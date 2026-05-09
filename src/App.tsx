/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './pages/Dashboard';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Scan } from './pages/Scan';
import { Planner } from './pages/Planner';
import { Market } from './pages/Market';
import { Weather } from './pages/Weather';
import { Blogs } from './pages/Blogs';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Loader3D } from './components/ui/Loader3D';
import { UserProvider, useUser } from './contexts/UserContext';
import { useLanguage } from './contexts/LanguageContext';
import { translations } from './lib/translations';

function LanguagePreferenceBridge() {
  const { lang, setLanguage } = useLanguage();
  const { user, firebaseUser, updateUser } = useUser();
  const hydrated = useRef(false);

  useEffect(() => {
    if (!firebaseUser) hydrated.current = false;
  }, [firebaseUser]);

  useEffect(() => {
    if (!user?.preferredLanguage) return;
    if (!(user.preferredLanguage in translations)) return;
    if (hydrated.current) return;
    setLanguage(user.preferredLanguage);
    hydrated.current = true;
  }, [user?.id, user?.preferredLanguage, setLanguage]);

  useEffect(() => {
    if (!firebaseUser || !user) return;
    if (user.preferredLanguage === lang) return;
    const t = window.setTimeout(() => {
      updateUser({ preferredLanguage: lang });
    }, 400);
    return () => clearTimeout(t);
  }, [lang, firebaseUser?.uid, user?.id, user?.preferredLanguage, updateUser]);

  return null;
}

function DashboardLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function MainApp() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // 3D Loading Animation for 2.5 seconds on initial load
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <Loader3D />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="scan" element={<Scan />} />
          <Route path="planner" element={<Planner />} />
          <Route path="market" element={<Market />} />
          <Route path="weather" element={<Weather />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <UserProvider>
      <LanguagePreferenceBridge />
      <MainApp />
    </UserProvider>
  );
}
