import React, { useState } from 'react';
import {
  Calendar,
  Instagram,
  Facebook,
  Twitter,
  Image,
  Sparkles,
  Send,
  Clock,
  X,
} from 'lucide-react';

const SchedulePosts = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [postContent, setPostContent] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [mediaPreview, setMediaPreview] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-pink-500 to-purple-600' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
  ];

  const handleContentChange = (e) => {
    const text = e.target.value;
    setPostContent(text);
    setCharCount(text.length);
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaPreview(null);
  };

  const generateAICaption = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setPostContent(
        "✨ Exciting news! Our new collection drops next week. Get ready for something amazing! #ComingSoon #NewArrivals"
      );
      setCharCount(95);
      setIsGenerating(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would integrate with your backend
    alert(`Post scheduled on ${selectedPlatform} at ${new Date(scheduleTime).toLocaleString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Schedule a Post</h1>
        <p className="text-slate-500 mt-1">
          Create, customize, and schedule your content across all platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Select Platform
                </label>
                <div className="flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                        ${
                          selectedPlatform === platform.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50'
                        }
                      `}
                    >
                      <platform.icon size={18} />
                      <span className="text-sm font-medium">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Media (optional)
                </label>
                {mediaPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={removeMedia}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                    <div className="flex flex-col items-center">
                      <Image className="w-6 h-6 text-slate-400" />
                      <span className="text-sm text-slate-500 mt-1">Click to upload</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleMediaUpload} />
                  </label>
                )}
              </div>

              {/* Post Content */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="content" className="block text-sm font-medium text-slate-700">
                    Post Content
                  </label>
                  <span className={`text-xs ${charCount > 280 ? 'text-red-500' : 'text-slate-400'}`}>
                    {charCount}/280
                  </span>
                </div>
                <textarea
                  id="content"
                  rows="5"
                  value={postContent}
                  onChange={handleContentChange}
                  maxLength={280}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="What would you like to share?"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={generateAICaption}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                  >
                    <Sparkles size={16} />
                    {isGenerating ? 'Generating...' : 'Generate AI caption'}
                  </button>
                </div>
              </div>

              {/* Schedule Time */}
              <div>
                <label htmlFor="schedule-time" className="block text-sm font-medium text-slate-700 mb-2">
                  Schedule Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="datetime-local"
                    id="schedule-time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Your local timezone is automatically used.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!postContent || !scheduleTime}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
                Schedule Post
              </button>
            </form>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Preview</h3>
            <div className="space-y-4">
              {/* Platform Badge */}
              <div className="flex items-center gap-2">
                {platforms.find(p => p.id === selectedPlatform)?.icon && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${platforms.find(p => p.id === selectedPlatform)?.color}`}>
                    {React.createElement(platforms.find(p => p.id === selectedPlatform).icon, { size: 18 })}
                  </div>
                )}
                <span className="font-medium text-slate-700">
                  {platforms.find(p => p.id === selectedPlatform)?.name}
                </span>
              </div>

              {/* Media Preview */}
              {mediaPreview ? (
                <img src={mediaPreview} alt="Post media" className="w-full h-48 object-cover rounded-lg border border-slate-200" />
              ) : (
                <div className="w-full h-48 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                  <Image size={32} />
                </div>
              )}

              {/* Content Preview */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {postContent || 'Your post content will appear here...'}
                </p>
                {scheduleTime && (
                  <div className="flex items-center gap-1 mt-3 text-xs text-slate-500">
                    <Calendar size={12} />
                    <span>Scheduled for {new Date(scheduleTime).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePosts;