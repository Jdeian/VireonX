import { Input } from "@common/components/shadcn/input";
import { Label } from "@common/components/shadcn/label";
import { Checkbox } from "@common/components/shadcn/checkbox";
import { Textarea } from "@common/components/shadcn/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@common/components/shadcn/select";

import { niches, goals, platforms } from "../constants";

const toneOptions = [
  "Professional",
  "Casual",
  "Humorous",
  "Inspirational",
  "Educational",
];

const postStyleOptions = [
  "Conversational",
  "Storytelling",
  "Promotional",
  "News / Updates",
  "Question-based",
];

const languageOptions = [
  "English",
  "Filipino",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Indonesian",
  "Japanese",
  "Korean",
  "Arabic",
];

const ContentSetup = ({ form, setForm, togglePlatform }) => {
  return (
    <div className="space-y-6">

      {/* Niche */}
      <div className="space-y-2">
        <Label htmlFor="niche">
          Main content niche
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="niche"
          list="niche-suggestions"
          placeholder="Enter or select your niche"
          value={form.niche}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, niche: e.target.value }))
          }
        />
        <datalist id="niche-suggestions">
          {niches.map((niche) => (
            <option key={niche} value={niche} />
          ))}
        </datalist>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label>
          Short description{" "}
          <span className="text-slate-400">(optional)</span>
        </Label>
        <Textarea
          id="brand-bio"
          placeholder={
            form.accountType === "personal"
              ? "Describe yourself, your audience, or the kind of content you post."
              : "Describe your brand, audience, or the kind of content you want VireonX to help with."
          }
          value={form.bio}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, bio: e.target.value }))
          }
          className="min-h-28"
        />
      </div>

      {/* Goal */}
      <div className="space-y-2">
        <Label>
          Primary goal{" "}
          <span className="text-slate-400">(optional)</span>
        </Label>
        <Select
          value={form.goal}
          onValueChange={(value) =>
            setForm((prev) => ({ ...prev, goal: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your goal" />
          </SelectTrigger>
          <SelectContent>
            {goals.map((goal) => (
              <SelectItem key={goal} value={goal}>
                {goal}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Platforms */}
      <div className="space-y-3">
        <Label>
          Preferred platforms
          <span className="text-red-500">*</span>
        </Label>
        <div className="grid gap-3 md:grid-cols-2">
          {platforms.map((platform) => {
            const checked = form.platforms.includes(platform.id);
            return (
              <button
                type="button"
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  checked
                    ? "border-indigo-500 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-500/10"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${platform.color}`}
                    >
                      <platform.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{platform.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Use for scheduling and publishing
                      </p>
                    </div>
                  </div>
                  <Checkbox checked={checked} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200 pt-2 dark:border-slate-800">
        <p className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
          AI Content Preferences
        </p>

        <div className="grid gap-4 md:grid-cols-2">

          {/* Tone */}
          <div className="space-y-2">
            <Label>
              Tone{" "}
              <span className="text-slate-400">(optional)</span>
            </Label>
            <Select
              value={form.tone}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, tone: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((tone) => (
                  <SelectItem key={tone} value={tone}>
                    {tone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Post Style */}
          <div className="space-y-2">
            <Label>
              Post style{" "}
              <span className="text-slate-400">(optional)</span>
            </Label>
            <Select
              value={form.postStyle}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, postStyle: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select post style" />
              </SelectTrigger>
              <SelectContent>
                {postStyleOptions.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label>
              Language{" "}
              <span className="text-slate-400">(optional)</span>
            </Label>
            <Select
              value={form.language}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, language: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Emoji usage */}
          <div className="space-y-2">
            <Label>Emoji usage</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Use emojis", value: true },
                { label: "No emojis", value: false },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, useEmojis: option.value }))
                  }
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    form.useEmojis === option.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default ContentSetup;