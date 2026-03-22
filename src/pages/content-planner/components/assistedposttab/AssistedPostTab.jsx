import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Image,
  Bot,
  Send,
  Clock,
  X,
  Loader2,
  ChevronDown,
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

import { schedulePost } from '@common/services/postService';
import { generateCaption } from '@common/services/aiService';

const AssistedPostTab = ({
  userProfile,
  setUserProfile,
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
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [showPreferences, setShowPreferences] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [scheduleDate, setScheduleDate] = useState(undefined);
  const [scheduleHour, setScheduleHour] = useState('8');
  const [scheduleMinute, setScheduleMinute] = useState('00');
  const [schedulePeriod, setSchedulePeriod] = useState('AM');
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const selectedPlatformData = useMemo(
    () => platforms.find((p) => p.id === selectedPlatform),
    [selectedPlatform, platforms]
  );

  const charCount = postContent.length;
  const handleContentChange = (e) => setPostContent(e.target.value);

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setMediaPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeMedia = () => setMediaPreview(null);

  // Uses onboarding preferences to shape the generated caption
  const generateAICaption = async () => {
    setIsGenerating(true);
    console.log('Generating with preferences:', {
    tone: userProfile?.tone,
    useEmojis: userProfile?.useEmojis,
    postStyle: userProfile?.postStyle,
    language: userProfile?.language,
  });
    try {
      const caption = await generateCaption({
        platform: selectedPlatform,
        niche: userProfile?.niche || 'general',
        goal: userProfile?.goal || '',
        tone: userProfile?.tone || 'friendly',
        useEmojis: userProfile?.useEmojis ?? false,
        postStyle: userProfile?.postStyle || '',
        language: userProfile?.language || 'English',
      });
      setPostContent(caption.slice(0, 280));
    } catch (err) {
      console.error('Caption generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDisplayTime = () =>
    `${scheduleHour}:${scheduleMinute} ${schedulePeriod}`;

  const getCombinedSchedule = () => {
    if (!scheduleDate || !scheduleHour || !scheduleMinute || !schedulePeriod)
      return null;
    const combined = new Date(scheduleDate);
    const hour24 = convertTo24Hour(scheduleHour, schedulePeriod);
    combined.setHours(hour24, Number(scheduleMinute), 0, 0);
    return combined;
  };

  const combinedSchedule = getCombinedSchedule();

  const handleSubmitAssisted = async (e) => {
    e.preventDefault();
    if (!combinedSchedule) return;

    // Only Facebook is supported until other OAuth flows are built
    if (selectedPlatform !== 'facebook') {
      setSubmitStatus({
        type: 'error',
        message: `${selectedPlatformData?.name} is not connected yet. Only Facebook is supported right now.`,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus(null);

      await schedulePost({
        message: postContent,
        imageUrl: null,
        scheduledAt: combinedSchedule.toISOString(),
        platform: selectedPlatform,
      });

      setSubmitStatus({
        type: 'success',
        message: `Post scheduled for ${combinedSchedule.toLocaleString([], {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}`,
      });

      setPostContent('');
      setScheduleDate(undefined);
      setMediaPreview(null);
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: err.message || 'Failed to schedule post. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
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

                <div className="flex items-center justify-between">
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

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={generateAICaption}
                    disabled={isGenerating || profileLoading}
                    className="gap-2 hover:bg-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                  >
                    <Bot size={16} />
                    {isGenerating ? 'Generating...' : 'Generate AI caption'}
                  </Button>
                </div>
              </div>

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
                        {scheduleDate ? format(scheduleDate, 'PPP') : <span>Pick a date</span>}
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
                          <Select value={scheduleHour} onValueChange={setScheduleHour}>
                            <SelectTrigger className="border-0 shadow-none focus:ring-0">
                              <SelectValue placeholder="Hour" />
                            </SelectTrigger>
                            <SelectContent>
                              {hours.map((hour) => (
                                <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-sm mx-3 font-bold text-slate-500">:</span>
                          <Select value={scheduleMinute} onValueChange={setScheduleMinute}>
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
                            <Select value={schedulePeriod} onValueChange={setSchedulePeriod}>
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

              {submitStatus && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    submitStatus.type === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
                      : 'border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <Button
                type="submit"
                disabled={!postContent.trim() || !scheduleDate || isSubmitting}
                className="w-full gap-2 py-5 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Schedule Post
                  </>
                )}
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
                  {React.createElement(selectedPlatformData.icon, { size: 18 })}
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
                    Scheduled for{' '}
                    {combinedSchedule.toLocaleString([], {
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