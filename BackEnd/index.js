const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

// Middleware 
app.use(bodyParser.json());
app.use(cors({
    origin: '*', // Update to your frontend's URL
}));

// Replace this with your actual JWT secret
const JWT_SECRET = 'your_jwt_secret';

(async () => {
  try {
      await prisma.$connect();
      console.log("Connected to the database");
  } catch (error) {
      console.error("Database connection error:", error);
      process.exit(1); // Exit the application if the database connection fails
  }
})();

// Test database connection on startup 
app.get('/', async (req, res) => {
  try {
      await prisma.$connect();
      console.log("Connected to the database");
      res.send("Connected to the database");
  } catch (error) {
      console.error("Database connection error:", error);
      res.status(500).send("Database connection error");
  } finally {
      await prisma.$disconnect(); // Disconnect after the request is handled
  }
});



// Signup Route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(400).json({ error: 'User already exists or invalid input' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to fetch trains with their station names
app.get('/trains', async (req, res) => {
  try {
    const trains = await prisma.train.findMany({
      include: {
        station: true, // Include station data
      },
    });
    res.json(trains);
  } catch (error) {
    console.error('Error fetching trains:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Route to fetch stations
app.get('/stations', async (req, res) => {
  try {
    const trains = await prisma.train.findMany({
      include: {
        station: true, // Include station data
      },
    });
    res.json(trains);
  } catch (error) {
    console.error('Error fetching trains:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch stations
app.get('/stations', async (req, res) => {
  try {
    const stations = await prisma.station.findMany(); // Fetching stations directly
    res.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to fetch next trains based on departure and arrival stations
app.get('/next-trains', async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'Both from and to train numbers are required.' });
  }

  try {
    const nextTrains = await prisma.train.findMany({
      where: {
        trainNumber: from, // Assuming you want to fetch trains based on train number
        // Adjust if needed to check for departure or arrival based on your data structure
      },
      select: {
        trainNumber: true,
        date: true,
        arrivalTime: true,
        station: true,
        coachGroup1: true,
        coachGroup2: true,  
        coachGroup3: true,
        coachGroup4: true,
      },
    });

    if (nextTrains.length === 0) {
      return res.status(404).json({ message: 'No trains found for the given criteria.' });
    }

    res.json(nextTrains);
  } catch (error) {
    console.error('Error fetching next trains:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  } 
});



// Add this fare route in your index.js
app.get('/fare', async (req, res) => {
  const { fromTrainNumber, toTrainNumber, fromStationId, toStationId } = req.query;

  if (!fromTrainNumber || !toTrainNumber || !fromStationId || !toStationId) {
      return res.status(400).json({ error: 'All train numbers and station IDs are required.' });
  }

  try {
      // Fetch the departure train based on train number and station ID
      const departureTrain = await prisma.train.findFirst({
          where: {
              trainNumber: fromTrainNumber,
              stationId: Number(fromStationId),
          },
      });

      // Fetch the arrival train based on train number and station ID
      const arrivalTrain = await prisma.train.findFirst({
          where: {
              trainNumber: toTrainNumber,
              stationId: Number(toStationId),
          },
      });

      if (!departureTrain || !arrivalTrain) {
          return res.status(404).json({ error: 'One or both trains not found.' });
      }

      // Calculate the total fare based on the final prices
      const totalFare = departureTrain.finalPrice + arrivalTrain.finalPrice;

      res.json({ totalFare });
  } catch (error) {
      console.error('Error fetching fare:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});



// Route to handle booking
app.post('/book', async (req, res) => {
  const { departure, arrival, fare, userId } = req.body;

  try {
    // Find departure and arrival stations by their names
    const departureStation = await prisma.station.findUnique({
      where: { name: departure.stationName },
    });

    const arrivalStation = await prisma.station.findUnique({
      where: { name: arrival.stationName },
    });

    if (!departureStation || !arrivalStation) {
      return res.status(404).json({ error: 'Station not found' });
    }

    // Find the departure and arrival trains by their train numbers
    const departureTrain = await prisma.train.findFirst({
      where: { trainNumber: departure.trainNumber },
    });

    const arrivalTrain = await prisma.train.findFirst({
      where: { trainNumber: arrival.trainNumber },
    });

    if (!departureTrain || !arrivalTrain) {
      return res.status(404).json({ error: 'Train not found' });
    }

    // Create the booking entry and connect to the train and station records
    const booking = await prisma.booking.create({
      data: {
        user: { connect: { id: userId } }, // Connect the user by ID
        departureTrain: { connect: { id: departureTrain.id } }, // Connect the departure train by ID
        arrivalTrain: { connect: { id: arrivalTrain.id } }, // Connect the arrival train by ID
        fromStation: { connect: { id: departureStation.id } }, // Connect departure station
        toStation: { connect: { id: arrivalStation.id } }, // Connect arrival station
        totalFare: fare,
      },
    });

    res.status(200).json({ message: 'Booking confirmed', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Route to fetch user's booking history using email
app.get('/booking-history', async (req, res) => {
  const { email } = req.query;  // Get email from query parameters

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Find the user based on email and include bookings with their related train and station information
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        bookings: {  // Include the bookings relation
          include: {
            departureTrain: {  // Include the departure train and station info
              include: {
                station: true,  // Include departure station details
              }
            },
            arrivalTrain: {  // Include the arrival train and station info
              include: {
                station: true,  // Include arrival station details
              }
            }
          }
        }
      }
    });

    // If user not found, return a 404 error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send back the bookings with user email, departure and arrival train information
    const bookingsWithUserEmail = user.bookings.map(booking => ({
      ...booking,
      userEmail: user.email,  // Include user email in each booking object
    }));

    res.json(bookingsWithUserEmail);
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});



// Route to fetch user ID by email
app.get('/get-user-id', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }, // Only return the user ID
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ userId: user.id });
  } catch (error) {
    console.error('Error fetching user ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});