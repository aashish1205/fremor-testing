import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://botchursnmplaerazpsb.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3MoXgQOFyH8KAPh4pm2UFA_aPVaWsoA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testVisas() {
    console.log("Testing visas table select with anonymous key...");
    const { data: readData, error: readError } = await supabase
        .from('visas')
        .select('*')
        .limit(1);

    if (readError) {
        console.error("Select failed:", readError);
    } else {
        console.log("Select succeeded. Sample:", readData);
    }

    console.log("\nTesting visas table insert with anonymous key...");
    const testRecord = {
        country_name: "Test Country Name " + Date.now(),
        country_code: "tc",
        visa_type: "E-VISA",
        price: 100,
        service_fee: 50,
        processing_time_text: "3-5 days"
    };

    const { data: insertData, error: insertError } = await supabase
        .from('visas')
        .insert([testRecord])
        .select();

    if (insertError) {
        console.error("Insert failed (expected for anon):", insertError);
    } else {
        console.log("Insert succeeded unexpectedly:", insertData);
    }
}

testVisas();
