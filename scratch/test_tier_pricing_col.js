import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase
        .from('destinations')
        .select('id, title, tier_pricing')
        .limit(1);
        
    if (error) {
        console.error("Column check failed! tier_pricing probably doesn't exist:", error);
    } else {
        console.log("Column check succeeded! Column tier_pricing exists. Data:", data);
    }
}

check();
