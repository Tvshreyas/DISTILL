"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useAutoSave } from "@/hooks/useAutoSave";
import type { ContentType } from "@/types";

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "book", label: "Book" },
  { value: "video", label: "Video" },
  { value: "article", label: "Article" },
  { value: "podcast", label: "Podcast" },
  { value: "other", label: "Other" },
];

const PROMPTS = [
  "What stood out to you? What's one idea you want to hold onto?",
  "How does this connect to something you already believe or know?",
  "What would you tell someone about this in your own words?",
];

const STORAGE_KEY = "distill_onboarding";

interface OnboardingData {
  deviceToken: string;
  title: string;
  contentType: ContentType;
  consumeReason: string;
  reflectionContent: string;
  promptUsed: string;
  thinkingShiftRating: number | null;
  createdAt: number;
}

function getStoredData(): OnboardingData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: OnboardingData = JSON.parse(raw);
    // Expire after 7 days
    if (Date.now() - data.createdAt > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveData(data: OnboardingData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

function getPrompt(deviceToken: string): string {
  let hash = 0;
  for (let i = 0; i < deviceToken.length; i++) {
    hash = (hash * 31 + deviceToken.charCodeAt(i)) | 0;
  }
  return PROMPTS[Math.abs(hash) % PROMPTS.length];
}

type Screen = "welcome" | "mechanism" | "session" | "reflection" | "account";

export default function OnboardingPage() {
  const router = useRouter();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const stored = getStoredData();

  // Determine initial screen based on stored progress
  function getInitialScreen(): Screen {
    if (!stored) return "welcome";
    if (stored.reflectionContent.trim()) return "account";
    if (stored.title.trim()) return "reflection";
    return "welcome";
  }

  const [screen, setScreen] = useState<Screen>(getInitialScreen);
  const [deviceToken] = useState(
    () => stored?.deviceToken ?? crypto.randomUUID()
  );

  // Session setup state
  const [title, setTitle] = useState(stored?.title ?? "");
  const [contentType, setContentType] = useState<ContentType>(
    stored?.contentType ?? "book"
  );
  const [reason, setReason] = useState(stored?.consumeReason ?? "");
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Reflection state
  const prompt = getPrompt(deviceToken);
  const [reflectionContent, setReflectionContent] = useState(
    stored?.reflectionContent ?? ""
  );
  const [rating, setRating] = useState<number | null>(
    stored?.thinkingShiftRating ?? null
  );
  const [wordCount, setWordCount] = useState(() => {
    const initial = stored?.reflectionContent ?? "";
    return initial.trim() ? initial.trim().split(/\s+/).length : 0;
  });

  // Account creation state
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Auto-save reflection to localStorage
  const handleAutoSave = useCallback(
    (value: string) => {
      const data: OnboardingData = {
        deviceToken,
        title,
        contentType,
        consumeReason: reason,
        reflectionContent: value,
        promptUsed: prompt,
        thinkingShiftRating: rating,
        createdAt: stored?.createdAt ?? Date.now(),
      };
      saveData(data);
    },
    [deviceToken, title, contentType, reason, prompt, rating, stored?.createdAt]
  );

  useAutoSave(reflectionContent, handleAutoSave, 3000);

  function handleReflectionChange(value: string) {
    if (value.length <= 3000) {
      setReflectionContent(value);
      setWordCount(value.trim() ? value.trim().split(/\s+/).length : 0);
    }
  }

  function handleSessionSubmit() {
    setSessionError(null);
    const trimmed = title.trim();
    if (!trimmed) {
      setSessionError("What did you consume? Add a title.");
      return;
    }
    if (trimmed.length > 200) {
      setSessionError("Title must be 200 characters or fewer.");
      return;
    }

    // Save to localStorage and proceed
    const data: OnboardingData = {
      deviceToken,
      title: trimmed,
      contentType,
      consumeReason: reason.trim(),
      reflectionContent: "",
      promptUsed: prompt,
      thinkingShiftRating: null,
      createdAt: stored?.createdAt ?? Date.now(),
    };
    saveData(data);
    setScreen("reflection");
  }

  function handleReflectionSubmit() {
    const trimmed = reflectionContent.trim();
    if (!trimmed) return;
    if (trimmed.length > 3000) return;

    // Save final reflection to localStorage
    const data: OnboardingData = {
      deviceToken,
      title: title.trim(),
      contentType,
      consumeReason: reason.trim(),
      reflectionContent: trimmed,
      promptUsed: prompt,
      thinkingShiftRating: rating,
      createdAt: stored?.createdAt ?? Date.now(),
    };
    saveData(data);
    setScreen("account");
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    setEmailSending(true);

    if (!signInLoaded || !signIn) {
      setEmailError("Authentication is not ready. Please try again.");
      setEmailSending(false);
      return;
    }

    try {
      await signIn.create({
        identifier: email,
        strategy: "email_link",
        redirectUrl: `${window.location.origin}/onboarding/migrate`,
      });
      setEmailSent(true);
    } catch {
      setEmailError("Something went wrong. Please try again.");
    }

    setEmailSending(false);
  }

  // --- Screen 1: Welcome ---
  if (screen === "welcome") {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            You&apos;ve consumed a lot.
            <br />
            How much of it became yours?
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Books, videos, podcasts, articles — you finish them and move on. But
            what did <em>you</em> actually think? Distill helps you capture your
            own perspective after consuming content. Not summaries. Not
            notes. Your thinking.
          </p>
          <button
            onClick={() => setScreen("mechanism")}
            className="w-full bg-black text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800"
          >
            See how it works
          </button>
          <button
            onClick={() => setScreen("mechanism")}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Skip
          </button>
          <p className="text-xs text-gray-400 leading-relaxed pt-2">
            Distill is a thinking development and reflection tool. It is NOT a
            medical device and is NOT intended to diagnose, treat, cure, or
            prevent anxiety, digital addiction, attention disorders, or any
            other medical or psychological condition. Users experiencing mental
            health difficulties should consult a qualified healthcare
            professional.
          </p>
        </div>
      </main>
    );
  }

  // --- Screen 2: Mechanism ---
  if (screen === "mechanism") {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              Consume. Reflect. Grow.
            </h1>
            <p className="text-gray-600 text-sm">
              After you finish something, take 5 minutes to write what{" "}
              <em>you</em> think — not what the author said. Over time, your
              reflections compound into a library of your own perspective.
            </p>
          </div>

          {/* Example reflection card */}
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                Book
              </span>
              <span className="text-sm font-medium text-gray-900">
                Thinking, Fast and Slow
              </span>
            </div>
            <p className="text-sm text-gray-700 italic leading-relaxed">
              &ldquo;I thought I was being rational but Kahneman made me
              realize how often I rely on mental shortcuts. The anchoring
              effect explains why I always overpay when the first price I see
              is high. I want to start noticing when System 1 is doing my
              thinking for me.&rdquo;
            </p>
            <p className="text-xs text-gray-400 mt-2">47 words</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setScreen("session")}
              className="w-full bg-black text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800"
            >
              Try it now
            </button>
            <button
              onClick={() => setScreen("session")}
              className="w-full text-sm text-gray-400 hover:text-gray-600"
            >
              Skip
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --- Screen 3: Session Setup ---
  if (screen === "session") {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              What have you recently finished?
            </h1>
            <p className="text-sm text-gray-500">
              Pick something you consumed — a book, video, article, or podcast.
            </p>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-900 mb-1.5"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g. "Thinking, Fast and Slow"'
              maxLength={200}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {title.length}/200
            </p>
          </div>

          {/* Content Type */}
          <div>
            <label
              htmlFor="content-type"
              className="block text-sm font-medium text-gray-900 mb-1.5"
            >
              Type
            </label>
            <div className="flex gap-2 flex-wrap">
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.value}
                  type="button"
                  onClick={() => setContentType(ct.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border ${
                    contentType === ct.value
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reason (optional) */}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-900 mb-1.5"
            >
              Why are you consuming this?{" "}
              <span className="text-gray-400 font-normal">Optional</span>
            </label>
            <input
              id="reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Curious about decision-making biases"
              maxLength={140}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Error */}
          {sessionError && (
            <p className="text-sm text-red-600" role="alert">
              {sessionError}
            </p>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSessionSubmit}
            disabled={!title.trim()}
            className="w-full bg-black text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start reflecting
          </button>
        </div>
      </main>
    );
  }

  // --- Screen 4a: Reflection ---
  if (screen === "reflection") {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Reflecting on
            </p>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>

          {/* Prompt */}
          <p className="text-sm text-gray-500 italic">{prompt}</p>

          {/* Textarea */}
          <div>
            <textarea
              value={reflectionContent}
              onChange={(e) => handleReflectionChange(e.target.value)}
              placeholder="Write your reflection..."
              rows={8}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y"
              autoFocus
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{wordCount} words</span>
              <span>{reflectionContent.length}/3000</span>
            </div>
          </div>

          {/* Thinking Shift Rating */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              How much did this shift your thinking?{" "}
              <span className="text-gray-400 font-normal">Optional</span>
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(rating === n ? null : n)}
                  className={`w-9 h-9 rounded-md text-sm font-medium border ${
                    rating === n
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              1 = reinforced what I knew · 5 = completely changed my view
            </p>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleReflectionSubmit}
            disabled={!reflectionContent.trim()}
            className="w-full bg-black text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save my reflection
          </button>
        </div>
      </main>
    );
  }

  // --- Screen 4b: Account Creation ---
  if (screen === "account") {
    if (emailSent) {
      return (
        <main className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-sm text-center space-y-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Check your email
            </h1>
            <p className="text-gray-600 text-sm">
              We sent a link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500">
              The link expires in 15 minutes.{" "}
              <button
                onClick={() => setEmailSent(false)}
                className="underline hover:no-underline"
              >
                Send a new one
              </button>
            </p>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Your reflection is saved
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your email to keep it. We&apos;ll send you a link — no
              password needed.
            </p>
          </div>

          {/* Reflection preview */}
          <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
            <p className="text-xs text-gray-400 mb-1">{title}</p>
            <p className="text-sm text-gray-700 line-clamp-3">
              {reflectionContent}
            </p>
            <p className="text-xs text-gray-400 mt-1">{wordCount} words</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                autoFocus
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {emailError && (
              <p role="alert" className="text-sm text-red-600">
                {emailError}
              </p>
            )}

            <button
              type="submit"
              disabled={emailSending}
              className="w-full bg-black text-white rounded-md px-5 py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailSending ? "Sending..." : "Send me a link"}
            </button>
          </form>

          <p className="text-center">
            <button
              onClick={() => router.push("/sign-in")}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Already have an account? Sign in
            </button>
          </p>
        </div>
      </main>
    );
  }

  return null;
}
