import React, { useState } from 'react';
import ItemHistoryModal from './ItemHistoryModal';
import api from '../services/api';

export default function RentalCard({ item, onAction }) {
  const [isHistoryOpen, setIsHistoryHistoryOpen] = useState(false);
  const { id, name, pricePerDay, status, imageUrl, image, image_url, owner } = item;

  const ownerName = owner?.name || "Community Member";
  const ownerInitial = ownerName.trim().charAt(0).toUpperCase();
  
  const isAvailable = status === 'AVAILABLE' || status === 'Available';
  const price = pricePerDay !== undefined && pricePerDay !== null ? Number(pricePerDay).toFixed(2) : "0.00";
  
  const displayedImage = imageUrl || image || image_url || "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&w=400&q=80";

  const currentUserId = localStorage.getItem('userId');
  const isOwner = owner?.id && currentUserId && String(owner.id) === String(currentUserId);

  const handleDeleteListing = async (e) => {
    e.stopPropagation();
    const confirmChoice = window.confirm(`Are you sure you want to completely unlist "${name}" from the neighborhood marketplace?`);
    if (!confirmChoice) return;

    try {
      await api.delete(`/items/${id}`, {
        params: { userId: currentUserId }
      });
      alert("Listing successfully removed.");
      if (onAction) onAction(null); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Deletion aborted by backend security validation rules.");
    }
  };

  const getProximityString = () => {
    const userLat = localStorage.getItem('userLat');
    const userLng = localStorage.getItem('userLng');
    const ownerLat = owner?.latitude;
    const ownerLng = owner?.longitude;

    if (!userLat || !userLng || !ownerLat || !ownerLng) return null; 

    try {
      const lat1 = parseFloat(userLat);
      const lon1 = parseFloat(userLng);
      const lat2 = parseFloat(ownerLat);
      const lon2 = parseFloat(ownerLng);

      const R = 6371; 
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance < 1) return `${Math.round(distance * 1000)}m away`;
      return `${distance.toFixed(1)} km away`;
    } catch (err) {
      return null;
    }
  };

  const distanceStr = getProximityString();

  return (
    <div className="bg-white border border-gray-100/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 w-full max-w-[280px]">
      
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-50 mb-4 shrink-0">
        <img 
          src={displayedImage} 
          alt={name}
          className="w-full h-full object-cover"
        />

        <button
          onClick={(e) => { e.stopPropagation(); setIsHistoryHistoryOpen(true); }}
          className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-xs rounded-xl shadow-xs border border-gray-100 hover:bg-white transition-all cursor-pointer text-gray-500 hover:text-[#b85c26] text-xs z-10 flex items-center justify-center"
          title="View Audit History Logs"
        >
          ⏱️ History
        </button>
        
        <div className="absolute bottom-3 left-3">
          <div className="bg-white px-3 py-1 rounded-md shadow-sm border border-gray-100 flex items-baseline gap-0.5">
            <span className="text-xs font-black text-gray-900">₹{price}</span>
            <span className="text-[9px] font-medium text-gray-400">/ day</span>
          </div>
        </div>
      </div>

      <div className="flex-grow mb-5">
        <h3 className="text-base font-bold text-gray-900 leading-snug tracking-tight mb-3 min-h-[44px] line-clamp-2">
          {name}
        </h3>
        
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-orange-700 uppercase">
              {ownerInitial}
            </span>
          </div>
          
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-800 truncate mb-0.5">
              {isOwner ? "You (Owner)" : ownerName}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-[9px] font-bold text-orange-600/80 uppercase tracking-wider leading-none shrink-0">
                {isAvailable ? "AVAILABLE NOW" : "RESERVED"}
              </p>
              {distanceStr && !isOwner && (
                <span className="text-[9px] font-semibold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 whitespace-nowrap">
                  📍 {distanceStr}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {isOwner ? (
        <div className="flex flex-col gap-2 w-full">
          <button
            disabled
            className="w-full py-2 bg-gray-50 text-gray-400 text-xs font-semibold rounded-xl border border-gray-200/50 cursor-not-allowed"
          >
            Your Listing
          </button>
          {isAvailable && (
            <button
              onClick={handleDeleteListing}
              className="w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl border border-red-200/40 transition-colors cursor-pointer"
            >
              Delete Listing
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => onAction && onAction(item)}
          className={`w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] cursor-pointer ${
            isAvailable
              ? 'bg-[#5c3a21] text-white hover:bg-[#4a2e1a] shadow-sm'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {isAvailable ? 'Request Rental' : 'Return Rental'}
        </button>
      )}

      <ItemHistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryHistoryOpen(false)}
        itemId={id}
        itemName={name}
      />

    </div>
  );
}