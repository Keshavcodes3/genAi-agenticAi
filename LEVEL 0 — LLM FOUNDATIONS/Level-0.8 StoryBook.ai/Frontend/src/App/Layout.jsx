import React from 'react'

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#FAFAFE] text-[#110E2C] antialiased">
            {children}
        </div>
    )
}

export default Layout