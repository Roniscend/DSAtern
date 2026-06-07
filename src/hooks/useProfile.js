import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dsatern_profile';

const DEFAULT_PROFILE = {
  name: '',
  college: '',
  bio: '',
  level: 'Beginner',
  avatar: null, // base64 data URL
  appliedCount: 0,
};

/**
 * Custom hook for managing user profile data persisted in localStorage.
 * @returns {{ profile, updateProfile, incrementApplied, resetProfile }}
 */
export function useProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : { ...DEFAULT_PROFILE };
    } catch {
      return { ...DEFAULT_PROFILE };
    }
  });

  // Persist to localStorage whenever profile changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      console.warn('Failed to save profile to localStorage');
    }
  }, [profile]);

  const updateProfile = useCallback((patch) => {
    setProfile(prev => ({ ...prev, ...patch }));
  }, []);

  const incrementApplied = useCallback(() => {
    setProfile(prev => ({ ...prev, appliedCount: (prev.appliedCount || 0) + 1 }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile({ ...DEFAULT_PROFILE });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { profile, updateProfile, incrementApplied, resetProfile };
}
