import { supabase } from '../supabaseClient';

const BUCKET_NAME = 'instagram-gallery';

// ─── FETCH ALL GALLERY IMAGES (active only, ordered) ──────────────────
export async function fetchGalleryImages() {
    const { data, error } = await supabase
        .from('instagram_gallery')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
}

// ─── FETCH ALL GALLERY IMAGES (admin — includes inactive) ─────────────
export async function fetchAllGalleryImages() {
    const { data, error } = await supabase
        .from('instagram_gallery')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
}

// ─── CREATE NEW GALLERY IMAGE ─────────────────────────────────────────
export async function createGalleryImage(imageData) {
    const { data, error } = await supabase
        .from('instagram_gallery')
        .insert([imageData])
        .select()
        .single();

    if (error) {
        console.error('Gallery Insert Error:', error);
        throw error;
    }
    return data;
}

// ─── UPDATE GALLERY IMAGE ─────────────────────────────────────────────
export async function updateGalleryImage(id, imageData) {
    const { data, error } = await supabase
        .from('instagram_gallery')
        .update(imageData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ─── DELETE GALLERY IMAGE ─────────────────────────────────────────────
export async function deleteGalleryImage(id) {
    const { error } = await supabase
        .from('instagram_gallery')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}

// ─── TOGGLE ACTIVE STATUS ─────────────────────────────────────────────
export async function toggleGalleryImageActive(id, isActive) {
    const { data, error } = await supabase
        .from('instagram_gallery')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ─── UPDATE DISPLAY ORDER ─────────────────────────────────────────────
export async function updateDisplayOrder(id, newOrder) {
    const { data, error } = await supabase
        .from('instagram_gallery')
        .update({ display_order: newOrder })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ─── UPLOAD IMAGE TO SUPABASE STORAGE ─────────────────────────────────
export async function uploadGalleryFile(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `gallery/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('Gallery Upload Error:', error);
        throw error;
    }

    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

// ─── DELETE IMAGE FROM SUPABASE STORAGE ───────────────────────────────
export async function deleteGalleryFile(imageUrl) {
    if (!imageUrl || !imageUrl.includes(BUCKET_NAME)) return;

    try {
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split(`${BUCKET_NAME}/`);
        if (pathParts.length < 2) return;

        const filePath = pathParts[1];
        await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    } catch (err) {
        console.warn('Failed to delete gallery image from storage:', err);
    }
}

// ─── HELPER: Get image source URL ─────────────────────────────────────
export function getGalleryImageSrc(imagePath) {
    if (!imagePath) return '/assets/img/gallery/gallery_4_1.jpg';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    return `/assets/img/gallery/${imagePath}`;
}
