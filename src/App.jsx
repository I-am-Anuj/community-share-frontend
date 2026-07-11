import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if secure authorization token string is already active
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#b85c26] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen">
      {isAuthenticated ? (
        <Dashboard onLogout={() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }} />
      ) : (
        <Auth onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}