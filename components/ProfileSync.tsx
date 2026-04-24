"use client";

import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export default function ProfileSync() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const profile = useQuery(api.profiles.get);
  const createProfile = useMutation(api.profiles.createOrGet);
  const [synced, setSynced] = useState(false);

  // Create profile with UTM data on first sign-in
  useEffect(() => {
    if (isLoaded && isSignedIn && profile === null && !synced) {
      const utmSource = getCookie("utm_source");
      const utmMedium = getCookie("utm_medium");
      const utmCampaign = getCookie("utm_campaign");

      createProfile({
        acquisitionSource: utmSource,
        acquisitionMedium: utmMedium,
        acquisitionCampaign: utmCampaign,
      })
        .then(() => {
          setSynced(true);
          // Clear UTM cookies after successful profile creation
          deleteCookie("utm_source");
          deleteCookie("utm_medium");
          deleteCookie("utm_campaign");
          // Track signup event
          import("posthog-js").then(({ default: posthog }) => {
            posthog.capture("user_signed_up", {
              acquisition_source: utmSource,
              acquisition_medium: utmMedium,
              acquisition_campaign: utmCampaign,
            });
          });
        })
        .catch((err) => {
          console.error("Failed to sync profile:", err);
        });
    }
  }, [isLoaded, isSignedIn, profile, createProfile, synced]);

  // Identify user in PostHog once profile exists
  useEffect(() => {
    if (isLoaded && isSignedIn && userId && profile) {
      import("posthog-js").then(({ default: posthog }) => {
        posthog.identify(userId, {
          plan: profile.plan,
          acquisition_source: profile.acquisitionSource,
          acquisition_medium: profile.acquisitionMedium,
          acquisition_campaign: profile.acquisitionCampaign,
        });
      });
    }
  }, [isLoaded, isSignedIn, userId, profile]);

  // Auto-sync timezone from browser on every load
  const updateProfile = useMutation(api.profiles.update);
  useEffect(() => {
    if (isLoaded && isSignedIn && profile) {
      try {
        const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (browserTz && browserTz !== profile.timezone) {
          updateProfile({ timezone: browserTz });
        }
      } catch {
        // Intl not available — keep existing timezone
      }
    }
  }, [isLoaded, isSignedIn, profile, updateProfile]);

  return null;
}
