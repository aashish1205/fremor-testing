import { supabase } from '../supabaseClient';

const BUCKET_NAME = 'destinationdetails_images';

const CACHE_KEY = 'fremor_tours_cache';

// ─── FETCH ALL TOURS ──────────────────────────────────────────────────
export async function fetchTours() {
    let allTours = null;
    try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            allTours = JSON.parse(cached);
        }
    } catch (e) {
        console.warn('Error reading from sessionStorage:', e);
    }

    if (!allTours) {
        const { data, error } = await supabase
            .from('tours')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        allTours = data;
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(allTours));
        } catch (e) {
            console.warn('Error writing to sessionStorage:', e);
        }
    }
    return allTours;
}

// ─── FETCH SINGLE TOUR BY ID ──────────────────────────────────────────
export async function fetchTourById(id) {
    const tours = await fetchTours();
    return tours.find(t => String(t.id) === String(id)) || null;
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
    try {
        sessionStorage.removeItem(CACHE_KEY);
    } catch (e) {
        console.warn('Error clearing sessionStorage cache:', e);
    }
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
    try {
        sessionStorage.removeItem(CACHE_KEY);
    } catch (e) {
        console.warn('Error clearing sessionStorage cache:', e);
    }
    return data;
}

// ─── DELETE TOUR ──────────────────────────────────────────────────────
export async function deleteTour(id) {
    const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', id);

    if (error) throw error;
    try {
        sessionStorage.removeItem(CACHE_KEY);
    } catch (e) {
        console.warn('Error clearing sessionStorage cache:', e);
    }
    return true;
}

// ─── UPLOAD IMAGE TO SUPABASE STORAGE ─────────────────────────────────
export async function uploadTourImage(file, folder = 'tours') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
            cacheControl: '31536000, public, immutable',
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
