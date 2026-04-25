import { supabase } from '../supabaseClient';

const BUCKET_NAME = 'testimonials';

// ─── FETCH ACTIVE TESTIMONIALS (For Frontend) ─────────────────────────
export async function fetchTestimonials() {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// ─── FETCH ALL TESTIMONIALS (For Admin Panel) ─────────────────────────
export async function fetchAllTestimonials() {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
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
    return data;
}

// ─── DELETE TESTIMONIAL ───────────────────────────────────────────────
export async function deleteTestimonial(id) {
    const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

    if (error) throw error;
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
    return data;
}

// ─── UPLOAD IMAGE TO SUPABASE STORAGE ─────────────────────────────────
export async function uploadTestimonialImage(file) {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `testimonial_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
            cacheControl: '3600',
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
