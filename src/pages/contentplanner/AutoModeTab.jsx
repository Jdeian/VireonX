import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Instagram,
  Facebook,
  Twitter,
  Image,
  Clock,
  ThumbsUp,
  XCircle,
  Brain,
  Loader2,
  CheckCircle2,
  Bot,
  Power,
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

const platforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-br from-pink-500 to-purple-600',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-sky-500',
  },
];

const nicheSuggestions = [
  'Fashion',
  'Technology',
  'Fitness',
  'Food',
  'Travel',
  'Business',
  'Health',
  'Entertainment',
  'Sports',
  'Education',
  'Weather',
];

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0')
);
const periods = ['AM', 'PM'];

const formatDisplayTime = (date) =>
  new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);

const getPlatformTone = (platformId) => {
  switch (platformId) {
    case 'instagram':
      return {
        emoji: '✨',
        hashtags: '#Instagram #ContentCreator',
      };
    case 'facebook':
      return {
        emoji: '📣',
        hashtags: '#FacebookPost #Community',
      };
    case 'twitter':
      return {
        emoji: '⚡',
        hashtags: '#Trending #SocialMedia',
      };
    default:
      return {
        emoji: '✨',
        hashtags: '#Content',
      };
  }
};

const isWeatherTopic = (topic) => {
  const value = topic.toLowerCase();
  return (
    value.includes('weather') ||
    value.includes('forecast') ||
    value.includes('rain') ||
    value.includes('sunny') ||
    value.includes('temperature') ||
    value.includes('climate')
  );
};

const generatePostContent = (topic, index, platformId) => {
  const cleanTopic = topic.trim() || 'General';
  const tone = getPlatformTone(platformId);

  if (isWeatherTopic(cleanTopic)) {
    const weatherTemplates = [
      `${tone.emoji} Good morning! Here’s your daily weather update. Expect a bright start to the day with changing conditions later on. Stay prepared and plan smart.`,
      `${tone.emoji} Weather check-in: today looks like a mix of comfort and change. Bring what you need, stay alert for updates, and make the most of the day.`,
      `${tone.emoji} Daily forecast post: a fresh weather snapshot to help your audience plan outfits, travel, and activities with confidence.`,
      `${tone.emoji} Today’s weather update is in. A quick caption, a clear forecast vibe, and a simple reminder to stay ready for the day ahead.`,
    ];

    return `${weatherTemplates[index % weatherTemplates.length]} ${tone.hashtags} #WeatherUpdate #DailyForecast`;
  }

  const genericTemplates = [
    `${tone.emoji} Fresh insight from the world of ${cleanTopic.toLowerCase()}. This post is designed to educate, engage, and keep your audience interested.`,
    `${tone.emoji} Here’s a smart ${cleanTopic.toLowerCase()} content angle built for consistent engagement and strong platform fit.`,
    `${tone.emoji} Your audience wants relevant ${cleanTopic.toLowerCase()} content. This post is crafted to feel timely, useful, and shareable.`,
    `${tone.emoji} A strong ${cleanTopic.toLowerCase()} post should inform or inspire. This one is designed to do both.`,
    `${tone.emoji} Another AI-generated ${cleanTopic.toLowerCase()} idea tailored to match your posting schedule and platform style.`,
    `${tone.emoji} Keeping your ${cleanTopic.toLowerCase()} content flow active with a post designed for reach, clarity, and engagement.`,
  ];

  return `${genericTemplates[index % genericTemplates.length]} ${tone.hashtags} #${cleanTopic.replace(
    /\s+/g,
    ''
  )}`;
};

const generateImagePrompt = (topic, index, platformId) => {
  const platformName =
    platforms.find((p) => p.id === platformId)?.name || 'social media';

  if (isWeatherTopic(topic)) {
    const weatherPrompts = [
      `Create an engaging ${platformName} weather graphic for a morning forecast with clean typography, weather icons, a bright sky palette, and a polished modern layout.`,
      `Create a visually engaging daily weather image for ${platformName} with atmospheric clouds, forecast icons, bold headline space, and a clean news-style composition.`,
      `Create a social-ready forecast image for ${platformName} with a modern weather dashboard style, temperature emphasis, subtle gradients, and friendly visual appeal.`,
    ];
    return weatherPrompts[index % weatherPrompts.length];
  }

  const genericPrompts = [
    `Create an engaging promotional image for ${platformName} about ${topic}, visually modern, professional, eye-catching, and optimized for social engagement.`,
    `Design a high-quality social media visual for ${platformName} focused on ${topic}, with bold composition, clean typography space, and strong visual storytelling.`,
    `Generate a polished branded content image for ${platformName} around ${topic}, modern aesthetic, audience-friendly, and highly engaging.`,
  ];

  return genericPrompts[index % genericPrompts.length];
};

const getStartDateTime = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hoursValue, minutesValue] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hoursValue, minutesValue, 0, 0);
};

const addMonthsSafe = (date, monthsToAdd) => {
  const result = new Date(date);
  const originalDay = result.getDate();
  result.setMonth(result.getMonth() + monthsToAdd);

  if (result.getDate() < originalDay) {
    result.setDate(0);
  }

  return result;
};

const buildRecurringSlots = (
  dateStr,
  timeStr,
  countPerPeriod,
  frequency,
  previewCount
) => {
  const baseStart = getStartDateTime(dateStr, timeStr);
  const slots = [];

  for (let i = 0; i < previewCount; i++) {
    const cycleIndex = Math.floor(i / countPerPeriod);
    const slotIndex = i % countPerPeriod;

    let cycleStart;
    let cycleDurationMs;

    if (frequency === 'day') {
      cycleStart = new Date(
        baseStart.getTime() + cycleIndex * 24 * 60 * 60 * 1000
      );
      cycleDurationMs = 24 * 60 * 60 * 1000;
    } else if (frequency === 'week') {
      cycleStart = new Date(
        baseStart.getTime() + cycleIndex * 7 * 24 * 60 * 60 * 1000
      );
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

const convertTo24Hour = (hour, period) => {
  const parsedHour = Number(hour);

  if (period === 'AM') {
    return parsedHour === 12 ? 0 : parsedHour;
  }

  return parsedHour === 12 ? 12 : parsedHour + 12;
};

const parseDateString = (dateStr) => {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const AutoModeTab = () => {
  const [autoPlatform, setAutoPlatform] = useState('instagram');
  const [selectedNiche, setSelectedNiche] = useState('Fashion');
  const [customNiche, setCustomNiche] = useState('');
  const [postsPerPeriod, setPostsPerPeriod] = useState(3);
  const [scheduleFrequency, setScheduleFrequency] = useState('day');
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return format(now, 'yyyy-MM-dd');
  });
  const [startHour, setStartHour] = useState('8');
  const [startMinute, setStartMinute] = useState('00');
  const [startPeriod, setStartPeriod] = useState('AM');
  const [workflowMode, setWorkflowMode] = useState('approval');
  const [autoPostingEnabled, setAutoPostingEnabled] = useState(false);
  const [includeImage, setIncludeImage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pendingSuggestions, setPendingSuggestions] = useState([]);
  const [scheduledSuggestions, setScheduledSuggestions] = useState([]);

  const previewQueueCount = 8;

  const resolvedNiche = useMemo(
    () => customNiche.trim() || selectedNiche,
    [customNiche, selectedNiche]
  );

  const selectedAutoPlatformData = useMemo(
    () => platforms.find((p) => p.id === autoPlatform),
    [autoPlatform]
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
  }, [startHour, startMinute, startPeriod]);

  const buildAutoPosts = () => {
    const slots = buildRecurringSlots(
      startDate,
      startTime24,
      postsPerPeriod,
      scheduleFrequency,
      previewQueueCount
    );

    return slots.map((slot, index) => ({
      id: `${Date.now()}-${index}`,
      platform: autoPlatform,
      niche: resolvedNiche,
      content: generatePostContent(resolvedNiche, index, autoPlatform),
      imagePrompt: includeImage
        ? generateImagePrompt(resolvedNiche, index, autoPlatform)
        : null,
      scheduledAt: slot.scheduledAt,
      suggestedTime: slot.displayTime,
      status: workflowMode === 'autopilot' ? 'auto-managed' : 'pending',
    }));
  };

  useEffect(() => {
    if (!resolvedNiche.trim()) return;

    if (workflowMode === 'autopilot' && !autoPostingEnabled) {
      setLoading(false);
      setPendingSuggestions([]);
      setScheduledSuggestions([]);
      return;
    }

    setLoading(true);
    setPendingSuggestions([]);
    setScheduledSuggestions([]);

    const timer = setTimeout(() => {
      const generatedPosts = buildAutoPosts();

      if (workflowMode === 'autopilot') {
        setScheduledSuggestions(generatedPosts);
        setPendingSuggestions([]);
      } else {
        setPendingSuggestions(generatedPosts);
        setScheduledSuggestions([]);
      }

      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, [
    autoPlatform,
    resolvedNiche,
    postsPerPeriod,
    scheduleFrequency,
    startDate,
    startTime24,
    workflowMode,
    includeImage,
    autoPostingEnabled,
  ]);

  const approveSuggestion = (id) => {
    const approvedPost = pendingSuggestions.find((item) => item.id === id);
    if (!approvedPost) return;

    setPendingSuggestions((prev) => prev.filter((item) => item.id !== id));
    setScheduledSuggestions((prev) => [
      ...prev,
      { ...approvedPost, status: 'scheduled' },
    ]);
  };

  const rejectSuggestion = (id) => {
    setPendingSuggestions((prev) => prev.filter((item) => item.id !== id));
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
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Auto Posting Control
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Turn Full Auto Mode on to let AI generate, schedule, and
                        manage posts automatically.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
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
                        onClick={() => setAutoPostingEnabled((prev) => !prev)}
                        className={`gap-2 text-white ${
                          autoPostingEnabled
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        <Power size={14} />
                        {autoPostingEnabled ? 'Turn Off' : 'Start Auto Posting'}
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
                  <Select
                    value={scheduleFrequency}
                    onValueChange={setScheduleFrequency}
                  >
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
                          <div>
                            <Select value={startHour} onValueChange={setStartHour}>
                              <SelectTrigger className="border-0 shadow-none focus:ring-0">
                                <SelectValue placeholder="Hour" />
                              </SelectTrigger>
                              <SelectContent>
                                {hours.map((hour) => (
                                  <SelectItem key={hour} value={hour}>
                                    {hour}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <span className="mx-3 text-sm font-bold text-slate-500">
                            :
                          </span>

                          <div>
                            <Select value={startMinute} onValueChange={setStartMinute}>
                              <SelectTrigger className="border-0 shadow-none focus:ring-0">
                                <SelectValue placeholder="Minute" />
                              </SelectTrigger>
                              <SelectContent>
                                {minutes.map((minute) => (
                                  <SelectItem key={minute} value={minute}>
                                    {minute}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="ml-4">
                            <Select value={startPeriod} onValueChange={setStartPeriod}>
                              <SelectTrigger className="border-0 shadow-none focus:ring-0">
                                <SelectValue placeholder="AM/PM" />
                              </SelectTrigger>
                              <SelectContent>
                                {periods.map((period) => (
                                  <SelectItem key={period} value={period}>
                                    {period}
                                  </SelectItem>
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
                  <Button
                    type="button"
                    onClick={() => setIncludeImage((prev) => !prev)}
                    className={`flex w-full items-center justify-between border py-5 shadow-none ${
                      includeImage
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {includeImage ? 'Enabled' : 'Disabled'}
                    </span>
                    <Image size={16} />
                  </Button>
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
                      ? 'AI is building your recurring posting queue...'
                      : workflowMode === 'autopilot'
                      ? autoPostingEnabled
                        ? 'Full Auto Mode is active'
                        : 'Full Auto Mode is off'
                      : 'Approval Mode is active'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {loading
                      ? 'Queue is being regenerated from your latest settings.'
                      : workflowMode === 'autopilot'
                      ? autoPostingEnabled
                        ? `${postsPerPeriod} post(s) per ${scheduleFrequency}, starting ${displayStartDate} at ${displayStartTime}. AI will fully manage the posting queue for ${selectedAutoPlatformData?.name}.`
                        : 'Autopilot is currently off. Click "Start Auto Posting" to let AI manage posting automatically.'
                      : `${postsPerPeriod} post(s) per ${scheduleFrequency}, starting ${displayStartDate} at ${displayStartTime}. AI will wait for your approval before scheduling.`}
                  </p>
                </div>
              </div>
            </div>

            {workflowMode === 'approval' && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Pending Approval ({pendingSuggestions.length})
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Approve to move posts into scheduled queue
                  </span>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 size={24} className="animate-spin text-indigo-600" />
                    <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                      Generating your automated queue...
                    </span>
                  </div>
                ) : pendingSuggestions.length > 0 ? (
                  <div className="space-y-3">
                    {pendingSuggestions.map((suggestion) => {
                      const platform =
                        platforms.find((p) => p.id === suggestion.platform) ||
                        platforms[0];

                      return (
                        <div
                          key={suggestion.id}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${platform.color}`}
                              >
                                <platform.icon size={16} />
                              </div>

                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                                    {platform.name}
                                  </span>
                                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                                    {suggestion.niche}
                                  </span>
                                </div>

                                <p className="max-w-full whitespace-pre-wrap wrap-break-word text-sm text-slate-800 dark:text-slate-100">
                                  {suggestion.content}
                                </p>

                                {suggestion.imagePrompt && (
                                  <div className="rounded-lg border border-dashed border-slate-300 p-3 dark:border-slate-600">
                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                      AI image prompt
                                    </p>
                                    <p className="mt-1 max-w-full whitespace-pre-wrap wrap-break-word text-xs text-slate-500 dark:text-slate-400">
                                      {suggestion.imagePrompt}
                                    </p>
                                  </div>
                                )}

                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <Clock size={12} />
                                  <span>{suggestion.suggestedTime}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex shrink-0 gap-1">
                              <Button
                                type="button"
                                size="icon"
                                onClick={() => approveSuggestion(suggestion.id)}
                                className="rounded-full bg-emerald-50 text-emerald-600 shadow-none hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20"
                                title="Approve post"
                              >
                                <ThumbsUp size={14} />
                              </Button>

                              <Button
                                type="button"
                                size="icon"
                                onClick={() => rejectSuggestion(suggestion.id)}
                                className="rounded-full bg-red-50 text-red-600 shadow-none hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20"
                                title="Reject post"
                              >
                                <XCircle size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                    <Brain
                      size={28}
                      className="mx-auto text-slate-300 dark:text-slate-600"
                    />
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      No pending posts right now. Adjust your settings to regenerate
                      the queue.
                    </p>
                  </div>
                )}
              </div>
            )}

            {workflowMode === 'autopilot' && autoPostingEnabled && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Autopilot enabled
                </p>
                <p className="mt-1 text-sm text-emerald-700/90 dark:text-emerald-200">
                  AI is directly managing the posting queue. No approve/reject step
                  is required.
                </p>
              </div>
            )}

            {workflowMode === 'autopilot' && !autoPostingEnabled && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Autopilot is off
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your settings are ready. Turn on Auto Posting to let AI generate
                  and manage the queue automatically.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-24 border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
              {workflowMode === 'autopilot'
                ? 'Auto-Managed Posts'
                : 'Scheduled Posts'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {workflowMode === 'autopilot' && !autoPostingEnabled ? (
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                <Bot size={24} className="mx-auto text-slate-300 dark:text-slate-600" />
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  Auto Posting is off. Start it to let AI generate and manage
                  scheduled posts.
                </p>
              </div>
            ) : scheduledSuggestions.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                <CalendarIcon
                  size={24}
                  className="mx-auto text-slate-300 dark:text-slate-600"
                />
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
                    platforms.find((p) => p.id === suggestion.platform) ||
                    platforms[0];

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

                      {suggestion.imagePrompt && (
                        <div className="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            AI image prompt
                          </p>
                          <p className="mt-1 max-w-full whitespace-pre-wrap wrap-break-word text-xs text-slate-500 dark:text-slate-400">
                            {suggestion.imagePrompt}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                          {suggestion.niche}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            workflowMode === 'autopilot'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}
                        >
                          {workflowMode === 'autopilot'
                            ? 'AI Managed'
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