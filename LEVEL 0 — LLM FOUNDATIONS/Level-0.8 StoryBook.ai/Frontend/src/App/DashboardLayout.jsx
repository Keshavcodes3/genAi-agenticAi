import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Features/Dashboard/Components/Sidebar';
import TopNav from '../Features/Dashboard/Components/TopNav';

const DashboardLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#FAFAFE] text-[#110E2C] antialiased">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            
            <div 
                className={`flex flex-col flex-1 transition-all duration-300 ${
                    isCollapsed ? 'ml-[80px]' : 'ml-[80px] md:ml-[256px]'
                }`}
            >
                <TopNav />
                <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
