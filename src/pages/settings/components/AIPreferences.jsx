import React, { useState, useEffect } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { Button } from '@common/components/shadcn/button';
import { Label } from '@common/components/shadcn/label';
import { Input } from '@common/components/shadcn/input';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@common/components/shadcn/select';

const toneOptions      = ['Professional', 'Casual', 'Humorous', 'Inspirational', 'Educational'];
const postStyleOptions = ['Conversational', 'Storytelling', 'Promotional', 'News / Updates', 'Question-based'];
const languageOptions  = ['English', 'Filipino', 'Spanish', 'French', 'German', 'Portuguese', 'Indonesian', 'Japanese', 'Korean', 'Arabic'];

const AIPreferences = ({ profileData, onSave }) => {
  const [form, setForm]       = useState({ tone: '', postStyle: '', language: 'English', useEmojis: false, niche: '', goal: '' });
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  // Sync with profileData when it loads
  useEffect(() => {
    if (profileData) {
      setForm({
        tone:      profileData.tone      || '',
        postStyle: profileData.postStyle || '',
        language:  profileData.language  || 'English',
        useEmojis: profileData.useEmojis ?? false,
        niche:     profileData.niche     || '',
        goal:      profileData.goal      || '',
      });
    }
  }, [profileData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      await onSave(form);
      setSuccess('AI preferences saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/70">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <Bot size={18} className="text-indigo-600" />
          AI Preferences
        </h2>
      </div>

      <div className="space-y-5 p-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Niche */}
          <div className="space-y-2">
            <Label htmlFor="niche">Content Niche</Label>
            <Input
              id="niche"
              value={form.niche}
              onChange={(e) => setForm((p) => ({ ...p, niche: e.target.value }))}
              placeholder="e.g. Fashion, Technology, Food..."
            />
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <Label htmlFor="goal">Goal</Label>
            <Input
              id="goal"
              value={form.goal}
              onChange={(e) => setForm((p) => ({ ...p, goal: e.target.value }))}
              placeholder="e.g. Grow followers, Drive traffic..."
            />
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={form.tone} onValueChange={(v) => setForm((p) => ({ ...p, tone: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Post Style */}
          <div className="space-y-2">
            <Label>Post Style</Label>
            <Select value={form.postStyle} onValueChange={(v) => setForm((p) => ({ ...p, postStyle: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {postStyleOptions.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label>Language</Label>
            <Select value={form.language} onValueChange={(v) => setForm((p) => ({ ...p, language: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Emojis */}
          <div className="space-y-2">
            <Label>Use Emojis</Label>
            <div className="grid grid-cols-2 gap-2">
              {[{ label: 'Yes', value: true }, { label: 'No', value: false }].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, useEmojis: opt.value }))}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    form.useEmojis === opt.value
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

        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full gap-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : null}
          {saving ? 'Saving...' : 'Save AI Preferences'}
        </Button>
      </div>
    </div>
  );
};

export default AIPreferences;