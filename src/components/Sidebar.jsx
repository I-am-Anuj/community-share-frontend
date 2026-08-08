import React from 'react';
import { Box, ArrowLeftRight, History, Settings, CircleHelp, Plus, LogOut } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onShareClick, onLogout }) {
  
  const menuItems = [
    { id: 'inventory', label: 'Space Inventory', icon: Box },
    { id: 'requests', label: 'Requests Hub', icon: ArrowLeftRight },
    { id: 'history', label: 'Audit History', icon: History },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0">
      
      
      <div>
        <div className="mb-10 px-2">
          <h1 className="text-2xl font-bold text-[#b85c26] tracking-tight">CommunityShare</h1>
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mt-0.5">
            Resource Sharing
          </p>
        </div>

   
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#b85c26] text-white shadow-sm font-semibold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      
      <div className="space-y-4">
        <div className="space-y-1 border-t border-gray-50 pt-4">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'bg-gray-50 text-gray-900 font-bold' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <Settings size={16} />
            Settings
          </button>
          
          <button 
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'support' ? 'bg-[#b85c26]/10 text-[#b85c26] font-bold' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <CircleHelp size={16} className={activeTab === 'support' ? 'text-[#b85c26]' : 'text-gray-400'} />
            Help & Support
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50/50 hover:text-red-700 transition-colors cursor-pointer"
          >
            <LogOut size={16} className="text-red-400" />
            Sign Out
          </button>
        </div>

    
        <button 
          onClick={onShareClick}
          className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-3 bg-[#b85c26] text-white font-semibold text-sm rounded-xl hover:bg-[#a04f1f] transition-all shadow-xs cursor-pointer"
        >
          <Plus size={16} />
          Share an Item
        </button>
      </div>
    </div>
  );
}