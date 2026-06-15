import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .limit(1);
    if (error) {
        console.error(error);
    } else {
        console.log('Columns in blogs:', data.length > 0 ? Object.keys(data[0]) : 'No data in blogs table');
    }
}
run();
