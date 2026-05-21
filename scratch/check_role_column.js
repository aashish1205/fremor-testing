import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase
    .from('fremor_team')
    .select('role')
    .limit(1);

  if (error) {
    console.log('Error fetching role column:', error.message);
  } else {
    console.log('Success! Role column exists. Data:', data);
  }
}

check();
