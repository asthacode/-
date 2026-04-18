import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, ShieldCheck, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: phone, 2: otp
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Standard cleanup for recaptcha
    return () => {
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  };

  const handleSendOtp = async () => {
    if (phone.length === 10) {
      setIsLoading(true);
      setError('');
      try {
        setupRecaptcha();
        const appVerifier = (window as any).recaptchaVerifier;
        const formattedPhone = `+880${phone}`;
        const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        setConfirmationResult(result);
        setStep(2);
      } catch (err: any) {
        console.error('Error sending OTP:', err);
        setError(err.message || 'Failed to send OTP. Please try again.');
        if ((window as any).recaptchaVerifier) {
          (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = null;
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 6 && confirmationResult) {
      setIsLoading(true);
      setError('');
      try {
        await confirmationResult.confirm(otp);
        await login('traveler'); // Default role for login, can be updated later
        navigate('/explore');
      } catch (err: any) {
        console.error('Error verifying OTP:', err);
        setError('Invalid code. Please check and try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-heritage-sand px-4">
      <div id="recaptcha-container"></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 md:p-12 border border-heritage-olive/5"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-heritage-olive/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-heritage-olive">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-serif text-heritage-olive mb-2">Welcome Back</h1>
          <p className="text-heritage-dust font-sans text-sm tracking-wide">Enter your mobile number to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-heritage-dust ml-1">Mobile Number | মোবাইল নম্বর</label>
              <div className="flex space-x-2">
                <span className="bg-heritage-sand px-4 py-4 rounded-2xl flex items-center font-bold text-heritage-olive">+880</span>
                <input 
                  type="tel" 
                  className="w-full bg-heritage-sand border-none rounded-2xl p-4 focus:ring-2 focus:ring-heritage-clay outline-none font-bold placeholder:text-heritage-dust/30" 
                  placeholder="1XXXXXXXXX" 
                  autoFocus
                  disabled={isLoading}
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
            </div>
            <button 
              onClick={handleSendOtp}
              disabled={phone.length < 10 || isLoading}
              className="w-full bg-heritage-olive text-heritage-sand py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-heritage-clay transition-all disabled:opacity-50 shadow-lg"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <span>Get OTP</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="space-y-2 text-center">
              <div className="flex items-center justify-center space-x-2 text-heritage-clay mb-4">
                <MessageSquare size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Verify SMS | এসএমএস যাচাই করুন</span>
              </div>
              <p className="text-xs text-heritage-dust mb-6 italic">We've sent a 6-digit code to +880 {phone}</p>
              
              <div className="flex justify-between items-center space-x-2">
                <input 
                  type="text" 
                  maxLength={6}
                  className="w-full bg-heritage-sand border-none rounded-2xl p-6 text-center text-3xl font-serif tracking-[0.5em] focus:ring-2 focus:ring-heritage-clay outline-none" 
                  placeholder="000000" 
                  autoFocus
                  disabled={isLoading}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={handleVerifyOtp}
                disabled={otp.length < 6 || isLoading}
                className="w-full bg-heritage-olive text-heritage-sand py-4 rounded-2xl font-bold hover:bg-heritage-clay transition-all disabled:opacity-50 shadow-lg flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Verify & Login"}
              </button>
              <button 
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="w-full text-xs font-bold uppercase tracking-widest text-heritage-dust hover:underline"
              >
                Change Number
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-heritage-sand text-center">
          <p className="text-xs text-heritage-dust">
            By continuing, you agree to our <span className="text-heritage-olive underline cursor-pointer">Terms</span> and <span className="text-heritage-olive underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
