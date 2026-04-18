import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import GuideRegistration from './pages/GuideRegistration';
import Login from './pages/Login';
import GuideProfile from './pages/GuideProfile';
import { useAuth } from './context/AuthContext';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-heritage-olive text-heritage-sand py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-heritage-sand/10 pb-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <LinkToHome />
            <p className="text-heritage-sand/60 font-serif italic text-lg max-w-sm">
              Connecting travelers with the heart and soul of rural Bangladesh. Authentic, safe, and enriching.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-heritage-sand/40">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium uppercase tracking-wider">
              <li><a href="/explore" className="hover:text-heritage-clay transition-colors">Explore | অন্বেষণ</a></li>
              <li><a href="/register-guide" className="hover:text-heritage-clay transition-colors">Become a Guide</a></li>
              <li><a href="#about" className="hover:text-heritage-clay transition-colors">Our Mission</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-heritage-sand/40">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center space-x-3">
                <Phone size={16} />
                <span>+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} />
                <span>contact@nadekha.com</span>
              </li>
              <li className="flex items-center space-x-3 text-heritage-sand/60">
                <MapPin size={16} />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[10px] uppercase tracking-widest text-heritage-sand/40 font-bold">
            © 2026 Nadekha Bangladesh. All Rural Rights Reserved.
          </p>
          <div className="flex space-x-6 text-heritage-sand/60">
            <Facebook size={20} className="hover:text-heritage-sand cursor-pointer transition-colors" />
            <Instagram size={20} className="hover:text-heritage-sand cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function LinkToHome() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 bg-heritage-sand rounded-full flex items-center justify-center">
        <MapPin className="text-heritage-olive" size={20} />
      </div>
      <div>
        <span className="text-2xl font-serif font-bold tracking-tight text-heritage-sand block leading-none">
          Nadekha
        </span>
        <span className="text-xs font-sans font-medium uppercase tracking-[0.2em] text-heritage-clay">
          Bangladesh
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-heritage-sand">
        <div className="w-16 h-16 border-4 border-heritage-olive border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-heritage-olive font-serif text-xl">Loading Bangladesh...</p>
      </div>
    );
  }

  return (
    <Router>
        <div className="min-h-screen flex flex-col selection:bg-heritage-clay selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/register-guide" element={<GuideRegistration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/guide/:id" element={<GuideProfile />} />
              <Route path="/dashboard" element={<div className="h-screen flex items-center justify-center font-serif text-3xl text-heritage-olive">Dashboard Coming Soon...</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
    </Router>
  );
}
