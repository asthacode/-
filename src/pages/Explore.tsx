import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { BANGLADESH_DATA } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

// Mock Guide Data
const MOCK_GUIDES = [
  {
    id: 'g1',
    name: 'Abdur Rahman',
    division: 'sylhet',
    district: 'moulvibazar',
    upazila: 'sreemangal',
    photo: 'https://i.pravatar.cc/150?u=g1',
    description: 'Specialist in tea garden exploration and lemon orchards. I have lived in Sreemangal all my life.',
    price: 1500,
    rating: 4.8,
    reviews: 24,
    availableDates: ['2026-04-20', '2026-04-21', '2026-04-25'],
    villagePhotos: ['https://picsum.photos/seed/tea1/400/300', 'https://picsum.photos/seed/tea2/400/300']
  },
  {
    id: 'g2',
    name: 'Sultana Begum',
    division: 'chattogram',
    district: 'coxsbazar',
    upazila: 'teknaf',
    photo: 'https://i.pravatar.cc/150?u=g2',
    description: 'Native guide for hidden coastal villages and traditional weaving families.',
    price: 1200,
    rating: 4.9,
    reviews: 18,
    availableDates: ['2026-04-22', '2026-04-23'],
    villagePhotos: ['https://picsum.photos/seed/coast1/400/300']
  }
];

export default function Explore() {
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');

  const filteredDistricts = selectedDivision ? (BANGLADESH_DATA.districts as any)[selectedDivision] || [] : [];
  const filteredUpazilas = selectedDistrict ? (BANGLADESH_DATA.upazilas as any)[selectedDistrict] || [] : [];

  const guides = useMemo(() => {
    return MOCK_GUIDES.filter(guide => {
      if (selectedDivision && guide.division !== selectedDivision) return false;
      if (selectedDistrict && guide.district !== selectedDistrict) return false;
      if (selectedUpazila && guide.upazila !== selectedUpazila) return false;
      return true;
    });
  }, [selectedDivision, selectedDistrict, selectedUpazila]);

  return (
    <div className="min-h-screen pt-12 pb-24 bg-heritage-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-heritage-paper rounded-[1.5rem] shadow-sm p-4 mb-12 border border-heritage-border flex flex-col md:flex-row items-center gap-2">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 w-full">
            <div className="px-6 py-2 border-r border-heritage-border">
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-heritage-olive-light block mb-1">Division | বিভাগ</label>
              <select 
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-heritage-ink outline-none"
                value={selectedDivision}
                onChange={(e) => {
                  setSelectedDivision(e.target.value);
                  setSelectedDistrict('');
                  setSelectedUpazila('');
                }}
              >
                <option value="">All Divisions</option>
                {BANGLADESH_DATA.divisions.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="px-6 py-2 border-r border-heritage-border">
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-heritage-olive-light block mb-1">District | জেলা</label>
              <select 
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-heritage-ink outline-none disabled:opacity-50"
                value={selectedDistrict}
                disabled={!selectedDivision}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedUpazila('');
                }}
              >
                <option value="">Select District</option>
                {filteredDistricts.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="px-6 py-2">
              <label className="text-[0.65rem] font-bold uppercase tracking-widest text-heritage-olive-light block mb-1">Upazila | উপজেলা</label>
              <select 
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-heritage-ink outline-none disabled:opacity-50"
                value={selectedUpazila}
                disabled={!selectedDistrict}
                onChange={(e) => setSelectedUpazila(e.target.value)}
              >
                <option value="">All Upazilas</option>
                {filteredUpazilas.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-heritage-clay text-heritage-paper px-10 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-heritage-clay/90 transition-all w-full md:w-auto shadow-lg shadow-heritage-clay/20"
          >
            <Search size={18} />
            <span>Find Your Guide</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {guides.length > 0 ? (
              guides.map(guide => (
                <GuideCard key={guide.id} guide={guide} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <MapPin className="mx-auto text-heritage-dust/30 mb-4" size={64} />
                <h3 className="text-2xl font-serif text-heritage-dust">No guides found in this area yet.</h3>
                <p className="text-heritage-dust/60">Help us grow by inviting locals to register!</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function GuideCard({ guide }: { guide: any, key?: React.Key }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-heritage-paper rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all group border border-heritage-border flex flex-col"
    >
      <div className="h-[180px] relative overflow-hidden">
        <img 
          src={guide.villagePhotos[0]} 
          alt="Village view" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-4 right-4 bg-heritage-paper px-3 py-1.5 rounded-lg text-sm font-bold text-heritage-clay shadow-sm">
          ৳{guide.price} / day
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif text-heritage-olive">{guide.name}</h3>
          <span className="text-xs font-bold text-heritage-clay flex items-center">★ 4.9</span>
        </div>
        
        <div className="location text-[0.75rem] text-heritage-olive-light flex items-center gap-1 mb-4 font-bold uppercase tracking-wider">
          <MapPin size={12} />
          {guide.upazila}, {guide.district}
        </div>
        
        <p className="text-[0.85rem] text-neutral-500 line-clamp-2 mb-6 flex-grow">
          {guide.description}
        </p>
        
        <Link 
          to={`/guide/${guide.id}`}
          className="group/btn w-full bg-heritage-olive text-heritage-paper py-3.5 rounded-xl text-sm font-bold text-center hover:bg-heritage-olive-light transition-all flex items-center justify-center gap-2"
        >
          <span>View Experience</span>
          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
