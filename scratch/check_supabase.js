import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://botchursnmplaerazpsb.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3MoXgQOFyH8KAPh4pm2UFA_aPVaWsoA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Fetching all destinations...");
    const { data, error } = await supabase
        .from('destinations')
        .select('*');

    if (error) {
        console.error("Error fetching destinations:", error);
        return;
    }

    console.log(`Total packages found: ${data.length}`);
    if (data.length > 0) {
        console.log("Sample package properties:", Object.keys(data[0]));
    }

    const recentlyBooked = data.filter(d => d.show_recently_booked === true || d.show_recently_booked === 'true');
    console.log(`\nPackages flagged for Recently Booked (${recentlyBooked.length}):`);
    recentlyBooked.forEach(d => {
        console.log(`- ID: ${d.id} | Title: "${d.title}" | show_recently_booked: ${d.show_recently_booked} | text: "${d.recent_booking_text}" | tag: "${d.recent_booking_tag}"`);
    });
}

check();
