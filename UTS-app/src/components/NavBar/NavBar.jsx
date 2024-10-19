  import React, { useState } from 'react';
  import { FaTrain, FaTimes } from 'react-icons/fa';
  import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';

  const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    return (

      <header className="bg-gradient-to-r from-orange-500 to-red-400 text-white px-3 py-3 shadow-md">
        <div className=" mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center">
             <FaTrain className="text-3xl mr-2" />
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold">UTS</h1>
              <p className="text-sm font-medium md:text-base">IR Unreserved Tracking System</p>
            </div>
          </div>
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <BsThreeDotsVertical className="text-2xl " />}
          </button>
          <nav className={`w-full md:w-auto ${isMenuOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
            <ul className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">

              <li><a href="/" className="block hover:text-red-300">Home</a></li>
              <li><a href="/trains" className="block hover:text-red-300">Trains</a></li>
              <li><a href="/stations" className="block hover:text-red-300">Stations</a></li>
              <li><a href="/tickets" className="block hover:text-red-300">Tickets</a></li>
              <li><a href="/about" className="block hover:text-red-300">About</a></li>
            </ul>
          </nav>
        </div>
      </header>
    );
  };

  export default NavBar;