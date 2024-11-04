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
  const { departure, arrival, fare, email } = req.body; // Include email in the request body

  try {
    const booking = await prisma.booking.create({
      data: {
        userId: 1, // Replace with actual user ID retrieval logic
        email: email, // Store the user's email
        departureTrainNumber: departure.trainNumber,
        arrivalTrainNumber: arrival.trainNumber,
        fromStationId: departure.stationId,
        toStationId: arrival.stationId,
        totalFare: fare,
        // Add other booking details as necessary
      },
    });
    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    console.error('Error during booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});


// Route to fetch user's booking history using email

app.get('/booking-history', async (req, res) => {
  const { email } = req.query;
  // Log the email being used to search
  console.log('Fetching booking history for email:', email);

  const user = await prisma.user.findUnique({
      where: { email },
      include: { bookings: true } // Include bookings associated with the user
  });

  if (!user) {
      return res.status(404).json({ error: 'User not found' });
  }

  res.json(user.bookings); // Send back the bookings
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});