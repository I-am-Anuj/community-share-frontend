import React, { useState, useEffect } from 'react';
import { X, Clock, User, Calendar } from 'lucide-react';
import api from '../services/api';

export default function ItemHistoryModal({ isOpen, onClose, itemId, itemName }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentUserId = localStorage.getItem('userId') || 1;

  useEffect(() => {
    if (isOpen && itemId) {
      const fetchHistory = async () => {
        try {
          setLoading(true);
          setError('');
          const response = await api.get(`/items/${itemId}/history`, {
            params: { userId: parseInt(currentUserId) }
          });
          setLogs(response.data);
        } catch (err) {
          console.error(err);
          setError(err.response?.data || "Failed to stream historical ledger for this resource.");
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, itemId, currentUserId]);

  if (!isOpen) return null;

  const getActionBadge = (actionType) => {
    const type = (actionType || '').toUpperCase();
    if (type === 'CHECK_OUT') {
      return {
        text: 'Checked Out',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: '📤'
      };
    }
    if (type === 'RETURN') {
      return {
        text: 'Returned Safe',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: '📥'
      };
    }
    return {
      text: type,
      bg: 'bg-gray-50 text-gray-600 border-gray-200',
      icon: '📋'
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden m-4 flex flex-col max-h-[85vh]">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="text-[#b85c26]" size={18} />
            <div>
              <h3 className="text-base font-bold text-gray-900">Item Audit History</h3>
              <p className="text-xs text-gray-500 truncate max-w-[280px]">Tracking log for: <span className="font-semibold text-gray-800">{itemName}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {error ? (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl text-center">
              ⚠️ {error}
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-gray-400 italic">Compiling chronological timeline steps...</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-gray-100 ml-3 pl-6 space-y-6">
              {logs.map((log) => {
                const badge = getActionBadge(log.actionType);
                return (
                  <div key={log.id || log.Id} className="relative">
                    <span className="absolute -left-[33px] top-0.5 bg-white border-2 border-gray-200 rounded-full w-4 h-4 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                    </span>

                    <div className="bg-gray-50/60 border border-gray-100/70 rounded-xl p-4 space-y-2.5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] tracking-wider uppercase border flex items-center gap-1 ${badge.bg}`}>
                          <span>{badge.icon}</span> {badge.text}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(log.timestamp)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <User size={14} className="text-gray-400 shrink-0" />
                        <span className="text-gray-900 font-semibold">
                          {log.user?.name || "System Record"}
                        </span>
                        <span className="text-xs text-gray-400 font-normal">
                          ({log.user?.email || "No Email Provided"})
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {logs.length === 0 && !loading && (
                <div className="text-center py-10 -ml-6">
                  <p className="text-sm text-gray-400 italic">No actions registered yet for this item.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/30 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Close Logs
          </button>
        </div>

      </div>
    </div>
  );
}