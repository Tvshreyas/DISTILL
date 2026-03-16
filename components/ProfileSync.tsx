"use client";

import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

export default function ProfileSync() {
  const { isSignedIn, isLoaded } = useAuth();
  const profile = useQuery(api.profiles.get);
  const createProfile = useMutation(api.profiles.createOrGet);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && profile === null && !synced) {
      console.log("Syncing profile...");
      createProfile()
        .then(() => {
          setSynced(true);
          console.log("Profile synced successfully.");
        })
        .catch((err) => {
          console.error("Failed to sync profile:", err);
        });
    }
  }, [isLoaded, isSignedIn, profile, createProfile, synced]);

  return null;
}
