import dotenv from 'dotenv';
dotenv.config();

async function schema() {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    const res = await fetch(`${url}/rest/v1/?apikey=${key}`);
    const json = await res.json();
    console.log(Object.keys(json.definitions || {}));
}

schema();
