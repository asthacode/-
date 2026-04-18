import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav ref={navRef} className="bg-heritage-paper border-b border-heritage-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="logo text-2xl font-serif font-bold text-heritage-olive tracking-tight">
                অদেখা বাংলাদেশ 
                <span className="text-xs font-sans font-bold text-heritage-olive-light uppercase tracking-widest ml-2 hidden sm:inline-block">
                  Nadekha Bangladesh
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-12">
            <nav className="flex items-center space-x-8 text-[0.85rem] font-bold uppercase tracking-wider text-heritage-olive-light">
              <Link 
                to="/explore" 
                className="group relative px-4 py-2 text-heritage-olive border border-heritage-clay/20 rounded-full hover:bg-heritage-clay hover:text-heritage-paper transition-all duration-300"
              >
                <span className="relative z-10">Explore</span>
                <span className="absolute inset-0 bg-heritage-clay scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full -z-10" />
              </Link>
              <Link to="/explore" className="hover:text-heritage-olive transition-colors underline decoration-transparent hover:decoration-heritage-clay underline-offset-8 transition-all">Hidden Villages</Link>
              <Link to="/" className="hover:text-heritage-olive transition-colors underline decoration-transparent hover:decoration-heritage-clay underline-offset-8 transition-all">About Us</Link>
            </nav>
            
            <div className="flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/login" 
                    className="px-6 py-2 rounded-full border border-heritage-olive text-heritage-olive text-[0.8rem] font-bold hover:bg-heritage-sand transition-all"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register-guide" 
                    className="px-6 py-2 rounded-full bg-heritage-olive text-heritage-paper text-[0.8rem] font-bold hover:bg-heritage-olive-light transition-all"
                  >
                    Join as Guide
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-6">
                  <Link to="/dashboard" className="flex items-center space-x-2 text-[0.8rem] font-bold text-heritage-olive hover:text-heritage-clay transition-colors uppercase tracking-widest">
                    <User size={16} />
                    <span>Panel</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="text-[0.8rem] font-bold text-heritage-clay hover:opacity-80 transition-opacity flex items-center space-x-1 uppercase tracking-widest"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-heritage-olive p-2 transition-transform active:scale-95"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-heritage-sand border-t border-heritage-olive/10 px-4 py-4 space-y-4 animate-in slide-in-from-top duration-300">
          <Link to="/explore" className="block text-lg font-medium py-2">Explore | অন্বেষণ</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="block text-lg font-medium py-2">Login | লগইন</Link>
              <Link to="/register-guide" className="block bg-heritage-olive text-heritage-sand px-6 py-3 rounded-xl text-center font-medium">
                Be a Guide | গাইড হন
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="block text-lg font-medium py-2">Dashboard</Link>
              <button 
                onClick={logout}
                className="block w-full text-left text-lg font-medium py-2 text-heritage-clay"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
