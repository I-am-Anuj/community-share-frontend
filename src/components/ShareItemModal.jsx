import React, { useState } from 'react';
import { X, Package, DollarSign, Image as ImageIcon, Upload } from 'lucide-react';
import api from '../services/api';

export default function ShareItemModal({ isOpen, onClose, onItemAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'ASSET',
    price: '',
    imageUrl: '', 
    spaceId: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image is too large! Please choose a smaller photo under 2MB.");
        return;
      }

      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const activeUserId = localStorage.getItem('userId') || 1;

      const payload = {
        name: formData.name,
        description: formData.description,
        // 🔥 FIX: Sends MARKETPLACE_RENT to match the validation rule in BookingService.java
        itemType: formData.type === 'RENTAL' ? 'MARKETPLACE_RENT' : 'ASSET', 
        category: formData.type === 'ASSET' ? 'Community Asset' : 'Neighborhood Rental', 
        price: formData.type === 'RENTAL' ? parseFloat(formData.price) : 0,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1530124560677-bdaeaef2f921?auto=format&fit=crop&w=500&q=80',
        spaceId: formData.spaceId,
        ownerId: parseInt(activeUserId)
      };

      const response = await api.post('/items/add', payload);
      
      if (response.data) {
        onItemAdded();
        onClose();
        setFormData({ name: '', description: '', type: 'ASSET', price: '', imageUrl: '', spaceId: 1 });
      }
    } catch (err) {
      console.error("Error adding item:", err);
      setError(err.response?.data?.message || 'Failed to list item. Verify backend validation requirements.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden m-4">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Package className="text-[#b85c26]" size={20} />
            <h3 className="text-lg font-bold text-gray-900">List an Item to Share</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Item Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Makita Cordless Router"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#b85c26] focus:ring-1 focus:ring-[#b85c26] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Listing Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, type: 'ASSET' }))}
                className={`py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer ${formData.type === 'ASSET' ? 'border-[#b85c26] bg-orange-50/40 text-[#b85c26] font-semibold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Community Asset
              </button>
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, type: 'RENTAL' }))}
                className={`py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer ${formData.type === 'RENTAL' ? 'border-[#b85c26] bg-orange-50/40 text-[#b85c26] font-semibold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Neighborhood Rental
              </button>
            </div>
          </div>

          {formData.type === 'RENTAL' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Rental Fee (Per Day)</label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-400 text-sm"><DollarSign size={16} /></span>
                <input
                  type="number"
                  name="price"
                  required
                  min="1"
                  step="1"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#b85c26] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              name="description"
              required
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide clean instructions, specifications..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#b85c26] resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Upload Product Image</label>
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={20} className="text-gray-300" />
                )}
              </div>

              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-gray-300 rounded-xl hover:bg-gray-50/80 hover:border-[#b85c26] transition-colors cursor-pointer group">
                <Upload size={16} className="text-gray-400 group-hover:text-[#b85c26] transition-colors" />
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">
                  {formData.imageUrl ? 'Change Photo Selected' : 'Choose Local File Image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-[#b85c26] text-white rounded-xl text-sm font-semibold hover:bg-[#a04f1f] shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? 'Publishing...' : 'List Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}