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
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching from fremor_team:', error);
  } else {
    console.log('Sample row from fremor_team:', data);
  }

  // Let's also retrieve the definition of the SQL RPC team_login
  const { data: rpcData, error: rpcError } = await supabase
    .rpc('team_login', { p_email: 'test@example.com', p_password: 'test' });
  console.log('RPC check:', { rpcData, rpcError });
}

check();
