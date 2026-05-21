import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

async function check() {
  const res = await fetch(`${url}/rest/v1/?apikey=${key}`);
  const json = await res.json();
  
  if (json.definitions && json.definitions.fremor_team) {
    console.log('fremor_team definition:', json.definitions.fremor_team);
  } else if (json.paths && json.paths['/fremor_team']) {
    console.log('fremor_team paths:', json.paths['/fremor_team']);
  } else {
    console.log('Keys in json:', Object.keys(json));
    if (json.definitions) {
      console.log('Keys in definitions:', Object.keys(json.definitions));
    }
  }
}

check();
