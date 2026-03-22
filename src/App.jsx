import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import Onboarding from './pages/onboarding/Onboarding';
import Dashboard from './pages/Dashboard';
import ContentPlanner from './pages/content-planner/ContentPlanner';
import ContentCenter from './pages/content-center/ContentCenter';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications'
import Profile from './pages/Profile';
import Settings from './pages/settings/Settings';
import Login from './pages/Login';
import LandingPage from './pages/landing-page/LandingPagee';

function App() {
  useEffect(() => {
    const savedAppearance = localStorage.getItem('theme');

    if (savedAppearance) {
      const parsedAppearance = JSON.parse(savedAppearance);

      if (parsedAppearance.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Routes without Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/landingpage" element={<LandingPage />} />

        {/* Routes with Layout */}
        <Route path="/" element={<Layout> <Dashboard /> </Layout>} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Layout> <Dashboard /> </Layout>} />
        <Route path="/content-planner" element={<Layout> <ContentPlanner /> </Layout>} />
        <Route path="/content-center" element={<Layout> <ContentCenter /> </Layout>} />
        <Route path="/analytics" element={<Layout> <Analytics /> </Layout>} />
        <Route path="/notifications" element={<Layout> <Notifications /> </Layout>} />
        <Route path="/profile" element={<Layout> <Profile /> </Layout>} />
        <Route path="/settings" element={<Layout> <Settings /> </Layout>} />
      </Routes>
    </Router>
  );
}

export default App;