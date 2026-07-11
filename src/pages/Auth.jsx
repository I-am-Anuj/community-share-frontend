import React, { useState } from 'react';
import { Lock, Mail, User, ShieldCheck, KeyRound } from 'lucide-react';
import api from '../services/api';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtpStep, setShowOtpStep] = useState(false); 
  const [otpCode, setOtpCode] = useState('');
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getUserCoordinates = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("Geolocation API is not supported by this browser shell configuration.");
        return resolve({ latitude: null, longitude: null });
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (geoError) => {
          console.warn("Geolocating sequence rejected or timed out. Falling back to empty values.", geoError);
          resolve({ latitude: null, longitude: null });
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (showOtpStep) {
        const response = await api.post('/users/verify-otp', {
          email: formData.email,
          otpCode: otpCode
        });

        if (response.data?.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('userName', response.data.name || ''); 
          localStorage.setItem('userId', response.data.userId); 
          localStorage.setItem('userEmail', formData.email); // ✅ Fixed: Saves email to local storage
          
          if (response.data.latitude && response.data.longitude) {
            localStorage.setItem('userLat', response.data.latitude);
            localStorage.setItem('userLng', response.data.longitude);
          }
          
          onLoginSuccess();
        } else {
          setError('Verification succeeded, but access token was missing.');
        }
        return;
      }

      if (isLogin) {
        const response = await api.post('/users/login', {
          email: formData.email,
          password: formData.password
        });
        
        if (response.data?.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('userName', response.data.name || ''); 
          localStorage.setItem('userId', response.data.userId); 
          localStorage.setItem('userEmail', formData.email); // ✅ Fixed: Saves email to local storage
          
          if (response.data.latitude && response.data.longitude) {
            localStorage.setItem('userLat', response.data.latitude);
            localStorage.setItem('userLng', response.data.longitude);
          }

          onLoginSuccess();
        } else {
          setError('Login succeeded, but access token was missing.');
        }
        return;
      } else {
        const coords = await getUserCoordinates();

        const response = await api.post('/users/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          latitude: coords.latitude,  
          longitude: coords.longitude 
        });

        setSuccessMessage(response.data || 'Registration successful! Check your email for your verification code.');
        setShowOtpStep(true);
      }

    } catch (err) {
      console.error("Auth transaction failed:", err);
      setError(err.response?.data?.message || err.response?.data || 'An authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-orange-50 text-[#b85c26] rounded-xl mb-1">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {showOtpStep ? 'Verify Your Email' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-gray-500">
            {showOtpStep ? 'Enter the code sent to your registered address' : isLogin ? 'Access your neighborhood community share hub' : 'Join your local tool sharing space'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-xl">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium rounded-xl">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {showOtpStep ? (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">OTP Code</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-400"><KeyRound size={16} /></span>
                <input
                  type="text"
                  required
                  maxLength="6"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="000000"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-center font-mono text-lg tracking-widest focus:outline-hidden focus:border-[#b85c26] focus:ring-1 focus:ring-[#b85c26] transition-all"
                />
              </div>
            </div>
          ) : (
            <>
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400"><User size={16} /></span>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Anuj Kumar"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#b85c26] transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400"><Mail size={16} /></span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="anuj@example.com"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#b85c26] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400"><Lock size={16} /></span>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#b85c26] transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#b85c26] text-white font-semibold rounded-xl text-sm hover:bg-[#a04f1f] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? 'Processing...' : showOtpStep ? 'Confirm Verification Code' : isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setShowOtpStep(false);
              setError('');
              setSuccessMessage('');
            }}
            className="text-xs font-medium text-[#b85c26] hover:underline cursor-pointer"
          >
            {showOtpStep ? "← Back to Registration" : isLogin ? "Don't have an account? Sign up here" : 'Already have an account? Log in here'}
          </button>
        </div>

      </div>
    </div>
  );
}