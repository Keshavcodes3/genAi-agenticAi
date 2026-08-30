import React from 'react';
import { Feather, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    // const navLinks = ['About'];

    return (
        <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-50">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                    <Feather className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-[#110E2C]">
                    StoryBook<span className="text-violet-500">.ai</span>
                </span>
            </Link>

          

            {/* Actions */}
            <div className="flex items-center gap-6">
                <Link to="/login" className="text-sm font-semibold text-[#110E2C] hover:text-violet-600 transition-colors hidden sm:block">
                    Login
                </Link>
                <Link to="/register" className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:-translate-y-0.5">
                    Get Started <Sparkles className="w-4 h-4" />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
