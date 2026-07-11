import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRightLeft, ShieldCheck, FileText } from 'lucide-react';
import api from '../services/api';

export default function AuditHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUserId = localStorage.getItem('userId') || 1;

  useEffect(() => {
    const fetchAllHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/bookings/user/${currentUserId}/history`);
        setHistory(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllHistory();
  }, [currentUserId]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-8 max-w-[1280px] mx-auto w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-[#42240d]">Global Audit History Ledger</h2>
        <p className="text-sm text-[#50443d]">Immutable timeline of all your completed handoffs, structural agreements, and rental transactions.</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 italic py-6">Streaming operational transaction logs...</p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-12 px-6 py-2 text-[#50443d] text-xs font-semibold uppercase tracking-wider">
            <div className="col-span-4">Item & Transaction Info</div>
            <div className="col-span-3">Borrower Mapped</div>
            <div className="col-span-2">Lease Fee</div>
            <div className="col-span-3 text-right">Lifecycle Status</div>
          </div>

          <div className="flex flex-col gap-3">
            {history.map((log) => (
              <div key={log.id} className="grid grid-cols-12 items-center bg-white border border-[#d4c3b9]/50 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
                <div className="col-span-4 flex flex-col gap-0.5">
                  <span className="text-base font-bold text-[#1f1b16]">{log.itemName}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} /> Init: {formatDate(log.createdAt)}
                  </span>
                </div>

                <div className="col-span-3 flex items-center gap-2 text-sm text-gray-700">
                  <User size={14} className="text-gray-400" />
                  <span className="font-medium">{log.borrower?.name}</span>
                </div>

                <div className="col-span-2 text-sm font-black text-[#42240d]">
                 ₹{Number(log.totalPrice).toFixed(2)}
                </div>

                <div className="col-span-3 flex justify-end">
                  <span className={`px-4 py-1.5 rounded-full font-bold text-[10px] tracking-wider uppercase border ${
                    log.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    log.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                    log.status === 'ACTIVE' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    ● {log.status}
                  </span>
                </div>
              </div>
            ))}

            {history.length === 0 && (
              <div className="text-center py-12 bg-white border border-dashed border-gray-200 rounded-2xl">
                <FileText className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-sm text-gray-400 italic">No global lifecycle histories are stored inside this profile path yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}