import React from 'react';
import logo from '../src/assets/logo.png';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full bg-[#16192a]/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center h-16 gap-3">
                    <img src={logo} alt="PSPCL Logo" className="h-10 w-auto" />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                        Punjab Power Supply
                    </h1>
                </div>
            </div>
        </header>
    );
};

export default Header;
