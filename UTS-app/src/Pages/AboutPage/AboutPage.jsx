  import React from 'react';
  import { FaTrain, FaInfoCircle, FaHistory, FaUsers, FaMapMarkedAlt, FaBell, FaMobileAlt, FaHandshake, FaChartLine, FaHandHoldingHeart, FaAward } from 'react-icons/fa';
  import { MdSecurity, MdSpeed, MdFeedback } from 'react-icons/md';

  const AboutPage = () => {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              About Unreserved Railway Tracking System
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Experience the future of train tracking with our innovative platform
            </p>
          </div>



          <div className="mt-16 bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <FaInfoCircle className="text-3xl text-blue-600 mr-4 animate-pulse" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Our Vision</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              We're revolutionizing train travel by bringing cutting-edge technology to unreserved railway services. 
              Our innovative platform combines artificial intelligence with real-time tracking to provide you with 
              the most accurate and reliable journey information. Join thousands of satisfied users who have transformed 
              their travel experience with our smart tracking solution.
            </p>
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <FaHistory className="text-3xl text-blue-600 mr-4 animate-pulse" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Our Journey</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              Starting from a simple idea to make train travel more convenient, we've grown into a comprehensive 
              tracking solution trusted by millions. Our journey is marked by continuous innovation, user-centric 
              development, and a commitment to excellence in railway information services.
            </p>
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <FaUsers className="text-3xl text-blue-600 mr-4 animate-pulse" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Our Community</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              We're proud to serve a growing community of travelers who rely on our platform daily. Our users' 
              trust and satisfaction drive us to continuously improve and innovate. Join our community and be 
              part of the revolution in railway travel tracking.
            </p>
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <FaAward className="text-3xl text-blue-600 mr-4 animate-pulse" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Our Achievements</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              Over the years, we've achieved numerous milestones and received recognition for our innovative approach 
              to railway tracking. Our platform has been awarded for its reliability, user experience, and technological 
              advancement in the transportation sector.
            </p>
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-lg p-8 hover:shadow-xl mb-8 transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <FaHandHoldingHeart className="text-3xl text-blue-600 mr-4 animate-pulse" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Our Commitment</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              We are dedicated to making train travel easier, more efficient, and more enjoyable for everyone. 
              Our commitment extends beyond just providing a service - we're building a future where railway 
              travel is seamlessly integrated with modern technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-300">
              <FaTrain className="text-4xl text-blue-600 mb-4 animate-pulse" />
              <h2 className="text-2xl font-semibold mb-4">Real-Time Tracking</h2>
              <p className="text-gray-600">
                Experience seamless train tracking with live updates and precise arrival predictions at your fingertips.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-300">
              <MdSecurity className="text-4xl text-blue-600 mb-4 animate-pulse" />
              <h2 className="text-2xl font-semibold mb-4">Advanced Security</h2>
              <p className="text-gray-600">
                State-of-the-art encryption and security protocols keeping your data safe and protected 24/7.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-300">
              <FaMobileAlt className="text-4xl text-blue-600 mb-4 animate-pulse" />
              <h2 className="text-2xl font-semibold mb-4">Mobile Friendly</h2>
              <p className="text-gray-600">
                Access real-time updates anywhere with our responsive mobile application designed for on-the-go tracking.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-300">
              <FaBell className="text-4xl text-blue-600 mb-4 animate-pulse" />
              <h2 className="text-2xl font-semibold mb-4">Smart Notifications</h2>
              <p className="text-gray-600">
                Get instant alerts about delays, platform changes, and arrival times customized to your journey.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-300">
              <MdSpeed className="text-4xl text-blue-600 mb-4 animate-pulse" />
              <h2 className="text-2xl font-semibold mb-4">Lightning Fast</h2>
              <p className="text-gray-600">
                Experience rapid updates with our high-performance tracking system designed for speed and efficiency.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-300">
              <FaMapMarkedAlt className="text-4xl text-blue-600 mb-4 animate-pulse" />
              <h2 className="text-2xl font-semibold mb-4">Interactive Maps</h2>
              <p className="text-gray-600">
                Visualize train routes and locations with our interactive mapping system for better journey planning.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-300">
              <FaHandshake className="text-4xl text-blue-600 mb-4 animate-pulse" />
              <h2 className="text-2xl font-semibold mb-4">User Support</h2>
              <p className="text-gray-600">
                24/7 dedicated customer support to assist you with any queries or concerns during your journey.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-300">
              <MdFeedback className="text-4xl text-blue-600 mb-4 animate-pulse" />
              <h2 className="text-2xl font-semibold mb-4">User Feedback</h2>
              <p className="text-gray-600">
                Continuous improvement through user feedback and suggestions to enhance your travel experience.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-transform duration-300">
              <FaChartLine className="text-4xl text-blue-600 mb-4 animate-pulse" />
              <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
              <p className="text-gray-600">
                Access detailed journey statistics and travel patterns to optimize your travel planning.
              </p>
            </div>
          </div>

                  
        </div>
      </div>
    );
  };

  export default AboutPage;