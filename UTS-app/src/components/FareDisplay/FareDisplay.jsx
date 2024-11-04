import React from 'react';
import { useLocation } from 'react-router-dom';

const FareDisplay = () => {
    const location = useLocation();
    const { totalFare } = location.state || { totalFare: 0 };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Total Fare</h1>
            <p className="text-lg">Your total fare is: <strong>${totalFare}</strong></p>
        </div>
    );
};

export default FareDisplay;
