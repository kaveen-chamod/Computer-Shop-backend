import { useState } from "react";
import { Link } from "react-router-dom";
import { BiShoppingBag, BiMenu, BiX } from "react-icons/bi";
import UserData from "./userData";

export default function Header() {
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="w-full h-[100px] sticky top-0 bg-white/90 backdrop-blur-md flex justify-between items-center px-6 lg:px-12 mb-4 shadow-md z-[100] border-b border-gray-100 transition-all">
            
            {/* Logo Section */}
            <Link to="/" className="h-full py-2 hover:scale-105 transition-transform duration-300">
                <img 
                    src="/logo.png" 
                    alt="Isuri Computers Logo" 
                    className="h-full w-auto object-contain drop-shadow-sm" 
                />
            </Link>

            {/* Navigation Links (Hidden on Mobile) */}
            <nav className="hidden md:flex gap-10 text-primary font-bold text-lg tracking-wide">
                <Link to="/" className="hover:opacity-70 hover:-translate-y-0.5 transition-all duration-300">
                    Home
                </Link>
                <Link to="/products" className="hover:opacity-70 hover:-translate-y-0.5 transition-all duration-300">
                    Products
                </Link>
                <Link to="/contact" className="hover:opacity-70 hover:-translate-y-0.5 transition-all duration-300">
                    Contact Us
                </Link>
            </nav>

            {/* Right Side (Cart, Profile & Mobile Menu Button) */}
            <div className="flex items-center gap-4 md:gap-8">
                <Link to="/cart" className="text-primary text-[28px] hover:opacity-70 hover:scale-110 transition-all duration-300">
                    <BiShoppingBag />
                </Link>
                
                {/* User Dropdown Component */}
                <UserData />

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden text-primary text-[28px] focus:outline-none hover:opacity-70 transition-all z-[110] relative"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <BiX /> : <BiMenu />}
                </button>
            </div>
             
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-[90] md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Menu Sidebar (Left side slider) */}
            <div 
                className={`fixed top-0 left-0 h-screen w-[250px] bg-white shadow-2xl z-[100] flex flex-col pt-24 px-8 gap-8 md:hidden transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-bold text-xl hover:opacity-70 transition-all border-b border-gray-100 pb-2">
                    Home
                </Link>
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-bold text-xl hover:opacity-70 transition-all border-b border-gray-100 pb-2">
                    Products
                </Link>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-bold text-xl hover:opacity-70 transition-all border-b border-gray-100 pb-2">
                    Contact Us
                </Link>
            </div>
        </header>
    );
}