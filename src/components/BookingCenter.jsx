import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function BookingCenter() {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUserId = localStorage.getItem('userId') || 1;

  const fetchIncomingRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings/owner/${currentUserId}/incoming`);
      setIncomingRequests(response.data);
    } catch (err) {
      console.error("Error loading owner transaction pipelines:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings/borrower/${currentUserId}/my-requests`);
      setSentRequests(response.data);
    } catch (err) {
      console.error("Error loading borrower requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'incoming') {
      fetchIncomingRequests();
    } else {
      fetchSentRequests();
    }
  }, [activeTab]);

  const handleReviewRequest = async (bookingId, approveStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/review`, null, {
        params: { ownerId: currentUserId, approve: approveStatus }
      });
      fetchIncomingRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Action request update rejected.");
    }
  };

  const handleInitializeReturn = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/return`, null, {
        params: { borrowerId: currentUserId }
      });
      alert("Return request submitted! Awaiting owner confirmation sign-off.");
      fetchSentRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to trigger return.");
    }
  };

  const handleConfirmReturnReceived = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/confirm`, null, {
        params: { ownerId: currentUserId }
      });
      alert("Return verified successfully! Your tool is back in your custody and open for rentals.");
      fetchIncomingRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to confirm return collection.");
    }
  };

  const pendingRequests = incomingRequests.filter(b => b.status === 'PENDING');
  const occupiedTools = incomingRequests.filter(b => b.status === 'ACTIVE' || b.status === 'RETURN_PENDING');

  return (
    <div className="p-8 max-w-[1280px] mx-auto w-full flex flex-col gap-8">
      
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-[#42240d]">Two-Factor Verification Center</h2>
        <p className="text-sm text-[#50443d]">Manage handoffs, verify physical tool returns, and monitor active leases.</p>
      </div>

      {/* Primary Navigation Bar Toggle */}
      <div className="bg-[#f5ece4] rounded-2xl p-1.5 flex self-start shadow-sm border border-[#d4c3b9]/30">
        <button 
          onClick={() => setActiveTab('incoming')}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
            activeTab === 'incoming' ? 'bg-[#42240d] text-white shadow-md' : 'text-[#50443d] hover:text-[#1f1b16]'
          }`}
        >
          My Tools & Listings ({incomingRequests.length})
        </button>
        <button 
          onClick={() => setActiveTab('sent')}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
            activeTab === 'sent' ? 'bg-[#42240d] text-white shadow-md' : 'text-[#50443d] hover:text-[#1f1b16]'
          }`}
        >
          Items I Am Borrowing ({sentRequests.length})
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 italic py-4">Synchronizing transaction logs matrices...</p>
      ) : activeTab === 'incoming' ? (
        
        <div className="space-y-10">
          
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span>📩</span> Incoming Rental Requests Received
            </h3>
            
            {pendingRequests.length > 0 && (
              <div className="grid grid-cols-12 px-6 text-[#50443d] text-xs font-semibold uppercase tracking-wider">
                <div className="col-span-5">Tool Requested</div>
                <div className="col-span-3">Borrower</div>
                <div className="col-span-2">Duration</div>
                <div className="col-span-2 text-right">Decisions</div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {pendingRequests.map((booking) => (
                <div key={booking.id} className="grid grid-cols-12 items-center bg-white border border-[#d4c3b9]/50 rounded-2xl p-4">
                  <div className="col-span-5 flex flex-col">
                    <span className="text-base font-bold text-[#1f1b16]">{booking.itemName}</span>
                    <span className="text-xs text-gray-400">Request ID: #RQ-{booking.id}</span>
                  </div>
                  <div className="col-span-3 text-sm font-medium text-[#1f1b16]">{booking.borrower?.name}</div>
                  <div className="col-span-2 text-sm text-[#50443d]">📅 {booking.rentalDays} Days</div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <button 
                      onClick={() => handleReviewRequest(booking.id, false)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 cursor-pointer"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleReviewRequest(booking.id, true)}
                      className="px-4 py-1.5 bg-[#9a460f] text-white text-xs font-bold rounded-xl hover:bg-[#793100] cursor-pointer shadow-xs"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}

              {pendingRequests.length === 0 && (
                <p className="text-xs text-gray-400 italic bg-gray-50/40 p-6 rounded-2xl text-center border border-dashed border-gray-200">
                  No new rental requests are currently waiting for your decision.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span>🤝</span> My Tools on Rent (Occupied By Neighbors)
            </h3>

            {occupiedTools.length > 0 && (
              <div className="grid grid-cols-12 px-6 text-[#50443d] text-xs font-semibold uppercase tracking-wider">
                <div className="col-span-3">Item Out on Lease</div>
                <div className="col-span-2">Current Holder</div>
                <div className="col-span-2">Remaining Time Status</div>
                <div className="col-span-2">Return Request Status</div>
                <div className="col-span-3 text-right">Escrow Handshake Action</div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {occupiedTools.map((booking) => (
                <div key={booking.id} className="grid grid-cols-12 items-center bg-white border border-[#d4c3b9]/50 rounded-2xl p-4 shadow-xs">
                  
                 
                  <div className="col-span-3 flex flex-col">
                    <span className="text-base font-bold text-[#1f1b16]">{booking.itemName}</span>
                    <span className="text-xs text-gray-400">Active Lease Token: #LS-{booking.id}</span>
                  </div>
                  
               
                  <div className="col-span-2 text-sm font-medium text-[#1f1b16]">{booking.borrower?.name}</div>
                  
                  
                  <div className="col-span-2 flex flex-col gap-1 justify-center">
                    {booking.status === 'ACTIVE' ? (
                      <span className="text-xs text-orange-700 font-bold flex items-center gap-1">
                        ⏳ {booking.daysRemaining} Days Left
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium italic">Lease Complete</span>
                    )}
                  </div>

                
                  <div className="col-span-2 flex items-center">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] tracking-wider uppercase border ${
                      booking.status === 'RETURN_PENDING' 
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse font-black' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      ● {booking.status === 'RETURN_PENDING' ? 'Requested' : 'Occupied'}
                    </span>
                  </div>

                  <div className="col-span-3 flex justify-end">
                    {booking.status === 'ACTIVE' && (
                      <span className="text-xs text-gray-400 italic bg-gray-50 px-3 py-1 rounded-xl border border-gray-100">
                        User is still using tool
                      </span>
                    )}
                    {booking.status === 'RETURN_PENDING' && (
                      <button 
                        onClick={() => handleConfirmReturnReceived(booking.id)}
                        className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-xs cursor-pointer"
                      >
                        ✓ Accept Return
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {occupiedTools.length === 0 && (
                <p className="text-xs text-gray-400 italic bg-gray-50/40 p-6 rounded-2xl text-center border border-dashed border-gray-200">
                  None of your tools are currently out on rent or occupied by other users.
                </p>
              )}
            </div>
          </div>

        </div>

      ) : (

     
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-12 px-6 py-2 text-[#50443d] text-xs font-semibold uppercase tracking-wider">
            <div className="col-span-4">Item Borrowed</div>
            <div className="col-span-2">Rental Fee</div>
            <div className="col-span-3">Time Constraints</div>
            <div className="col-span-3 text-right">Verification Flow Action</div>
          </div>

          <div className="flex flex-col gap-3">
            {sentRequests.map((request) => (
              <div key={request.id} className="grid grid-cols-12 items-center bg-white border border-[#d4c3b9]/50 rounded-2xl p-4 shadow-xs">
                <div className="col-span-4 flex flex-col">
                  <span className="text-base font-bold text-[#1f1b16]">{request.itemName}</span>
                  <span className="text-xs text-gray-400">Total Duration: {request.rentalDays} Days</span>
                </div>
                <div className="col-span-2 text-sm font-bold text-[#42240d]">₹{Number(request.totalPrice).toFixed(2)}</div>
                
                <div className="col-span-3">
                  {request.status === 'ACTIVE' ? (
                    <span className="text-xs font-black text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg">
                      ⏳ {request.daysRemaining} Days Remaining
                    </span>
                  ) : (
                    <span className={`px-3 py-0.5 rounded-full font-bold text-[9px] tracking-wider uppercase border ${
                      request.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {request.status}
                    </span>
                  )}
                </div>

                <div className="col-span-3 flex justify-end">
                  {request.status === 'PENDING' && (
                    <span className="text-xs text-amber-600 font-semibold italic bg-amber-50 px-3 py-1 rounded-xl">Awaiting Owner Approval</span>
                  )}
                  {request.status === 'ACTIVE' && (
                    <button 
                      onClick={() => handleInitializeReturn(request.id)}
                      className="px-4 py-2 bg-[#42240d] text-white text-xs font-bold rounded-xl hover:bg-black transition-all cursor-pointer"
                    >
                      I Have Returned It
                    </button>
                  )}
                  {request.status === 'RETURN_PENDING' && (
                    <span className="text-xs text-indigo-600 font-bold italic bg-indigo-50 px-3 py-1 rounded-xl">Awaiting Owner Return Inspection</span>
                  )}
                  {request.status === 'COMPLETED' && (
                    <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-xl">Lease Safely Settled</span>
                  )}
                </div>
              </div>
            ))}

            {sentRequests.length === 0 && (
              <div className="text-center py-10 bg-white border border-dashed border-gray-200 rounded-2xl">
                <p className="text-sm text-gray-400 italic">You aren't currently renting or borrowing any neighborhood items.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}