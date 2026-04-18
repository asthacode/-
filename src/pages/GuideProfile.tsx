import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, CheckCircle, ArrowLeft, Phone, Info } from 'lucide-react';
import { motion } from 'motion/react';

// Mock data again (ideally this comes from a hook)
const MOCK_GUIDES = {
  'g1': {
    id: 'g1',
    name: 'Abdur Rahman',
    division: 'sylhet',
    district: 'moulvibazar',
    upazila: 'sreemangal',
    photo: 'https://i.pravatar.cc/150?u=g1',
    description: 'Welcome to Sreemangal, the tea capital of Bangladesh! I am Abdur, a local guide with 10 years of experience. I will take you through the lush tea gardens, the Lawachara Rain Forest, and introduce you to the traditional Manipuri communities. We will taste the famous 7-layer tea together.',
    price: 1500,
    rating: 4.8,
    reviews: 24,
    availableDates: ['2026-04-20', '2026-04-21', '2026-04-25', '2026-04-26'],
    villagePhotos: [
      'https://picsum.photos/seed/tea1/800/600', 
      'https://picsum.photos/seed/tea2/800/600',
      'https://picsum.photos/seed/tea3/800/600'
    ]
  }
};

export default function GuideProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const guide = MOCK_GUIDES[id as keyof typeof MOCK_GUIDES] || MOCK_GUIDES['g1'];
  
  const [selectedDate, setSelectedDate] = useState('');
  const [bookingStep, setBookingStep] = useState(0); // 0: initial, 1: confirming, 2: success

  const handleBooking = () => {
    if (!selectedDate) return;
    setBookingStep(1);
  };

  const confirmBooking = () => {
    setBookingStep(2);
  };

  return (
    <div className="bg-heritage-sand min-h-screen pb-24">
      {/* Hero Header */}
      <div className="h-[40vh] relative overflow-hidden">
        <img 
          src={guide.villagePhotos[0]} 
          className="w-full h-full object-cover blur-sm scale-110 opacity-40" 
          alt="Background"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-heritage-sand to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg text-heritage-olive hover:text-heritage-clay transition-colors mb-8"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-heritage-olive/5 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
              <div className="w-40 h-40 rounded-[2rem] overflow-hidden shadow-2xl flex-shrink-0">
                <img src={guide.photo} alt={guide.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-serif text-heritage-olive mb-1">{guide.name}</h1>
                    <div className="flex items-center justify-center md:justify-start text-heritage-dust font-medium uppercase tracking-widest text-xs">
                      <MapPin size={14} className="mr-2 text-heritage-clay" />
                      <span>{guide.upazila}, {guide.district}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 bg-heritage-sand px-4 py-2 rounded-2xl flex items-center space-x-2">
                    <Star className="text-heritage-clay" fill="currentColor" size={16} />
                    <span className="font-bold text-heritage-olive">{guide.rating}</span>
                    <span className="text-xs text-heritage-dust">({guide.reviews} reviews)</span>
                  </div>
                </div>
                <p className="text-lg text-heritage-dust font-serif italic leading-relaxed">
                  "{guide.description}"
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-serif text-heritage-olive flex items-center space-x-3">
                <span>The Village Experience</span>
                <div className="h-[1px] flex-grow bg-heritage-olive/10" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guide.villagePhotos.map((photo, i) => (
                  <div key={i} className={`rounded-[2rem] overflow-hidden shadow-lg ${i === 0 ? 'md:col-span-2 h-96' : 'h-64'}`}>
                    <img src={photo} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" alt={`Experience ${i}`} referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-heritage-olive/5">
                <div className="mb-8">
                  <span className="text-3xl font-bold text-heritage-olive">৳ {guide.price}</span>
                  <span className="text-sm font-medium text-heritage-dust tracking-widest uppercase ml-2">/ Day | প্রতিদিন</span>
                </div>

                {bookingStep === 0 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-4">
                      <label className="text-xs font-bold uppercase tracking-widest text-heritage-dust flex items-center">
                        <Calendar size={14} className="mr-2" />
                        Available Dates | উপলভ্য তারিখ
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {guide.availableDates.map(date => (
                          <button 
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`p-3 rounded-xl border-2 transition-all font-medium text-sm ${selectedDate === date ? 'border-heritage-clay bg-heritage-clay/5 text-heritage-clay' : 'border-heritage-sand bg-heritage-sand/30 text-heritage-dust hover:border-heritage-olive/10'}`}
                          >
                            {new Date(date).toLocaleDateString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleBooking}
                      disabled={!selectedDate}
                      className="w-full bg-heritage-olive text-heritage-sand py-4 rounded-2xl font-bold hover:bg-heritage-clay transition-all shadow-lg disabled:opacity-50"
                    >
                      Book Now | এখনই বুক করুন
                    </button>
                    
                    <div className="flex items-center space-x-2 text-xs text-heritage-dust/60 justify-center">
                      <Info size={12} />
                      <span>No prior payment required</span>
                    </div>
                  </div>
                )}

                {bookingStep === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <h3 className="text-2xl font-serif text-heritage-olive text-center">Confirm Booking</h3>
                    <div className="bg-heritage-sand/50 p-6 rounded-2xl space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-heritage-dust">Guide</span>
                        <span className="font-bold">{guide.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-heritage-dust">Date</span>
                        <span className="font-bold">{new Date(selectedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="pt-3 border-t border-heritage-olive/10 flex justify-between font-bold text-heritage-olive">
                        <span>Total Pay (Offline)</span>
                        <span>৳ {guide.price}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                       <button 
                        onClick={confirmBooking}
                        className="w-full bg-heritage-olive text-heritage-sand py-4 rounded-2xl font-bold hover:bg-heritage-clay transition-all"
                      >
                        Confirm Booking
                      </button>
                      <button 
                        onClick={() => setBookingStep(0)}
                        className="w-full text-xs font-bold uppercase tracking-widest text-heritage-dust hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div className="text-center space-y-6 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle size={40} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-heritage-olive">Booking Sent!</h3>
                      <p className="text-sm text-heritage-dust mt-2">
                        {guide.name} has been notified. You will receive an SMS once they accept your request.
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate('/explore')}
                      className="text-heritage-clay font-bold underline"
                    >
                      Explore more places
                    </button>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

function ShieldCheck(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
