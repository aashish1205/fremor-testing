import { supabase } from '../supabaseClient';

const BUCKET_NAME = 'destinationdetails_images';

// ─── FETCH ALL TOURS ──────────────────────────────────────────────────
export async function fetchTours() {
    const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// ─── FETCH SINGLE TOUR BY ID ──────────────────────────────────────────
export async function fetchTourById(id) {
    const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

// ─── SEARCH TOURS BY TITLE ────────────────────────────────────────────
export async function searchTours(query) {
    const { data, error } = await supabase
        .from('tours')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// ─── CREATE NEW TOUR ──────────────────────────────────────────────────
export async function createTour(tourData) {
    const { data, error } = await supabase
        .from('tours')
        .insert([tourData])
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ─── UPDATE TOUR ──────────────────────────────────────────────────────
export async function updateTour(id, tourData) {
    const { data, error } = await supabase
        .from('tours')
        .update(tourData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ─── DELETE TOUR ──────────────────────────────────────────────────────
export async function deleteTour(id) {
    const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}

// ─── UPLOAD IMAGE TO SUPABASE STORAGE ─────────────────────────────────
export async function uploadTourImage(file, folder = 'tours') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) throw error;

    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

// ─── DELETE IMAGE FROM SUPABASE STORAGE ───────────────────────────────
export async function deleteTourImage(imageUrl) {
    if (!imageUrl || !imageUrl.includes(BUCKET_NAME)) return;

    try {
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split(`${BUCKET_NAME}/`);
        if (pathParts.length < 2) return;

        const filePath = pathParts[1];
        await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    } catch (err) {
        console.warn('Failed to delete image from storage:', err);
    }
}

// ─── HELPER: Check if URL is a full URL or local path ─────────────────
export function getTourImageSrc(imagePath) {
    if (!imagePath) return '/assets/img/tour/tour_inner_1.jpg';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    return `/assets/img/tour/${imagePath}`;
}
