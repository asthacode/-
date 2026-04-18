import React, { useState } from 'react';
import { Camera, Upload, CheckCircle, Shield, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { BANGLADESH_DATA } from '../constants';
import { db, storage, auth } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function GuideRegistration() {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    division: '',
    district: '',
    upazila: '',
    nidFrontPhoto: null as File | null,
    nidBackPhoto: null as File | null,
    facePhoto: null as File | null,
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const filteredDistricts = formData.division ? (BANGLADESH_DATA.districts as any)[formData.division] || [] : [];
  const filteredUpazilas = formData.district ? (BANGLADESH_DATA.upazilas as any)[formData.district] || [] : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'nidFrontPhoto' | 'nidBackPhoto' | 'facePhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      setFormData({ ...formData, [field]: file });
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Please login first to submit application.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Upload files
      const timestamp = Date.now();
      const [frontUrl, backUrl, faceUrl] = await Promise.all([
        uploadFile(formData.nidFrontPhoto!, `applications/${user.uid}/nid_front_${timestamp}`),
        uploadFile(formData.nidBackPhoto!, `applications/${user.uid}/nid_back_${timestamp}`),
        uploadFile(formData.facePhoto!, `applications/${user.uid}/face_${timestamp}`)
      ]);

      // 2. Save metadata to Firestore
      await addDoc(collection(db, 'applications'), {
        userId: user.uid,
        name: formData.name,
        phone: formData.phone,
        division: formData.division,
        district: formData.district,
        upazila: formData.upazila,
        nidFrontUrl: frontUrl,
        nidBackUrl: backUrl,
        facePhotoUrl: faceUrl,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      nextStep();
    } catch (err: any) {
      console.error('Submission error:', err);
      setError('Failed to submit application. ' + (err.message || ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-24 bg-heritage-sand">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 border border-heritage-olive/5">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-heritage-olive text-heritage-sand scale-110' : 'bg-heritage-sand text-heritage-dust'}`}>
                  {step > s ? <CheckCircle size={20} /> : s}
                </div>
                {s < 3 && <div className={`h-1 flex-1 mx-4 rounded-full ${step > s ? 'bg-heritage-olive' : 'bg-heritage-sand'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <header className="space-y-4">
                <h1 className="text-4xl font-serif text-heritage-olive">Basic Information</h1>
                <div className="bg-heritage-clay/5 p-4 rounded-2xl border border-heritage-clay/10 space-y-2">
                  <p className="text-xs font-bold text-heritage-clay uppercase tracking-widest">Mandatory Requirements | আবশ্যকীয় নথি</p>
                  <ul className="text-sm text-heritage-dust space-y-1 list-disc list-inside">
                    <li>NID CardFront & Back | এনআইডি কার্ড (উভয় পিঠ)</li>
                    <li>Live Face Photo Verification | নিজের সদ্য তোলা ছবি</li>
                    <li>Valid Mobile Number | সচল মোবাইল নম্বর</li>
                  </ul>
                </div>
                <p className="text-heritage-dust">Let's start with who you are and where you're from.</p>
              </header>

              <div className="space-y-6">
                <InputGroup label="Full Name | পূর্ণ নাম">
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter your full name" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </InputGroup>

                <InputGroup label="Mobile Number | মোবাইল নম্বর">
                  <div className="flex space-x-2">
                    <span className="bg-heritage-sand px-4 py-3 rounded-xl flex items-center font-bold text-heritage-olive">+880</span>
                    <input 
                      type="tel" 
                      className="form-input flex-1" 
                      placeholder="1XXXXXXXXX" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </InputGroup>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Division | বিভাগ">
                    <select 
                      className="form-select"
                      value={formData.division}
                      onChange={e => setFormData({...formData, division: e.target.value, district: '', upazila: ''})}
                    >
                      <option value="">Select Division</option>
                      {BANGLADESH_DATA.divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </InputGroup>

                  <InputGroup label="District | জেলা">
                    <select 
                      className="form-select"
                      disabled={!formData.division}
                      value={formData.district}
                      onChange={e => setFormData({...formData, district: e.target.value, upazila: ''})}
                    >
                      <option value="">Select District</option>
                      {filteredDistricts.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </InputGroup>
                </div>

                <InputGroup label="Upazila | উপজেলা">
                  <select 
                    className="form-select"
                    disabled={!formData.district}
                    value={formData.upazila}
                    onChange={e => setFormData({...formData, upazila: e.target.value})}
                  >
                    <option value="">Select Upazila</option>
                    {filteredUpazilas.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </InputGroup>
              </div>

              <div className="pt-8">
                <button 
                  onClick={nextStep}
                  disabled={!formData.name || !formData.phone || !formData.upazila}
                  className="w-full bg-heritage-olive text-heritage-sand py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-heritage-clay transition-all disabled:opacity-50"
                >
                  <span>Continue</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <header className="space-y-2">
                <h1 className="text-4xl font-serif text-heritage-olive">Verification</h1>
                <p className="text-heritage-dust">We require your NID and a face photo to ensure traveler safety.</p>
              </header>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold uppercase tracking-wider text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-heritage-dust">NID Card Front | এনআইডি (সম্মুখভাগ)</label>
                  <label className={`aspect-[3/2] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer group ${formData.nidFrontPhoto ? 'border-green-500 bg-green-50' : 'border-heritage-olive/20 bg-heritage-sand/30 hover:bg-heritage-sand/50'}`}>
                    {formData.nidFrontPhoto ? (
                      <div className="text-center">
                        <CheckCircle className="text-green-500 mx-auto mb-2" size={40} />
                        <span className="text-xs font-bold text-green-700">Uploaded</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="text-heritage-olive/40 mb-2 group-hover:scale-110 transition-transform" size={40} />
                        <span className="text-xs font-bold text-heritage-olive/60">Upload Front Side</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'nidFrontPhoto')} />
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-heritage-dust">NID Card Back | এনআইডি (বিপরীত ভাগ)</label>
                  <label className={`aspect-[3/2] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer group ${formData.nidBackPhoto ? 'border-green-500 bg-green-50' : 'border-heritage-olive/20 bg-heritage-sand/30 hover:bg-heritage-sand/50'}`}>
                    {formData.nidBackPhoto ? (
                      <div className="text-center">
                        <CheckCircle className="text-green-500 mx-auto mb-2" size={40} />
                        <span className="text-xs font-bold text-green-700">Uploaded</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="text-heritage-olive/40 mb-2 group-hover:scale-110 transition-transform" size={40} />
                        <span className="text-xs font-bold text-heritage-olive/60">Upload Back Side</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'nidBackPhoto')} />
                  </label>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-heritage-dust text-center block">Face Verification | নিজের ছবি</label>
                  <label className={`aspect-[3/1] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer group ${formData.facePhoto ? 'border-green-500 bg-green-50' : 'border-heritage-olive/20 bg-heritage-sand/30 hover:bg-heritage-sand/50'}`}>
                    {formData.facePhoto ? (
                      <div className="text-center">
                        <CheckCircle className="text-green-500 mx-auto mb-2" size={40} />
                        <span className="text-xs font-bold text-green-700">Photo Taken</span>
                      </div>
                    ) : (
                      <>
                        <Camera className="text-heritage-olive/40 mb-2 group-hover:scale-110 transition-transform" size={40} />
                        <span className="text-xs font-bold text-heritage-olive/60">Take a Photo</span>
                      </>
                    )}
                    <input type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => handleFileChange(e, 'facePhoto')} />
                  </label>
                </div>
              </div>

              <div className="bg-heritage-clay/5 p-6 rounded-2xl flex items-start space-x-4 border border-heritage-clay/10">
                <Shield className="text-heritage-clay flex-shrink-0" size={24} />
                <p className="text-sm text-heritage-clay/80 leading-relaxed font-sans">
                  Your identity data is encrypted and only used for verification. We do not share your NID with travelers.
                </p>
              </div>

              <div className="pt-8 flex space-x-4">
                <button 
                  onClick={prevStep}
                  className="flex-1 bg-heritage-sand text-heritage-olive py-4 rounded-2xl font-bold border border-heritage-olive/10"
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!formData.nidFrontPhoto || !formData.nidBackPhoto || !formData.facePhoto || isSubmitting}
                  className="flex-[2] bg-heritage-olive text-heritage-sand py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-heritage-clay transition-all disabled:opacity-50 shadow-lg"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <span>Verify Identity</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-8 animate-in zoom-in duration-500">
              <div className="w-32 h-32 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle size={64} />
              </div>
              <h1 className="text-4xl font-serif text-heritage-olive">Application Submitted!</h1>
              <p className="text-heritage-dust max-w-md mx-auto leading-relaxed">
                Thank you, {formData.name}. Our team is reviewing your application. You will receive an OTP for phone verification shortly.
              </p>
              
              <div className="pt-8">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="bg-heritage-olive text-heritage-sand px-12 py-4 rounded-full font-bold hover:bg-heritage-clay transition-all shadow-xl"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <style>{`
        .form-input {
          @apply w-full bg-heritage-sand border-none rounded-xl p-4 focus:ring-2 focus:ring-heritage-clay outline-none transition-all placeholder:text-heritage-dust/40 font-medium;
        }
        .form-select {
          @apply w-full bg-heritage-sand border-none rounded-xl p-4 focus:ring-2 focus:ring-heritage-clay outline-none transition-all font-medium;
        }
      `}</style>
    </div>
  );
}

function InputGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-heritage-dust ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}
