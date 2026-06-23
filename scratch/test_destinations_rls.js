import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Attempting to insert a temporary destination package via anon key...");
    const { data: insertData, error: insertError } = await supabase
        .from('destinations')
        .insert([{
            title: 'RLS Test Package',
            location: 'Test Location',
            price: 9999
        }])
        .select();

    if (insertError) {
        console.error("❌ Write attempt failed! This means RLS is probably blocking anon/team member writes on the 'destinations' table.");
        console.error("Error details:", insertError);
    } else {
        console.log("✅ Write attempt succeeded! RLS is NOT blocking writes on 'destinations'.");
        
        // Clean up
        const testId = insertData[0].id;
        console.log(`Cleaning up test record with ID: ${testId}...`);
        const { error: deleteError } = await supabase
            .from('destinations')
            .delete()
            .eq('id', testId);
            
        if (deleteError) {
            console.error("Warning: Cleanup failed:", deleteError);
        } else {
            console.log("Cleanup succeeded.");
        }
    }
}

check();
