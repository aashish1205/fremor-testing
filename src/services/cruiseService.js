import { supabase } from '../supabaseClient';

const BUCKET_NAME = 'cruises-images';

const CACHE_KEY = 'fremor_cruises_cache';

// ─── FETCH ALL CRUISES ───────────────────────────────────────────
export async function fetchCruises() {
    let allCruises = null;
    try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            allCruises = JSON.parse(cached);
        }
    } catch (e) {
        console.warn('Error reading from sessionStorage:', e);
    }

    if (!allCruises) {
        const { data, error } = await supabase
            .from('cruises')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        allCruises = data;
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(allCruises));
        } catch (e) {
            console.warn('Error writing to sessionStorage:', e);
        }
    }
    return allCruises;
}

// ─── FETCH SINGLE CRUISE BY ID ───────────────────────────────────
export async function fetchCruiseById(id) {
    const { data, error } = await supabase
        .from('cruises')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

// ─── SEARCH CRUISES BY TITLE ─────────────────────────────────────
export async function searchCruises(query) {
    const { data, error } = await supabase
        .from('cruises')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// ─── CREATE NEW CRUISE ───────────────────────────────────────────
export async function createCruise(cruiseData) {
    const { data, error } = await supabase
        .from('cruises')
        .insert([cruiseData])
        .select()
        .single();

    if (error) {
        console.error('Table Insert Error:', error);
        throw error;
    }
    try {
        sessionStorage.removeItem(CACHE_KEY);
    } catch (e) {
        console.warn('Error clearing sessionStorage cache:', e);
    }
    return data;
}

// ─── UPDATE CRUISE ───────────────────────────────────────────────
export async function updateCruise(id, cruiseData) {
    const { data, error } = await supabase
        .from('cruises')
        .update(cruiseData)
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

// ─── DELETE CRUISE ───────────────────────────────────────────────
export async function deleteCruise(id) {
    const { error } = await supabase
        .from('cruises')
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
export async function uploadCruiseImage(file, folder = 'cruises') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
            cacheControl: '31536000, public, immutable',
            upsert: false,
        });

    if (error) {
        console.error('Storage Upload Error:', error);
        throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

// ─── DELETE IMAGE FROM SUPABASE STORAGE ───────────────────────────────
export async function deleteCruiseImage(imageUrl) {
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
export function getCruiseImageSrc(imagePath) {
    if (!imagePath) return '/assets/img/cruises/AQUAVITAboat1.jpg'; // default placeholder if none
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    return `/assets/img/cruises/${imagePath}`;
}

// ─── UPLOAD BROCHURE (PDF) TO SUPABASE STORAGE ────────────────────────
export async function uploadCruiseBrochure(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `brochures/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
            cacheControl: '31536000, public, immutable',
            upsert: false,
        });

    if (error) {
        console.error('Brochure Upload Error:', error);
        throw error;
    }

    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

// ─── DELETE BROCHURE FROM SUPABASE STORAGE ────────────────────────────
export async function deleteCruiseBrochure(brochureUrl) {
    if (!brochureUrl || !brochureUrl.includes(BUCKET_NAME)) return;

    try {
        const url = new URL(brochureUrl);
        const pathParts = url.pathname.split(`${BUCKET_NAME}/`);
        if (pathParts.length < 2) return;

        const filePath = pathParts[1];
        await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    } catch (err) {
        console.warn('Failed to delete brochure from storage:', err);
    }
}
