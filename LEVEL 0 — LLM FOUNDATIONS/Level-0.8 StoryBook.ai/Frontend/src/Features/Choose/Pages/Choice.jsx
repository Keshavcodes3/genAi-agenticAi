import React from 'react';
import TypeSelection from "../Components/TypeSelection.jsx";

const Choice = () => {
    return (
        <div className="p-6  w-full md:p-10 w-full min-h-[calc(100vh-80px)] flex justify-center items-center">
            <TypeSelection />
        </div>
    );
};

export default Choice;