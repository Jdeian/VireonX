import React, { useState } from 'react';

const SchedulePosts = () => {
  const [postContent, setPostContent] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const handlePostContentChange = (e) => setPostContent(e.target.value);
  const handleScheduleTimeChange = (e) => setScheduleTime(e.target.value);

  const handleSubmit = () => {
    // Logic for scheduling the post
    alert(`Post scheduled at ${scheduleTime}`);
  };

  return (
    <div className="bg-linear-to-r from-purple-600 via-blue-600 to-indigo-800 min-h-screen text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-5xl font-extrabold text-center">Schedule Your Post</h1>
        <div className="mt-8 max-w-lg mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="postContent" className="block text-lg">Post Content</label>
              <textarea
                id="postContent"
                rows="5"
                value={postContent}
                onChange={handlePostContentChange}
                className="w-full p-3 mt-2 rounded-lg bg-gray-900 text-white"
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="scheduleTime" className="block text-lg">Schedule Time</label>
              <input
                type="datetime-local"
                id="scheduleTime"
                value={scheduleTime}
                onChange={handleScheduleTimeChange}
                className="w-full p-3 mt-2 rounded-lg bg-gray-900 text-white"
              />
            </div>
            <button type="submit" className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Schedule Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SchedulePosts;