import { supabase } from './lib/supabase';

async function testConnection() {
  const { data, error } = await supabase.from('users').select('count');
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful! Users table exists.');
  }
}

testConnection();