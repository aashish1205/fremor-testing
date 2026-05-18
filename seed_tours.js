import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTours() {
    try {
        console.log('Reading data-tour.json...');
        const rawData = fs.readFileSync(path.resolve(__dirname, 'src/Components/data/data-tour.json'), 'utf8');
        const posts = JSON.parse(rawData);

        console.log(`Found ${posts.length} tours to insert.`);

        // Default layout fillers to replicate the static Tour details look
        const defaultHighlights = [
            "Visit most popular location of the city",
            "Buffet Breakfast for all travelers with good quality",
            "Expert guide always guide you and give informations",
            "Best Hotel for all also great food"
        ];
        
        const defaultIncluded = ["Hotel Fair", "Transportation", "Breakfast", "Sightseeing"];
        const defaultExcluded = ["WIFI", "Swimming Pool", "GYM"];

        const defaultItinerary = [
            { day: "Day 01", activities: ["Arrival and check-in", "Briefing and welcome dinner"] },
            { day: "Day 02", activities: ["Morning sightseeing", "Afternoon free time", "Evening local market tour"] },
            { day: "Day 03", activities: ["Departure and drop-off to the airport"] }
        ];

        const insertData = posts.map(post => ({
            title: post.title,
            price: parseFloat(post.price.replace(/[^0-9.]/g, '')),
            rating: 4.8,
            primary_image: post.image,
            gallery_images: [post.image],
            description_1: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
            description_2: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae.",
            highlights_text: "Here are some of the key highlights you will experience on this incredible journey.",
            highlights_list: defaultHighlights,
            basic_info_text: "Basic information regarding your departure, arrival, and general guides.",
            included_list: defaultIncluded,
            excluded_list: defaultExcluded,
            itinerary: defaultItinerary
        }));

        console.log('Inserting into Supabase [tours] table...');
        const { data, error } = await supabase
            .from('tours')
            .insert(insertData)
            .select();

        if (error) {
            console.error('Error inserting data:', error.message);
        } else {
            console.log(`Successfully inserted ${data.length} tours!`);
        }

    } catch (err) {
        console.error('Migration failed:', err);
    }
}

seedTours();
