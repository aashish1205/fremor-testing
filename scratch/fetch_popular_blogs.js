import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data, error } = await supabase
        .from('blogs')
        .select('id, title, is_popular_story');
    if (error) {
        console.error(error);
    } else {
        console.log('All blogs popularity status:');
        console.log(data);
    }
}
run();
