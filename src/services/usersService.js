import { supabase } from '@/lib/supabase';

export const usersService = {
  // Get a user by their ID
  async getUserById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get a user by username
  async getUserByUsername(username) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  // Create a new user profile
  async createUser(userId, username, email, championDriver, championConstructor) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        username,
        email,
        champion_driver_id: championDriver,
        champion_constructor_id: championConstructor
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all users (for leaderboard)
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  // Update user's champion picks
  async updateChampionPicks(userId, championDriver, championConstructor) {
    const { data, error } = await supabase
      .from('users')
      .update({
        champion_driver_id: championDriver,
        champion_constructor_id: championConstructor
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};