  import React, { useState } from 'react';
  import { FaTicketAlt, FaHistory, FaEye, FaWallet, FaUser, FaExchangeAlt } from 'react-icons/fa';

  const Tracking = () => {
    const [activeButton, setActiveButton] = useState(null);

    return (
      <div className="bg-gray-100 p-2 pb-5">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
            <Button icon={<FaTicketAlt />} text="Cancel Ticket" isActive={activeButton === 'Cancel Ticket'} onClick={() => setActiveButton('Cancel Ticket')} />
            <Button icon={<FaHistory />} text="Booking History" isActive={activeButton === 'Booking History'} onClick={() => setActiveButton('Booking History')} />
            <Button icon={<FaEye />} text="Show Ticket" isActive={activeButton === 'Show Ticket'} onClick={() => setActiveButton('Show Ticket')} />
            <Button icon={<FaWallet />} text="R-Wallet" isActive={activeButton === 'R-Wallet'} onClick={() => setActiveButton('R-Wallet')} />
            <Button icon={<FaUser />} text="Profile" isActive={activeButton === 'Profile'} onClick={() => setActiveButton('Profile')} />
            <Button icon={<FaExchangeAlt />} text="Transactions" isActive={activeButton === 'Transactions'} onClick={() => setActiveButton('Transactions')} />
          </div>
        </div>
      </div> 
    );
  };

  const Button = ({ icon, text, isActive, onClick }) => {
    return (
      <button
        className={`flex flex-col items-center justify-center p-2 rounded-md shadow-sm transition-all duration-200 ${
          isActive
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:shadow-md'
        }`}
        onClick={onClick}
      >
        <div className={`text-2xl mb-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>{icon}</div>
        <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>{text}</span>
      </button>
    );
  };

  export default Tracking;