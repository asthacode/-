import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ShieldCheck, Heart, Camera } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/rural-bangladesh-entry/1920/1080?blur=1" 
            alt="Bangladesh Rural Landscape" 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-heritage-olive/40 backdrop-blur-[2px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-center mx-auto"
          >
            <h1 className="text-5xl md:text-7xl text-heritage-olive font-serif mb-6 leading-[1.1]">
              গ্রামের লুকানো সৌন্দর্যে হারিয়ে যান
            </h1>
            <p className="text-xl text-heritage-ink/70 font-sans max-w-xl mb-12 mx-auto">
              Discover the soul of Bangladesh with our local village guides.
            </p>
            
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/explore')}
              className="bg-heritage-clay text-heritage-paper px-12 py-5 rounded-full text-xl font-bold flex items-center space-x-4 hover:bg-heritage-clay/90 transition-colors shadow-2xl mx-auto group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Compass size={28} className="group-hover:rotate-12 transition-transform duration-500" />
              <span className="relative z-10 flex flex-col items-start leading-none gap-1">
                <span className="text-xs uppercase tracking-[0.2em] font-sans opacity-80">Start Your Journey</span>
                <span className="font-serif">Explore Bangladesh | অন্বেষণ করুন</span>
              </span>
            </motion.button>
          </motion.div>
        </div>
        
        {/* Abstract Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-50">
          <div className="w-[1px] h-16 bg-heritage-sand" />
          <span className="text-[10px] text-heritage-sand uppercase tracking-widest font-bold">Scroll</span>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-heritage-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FeatureCard 
              icon={<Camera className="text-heritage-clay" size={32} />}
              title="Hidden Gems"
              titleBn="লুকানো সৌন্দর্য"
              desc="Discover villages and spots that aren't on any tourist map."
            />
            <FeatureCard 
              icon={<Heart className="text-heritage-clay" size={32} />}
              title="Authentic Hospitality"
              titleBn="খাঁটি আতিথেয়তা"
              desc="Experience the true mud-house living and home-cooked rural delicacies."
            />
          </div>
        </div>
      </section>

      {/* Visual Narrative Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-heritage-olive/10 rounded-[4rem] group-hover:bg-heritage-olive/20 transition-all duration-700" />
            <img 
              src="https://picsum.photos/seed/bangladesh-rural-life/800/1000" 
              className="rounded-[3rem] w-full h-[600px] object-cover relative z-10 shadow-2xl"
              alt="Authentic Village Life"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-5xl font-serif text-heritage-olive leading-tight">
              Connect with the <br /> 
              Roots of the Land
            </h2>
            <div className="h-1 w-20 bg-heritage-clay" />
            <p className="text-lg text-heritage-dust leading-relaxed font-serif italic italic">
              "We believe that tourism should be about connection, not just consumption. Our platform empowers local villagers to showcase their heritage and earn fairly."
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-heritage-olive/10 flex items-center justify-center text-heritage-olive">
                  01
                </div>
                <span className="text-sm font-semibold uppercase tracking-widest">Select Your Destination</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-heritage-olive/10 flex items-center justify-center text-heritage-olive">
                  02
                </div>
                <span className="text-sm font-semibold uppercase tracking-widest">Connect with a Local</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-heritage-olive/10 flex items-center justify-center text-heritage-olive">
                  03
                </div>
                <span className="text-sm font-semibold uppercase tracking-widest">Start the Journey</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, titleBn, desc }: { icon: any, title: string, titleBn: string, desc: string }) {
  return (
    <div className="p-10 rounded-3xl bg-white/50 border border-heritage-olive/5 hover:border-heritage-clay/20 hover:shadow-2xl transition-all group">
      <div className="mb-6 p-4 bg-heritage-sand rounded-2xl w-fit group-hover:bg-heritage-clay group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-serif text-heritage-olive mb-2">{title}</h3>
      <h4 className="text-sm font-medium text-heritage-clay mb-4">{titleBn}</h4>
      <p className="text-heritage-dust font-sans text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
