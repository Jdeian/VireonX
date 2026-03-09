import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-white min-h-screen text-black">
      <div className="container mx-auto p-8">
        {/* Dashboard Header */}
        <h1 className="text-5xl font-extrabold text-center text-indigo-600">Welcome to Your Dashboard</h1>
        <p className="text-xl text-center mt-4 text-gray-700">Your control center for all social media activities</p>

        {/* Key Metrics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-indigo-100 p-6 rounded-lg shadow-xl hover:bg-indigo-200 transition duration-200">
            <h2 className="text-3xl font-semibold text-indigo-600">Scheduled Posts</h2>
            <p className="mt-4 text-gray-700">You have 12 posts scheduled for this week.</p>
            <a href="/schedule" className="text-indigo-500 mt-6 inline-block">View Scheduled Posts →</a>
          </div>
          <div className="bg-violet-100 p-6 rounded-lg shadow-xl hover:bg-violet-200 transition duration-200">
            <h2 className="text-3xl font-semibold text-violet-600">Engagement Stats</h2>
            <p className="mt-4 text-gray-700">Your posts have received 1,450 likes this week.</p>
            <a href="/analytics" className="text-violet-500 mt-6 inline-block">View Analytics →</a>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg shadow-xl hover:bg-indigo-100 transition duration-200">
            <h2 className="text-3xl font-semibold text-indigo-600">Recent Activity</h2>
            <ul className="mt-4 text-gray-700">
              <li>Post #45 published successfully.</li>
              <li>Scheduled 5 posts for next week.</li>
              <li>Analytics for Post #12 updated.</li>
            </ul>
            <a href="/activity" className="text-indigo-500 mt-6 inline-block">View More Activity →</a>
          </div>
        </div>

        {/* Upcoming Post Timeline */}
        <div className="mt-12 bg-gray-100 p-6 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold text-indigo-600">Upcoming Posts</h2>
          <div className="mt-6">
            <ul className="space-y-4">
              <li className="flex justify-between">
                <span className="text-gray-700">Instagram - Post #23</span>
                <span className="text-gray-500">Scheduled: 2:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-700">Facebook - Post #44</span>
                <span className="text-gray-500">Scheduled: 4:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-700">Twitter - Post #56</span>
                <span className="text-gray-500">Scheduled: 6:00 PM</span>
              </li>
            </ul>
            <a href="/schedule" className="text-indigo-500 mt-6 inline-block">View All Upcoming Posts →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;