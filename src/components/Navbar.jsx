import React, { useState, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';

export default function Navbar({ setActiveTab }) {
  const [userName, setUserName] = useState('Community Member');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
   
    const storedName = localStorage.getItem('name') || localStorage.getItem('userName');
    if (storedName && storedName.trim() !== '') {
      setUserName(storedName);
    }
    
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  const firstLetter = userName ? userName.trim().charAt(0).toUpperCase() : 'C';

  return (
    <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
      
     
      <div className="relative w-72">
        <span className="absolute left-3.5 top-2.5 text-gray-400">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search resources..."
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-100 bg-gray-50/50 text-gray-700 placeholder-gray-400 focus:outline-hidden focus:border-[#b85c26] focus:bg-white transition-all"
        />
      </div>

    
      <div className="flex items-center gap-4">
        
    
        <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-gray-100"></div>

        <div 
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-opacity"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-800 tracking-tight group-hover:text-[#b85c26] transition-colors">
              {userName}
            </p>
            <p className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mt-0.5">
              YOU ARE AWESOME
            </p>
          </div>
          
          {profileImage ? (
            <img 
              src={profileImage} 
              alt="User avatar image" 
              className="w-9 h-9 rounded-full object-cover border border-gray-100 shadow-xs group-hover:border-[#b85c26] transition-colors animate-fadeIn"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#b85c26] text-white shadow-xs flex items-center justify-center font-bold text-sm select-none border border-orange-700/10 group-hover:brightness-110 transition-all">
              {firstLetter}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}