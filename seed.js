import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    try {
        console.log('Reading data-destination.json...');
        const dataPath = path.join(__dirname, 'src', 'Components', 'data', 'data-destination.json');
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const posts = JSON.parse(fileContent);

        console.log(`Found ${posts.length} destinations to insert.`);

        const insertData = posts.map(post => ({
            title: post.title,
            price: parseFloat(post.price.replace(/[^0-9.]/g, '')),
            image: post.image,
            location: post.title
        }));

        console.log('Inserting into Supabase...');
        const { data, error } = await supabase
            .from('destinations')
            .insert(insertData)
            .select();

        if (error) {
            console.error('Error inserting data:', error.message, error.details);
        } else {
            console.log(`Successfully inserted ${data.length} destinations!`);
        }
    } catch (err) {
        console.error('Failed to seed database:', err);
    }
}

seed();
