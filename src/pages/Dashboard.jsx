import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AssetCard from '../components/AssetCard'; 
import RentalCard from '../components/RentalCard'; 
import ShareItemModal from '../components/ShareItemModal';
import BookingCenter from '../components/BookingCenter'; 
import AuditHistory from '../components/AuditHistory';
import ProfileSettings from '../components/ProfileSettings';
import HelpSupport from '../components/HelpSupport';
import api from '../services/api';
import { Shield, UserMinus, Key, Users, Layers, ExternalLink } from 'lucide-react';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('inventory');
  const [subTab, setSubTab] = useState('marketplace'); 
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const [rentals, setRentals] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [allSystemSpaces, setAllSystemSpaces] = useState([]);
  const [activeSpaceMembers, setActiveSpaceMembers] = useState([]);
  const [viewingMembersSpaceId, setViewingMembersSpaceId] = useState(null);

  const [userSpaceId, setUserSpaceId] = useState(localStorage.getItem('spaceId') ? parseInt(localStorage.getItem('spaceId')) : null);
  const [spaceNameInput, setSpaceNameInput] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [spaceError, setSpaceError] = useState('');
  const [spaceSuccess, setSpaceSuccess] = useState('');

  const currentUserId = parseInt(localStorage.getItem('userId') || 1);

  const fetchAllSystemSpaces = async () => {
    try {
      const response = await api.get('/spaces');
      setAllSystemSpaces(response.data || []);
    } catch (err) {
      console.error(err);
      setAllSystemSpaces([]);
    }
  };

  const fetchSpaceMembersList = async (spaceId) => {
    try {
      const response = await api.get(`/spaces/${spaceId}/members`);
      setActiveSpaceMembers(response.data);
      setViewingMembersSpaceId(spaceId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMemberAction = async (spaceId, targetUserId) => {
    if (!window.confirm("Are you sure you want to remove this user from the space?")) return;
    try {
      await api.delete(`/spaces/${spaceId}/members/${targetUserId}`, {
        params: { adminId: currentUserId }
      });
      alert("Member removed successfully.");
      fetchSpaceMembersList(spaceId);
    } catch (err) {
      alert(err.response?.data || "Failed to remove member.");
    }
  };

  const fetchMarketplaceRentals = async () => {
    try {
      setLoading(true);
      const lat = localStorage.getItem('userLat');
      const lng = localStorage.getItem('userLng');

      const response = await api.get('/items', {
        params: {
          spaceId: 1,
          lat: lat ? parseFloat(lat) : null,
          lng: lng ? parseFloat(lng) : null
        }
      });
      setRentals(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityAssets = async (spaceId) => {
    if (!spaceId) return;
    try {
      setLoading(true);
      const response = await api.get(`/items/space/${spaceId}`);
      const filteredAssets = response.data.filter(item => 
        (item.itemType || item.type || '').toUpperCase() === 'ASSET'
      );
      setAssets(filteredAssets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSystemSpaces();
  }, []);

  useEffect(() => {
    if (activeTab === 'inventory') {
      if (subTab === 'marketplace') {
        fetchMarketplaceRentals();
      } else if (subTab === 'community' && userSpaceId) {
        fetchCommunityAssets(userSpaceId);
      }
    }
  }, [activeTab, subTab, userSpaceId]);

  const handleItemAction = async (item) => {
    if (!item) {
      fetchMarketplaceRentals();
      if (userSpaceId) fetchCommunityAssets(userSpaceId);
      return;
    }

    try {
      const itemType = (item.itemType || item.type || '').toUpperCase();

      if (itemType === 'MARKETPLACE_RENT' || itemType === 'RENTAL') {
        if (item.status === 'AVAILABLE') {
          const daysInput = prompt("How many days would you like to request this item?", "3");
          if (!daysInput) return;
          
          const rentalDays = parseInt(daysInput);
          if (isNaN(rentalDays) || rentalDays <= 0) {
            alert("Please enter a valid number of days.");
            return;
          }

          await api.post('/bookings/request', {
            itemId: item.id,
            borrowerId: currentUserId,
            rentalDays: rentalDays
          });
          
          alert("Ownership transfer request submitted successfully! Waiting for the current owner's approval.");
        }
        fetchMarketplaceRentals();
      } else {
        if (item.status === 'AVAILABLE') {
          await api.put(`/items/${item.id}/checkout/${currentUserId}`);
        } else {
          await api.put(`/items/${item.id}/return`);
        }
        fetchCommunityAssets(userSpaceId);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data || "Failed to complete ownership request process.");
    }
  };

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    setSpaceError('');
    setSpaceSuccess('');
    try {
      const response = await api.post('/spaces/create', {
        name: spaceNameInput,
        adminId: currentUserId
      });
      const newSpaceId = response.data.id;
      localStorage.setItem('spaceId', newSpaceId);
      setUserSpaceId(newSpaceId);
      setSpaceSuccess(`Space generated successfully! Invite Code: ${response.data.inviteCode}`);
      setSpaceNameInput('');
      fetchAllSystemSpaces();
    } catch (err) {
      setSpaceError(err.response?.data?.message || 'Failed to instantiate sharing space.');
    }
  };

  const handleJoinSpace = async (e) => {
    e.preventDefault();
    setSpaceError('');
    setSpaceSuccess('');
    try {
      const response = await api.post('/spaces/join', {
        inviteCode: inviteCodeInput.trim().toUpperCase(),
        userId: currentUserId
      });
      setSpaceSuccess(response.data || 'Successfully registered into new group network!');
      setInviteCodeInput('');
      fetchAllSystemSpaces();
    } catch (err) {
      setSpaceError(err.response?.data || err.response?.data?.message || 'Invalid space invite token credentials.');
    }
  };

  const selectActiveSpaceContext = (spaceId) => {
    localStorage.setItem('spaceId', spaceId);
    setUserSpaceId(spaceId);
    setViewingMembersSpaceId(null);
  };

  return (
    <div className="flex w-screen h-screen bg-gray-50/50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onShareClick={() => setIsShareModalOpen(true)}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar setActiveTab={setActiveTab} />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            
            {activeTab === 'inventory' && (
              <>
                <div className="flex items-center justify-between border-b border-gray-200 mb-8 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Resource Dashboard</h1>
                    <p className="text-xs text-gray-500">Toggle between open local public marketplaces or gated closed groups.</p>
                  </div>

                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setSubTab('marketplace')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${subTab === 'marketplace' ? 'bg-[#b85c26] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      🏪 Nearby Rentals
                    </button>
                    <button
                      onClick={() => setSubTab('community')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${subTab === 'community' ? 'bg-[#b85c26] text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      📦 Community Assets
                    </button>
                  </div>
                </div>

                {loading ? (
                  <p className="text-sm text-gray-400 italic py-6">Loading localized item records mapping matrix...</p>
                ) : subTab === 'marketplace' ? (
                  <div className="space-y-6">
                    <div className="flex flex-col">
                      <h3 className="text-base font-bold text-gray-800">Available Neighborhood Tools</h3>
                      <p className="text-xs text-gray-400">Items sorted natively by closest proximity based on active browser location keys.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {rentals.map(item => (
                        <RentalCard key={item.id} item={item} onAction={handleItemAction} />
                      ))}
                    </div>

                    {rentals.length === 0 && (
                      <p className="text-sm text-gray-400 italic bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
                        No neighborhood tools listed for rental payouts near your active location coordinate point.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    
                    <div className="bg-white border border-gray-200/60 shadow-xs rounded-2xl p-6">
                      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <Layers size={16} className="text-[#b85c26]" /> All Community Gated Spaces
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {allSystemSpaces.map(space => {
                          const isAdmin = space.adminId === currentUserId;
                          const isActive = userSpaceId === space.id;
                          return (
                            <div key={space.id} className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${isActive ? 'border-[#b85c26] bg-orange-50/20' : 'border-gray-200 bg-white'}`}>
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-base font-bold text-gray-900 truncate">{space.name}</h4>
                                  {isAdmin && (
                                    <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold flex items-center gap-1 shrink-0">
                                      <Shield size={10} /> Leader
                                    </span>
                                  )}
                                </div>
                                <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 w-max">
                                  <Key size={12} className="text-[#b85c26]" /> Code: <span className="font-mono font-bold text-gray-900">{space.inviteCode}</span>
                                </div>
                              </div>
                              <div className="mt-4 flex gap-2">
                                <button
                                  onClick={() => selectActiveSpaceContext(space.id)}
                                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${isActive ? 'bg-[#b85c26] text-white border-[#b85c26]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                                >
                                  {isActive ? 'Active Context' : 'Enter Space'}
                                </button>
                                {isAdmin && (
                                  <button
                                    onClick={() => fetchSpaceMembersList(space.id)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 hover:bg-200 transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <Users size={12} /> Manage Members
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {viewingMembersSpaceId && (
                      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Users size={16} className="text-[#b85c26]" /> Space Membership Controls
                          </h3>
                          <button onClick={() => setViewingMembersSpaceId(null)} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">Close Panel</button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {activeSpaceMembers.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                              <div>
                                <p className="text-sm font-bold text-gray-900">{member.name}</p>
                                <p className="text-xs text-gray-400">{member.email}</p>
                              </div>
                              {member.id !== currentUserId ? (
                                <button
                                  onClick={() => handleRemoveMemberAction(viewingMembersSpaceId, member.id)}
                                  className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <UserMinus size={14} /> Kick User
                                </button>
                              ) : (
                                <span className="text-[10px] text-gray-400 italic font-medium bg-white px-2 py-0.5 rounded border border-gray-200">Creator Leader</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="max-w-3xl mx-auto bg-white border border-gray-100 shadow-sm rounded-2xl p-8 mt-4">
                      <div className="text-center max-w-md mx-auto mb-8 space-y-2">
                        <h3 className="text-lg font-bold text-gray-900">Unlock Gated Community Assets</h3>
                        <p className="text-xs text-gray-500">Free peer-to-peer equipment loops are restricted inside secure invite networks like apartment rooms, hostel sectors, or shared workspaces.</p>
                      </div>

                      {spaceError && <div className="p-3 mb-4 bg-red-50 text-red-600 text-xs font-medium rounded-xl border border-red-100">{spaceError}</div>}
                      {spaceSuccess && <div className="p-3 mb-4 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-xl border border-emerald-100">{spaceSuccess}</div>}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <form onSubmit={handleJoinSpace} className="space-y-4 pr-0 md:pr-4">
                          <h4 className="text-sm font-bold text-[#b85c26]">Enter Share Invite Code</h4>
                          <input
                            type="text"
                            required
                            value={inviteCodeInput}
                            onChange={(e) => setInviteCodeInput(e.target.value)}
                            placeholder="e.g., ABC123XYZ"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#b85c26]"
                          />
                          <button type="submit" className="w-full py-2.5 bg-[#b85c26] text-white text-xs font-bold rounded-xl hover:bg-[#a04f1f] transition-all cursor-pointer">
                            Join Gated Network
                          </button>
                        </form>

                        <form onSubmit={handleCreateSpace} className="space-y-4 pt-6 md:pt-0 pl-0 md:pl-8">
                          <h4 className="text-sm font-bold text-[#42240d]">Start a Gated Circle</h4>
                          <input
                            type="text"
                            required
                            value={spaceNameInput}
                            onChange={(e) => setSpaceNameInput(e.target.value)}
                            placeholder="e.g., Hostel Block C Cabinet"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#42240d]"
                          />
                          <button type="submit" className="w-full py-2.5 bg-[#42240d] text-white text-xs font-bold rounded-xl hover:bg-black transition-all cursor-pointer">
                            Generate Workspace
                          </button>
                        </form>
                      </div>
                    </div>

                    {userSpaceId && (
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <h3 className="text-base font-bold text-gray-800">Communal Sharing Locker</h3>
                            <p className="text-xs text-gray-400">Free operational checkouts available exclusively inside your group workspace.</p>
                          </div>
                          <button 
                            onClick={() => { localStorage.removeItem('spaceId'); setUserSpaceId(null); }}
                            className="text-xs text-red-500 hover:underline bg-transparent border-0 cursor-pointer"
                          >
                            Deactivate Locker Focus
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                          {assets.map(item => (
                            <AssetCard key={item.id} item={item} onAction={handleItemAction} />
                          ))}
                        </div>

                        {assets.length === 0 && (
                          <p className="text-sm text-gray-400 italic bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
                            Locker cabinet is currently empty. Use the 'Share an Item' option below to list resources.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === 'requests' && <BookingCenter />}

            {(activeTab === 'history' || activeTab === 'audit' || activeTab === 'Audit History') && <AuditHistory />}
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'support' && <HelpSupport />}

          </div>
        </div>
      </div>

      <ShareItemModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        onItemAdded={() => {
          fetchMarketplaceRentals();
          if (userSpaceId) fetchCommunityAssets(userSpaceId);
        }}
      />
    </div>
  );
}