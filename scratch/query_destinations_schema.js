import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    try {
        const { data, error } = await supabase.from('destinations').select('*').limit(3);
        if (error) {
            console.error('Error fetching destinations:', error);
        } else {
            console.log('DESTINATIONS SAMPLE:', data.map(d => ({ id: d.id, title: d.title, accommodation_type: d.accommodation_type })));
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}
test();
