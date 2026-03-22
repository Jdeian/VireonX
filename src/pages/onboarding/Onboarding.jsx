import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Wand2,
  ShieldCheck,
  CalendarClock,
} from "lucide-react";

import { Button } from "@common/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@common/components/shadcn/card";
import { Progress } from "@common/components/shadcn/progress";

import logo from "@assets/images/logo.png";
import { useNavigate, useSearchParams } from "react-router-dom";

import { auth } from "@common/services/config";
import { saveOnboardingProfile } from "@common/services/profileService";

import ProfileSetup from "./components/ProfileSetup";
import ContentSetup from "./components/ContentSetup";
import PlatformSetup from "./components/PlatformSetup";
import { platforms, roleOptions, stepLabels } from "./constants";

const Onboarding = () => {
  const [step, setStep] = useState(() => {
    const saved = sessionStorage.getItem("onboarding_step");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [form, setForm] = useState(() => {
    try {
      const saved = sessionStorage.getItem("onboarding_form");
      return saved ? JSON.parse(saved) : {
        accountType: "personal",
        fullName: "",
        accountRole: "",
        niche: "",
        bio: "",
        goal: "",
        platforms: [],
        connectedAccounts: {
          facebook: false,
          instagram: false,
          twitter: false,
          linkedin: false,
        },
        facebookPageId: "",
        facebookPageName: "",
        tone: "",
        useEmojis: false,
        postStyle: "",
        language: "",
      };
    } catch {
      return {
        accountType: "personal",
        fullName: "",
        accountRole: "",
        niche: "",
        bio: "",
        goal: "",
        platforms: [],
        connectedAccounts: {
          facebook: false,
          instagram: false,
          twitter: false,
          linkedin: false,
        },
        facebookPageId: "",
        facebookPageName: "",
      };
    }
  });

  useEffect(() => {
    sessionStorage.setItem("onboarding_step", String(step));
  }, [step]);

  useEffect(() => {
    sessionStorage.setItem("onboarding_form", JSON.stringify(form));
  }, [form]);

  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const progress = useMemo(() => (step / stepLabels.length) * 100, [step]);

  const resolvedNiche = form.niche.trim();
  const resolvedAccountRole = form.accountRole.trim();
  const roleSuggestions = roleOptions[form.accountType];
  const selectedPlatforms = platforms.filter((platform) =>
    form.platforms.includes(platform.id)
  );

  useEffect(() => {
    const facebookStatus = searchParams.get("facebook");
    const pageId = searchParams.get("pageId");
    const pageName = searchParams.get("pageName");
    const message = searchParams.get("message");

    if (!facebookStatus) return;

    if (facebookStatus === "success") {
      setForm((prev) => ({
        ...prev,
        connectedAccounts: {
          ...prev.connectedAccounts,
          facebook: true,
        },
        facebookPageId: pageId || prev.facebookPageId,
        facebookPageName: pageName || prev.facebookPageName,
      }));
      setSubmitError("");
    }

    if (facebookStatus === "error") {
      setSubmitError(message || "Facebook connection failed. Please try again.");
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }, [searchParams]);

  const isStepValid = () => {
    if (step === 1) {
      return form.fullName.trim() !== "";
    }

    if (step === 2) {
      return form.niche.trim() !== "" && form.platforms.length > 0;
    }

    return true;
  };

  const togglePlatform = (platformId) => {
    setForm((prev) => {
      const exists = prev.platforms.includes(platformId);

      const updatedPlatforms = exists
        ? prev.platforms.filter((item) => item !== platformId)
        : [...prev.platforms, platformId];

      return {
        ...prev,
        platforms: updatedPlatforms,
        connectedAccounts: exists
          ? {
              ...prev.connectedAccounts,
              [platformId]: false,
            }
          : prev.connectedAccounts,
        ...(exists && platformId === "facebook"
          ? {
              facebookPageId: "",
              facebookPageName: "",
            }
          : {}),
      };
    });
  };

  const toggleConnection = (platformId) => {
    setForm((prev) => ({
      ...prev,
      connectedAccounts: {
        ...prev.connectedAccounts,
        [platformId]: !prev.connectedAccounts[platformId],
      },
    }));
  };

  const connectFacebook = async () => {
    try {
      setSubmitError("");

      const user = auth.currentUser;

      if (!user) {
        setSubmitError("You must be signed in first.");
        return;
      }

      const idToken = await user.getIdToken();
      const returnTo = `${window.location.origin}${window.location.pathname}`;

      const params = new URLSearchParams({
        token: idToken,
        returnTo,
      });

      window.location.href = `${API_BASE_URL}/auth/facebook/start?${params.toString()}`;
    } catch (error) {
      console.error("Failed to start Facebook connection:", error);
      setSubmitError("Failed to start Facebook connection.");
    }
  };

  const disconnectPlatform = (platformId) => {
    setForm((prev) => ({
      ...prev,
      connectedAccounts: {
        ...prev.connectedAccounts,
        [platformId]: false,
      },
      ...(platformId === "facebook"
        ? {
            facebookPageId: "",
            facebookPageName: "",
          }
        : {}),
    }));
  };

  const onConnectPlatform = async (platformId) => {
    if (platformId === "facebook") {
      await connectFacebook();
      return;
    }

    // Keep old local behavior for non-Facebook platforms for now
    toggleConnection(platformId);
  };

  const onDisconnectPlatform = (platformId) => {
    if (platformId === "facebook") {
      disconnectPlatform(platformId);
      return;
    }

    // Keep old local behavior for non-Facebook platforms for now
    toggleConnection(platformId);
  };

  const hasAnyConnectedSelectedPlatform = selectedPlatforms.some(
    (platform) => form.connectedAccounts[platform.id]
  );

  const nextStep = () => {
    if (step < 4 && isStepValid()) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));

  const handleFinish = async () => {
    try {
      setIsSaving(true);
      setSubmitError("");

      const user = auth.currentUser;

      if (!user) {
        setSubmitError("You must be signed in first.");
        return;
      }

      await saveOnboardingProfile(user.uid, form);
      sessionStorage.removeItem("onboarding_step"); // ← clear step
      sessionStorage.removeItem("onboarding_form");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save onboarding:", error);
      setSubmitError("Failed to save your onboarding. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[420px_1fr]">
        <aside className="relative overflow-hidden border-r border-slate-200 px-8 py-8 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.25),transparent_35%)]" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={logo} className="h-11 w-11" alt="VireonX logo" />
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Welcome to
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight">VireonX</h1>
                </div>
              </div>

              <p className="max-w-md text-sm leading-6 text-slate-300">
                Tell VireonX what kind of content you create, whether you are
                posting as yourself or for a page, and which social accounts you
                want to manage.
              </p>
            </div>

            <div className="mt-10 space-y-3">
              {[
                {
                  icon: Wand2,
                  title: "AI-assisted content flow",
                  text: "Generate ideas, captions, and recurring content with less manual work.",
                },
                {
                  icon: CalendarClock,
                  title: "Scheduling-ready setup",
                  text: "Prepare your preferences first so the content planner can work around your goals.",
                },
                {
                  icon: ShieldCheck,
                  title: "Connected accounts managed safely",
                  text: "Link your social platforms now or later when you are ready.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-10">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Current setup
                </p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Account type</span>
                    <span className="font-medium capitalize text-white">
                      {form.accountType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Role / Type</span>
                    <span className="font-medium text-white">
                      {resolvedAccountRole || "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Preferred niche</span>
                    <span className="font-medium text-white">
                      {resolvedNiche || "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Selected platforms</span>
                    <span className="font-medium text-white">
                      {form.platforms.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex items-center px-4 py-6 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Step {step} of {stepLabels.length}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    {stepLabels[step - 1]}
                  </h2>
                </div>
                <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300 sm:block">
                  VireonX setup
                </div>
              </div>

              <Progress value={progress} className="h-2" />

              <div className="mt-3 flex flex-wrap gap-2">
                {stepLabels.map((label, index) => {
                  const currentStep = index + 1;
                  const active = currentStep === step;
                  const done = currentStep < step;

                  return (
                    <div
                      key={label}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        active
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                          : done
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {done ? "Done" : `0${currentStep}`} · {label}
                    </div>
                  );
                })}
              </div>
            </div>

            <Card className="rounded-3xl border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">
                  {step === 1 && "Let’s get your workspace ready"}
                  {step === 2 && "Tell us how you want to use VireonX"}
                  {step === 3 && "Connect your posting accounts"}
                  {step === 4 && "You’re ready to start"}
                </CardTitle>
                <CardDescription>
                  {step === 1 &&
                    "A quick setup helps VireonX personalize your content planner whether you use a personal account or a page."}
                  {step === 2 &&
                    "Choose your niche, goals, and preferred platforms for posting."}
                  {step === 3 &&
                    "You can link your selected social accounts now or skip and connect them later in Settings."}
                  {step === 4 &&
                    "Review your setup before heading to the dashboard or content planner."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {step === 1 && (
                  <ProfileSetup
                    form={form}
                    setForm={setForm}
                    roleSuggestions={roleSuggestions}
                  />
                )}

                {step === 2 && (
                  <ContentSetup
                    form={form}
                    setForm={setForm}
                    togglePlatform={togglePlatform}
                  />
                )}

                {step === 3 && (
                  <PlatformSetup
                    selectedPlatforms={selectedPlatforms}
                    form={form}
                    onConnectPlatform={onConnectPlatform}
                    onDisconnectPlatform={onDisconnectPlatform}
                  />
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          Your VireonX workspace is ready.
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          You can now continue to the dashboard, open the
                          content planner, or manage connected accounts later in
                          Settings.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Profile summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500">Account type</span>
                            <span className="font-medium capitalize">
                              {form.accountType}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500">Name</span>
                            <span className="font-medium">
                              {form.fullName || "Not provided"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500">Role / Type</span>
                            <span className="font-medium">
                              {resolvedAccountRole || "Not provided"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500">Niche</span>
                            <span className="font-medium">
                              {resolvedNiche || "Not provided"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500">Goal</span>
                            <span className="font-medium">
                              {form.goal || "Not provided"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500">Tone</span>
                            <span className="font-medium">
                              {form.tone || "Not provided"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500">Post style</span>
                            <span className="font-medium">
                              {form.postStyle || "Not provided"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500">Emojis</span>
                            <span className="font-medium">
                              {form.useEmojis ? "Yes" : "No"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500">Language</span>
                            <span className="font-medium">
                              {form.language || "Not provided"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-950">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Connected accounts
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          {selectedPlatforms.map((platform) => {
                            const connected =
                              form.connectedAccounts[platform.id];

                            return (
                              <div
                                key={platform.id}
                                className="flex items-center justify-between gap-4"
                              >
                                <span className="text-slate-500">
                                  {platform.name}
                                </span>
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                    connected
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                  }`}
                                >
                                  {connected ? "Connected" : "Skipped"}
                                </span>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    {submitError}
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {step < 4 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {step === 3
                          ? hasAnyConnectedSelectedPlatform
                            ? "Continue"
                            : "Skip for now"
                          : "Continue"}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleFinish}
                        disabled={isSaving}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Finish Setup"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Onboarding;