import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { auth } from '@common/services/config';
import { getProfile } from '@common/services/profileService';
import AssistedPostTab from './components/assistedposttab/AssistedPostTab';
import AutoModeTab from './components/automodeTab/AutoModeTab';

// Shared platforms
export const platforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-br from-pink-500 to-purple-600',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-sky-500',
  },
  {
    id: 'linkedin',
    name: 'Linkedin',
    icon: Linkedin,
    color: 'bg-blue-700',
  },
];

// Shared time utilities
export const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
export const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0')
);
export const periods = ['AM', 'PM'];

export const convertTo24Hour = (hour, period) => {
  const parsedHour = Number(hour);
  if (period === 'AM') return parsedHour === 12 ? 0 : parsedHour;
  return parsedHour === 12 ? 12 : parsedHour + 12;
};

export const toneOptions = ['Professional', 'Casual', 'Humorous', 'Inspirational', 'Educational'];
export const postStyleOptions = ['Conversational', 'Storytelling', 'Promotional', 'News / Updates', 'Question-based'];
export const languageOptions = ['English', 'Filipino', 'Spanish', 'French', 'German', 'Portuguese', 'Indonesian', 'Japanese', 'Korean', 'Arabic'];

const ContentPlanner = () => {
  const [activeTab, setActiveTab] = useState('assisted');

  // Loaded once here and passed to both tabs to avoid duplicate Firestore reads
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const profile = await getProfile(user.uid);
        setUserProfile(profile);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Plan Your Content with AI-Powered Ease
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Create posts manually with AI help, or let AI manage recurring content
          generation, scheduling, and posting workflow for you.
        </p>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('assisted')}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'assisted'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            AI-Assisted Post
          </button>

          <button
            onClick={() => setActiveTab('auto')}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'auto'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            AI Auto Mode
          </button>
        </div>
      </div>

      {activeTab === 'assisted' ? (
        <AssistedPostTab
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          profileLoading={profileLoading}
          toneOptions={toneOptions}
          postStyleOptions={postStyleOptions}
          languageOptions={languageOptions}
          platforms={platforms}
          hours={hours}
          minutes={minutes}
          periods={periods}
          convertTo24Hour={convertTo24Hour}
        />
      ) : (
        <AutoModeTab
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          profileLoading={profileLoading}
          platforms={platforms}
          toneOptions={toneOptions}
          postStyleOptions={postStyleOptions}
          languageOptions={languageOptions}
          hours={hours}
          minutes={minutes}
          periods={periods}
          convertTo24Hour={convertTo24Hour}
        />
      )}
    </div>
  );
};

export default ContentPlanner;