import { supabase } from '@/lib/supabase';

export const commentsService = {
  // Get comments for a race
  async getRaceComments(raceId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('race_id', raceId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Add a comment
  async addComment(userId, username, raceId, content) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: userId,
        username,
        race_id: raceId,
        content
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};