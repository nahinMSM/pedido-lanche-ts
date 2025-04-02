import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from './services/firebase';

import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import Layout from './components/Layout';
import CustomerPage from './pages/CustomerPage';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><CustomerPage /></Layout>} />
        <Route path="/login" element={user ? <Navigate to="/admin" /> : <Login />} />
        <Route
          path="/admin"
          element={user ? <Layout><AdminPage /></Layout> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={user ? "/admin" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}