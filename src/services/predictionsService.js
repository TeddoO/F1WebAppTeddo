import { supabase } from '@/lib/supabase';

export const predictionsService = {
  // Get all predictions for a user
  async getUserPredictions(userId) {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  // Get predictions for a specific race
  async getRacePredictions(raceId) {
    const { data, error } = await supabase
      .from('predictions')
      .select('*, users(username)')
      .eq('race_id', raceId);
    
    if (error) throw error;
    return data;
  },

  // Save or update a prediction
  async savePrediction(userId, raceId, type, first, second, third) {
    const { data, error } = await supabase
      .from('predictions')
      .upsert({
        user_id: userId,
        race_id: raceId,
        prediction_type: type,
        first_place: first,
        second_place: second,
        third_place: third,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,race_id,prediction_type'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all predictions (for leaderboard calculation)
  async getAllPredictions() {
    const { data, error } = await supabase
      .from('predictions')
      .select('*');
    
    if (error) throw error;
    return data;
  }
};