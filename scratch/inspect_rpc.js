import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

async function check() {
  try {
    console.log('Fetching from URL:', url);
    const res = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    console.log('Response status:', res.status, res.statusText);
    const text = await res.text();
    console.log('Response length:', text.length);
    if (res.status !== 200) {
      console.log('Error body:', text);
      return;
    }
    const json = JSON.parse(text);
    
    if (json.definitions) {
      console.log('Available tables:', Object.keys(json.definitions));
      if (json.definitions.fremor_team) {
        console.log('fremor_team columns:', json.definitions.fremor_team.properties);
      }
    }
    if (json.paths) {
      const teamLoginPath = Object.keys(json.paths).find(p => p.includes('team_login'));
      if (teamLoginPath) {
        console.log('team_login path details:', JSON.stringify(json.paths[teamLoginPath], null, 2));
      } else {
        console.log('No team_login path found. Available RPCs:', Object.keys(json.paths).filter(p => p.startsWith('/rpc/')));
      }
    }
  } catch (e) {
    console.error('Exception caught:', e);
  }
}

check();
