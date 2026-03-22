import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Image,
  Clock,
  Brain,
  Loader2,
  CheckCircle2,
  Bot,
  Power,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

import { Button } from '@common/components/shadcn/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@common/components/shadcn/card';
import { Input } from '@common/components/shadcn/input';
import { Label } from '@common/components/shadcn/label';
import { Calendar } from '@common/components/shadcn/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@common/components/shadcn/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@common/components/shadcn/select';

import { schedulePost } from '@common/services/postService';
import { generateCaption, saveAutopilotConfig } from '@common/services/aiService';

import ApprovalMode from './ApprovalMode';
import FullAutoMode from './FullAutoMode';

const nicheSuggestions = [
  'Fashion', 'Technology', 'Fitness', 'Food', 'Travel',
  'Business', 'Health', 'Entertainment', 'Sports', 'Education', 'Weather',
];

const formatDisplayTime = (date) =>
  new Intl.DateTimeFormat(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(date);

const getStartDateTime = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hoursValue, minutesValue] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hoursValue, minutesValue, 0, 0);
};

const addMonthsSafe = (date, monthsToAdd) => {
  const result = new Date(date);
  const originalDay = result.getDate();
  result.setMonth(result.getMonth() + monthsToAdd);
  if (result.getDate() < originalDay) result.setDate(0);
  return result;
};

const buildRecurringSlots = (dateStr, timeStr, countPerPeriod, frequency, previewCount) => {
  const baseStart = getStartDateTime(dateStr, timeStr);
  const slots = [];

  for (let i = 0; i < previewCount; i++) {
    const cycleIndex = Math.floor(i / countPerPeriod);
    const slotIndex = i % countPerPeriod;

    let cycleStart;
    let cycleDurationMs;

    if (frequency === 'day') {
      cycleStart = new Date(baseStart.getTime() + cycleIndex * 24 * 60 * 60 * 1000);
      cycleDurationMs = 24 * 60 * 60 * 1000;
    } else if (frequency === 'week') {
      cycleStart = new Date(baseStart.getTime() + cycleIndex * 7 * 24 * 60 * 60 * 1000);
      cycleDurationMs = 7 * 24 * 60 * 60 * 1000;
    } else {
      cycleStart = addMonthsSafe(baseStart, cycleIndex);
      const nextCycle = addMonthsSafe(baseStart, cycleIndex + 1);
      cycleDurationMs = nextCycle.getTime() - cycleStart.getTime();
    }

    const intervalMs = cycleDurationMs / countPerPeriod;
    const scheduledAt = new Date(cycleStart.getTime() + slotIndex * intervalMs);

    slots.push({
      scheduledAt: scheduledAt.toISOString(),
      displayTime: formatDisplayTime(scheduledAt),
    });
  }

  return slots;
};

const parseDateString = (dateStr) => {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const AutoModeTab = ({
  userProfile,
  profileLoading,
  platforms,
  toneOptions,
  postStyleOptions,
  languageOptions,
  hours,
  minutes,
  periods,
  convertTo24Hour,
}) => {
  const [autoPlatform, setAutoPlatform] = useState('facebook');
  const [selectedNiche, setSelectedNiche] = useState('Fashion');
  const [customNiche, setCustomNiche] = useState('');
  const [postsPerPeriod, setPostsPerPeriod] = useState(1);
  const [scheduleFrequency, setScheduleFrequency] = useState('day');
  const [startDate, setStartDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [startHour, setStartHour] = useState('8');
  const [startMinute, setStartMinute] = useState('00');
  const [startPeriod, setStartPeriod] = useState('AM');
  const [workflowMode, setWorkflowMode] = useState('approval');
  const [showPreferences, setShowPreferences] = useState(false);

  // Persisted in localStorage so autopilot survives page reload
  const [autoPostingEnabled, setAutoPostingEnabled] = useState(() => {
    return localStorage.getItem('autopilot_enabled') === 'true';
  });

  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [pendingSuggestions, setPendingSuggestions] = useState([]);
  const [scheduledSuggestions, setScheduledSuggestions] = useState([]);
  const [scheduleError, setScheduleError] = useState('');
  const [schedulingId, setSchedulingId] = useState(null);
  const [autopilotSaving, setAutopilotSaving] = useState(false);

  const resolvedNiche = useMemo(
    () => customNiche.trim() || selectedNiche,
    [customNiche, selectedNiche]
  );

  const selectedAutoPlatformData = useMemo(
    () => platforms.find((p) => p.id === autoPlatform),
    [autoPlatform, platforms]
  );

  const selectedStartDate = useMemo(() => parseDateString(startDate), [startDate]);

  const displayStartDate = useMemo(
    () => (selectedStartDate ? format(selectedStartDate, 'PPP') : 'Pick a date'),
    [selectedStartDate]
  );

  const displayStartTime = useMemo(
    () => `${startHour}:${startMinute} ${startPeriod}`,
    [startHour, startMinute, startPeriod]
  );

  const startTime24 = useMemo(() => {
    const hour24 = convertTo24Hour(startHour, startPeriod);
    return `${String(hour24).padStart(2, '0')}:${startMinute}`;
  }, [startHour, startMinute, startPeriod, convertTo24Hour]);

  // Reset queue when any setting changes so user knows to regenerate
  useEffect(() => {
    setHasGenerated(false);
    setPendingSuggestions([]);
    setScheduledSuggestions([]);
    setScheduleError('');
  }, [autoPlatform, resolvedNiche, postsPerPeriod, scheduleFrequency, startDate, startTime24]);

  // On mount, re-sync autopilot config with backend if it was previously enabled
  useEffect(() => {
    if (autoPostingEnabled && workflowMode === 'autopilot') {
      saveAutopilotConfig({
        enabled: true,
        platform: autoPlatform,
        niche: resolvedNiche,
        frequency: scheduleFrequency,
        postsPerPeriod,
        goal: userProfile?.goal || '',
        tone: userProfile?.tone || 'professional but friendly',
        useEmojis: userProfile?.useEmojis ?? false,
        postStyle: userProfile?.postStyle || '',
        language: userProfile?.language || 'English',
      }).catch(console.error);
    }
  }, []);

  const buildTimeSlots = () => {
    return buildRecurringSlots(
      startDate,
      startTime24,
      postsPerPeriod,
      scheduleFrequency,
      postsPerPeriod,
    );
  };

  // Calls OpenAI once per slot using user's onboarding preferences
  const generateAIPosts = async (slots) => {
    const posts = [];

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];

      try {
        const content = await generateCaption({
          platform: autoPlatform,
          niche: resolvedNiche,
          goal: userProfile?.goal || '',
          tone: userProfile?.tone || 'professional but friendly',
          useEmojis: userProfile?.useEmojis ?? false,
          postStyle: userProfile?.postStyle || '',
          language: userProfile?.language || 'English',
        });

        posts.push({
          id: `${Date.now()}-${i}`,
          platform: autoPlatform,
          niche: resolvedNiche,
          content,
          scheduledAt: slot.scheduledAt,
          suggestedTime: slot.displayTime,
          status: 'pending',
        });
      } catch (err) {
        console.error(`Failed to generate AI post for slot ${i}:`, err.message);
      }
    }

    return posts;
  };

  // Manual trigger — only fires when user clicks Generate or Regenerate
  const handleGenerate = async () => {
    if (!resolvedNiche.trim()) return;

    setLoading(true);
    setHasGenerated(false);
    setPendingSuggestions([]);
    setScheduledSuggestions([]);
    setScheduleError('');

    try {
      const slots = buildTimeSlots();
      const generatedPosts = await generateAIPosts(slots);

      if (workflowMode === 'autopilot') {
        const results = [];

        for (const post of generatedPosts) {
          // Only Facebook is supported until other OAuth flows are built
          if (post.platform !== 'facebook') {
            results.push({ ...post, status: 'skipped' });
            continue;
          }

          try {
            await schedulePost({
              message: post.content,
              imageUrl: null,
              scheduledAt: post.scheduledAt,
              platform: post.platform,
            });
            results.push({ ...post, status: 'auto-managed' });
          } catch (err) {
            console.error('Autopilot failed to schedule post:', err.message);
            results.push({ ...post, status: 'failed' });
          }
        }

        setScheduledSuggestions(results);
        setPendingSuggestions([]);
      } else {
        setPendingSuggestions(generatedPosts);
        setScheduledSuggestions([]);
      }

      setHasGenerated(true);
    } catch (err) {
      console.error('Auto mode generation error:', err);
      setScheduleError('Failed to generate posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const approveSuggestion = async (id) => {
    const approvedPost = pendingSuggestions.find((item) => item.id === id);
    if (!approvedPost) return;

    if (approvedPost.platform !== 'facebook') {
      setScheduleError(
        `${approvedPost.platform} is not connected yet. Only Facebook is supported right now.`
      );
      return;
    }

    try {
      setSchedulingId(id);
      setScheduleError('');

      await schedulePost({
        message: approvedPost.content,
        imageUrl: null,
        scheduledAt: approvedPost.scheduledAt,
        platform: approvedPost.platform,
      });

      setPendingSuggestions((prev) => prev.filter((item) => item.id !== id));
      setScheduledSuggestions((prev) => [
        ...prev,
        { ...approvedPost, status: 'scheduled' },
      ]);
    } catch (err) {
      setScheduleError(err.message || 'Failed to schedule post. Please try again.');
    } finally {
      setSchedulingId(null);
    }
  };

  const rejectSuggestion = (id) => {
    setPendingSuggestions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAutopilotToggle = async () => {
    const newState = !autoPostingEnabled;
    setAutoPostingEnabled(newState);

    // Persist so autopilot state survives page reload
    localStorage.setItem('autopilot_enabled', String(newState));

    try {
      setAutopilotSaving(true);
      await saveAutopilotConfig({
        enabled: newState,
        platform: autoPlatform,
        niche: resolvedNiche,
        frequency: scheduleFrequency,
        postsPerPeriod,
        goal: userProfile?.goal || '',
        tone: userProfile?.tone || 'professional but friendly',
      });
    } catch (err) {
      console.error('Failed to save autopilot config:', err);
      setScheduleError('Failed to save autopilot settings. Please try again.');
    } finally {
      setAutopilotSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card className="border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6">

            <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10">
              <div className="flex items-start gap-3">
                <Bot className="mt-0.5 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Smart recurring AI management
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Configure the niche, recurrence, posting time, and whether AI
                    should wait for approval or fully manage posting on its own.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 space-y-6">
              <div className="space-y-2">
                <Label>Workflow Mode</Label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setWorkflowMode('approval');
                      setAutoPostingEnabled(false);
                      localStorage.setItem('autopilot_enabled', 'false');
                    }}
                    className={`h-auto justify-start rounded-xl border p-4 text-left shadow-none ${
                      workflowMode === 'approval'
                        ? 'border-indigo-600 bg-indigo-50 text-slate-800 ring-2 ring-indigo-200 hover:bg-indigo-50 dark:bg-indigo-500/10 dark:text-slate-100 dark:ring-indigo-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">Approval Mode</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        AI generates posts, then user approves or rejects them.
                      </p>
                    </div>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setWorkflowMode('autopilot')}
                    className={`h-auto justify-start rounded-xl border p-4 text-left shadow-none ${
                      workflowMode === 'autopilot'
                        ? 'border-emerald-600 bg-emerald-50 text-slate-800 ring-2 ring-emerald-200 hover:bg-emerald-50 dark:bg-emerald-500/10 dark:text-slate-100 dark:ring-emerald-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">Full Auto Mode</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        AI generates, schedules, and manages the posting queue
                        without approval.
                      </p>
                    </div>
                  </Button>
                </div>
              </div>

              {workflowMode === 'autopilot' && (
                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="wrap-break-word flex flex-col gap-3 sm:flex-row sm:items-stretch sm:flex-wrap sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Auto Posting Control
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Turn Full Auto Mode on to let AI generate, schedule, and manage posts automatically.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 sm:self-end">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          autoPostingEnabled
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {autoPostingEnabled ? 'ON' : 'OFF'}
                      </span>
                      <Button
                        type="button"
                        onClick={handleAutopilotToggle}
                        disabled={autopilotSaving}
                        className={`gap-2 text-white disabled:opacity-50 ${
                          autoPostingEnabled
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {autopilotSaving ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Power size={14} />
                        )}
                        {autopilotSaving
                          ? 'Saving...'
                          : autoPostingEnabled
                          ? 'Turn Off'
                          : 'Start Auto Posting'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label>Select Platform</Label>
                <div className="flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <Button
                      key={platform.id}
                      type="button"
                      onClick={() => setAutoPlatform(platform.id)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-5 shadow-none transition-all ${
                        autoPlatform === platform.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200 hover:bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-slate-800'
                      }`}
                    >
                      <platform.icon size={18} />
                      <span className="text-sm font-medium">{platform.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="content-niche">Content Niche / Topic</Label>
                <Input
                  id="content-niche"
                  type="text"
                  value={customNiche}
                  maxLength={60}
                  onChange={(e) => setCustomNiche(e.target.value)}
                  placeholder="Example: Weather, Coffee Reviews, Skincare Tips, Anime News, Local Events"
                  className="border-slate-200 py-5 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <div>
                  <p className="mb-2 text-xs text-slate-400 dark:text-slate-500">
                    Quick suggestions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {nicheSuggestions.map((niche) => (
                      <Button
                        key={niche}
                        type="button"
                        onClick={() => {
                          setSelectedNiche(niche);
                          setCustomNiche('');
                        }}
                        className={`h-auto rounded-full px-3 py-1 text-xs font-medium shadow-none ${
                          !customNiche && selectedNiche === niche
                            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                        }`}
                      >
                        {niche}
                      </Button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Active topic: <span className="font-medium">{resolvedNiche}</span>
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreferences((prev) => !prev)}
                className="gap-2 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${showPreferences ? 'rotate-180' : 'rotate-0'}`}
                />
                {showPreferences ? 'Hide' : 'Adjust'} AI preferences
              </Button>

              {showPreferences && (
                <div className="space-y-3">
                  <Label>AI Content Preferences</Label>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Pre-filled from your onboarding settings. Adjust here to override for this session.
                  </p>
                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Tone</Label>
                      <Select
                        value={userProfile?.tone || ''}
                        onValueChange={(v) => setUserProfile((prev) => ({ ...prev, tone: v }))}
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {toneOptions.map((t) => (
                            <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Post Style</Label>
                      <Select
                        value={userProfile?.postStyle || ''}
                        onValueChange={(v) => setUserProfile((prev) => ({ ...prev, postStyle: v }))}
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Style" />
                        </SelectTrigger>
                        <SelectContent>
                          {postStyleOptions.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Language</Label>
                      <Select
                        value={userProfile?.language || 'English'}
                        onValueChange={(v) => setUserProfile((prev) => ({ ...prev, language: v }))}
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map((l) => (
                            <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Emojis</Label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[{ label: 'Yes', value: true }, { label: 'No', value: false }].map((opt) => (
                          <button
                            key={String(opt.value)}
                            type="button"
                            onClick={() => setUserProfile((prev) => ({ ...prev, useEmojis: opt.value }))}
                            className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                              (userProfile?.useEmojis ?? false) === opt.value
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300'
                                : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="posts-per-period">Posts per Period</Label>
                  <Input
                    id="posts-per-period"
                    type="number"
                    min="1"
                    max="31"
                    value={postsPerPeriod}
                    onChange={(e) =>
                      setPostsPerPeriod(
                        Math.min(31, Math.max(1, parseInt(e.target.value, 10) || 1))
                      )
                    }
                    className="border-slate-200 py-5 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                    <SelectTrigger className="py-5">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Per Day</SelectItem>
                      <SelectItem value="week">Per Week</SelectItem>
                      <SelectItem value="month">Per Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        className="w-full justify-start rounded-md border bg-white py-5 text-left font-normal text-slate-700 shadow-none hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-900"
                      >
                        <Clock className="mr-2 h-4 w-4 text-slate-500" />
                        <span>{displayStartTime}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-3" align="start">
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          Select time
                        </p>
                        <div className="flex items-center rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                          <Select value={startHour} onValueChange={setStartHour}>
                            <SelectTrigger className="border-0 shadow-none focus:ring-0">
                              <SelectValue placeholder="Hour" />
                            </SelectTrigger>
                            <SelectContent>
                              {hours.map((hour) => (
                                <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="mx-3 text-sm font-bold text-slate-500">:</span>
                          <Select value={startMinute} onValueChange={setStartMinute}>
                            <SelectTrigger className="border-0 shadow-none focus:ring-0">
                              <SelectValue placeholder="Minute" />
                            </SelectTrigger>
                            <SelectContent>
                              {minutes.map((minute) => (
                                <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="ml-4">
                            <Select value={startPeriod} onValueChange={setStartPeriod}>
                              <SelectTrigger className="border-0 shadow-none focus:ring-0">
                                <SelectValue placeholder="AM/PM" />
                              </SelectTrigger>
                              <SelectContent>
                                {periods.map((period) => (
                                  <SelectItem key={period} value={period}>{period}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        className={`w-full justify-start rounded-md border py-5 text-left font-normal shadow-none ${
                          !selectedStartDate
                            ? 'bg-white text-slate-500 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-900'
                            : 'bg-white text-slate-700 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-900'
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {displayStartDate}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedStartDate}
                        onSelect={(date) => {
                          if (!date) return;
                          setStartDate(format(date, 'yyyy-MM-dd'));
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>AI Visual</Label>
                  <div className="flex h-10.5 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    <Image size={14} className="mr-2" />
                    AI image generation coming soon
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex items-start gap-3">
                {loading ? (
                  <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-400" />
                ) : workflowMode === 'autopilot' ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Brain className="mt-0.5 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {loading
                      ? 'AI is generating your posts...'
                      : workflowMode === 'autopilot'
                      ? autoPostingEnabled
                        ? 'Full Auto Mode is active'
                        : 'Full Auto Mode is off'
                      : 'Approval Mode is active'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {loading
                      ? `Calling OpenAI to generate ${postsPerPeriod} post(s) for your queue...`
                      : workflowMode === 'autopilot'
                      ? autoPostingEnabled
                        ? `${postsPerPeriod} post(s) per ${scheduleFrequency}, starting ${displayStartDate} at ${displayStartTime}. AI is managing the queue for ${selectedAutoPlatformData?.name}.`
                        : 'Autopilot is off. Click "Start Auto Posting" to activate.'
                      : hasGenerated
                      ? `Showing ${pendingSuggestions.length} AI-generated post(s). Approve, reject, or regenerate.`
                      : `Set your preferences above, then click "Generate Posts" to let AI create your queue.`}
                  </p>
                </div>
              </div>
            </div>

            {workflowMode === 'approval' && (
              <div className="mb-6">
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading || !resolvedNiche.trim()}
                  className="w-full gap-2 bg-indigo-600 py-5 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Generating...
                    </>
                  ) : hasGenerated ? (
                    <>
                      <RefreshCw size={18} />
                      Regenerate Posts
                    </>
                  ) : (
                    <>
                      <Bot size={18} />
                      Generate Posts
                    </>
                  )}
                </Button>
                {hasGenerated && (
                  <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
                    Not happy with these? Click Regenerate to get new AI-generated posts.
                  </p>
                )}
              </div>
            )}

            <ApprovalMode
              loading={loading}
              hasGenerated={hasGenerated}
              scheduleError={scheduleError}
              pendingSuggestions={pendingSuggestions}
              schedulingId={schedulingId}
              approveSuggestion={approveSuggestion}
              rejectSuggestion={rejectSuggestion}
              platforms={platforms}
              visible={workflowMode === 'approval'}
            />

            <FullAutoMode
              autoPostingEnabled={autoPostingEnabled}
              scheduledSuggestions={scheduledSuggestions}
              visible={workflowMode === 'autopilot'}
            />

          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-24 border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
              {workflowMode === 'autopilot' ? 'Auto-Managed Posts' : 'Scheduled Posts'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {workflowMode === 'autopilot' && !autoPostingEnabled ? (
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                <Bot size={24} className="mx-auto text-slate-300 dark:text-slate-600" />
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  Auto Posting is off. Start it to let AI generate and manage scheduled posts.
                </p>
              </div>
            ) : scheduledSuggestions.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                <CalendarIcon size={24} className="mx-auto text-slate-300 dark:text-slate-600" />
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  {workflowMode === 'autopilot'
                    ? 'AI-managed recurring posts will appear here automatically.'
                    : 'Approved posts will appear here and remain ready for posting.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledSuggestions.map((suggestion) => {
                  const platform =
                    platforms.find((p) => p.id === suggestion.platform) || platforms[0];

                  return (
                    <div
                      key={suggestion.id}
                      className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${platform.color}`}
                        >
                          <platform.icon size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                            {platform.name}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {suggestion.suggestedTime}
                          </p>
                        </div>
                      </div>

                      <p className="max-w-full whitespace-pre-wrap wrap-break-word text-sm text-slate-700 dark:text-slate-200">
                        {suggestion.content}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                          {suggestion.niche}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            suggestion.status === 'auto-managed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                              : suggestion.status === 'failed'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}
                        >
                          {suggestion.status === 'auto-managed'
                            ? 'AI Managed'
                            : suggestion.status === 'failed'
                            ? 'Failed'
                            : 'Ready to Post'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutoModeTab;