import { supabase } from '../supabaseClient';

const BUCKET_NAME = 'testimonials';

const CACHE_KEY_ACTIVE = 'fremor_testimonials_active_cache';
const CACHE_KEY_ALL = 'fremor_testimonials_all_cache';

// ─── FETCH ACTIVE TESTIMONIALS (For Frontend) ─────────────────────────
export async function fetchTestimonials() {
    let activeTestimonials = null;
    try {
        const cached = sessionStorage.getItem(CACHE_KEY_ACTIVE);
        if (cached) {
            activeTestimonials = JSON.parse(cached);
        }
    } catch (e) {
        console.warn('Error reading from sessionStorage:', e);
    }

    if (!activeTestimonials) {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) throw error;
        activeTestimonials = data;
        try {
            sessionStorage.setItem(CACHE_KEY_ACTIVE, JSON.stringify(activeTestimonials));
        } catch (e) {
            console.warn('Error writing to sessionStorage:', e);
        }
    }
    return activeTestimonials;
}

// ─── FETCH ALL TESTIMONIALS (For Admin Panel) ─────────────────────────
export async function fetchAllTestimonials() {
    let allTestimonials = null;
    try {
        const cached = sessionStorage.getItem(CACHE_KEY_ALL);
        if (cached) {
            allTestimonials = JSON.parse(cached);
        }
    } catch (e) {
        console.warn('Error reading from sessionStorage:', e);
    }

    if (!allTestimonials) {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) throw error;
        allTestimonials = data;
        try {
            sessionStorage.setItem(CACHE_KEY_ALL, JSON.stringify(allTestimonials));
        } catch (e) {
            console.warn('Error writing to sessionStorage:', e);
        }
    }
    return allTestimonials;
}

// ─── CREATE NEW TESTIMONIAL ───────────────────────────────────────────
export async function createTestimonial(testimonialData) {
    const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonialData])
        .select()
        .single();

    if (error) {
        console.error('Testimonial Insert Error:', error);
        throw error;
    }
    clearTestimonialCache();
    return data;
}

// ─── UPDATE TESTIMONIAL ───────────────────────────────────────────────
export async function updateTestimonial(id, testimonialData) {
    const { data, error } = await supabase
        .from('testimonials')
        .update(testimonialData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    clearTestimonialCache();
    return data;
}

// ─── DELETE TESTIMONIAL ───────────────────────────────────────────────
export async function deleteTestimonial(id) {
    const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

    if (error) throw error;
    clearTestimonialCache();
    return true;
}

// ─── TOGGLE ACTIVE STATUS ─────────────────────────────────────────────
export async function toggleTestimonialActive(id, isActive) {
    const { data, error } = await supabase
        .from('testimonials')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    clearTestimonialCache();
    return data;
}

function clearTestimonialCache() {
    try {
        sessionStorage.removeItem(CACHE_KEY_ACTIVE);
        sessionStorage.removeItem(CACHE_KEY_ALL);
    } catch (e) {
        console.warn('Error clearing sessionStorage:', e);
    }
}

// ─── UPLOAD IMAGE TO SUPABASE STORAGE ─────────────────────────────────
export async function uploadTestimonialImage(file) {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `testimonial_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
            cacheControl: '31536000, public, immutable',
            upsert: false,
        });

    if (error) {
        console.error('Testimonial Upload Error:', error);
        throw error;
    }

    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

// ─── DELETE IMAGE FROM SUPABASE STORAGE ───────────────────────────────
export async function deleteTestimonialImage(imageUrl) {
    if (!imageUrl || !imageUrl.includes(BUCKET_NAME)) return;

    try {
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split(`${BUCKET_NAME}/`);
        if (pathParts.length < 2) return;

        const filePath = pathParts[1];
        await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    } catch (err) {
        console.warn('Failed to delete testimonial image from storage:', err);
    }
}

// ─── HELPER: Get image source URL ─────────────────────────────────────
export function getTestimonialImageSrc(imagePath) {
    if (!imagePath) return '/assets/img/testimonial/testi_1_1.jpg'; // fallback
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    return `/assets/img/testimonial/${imagePath}`;
}
