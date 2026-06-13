import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    try {
        const { data, error } = await supabase.from('blogs').select('*').limit(1);
        if (error) {
            console.error('Error fetching blog:', error);
        } else {
            console.log('COLUMNS:', Object.keys(data[0] || {}));
            console.log('SAMPLE DATA:', data[0]);
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}
test();
