import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Instagram,
  Facebook,
  Twitter,
  Image,
  Sparkles,
  Send,
  Clock,
  X,
} from 'lucide-react';

import { Button } from '@common/components/shadcn/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@common/components/shadcn/card';
import { Label } from '@common/components/shadcn/label';
import { Textarea } from '@common/components/shadcn/textarea';
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

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0')
);
const periods = ['AM', 'PM'];

const AssistedPostTab = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [postContent, setPostContent] = useState('');
  const [scheduleDate, setScheduleDate] = useState(undefined);
  const [scheduleHour, setScheduleHour] = useState('8');
  const [scheduleMinute, setScheduleMinute] = useState('00');
  const [schedulePeriod, setSchedulePeriod] = useState('AM');
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedPlatformData = useMemo(
    () => platforms.find((p) => p.id === selectedPlatform),
    [selectedPlatform]
  );

  const charCount = postContent.length;

  const handleContentChange = (e) => {
    setPostContent(e.target.value);
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaPreview(null);
  };

  const generateAICaption = () => {
    setIsGenerating(true);

    setTimeout(() => {
      setPostContent(
        '✨ Exciting news! Our new collection drops next week. Get ready for something amazing! #ComingSoon #NewArrivals'
      );
      setIsGenerating(false);
    }, 800);
  };

  const formatDisplayTime = () => {
    return `${scheduleHour}:${scheduleMinute} ${schedulePeriod}`;
  };

  const convertTo24Hour = (hour, period) => {
    let parsedHour = Number(hour);

    if (period === 'AM') {
      if (parsedHour === 12) return 0;
      return parsedHour;
    }

    if (parsedHour === 12) return 12;
    return parsedHour + 12;
  };

  const getCombinedSchedule = () => {
    if (!scheduleDate || !scheduleHour || !scheduleMinute || !schedulePeriod) {
      return null;
    }

    const combined = new Date(scheduleDate);
    const hour24 = convertTo24Hour(scheduleHour, schedulePeriod);

    combined.setHours(hour24, Number(scheduleMinute), 0, 0);

    return combined;
  };

  const combinedSchedule = getCombinedSchedule();

  const handleSubmitAssisted = (e) => {
    e.preventDefault();

    if (!combinedSchedule) return;

    alert(
      `Post scheduled on ${selectedPlatform} at ${combinedSchedule.toLocaleString()}`
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card className="border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6">
            <form onSubmit={handleSubmitAssisted} className="space-y-6">
              <div className="space-y-3">
                <Label>Select Platform</Label>
                <div className="flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <Button
                      key={platform.id}
                      type="button"
                      variant="default"
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`flex items-center gap-2 rounded-lg px-4 py-4.5 transition-all ${
                        selectedPlatform === platform.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-slate-800'
                      }`}
                    >
                      <platform.icon size={18} />
                      <span className="text-sm font-medium">{platform.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Media (optional)</Label>

                {mediaPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="h-40 w-32 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={removeMedia}
                      className="absolute -right-2 -top-2 h-7 w-7 rounded-full"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ) : (
                  <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                    <div className="flex flex-col items-center">
                      <Image className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                      <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Click to upload
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleMediaUpload}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Post Content</Label>
                  <span
                    className={`text-xs ${
                      charCount > 280
                        ? 'text-red-500'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {charCount}/280
                  </span>
                </div>

                <Textarea
                  id="content"
                  rows={5}
                  value={postContent}
                  onChange={handleContentChange}
                  placeholder="What would you like to share?"
                  className="resize-none border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={generateAICaption}
                    disabled={isGenerating}
                    className="gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Sparkles size={16} />
                    {isGenerating ? 'Generating...' : 'Generate AI caption'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Schedule Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={`w-full justify-start text-left font-normal py-5 ${
                          !scheduleDate ? 'text-slate-500 dark:text-slate-400' : ''
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduleDate ? (
                          format(scheduleDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={scheduleDate}
                        onSelect={setScheduleDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Schedule Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start text-left font-normal py-5"
                      >
                        <Clock className="mr-2 h-4 w-4 text-slate-500" />
                        <span>{formatDisplayTime()}</span>
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-60 p-3" align="start">
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          Select time
                        </p>

                        <div className="flex items-center rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                          <div>
                            <Select value={scheduleHour} onValueChange={setScheduleHour}>
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

                          <span className="text-sm mx-3 font-bold text-slate-500">:</span>

                          <div>
                            <Select value={scheduleMinute} onValueChange={setScheduleMinute}>
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
                            <Select value={schedulePeriod} onValueChange={setSchedulePeriod}>
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

              <Button
                type="submit"
                disabled={!postContent.trim() || !scheduleDate}
                className="w-full gap-2 py-5 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Send size={18} />
                Schedule Post
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-24 border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
              Preview
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              {selectedPlatformData?.icon && (
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${selectedPlatformData.color}`}
                >
                  {React.createElement(selectedPlatformData.icon, {
                    size: 18,
                  })}
                </div>
              )}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {selectedPlatformData?.name}
              </span>
            </div>

            {mediaPreview ? (
              <img
                src={mediaPreview}
                alt="Post media"
                className="h-48 w-full rounded-lg border border-slate-200 object-cover dark:border-slate-700"
              />
            ) : (
              <div className="flex h-48 w-full items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <Image size={32} />
              </div>
            )}

            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              <p className="max-w-full wrap-break-word text-sm text-slate-700 dark:text-slate-200">
                {postContent || 'Your post content will appear here...'}
              </p>

              {combinedSchedule && (
                <div className="mt-3 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <CalendarIcon size={12} />
                  <span>
                    Scheduled for {combinedSchedule.toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssistedPostTab;