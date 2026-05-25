import { supabase } from '../supabaseClient';

const BUCKET_NAME = 'destination-images'; // Reusing the existing bucket for convenience

export async function fetchVisas() {
    const { data, error } = await supabase
        .from('visas')
        .select('*')
        .order('country_name', { ascending: true });

    if (error) throw error;
    return data;
}

export async function fetchFeaturedVisas() {
    const { data, error } = await supabase
        .from('visas')
        .select('*')
        .eq('is_featured', true)
        .order('country_name', { ascending: true });

    if (error) throw error;
    return data;
}

export async function fetchVisaByCountryName(countryName) {
    const { data, error } = await supabase
        .from('visas')
        .select('*')
        .ilike('country_name', countryName)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function fetchVisaById(id) {
    const { data, error } = await supabase
        .from('visas')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function createVisa(visaData) {
    const { data, error } = await supabase
        .from('visas')
        .insert([visaData])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateVisa(id, visaData) {
    const { data, error } = await supabase
        .from('visas')
        .update(visaData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteVisa(id) {
    const { error } = await supabase
        .from('visas')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}

// Storage helpers
export async function uploadImage(file, folder = 'visa') {
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

export async function deleteImage(imageUrl) {
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

export function getImageSrc(imagePath) {
    if (!imagePath) return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=350&fit=crop';
    return imagePath;
}

// Deadline calculation utility
export function calculateVisaDeadline(daysMax, type, baseDate = new Date()) {
  if (!daysMax || daysMax === 0 || type === 'interview') {
    return 'interview-based wait times';
  }
  
  const resultDate = new Date(baseDate);
  if (type === 'working_days') {
    let addedDays = 0;
    while (addedDays < daysMax) {
      resultDate.setDate(resultDate.getDate() + 1);
      const dayOfWeek = resultDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
        addedDays++;
      }
    }
  } else {
    // calendar_days, hours
    resultDate.setDate(resultDate.getDate() + daysMax);
  }
  
  return resultDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  }); // e.g. "08 Jun"
}

// ─── VISA ENQUIRIES CRUD ──────────────────────────────────────────────
export async function createVisaEnquiry(enquiryData) {
    const { data, error } = await supabase
        .from('visa_enquiries')
        .insert([enquiryData])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function fetchVisaEnquiries() {
    const { data, error } = await supabase
        .from('visa_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function updateVisaEnquiryStatus(id, status) {
    const { data, error } = await supabase
        .from('visa_enquiries')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteVisaEnquiry(id) {
    const { error } = await supabase
        .from('visa_enquiries')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}

