import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield, Save, Camera, Calendar, MapPin, Check, Key } from 'lucide-react';

export default function ProfileSettings() {
  const [name, setName] = useState('Anuj');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('Sharing tools and knowledge for a greener city.');
  const [profileImage, setProfileImage] = useState(null);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Dynamically load registration data on component mount
  useEffect(() => {
    const storedName = localStorage.getItem('name') || localStorage.getItem('userName');
    if (storedName) setName(storedName);

    // Fetches the exact email used during the login/registration step
    const storedEmail = localStorage.getItem('email') || localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setEmail('user@communityshare.org'); // Safe dynamic baseline if storage is empty
    }

    const storedPhone = localStorage.getItem('userPhone');
    if (storedPhone) setPhone(storedPhone);

    const storedBio = localStorage.getItem('userBio');
    if (storedBio) setBio(storedBio);

    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) setProfileImage(storedImage);
  }, []);

  const getInitials = (userName) => {
    if (!userName) return 'U';
    return userName.trim().split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
        // Force a quick sync across components by triggering storage event
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    alert("Password updated successfully!");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordForm(false);
  };

  const handleForgotPassword = () => {
    if (!email) {
      alert("No registered email found.");
      return;
    }
    alert("A temporary password reset link has been sent to: " + email);
  };

  const handleSaveChanges = () => {
    localStorage.setItem('name', name);
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('userBio', bio);
    alert("Changes saved successfully!");
    window.location.reload(); // Refreshes layout headers instantly
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-5 pb-20 p-4 text-xs">
      
      {/* Top Banner Display Info */}
      <section className="w-full">
        <div className="bg-white border border-[#e5e1da] rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5 bg-amber-50/20 shadow-xs">
          <div className="relative shrink-0">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile Avatar" 
                className="w-20 h-20 rounded-2xl object-cover border border-[#e5e1da] shadow-[4px_4px_0px_0px_#b85c26]"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#42240d] text-white flex items-center justify-center font-bold text-xl shadow-[4px_4px_0px_0px_#b85c26]">
                {getInitials(name)}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 bg-white border border-[#42240d] w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#5c3a21] hover:text-white transition-all cursor-pointer p-1">
              <Camera size={12} />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </label>
          </div>
          
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-lg font-bold text-[#42240d]">{name}</h1>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full border border-green-200 text-[10px]">
                <Check size={10} className="text-green-700" />
                <span className="font-semibold">Verified Account</span>
              </div>
            </div>
            <p className="text-xs text-[#50443d] mb-3">{bio}</p>
            <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-start text-[11px] text-[#50443d]">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>Member since: June 2023</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span>Portland, OR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forms Grid System */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        <section className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-white border border-[#e5e1da] rounded-xl p-5 h-full shadow-xs">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-[#5c3a21]/10 flex items-center justify-center text-[#42240d]">
                <User size={14} />
              </div>
              <h2 className="text-sm font-bold text-[#42240d]">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#50443d]">Full Name</label>
                <input 
                  className="bg-white border border-[#d4c3b9] rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#9a460f] focus:border-[#9a460f] transition-all outline-hidden text-[#1f1b16]" 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#50443d]">Email Address</label>
                <div className="relative flex items-center">
                  <Mail size={14} className="absolute left-3 text-gray-400" />
                  <input 
                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 pl-8 text-xs text-gray-400 cursor-not-allowed outline-hidden font-medium" 
                    type="email" 
                    value={email}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#50443d]">Phone Number (Optional)</label>
                <input 
                  className="bg-white border border-[#d4c3b9] rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#9a460f] focus:border-[#9a460f] transition-all outline-hidden text-[#1f1b16]" 
                  placeholder="+91" 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#50443d]">Bio</label>
                <input 
                  className="bg-white border border-[#d4c3b9] rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#9a460f] focus:border-[#9a460f] transition-all outline-hidden text-[#1f1b16]" 
                  type="text" 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>

            {/* Password Actions Box */}
            <div className="flex flex-col gap-4 p-4 bg-[#fbf2e9] rounded-xl border border-dashed border-[#d4c3b9]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#42240d] shadow-xs shrink-0">
                    <Lock size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1f1b16]">Security Credentials</h3>
                    <p className="text-[10px] text-[#50443d]">Update account security parameters safely.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button 
                    onClick={handleForgotPassword}
                    className="px-2 py-1 text-xs font-bold text-[#9a460f] hover:underline cursor-pointer bg-transparent border-0"
                  >
                    Forgot Password?
                  </button>
                  <button 
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="px-3 py-1.5 rounded-lg border border-[#82746c] text-[#50443d] font-bold text-xs hover:bg-white hover:text-[#42240d] transition-all cursor-pointer whitespace-nowrap"
                  >
                    {showPasswordForm ? 'Hide Panel' : 'Change Password'}
                  </button>
                </div>
              </div>

              {showPasswordForm && (
                <form onSubmit={handleUpdatePassword} className="border-t border-[#d4c3b9]/40 pt-4 flex flex-col gap-3 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-[#50443d]">Current Password</label>
                      <input 
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-white border border-[#d4c3b9] rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#9a460f] focus:border-[#9a460f] transition-all outline-hidden text-[#1f1b16]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-[#50443d]">New Password</label>
                      <input 
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-white border border-[#d4c3b9] rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#9a460f] focus:border-[#9a460f] transition-all outline-hidden text-[#1f1b16]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-[#50443d]">Confirm New Password</label>
                      <input 
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white border border-[#d4c3b9] rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#9a460f] focus:border-[#9a460f] transition-all outline-hidden text-[#1f1b16]"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-max bg-[#42240d] text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-[#5c3a21] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Key size={12} /> Update Password
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="lg:col-span-1"></section>

        <section className="lg:col-span-3">
          <div className="bg-white border border-[#e5e1da] rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#1e484d]/20 flex items-center justify-center text-[#003236]">
                <Shield size={14} />
              </div>
              <h2 className="text-sm font-bold text-[#42240d]">Privacy &amp; Notifications</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => setEmailAlerts(!emailAlerts)}
                className="flex items-center justify-between p-3 bg-[#fbf2e9] rounded-xl border border-[#d4c3b9]/20 hover:border-[#9a460f] transition-colors cursor-pointer group"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-[#1f1b16]">Email Alerts</span>
                  <span className="text-[10px] text-[#50443d]">New requests in your area</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative p-0.5 transition-colors flex items-center ${emailAlerts ? 'bg-[#9a460f]' : 'bg-[#eae1d8]'}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform transform ${emailAlerts ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer Navigation Bar controls */}
      <footer className="fixed bottom-0 right-0 left-64 bg-[#fff8f3]/90 backdrop-blur-md border-t border-[#d4c3b9]/30 px-6 py-2.5 z-40 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-[#50443d] text-xs">
            <Check size={14} className="text-green-600" />
            <span className="font-medium text-[11px]">All changes are managed locally</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 rounded-lg font-bold text-xs text-[#1f1b16] hover:bg-[#f5ece4] transition-all cursor-pointer">
              Discard Changes
            </button>
            <button 
              onClick={handleSaveChanges}
              className="flex items-center gap-1.5 bg-[#b85c26] text-white px-5 py-1.5 rounded-lg font-bold text-xs shadow-[2px_2px_0px_0px_#42240d] border border-white hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none group cursor-pointer"
            >
              <Save size={12} />
              Save Changes
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}