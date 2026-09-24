import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MapPage from './pages/MapPage';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import { verifyToken } from './api/client';

function AdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      const valid = await verifyToken(token);
      if (valid) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('admin_token');
        setToken(null);
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, [token]);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-bold">Loading...</div>;
  }

  if (isAuthenticated && token) {
    return (
      <AdminDashboard 
        token={token} 
        onLogout={() => {
          localStorage.removeItem('admin_token');
          setToken(null);
          setIsAuthenticated(false);
          navigate('/');
        }} 
      />
    );
  }

  return <AdminLogin onLogin={(newToken) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
  }} />;
}

function MapPageWrapper() {
  const navigate = useNavigate();
  return <MapPage onAdminClick={() => navigate('/admin')} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapPageWrapper />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
