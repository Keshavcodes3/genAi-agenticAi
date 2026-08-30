import React from 'react';
import { Feather } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-blue-100/70 pt-16 pb-8 relative overflow-hidden">
            {/* Minimal top border accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-200/60 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Fixed Layout: Clean, multi-column structural grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    
                    {/* Brand Section */}
                    <div className="md:col-span-2 max-w-md">
                        <Link to="/" className="flex items-center gap-2.5 mb-5 group">
                            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white transition-transform group-hover:scale-105 duration-200">
                                <Feather className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-neutral-800">
                                StoryBook<span className="text-blue-500">.ai</span>
                            </span>
                        </Link>
                        <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                            Empowering writers, visionaries, and dreamers to craft incredible narratives with the power of artificial intelligence.
                        </p>
                        {/* Social Icons with Clean blue Hover Actions */}
                        <div className="flex gap-3">
                            <a href="https://x.com/_keshav2008_" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-md bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200">
                                <FaXTwitter className="w-4 h-4" />
                            </a>
                            <a href="https://github.com/Keshavcodes3" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-md bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200">
                                <FaGithub className="w-4 h-4" />
                            </a>
                            <a href="https://www.linkedin.com/in/keshav-chetri/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-md bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200">
                                <FaLinkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links Column */}
                    <div className="md:col-span-1 md:justify-self-end">
                        <h4 className="font-semibold text-xs tracking-wider text-neutral-400 uppercase mb-5">Product</h4>
                        <ul className="space-y-3.5">
                            <li><Link to="/features" className="text-neutral-600 hover:text-blue-500 transition-colors text-sm">Features</Link></li>
                            <li><Link to="/tools" className="text-neutral-600 hover:text-blue-500 transition-colors text-sm">AI Tools</Link></li>
                            <li><Link to="/pricing" className="text-neutral-600 hover:text-blue-500 transition-colors text-sm">Pricing</Link></li>
                            <li><Link to="/about" className="text-neutral-600 hover:text-blue-500 transition-colors text-sm">About Us</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar Container */}
                <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-neutral-400 text-xs">
                        © {new Date().getFullYear()} StoryBook.ai. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        Made with <span className="text-blue-500 animate-pulse">♥</span> for storytellers.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;