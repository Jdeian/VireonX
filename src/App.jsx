import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import SchedulePosts from './pages/SchedulePosts';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import LandingPage from './pages/landingpage/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/landingpage" element={<LandingPage />} />

        {/* Routes with Layout */}
        <Route path="/" element={<Layout> <Dashboard /> </Layout>} />
        <Route path="/dashboard" element={<Layout> <Dashboard /> </Layout>} />
        <Route path="/schedule" element={<Layout> <SchedulePosts /> </Layout>} />
        <Route path="/analytics" element={<Layout> <Analytics /> </Layout>} />
        <Route path="/profile" element={<Layout> <Profile /> </Layout>} />
        <Route path="/settings" element={<Layout> <Settings /> </Layout>} />
      </Routes>
    </Router>
  );
}

export default App;