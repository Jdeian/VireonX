import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import Onboarding from './pages/onboarding/Onboarding';
import Dashboard from './pages/dashboard/Dashboard';
import ContentPlanner from './pages/content-planner/ContentPlanner';
import ContentCenter from './pages/content-center/ContentCenter';
import Analytics from './pages/analytics/Analytics';
import Notifications from './pages/notifications/Notifications'
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';
import LandingPage from './pages/landing-page/LandingPage';

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
        <Route path="/landing-page" element={<LandingPage />} />

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