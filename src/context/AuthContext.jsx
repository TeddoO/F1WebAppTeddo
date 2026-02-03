import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { usersService } from '@/services/usersService';
import { predictionsService } from '@/services/predictionsService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setCurrentUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId) => {
    try {
      const profile = await usersService.getUserById(userId);
      if (profile) {
        // Also load their predictions
        const predictions = await predictionsService.getUserPredictions(userId);
        
        // Convert predictions array to object format (like old localStorage)
        const predictionsObject = {};
        predictions.forEach(p => {
          if (!predictionsObject[p.race_id]) {
            predictionsObject[p.race_id] = {};
          }
          predictionsObject[p.race_id][p.prediction_type] = {
            first: p.first_place,
            second: p.second_place,
            third: p.third_place,
            timestamp: p.updated_at
          };
        });

        setUserProfile({
          ...profile,
          predictions: predictionsObject,
          // Map database fields to your component's expected names
          championDriver: profile.champion_driver_id,
          championConstructor: profile.champion_constructor_id,
          username: profile.username
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const register = async (email, password, username, championDriver, championConstructor) => {
    // Check if username is taken
    const existingUser = await usersService.getUserByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Create auth account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Create user profile
    await usersService.createUser(
      data.user.id,
      username,
      email,
      championDriver,
      championConstructor
    );

    // Load the profile
    await loadUserProfile(data.user.id);

    return data.user;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    await loadUserProfile(data.user.id);
    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateUser = async (updates) => {
    if (!currentUser) return;

    // If updating predictions
    if (updates.predictions) {
      // Save each prediction to database
      for (const [raceId, racePreds] of Object.entries(updates.predictions)) {
        if (racePreds.main) {
          await predictionsService.savePrediction(
            currentUser.id,
            parseInt(raceId),
            'main',
            racePreds.main.first,
            racePreds.main.second,
            racePreds.main.third
          );
        }
        if (racePreds.sprint) {
          await predictionsService.savePrediction(
            currentUser.id,
            parseInt(raceId),
            'sprint',
            racePreds.sprint.first,
            racePreds.sprint.second,
            racePreds.sprint.third
          );
        }
      }
    }

    // If updating champion picks
    if (updates.championDriver !== undefined || updates.championConstructor !== undefined) {
      await usersService.updateChampionPicks(
        currentUser.id,
        updates.championDriver ?? userProfile.championDriver,
        updates.championConstructor ?? userProfile.championConstructor
      );
    }

    // Reload profile to get fresh data
    await loadUserProfile(currentUser.id);
  };

  const isChampionSelectionLocked = () => {
    const firstRaceDate = new Date('2026-03-15');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    firstRaceDate.setHours(0, 0, 0, 0);
    return today >= firstRaceDate;
  };

  const value = {
    currentUser: userProfile, // Components expect this format
    loading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!currentUser,
    isChampionSelectionLocked
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};