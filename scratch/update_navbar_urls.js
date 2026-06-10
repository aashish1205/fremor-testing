import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    try {
        console.log('Fetching Outbound (Global) item...');
        const { data: outboundItems, error: fetchErr } = await supabase
            .from('navbar_items')
            .select('id')
            .eq('special_type', 'outbound_mega');

        if (fetchErr) throw fetchErr;

        if (!outboundItems || outboundItems.length === 0) {
            console.log('No Outbound item found.');
            return;
        }

        const parentId = outboundItems[0].id;
        console.log(`Found Outbound (Global) parent ID: ${parentId}`);

        // Check if continents already exist under this parent
        const { data: existingChildren, error: childErr } = await supabase
            .from('navbar_items')
            .select('id, label')
            .eq('parent_id', parentId);

        if (childErr) throw childErr;

        if (existingChildren && existingChildren.length > 0) {
            console.log(`Found ${existingChildren.length} existing children under Outbound. Updating their URLs...`);
            for (const child of existingChildren) {
                const targetUrl = `/destination/outbound?continent=${encodeURIComponent(child.label)}`;
                await supabase
                    .from('navbar_items')
                    .update({ url: targetUrl })
                    .eq('id', child.id);
                console.log(`Updated ${child.label} URL to ${targetUrl}`);
            }
        } else {
            console.log('No continents found under Outbound. Seeding now...');
            const continents = [
                { label: 'Europe', url: '/destination/outbound?continent=Europe', order_index: 1 },
                { label: 'Africa', url: '/destination/outbound?continent=Africa', order_index: 2 },
                { label: 'North America', url: '/destination/outbound?continent=North%20America', order_index: 3 },
                { label: 'South America', url: '/destination/outbound?continent=South%20America', order_index: 4 },
                { label: 'Australia', url: '/destination/outbound?continent=Australia', order_index: 5 }
            ];

            const insertData = continents.map(c => ({
                label: c.label,
                url: c.url,
                parent_id: parentId,
                order_index: c.order_index,
                is_mega: false
            }));

            const { data, error } = await supabase
                .from('navbar_items')
                .insert(insertData)
                .select();

            if (error) throw error;
            console.log(`Successfully seeded ${data.length} continent menu items!`);
        }
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

run();
