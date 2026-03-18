import React, { useState } from 'react';
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Clock,
  ThumbsUp,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Sparkles,
  Brain,
} from 'lucide-react';
import { Button } from '@common/components/shadcn/button';

const ContentCenter = () => {
  // Extended mock data with more statuses
  const [posts, setPosts] = useState([
    {
      id: 1,
      platform: 'Instagram',
      icon: Instagram,
      content: 'Summer collection launch',
      caption: "Get ready for the heat! ☀️ Our new summer collection drops next week. Which style is your favorite? #SummerVibes #NewArrivals",
      scheduledTime: 'Today, 2:00 PM',
      status: 'needs_review',
      confidence: 92,
      aiReason: 'Trending hashtags and high engagement predicted',
    },
    {
      id: 2,
      platform: 'Facebook',
      icon: Facebook,
      content: 'Behind the scenes video',
      caption: "Ever wondered how we create our products? Here's a sneak peek! 🎥 #BTS #MakerLife",
      scheduledTime: 'Tomorrow, 10:00 AM',
      status: 'needs_editing',
      confidence: 78,
      aiReason: 'Video content performing well on Facebook',
    },
    {
      id: 3,
      platform: 'Twitter',
      icon: Twitter,
      content: 'Industry trend update',
      caption: 'Did you know that AI-generated content is up 45% this year? Read our latest insights 👇',
      scheduledTime: 'Mar 20, 9:00 AM',
      status: 'needs_review',
      confidence: 88,
      aiReason: 'Relevant to your audience interests',
    },
    {
      id: 4,
      platform: 'LinkedIn',
      icon: Linkedin,
      content: 'Thought leadership article',
      caption: '5 ways AI is transforming social media management. Check out the full article on our blog!',
      scheduledTime: 'Mar 21, 8:00 AM',
      status: 'approved',
      confidence: 95,
      aiReason: 'High engagement potential with professionals',
    },
    {
      id: 5,
      platform: 'Instagram',
      icon: Instagram,
      content: 'User testimonial reel',
      caption: 'Hear what our customers are saying! 📣 Thanks @johndoe for sharing your experience.',
      scheduledTime: 'Mar 22, 6:00 PM',
      status: 'needs_review',
      confidence: 81,
      aiReason: 'User-generated content builds trust',
    },
    {
      id: 6,
      platform: 'Facebook',
      icon: Facebook,
      content: 'Holiday promotion',
      caption: 'Enjoy 20% off all products this weekend! 🎁 #HolidaySale',
      scheduledTime: 'Mar 23, 12:00 PM',
      status: 'scheduled',
      confidence: 90,
      aiReason: 'High conversion potential',
    },
    {
      id: 7,
      platform: 'Twitter',
      icon: Twitter,
      content: 'Customer appreciation tweet',
      caption: 'Thanks to all our amazing customers! ❤️',
      scheduledTime: 'Mar 24, 9:00 AM',
      status: 'published',
      confidence: 85,
      aiReason: 'Builds brand loyalty',
    },
    {
      id: 8,
      platform: 'LinkedIn',
      icon: Linkedin,
      content: 'Company milestone',
      caption: 'We just hit 10,000 followers! Thank you for your support.',
      scheduledTime: 'Mar 25, 8:00 AM',
      status: 'rejected',
      confidence: 60,
      aiReason: 'Low relevance score',
    },
  ]);

  const [filter, setFilter] = useState('all');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Define tab options – removed "history"
  const tabs = [
    { id: 'all', label: 'All Posts' },
    { id: 'needs_review', label: 'Needs Review' },
    { id: 'needs_editing', label: 'Needs Editing' },
    { id: 'approved', label: 'Approved' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'published', label: 'Published' },
    { id: 'rejected', label: 'Rejected' },
  ];

  // Filter posts based on selected tab
  const filteredPosts =
    filter === 'all' ? posts : posts.filter((post) => post.status === filter);

  // Handle selection
  const toggleSelectPost = (id) => {
    setSelectedPosts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  // Bulk actions
  const bulkApprove = () => {
    setPosts((prev) =>
      prev.map((post) =>
        selectedPosts.includes(post.id) ? { ...post, status: 'approved' } : post
      )
    );
    setSelectedPosts([]);
    setSelectAll(false);
  };

  const bulkReject = () => {
    setPosts((prev) =>
      prev.map((post) =>
        selectedPosts.includes(post.id) ? { ...post, status: 'rejected' } : post
      )
    );
    setSelectedPosts([]);
    setSelectAll(false);
  };

  const bulkDelete = () => {
    setPosts((prev) => prev.filter((post) => !selectedPosts.includes(post.id)));
    setSelectedPosts([]);
    setSelectAll(false);
  };

  const bulkSchedule = () => {
    setPosts((prev) =>
      prev.map((post) =>
        selectedPosts.includes(post.id) ? { ...post, status: 'scheduled' } : post
      )
    );
    setSelectedPosts([]);
    setSelectAll(false);
  };

  // Individual actions
  const handleApprove = (id) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, status: 'approved' } : post))
    );
  };

  const handleReject = (id) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, status: 'rejected' } : post))
    );
  };

  const handleEdit = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, status: 'needs_editing' } : post
      )
    );
    alert('Edit functionality would open an editor (mock)');
  };

  const handleSchedule = (id) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, status: 'scheduled' } : post))
    );
  };

  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Content Management Hub
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Effortlessly manage, review, edit, schedule, and track the performance of all your posts.
        </p>
      </div>

      {/* Tabs - Updated to match Analytics style */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex space-x-6 overflow-x-auto pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilter(tab.id);
                setSelectedPosts([]);
                setSelectAll(false);
              }}
              className={`border-b-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedPosts.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {selectedPosts.length} selected
          </span>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <Button variant="ghost" size="sm" onClick={bulkApprove} className="gap-1">
            <ThumbsUp size={16} />
            Approve
          </Button>
          <Button variant="ghost" size="sm" onClick={bulkReject} className="gap-1">
            <XCircle size={16} />
            Reject
          </Button>
          <Button variant="ghost" size="sm" onClick={bulkSchedule} className="gap-1">
            <Calendar size={16} />
            Schedule
          </Button>
          <Button variant="ghost" size="sm" onClick={bulkDelete} className="gap-1 text-red-600 hover:text-red-700 dark:text-red-400">
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">No posts found.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`relative rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-900 ${
                selectedPosts.includes(post.id)
                  ? 'border-indigo-300 ring-2 ring-indigo-200 dark:border-indigo-700 dark:ring-indigo-800'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Checkbox for selection */}
              <div className="absolute left-4 top-4">
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post.id)}
                  onChange={() => toggleSelectPost(post.id)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                />
              </div>

              <div className="ml-6">
                {/* Platform and badges */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <post.icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {post.platform}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-500/10">
                      🤖 AI
                    </span>
                    {post.confidence && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10">
                        {post.confidence}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Content preview */}
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {post.content}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                  {post.caption}
                </p>

                {/* Time and status */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock size={12} />
                    <span>{post.scheduledTime}</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      post.status === 'needs_review'
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10'
                        : post.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
                        : post.status === 'rejected'
                        ? 'bg-red-50 text-red-600 dark:bg-red-500/10'
                        : post.status === 'needs_editing'
                        ? 'bg-purple-50 text-purple-600 dark:bg-purple-500/10'
                        : post.status === 'scheduled'
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10'
                        : post.status === 'published'
                        ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {post.status.replace('_', ' ')}
                  </span>
                </div>

                {/* AI reason */}
                {post.aiReason && (
                  <div className="mt-2 flex items-start gap-1 text-xs text-slate-400">
                    <Brain size={12} className="mt-0.5" />
                    <span className="line-clamp-1">{post.aiReason}</span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleApprove(post.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                  >
                    <ThumbsUp size={12} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleEdit(post.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                  >
                    <Edit size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleReject(post.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                  >
                    <XCircle size={12} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleSchedule(post.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
                  >
                    <Calendar size={12} />
                    Schedule
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentCenter;