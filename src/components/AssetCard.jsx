import React from 'react';

export default function AssetCard({ item, onAction }) {
  const { name, status, category, imageUrl, image, image_url } = item;
  
  const isAvailable = status === 'AVAILABLE' || status === 'Available';
  const displayedImage = imageUrl || image || image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="bg-white border border-gray-100/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 w-full max-w-[280px]">
      
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-50 mb-4 shrink-0">
        <img 
          src={displayedImage} 
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            if (e.target.src !== "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80") {
              e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80";
            }
          }}
        />
        
        <div className="absolute bottom-3 left-3">
          <span className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm ${
            isAvailable 
              ? 'bg-white text-emerald-700 border border-emerald-50' 
              : 'bg-white text-gray-500 border border-gray-100'
          }`}>
            {isAvailable ? 'Available' : 'In Use'}
          </span>
        </div>
      </div>

      <div className="flex-grow mb-5">
        <h3 className="text-base font-bold text-gray-900 leading-snug tracking-tight mb-1 min-h-[44px] line-clamp-2">
          {name}
        </h3>
        <p className="text-xs text-[#b85c26] font-semibold tracking-wide uppercase truncate">
          {category || "Shared Asset"}
        </p>
      </div>

      <button
        onClick={() => onAction && onAction(item)}
        className={`w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] cursor-pointer ${
          isAvailable
            ? 'bg-[#5c3a21] text-white hover:bg-[#4a2e1a] shadow-sm'
            : 'bg-[#f4ebe1] text-[#5c3a21] hover:bg-[#ebdccb]'
        }`}
      >
        {isAvailable ? 'Quick Check-out' : 'Return Asset'}
      </button>

    </div>
  );
}