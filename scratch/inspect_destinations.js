import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    const { data, error } = await supabase.from('destinations').select('id, title, image, banner_image');
    if (error) {
        console.error(error);
    } else {
        console.log("All Destinations in DB:");
        data.forEach(d => {
            console.log(`- ID: ${d.id} | Title: ${d.title} | Banner: ${d.banner_image}`);
        });
    }
}

inspect();
