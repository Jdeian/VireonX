import {
  Sparkles,
  Bot,
  LayoutDashboard,
  ShieldCheck,
  User,
  Briefcase,
} from "lucide-react";

import { Input } from "@common/components/shadcn/input";
import { Label } from "@common/components/shadcn/label";

const ProfileSetup = ({
  form,
  setForm,
  roleSuggestions,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>
          Account type <span className="text-red-500">*</span>
        </Label>

        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              id: "personal",
              title: "Personal Account",
              text: "For creators or individuals posting as themselves.",
              icon: User,
            },
            {
              id: "page",
              title: "Page / Brand",
              text: "For businesses, organizations, or managed social pages.",
              icon: Briefcase,
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  accountType: item.id,
                  accountRole: "",
                }))
              }
              className={`rounded-2xl border p-4 text-left transition ${
                form.accountType === item.id
                  ? "border-indigo-500 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-500/10"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {item.text}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full-name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="full-name"
            placeholder="Enter your name"
            value={form.fullName}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                fullName: e.target.value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-role">
            Role or business type
            <span className="text-slate-400">(optional)</span>
          </Label>
          <Input
            id="account-role"
            list={`role-suggestions-${form.accountType}`}
            placeholder={
              form.accountType === "personal"
                ? "Enter or select a role"
                : "Enter or select a business type"
            }
            value={form.accountRole}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                accountRole: e.target.value,
              }))
            }
          />
          <datalist id={`role-suggestions-${form.accountType}`}>
            {roleSuggestions.map((role) => (
              <option key={role} value={role} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center rounded-2xl text-indigo-600 dark:text-indigo-300">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              What happens after this?
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
              You will set your posting preferences and optionally
              connect social accounts so VireonX can help generate
              and schedule content more accurately.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          {
            icon: Sparkles,
            title: "Personalized AI",
            text: "Content suggestions adapt to your niche and goals.",
          },
          {
            icon: LayoutDashboard,
            title: "Faster setup",
            text: "Start using the content planner with less manual configuration.",
          },
          {
            icon: ShieldCheck,
            title: "Flexible connection",
            text: "You can skip social account linking and do it later in Settings.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <item.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <p className="mt-3 text-sm font-semibold">
              {item.title}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileSetup;