import { supabase } from '../supabaseClient';

const BUCKET_NAME = 'destination-images';

const CACHE_KEY = 'fremor_destinations_cache';

export function processDestinationsWithTiers(destinationsList, packageType) {
    if (!packageType) return destinationsList;
    const ptLower = packageType.toLowerCase();
    
    const results = [];
    for (const d of destinationsList) {
        const matchingTierKey = d.tier_pricing ? Object.keys(d.tier_pricing).find(k => k.toLowerCase() === ptLower) : null;
        
        if (matchingTierKey) {
            const tierInfo = d.tier_pricing[matchingTierKey];
            if (tierInfo && parseFloat(tierInfo.price) > 0) {
                results.push({
                    ...d,
                    price: parseFloat(tierInfo.price),
                    original_price: parseFloat(tierInfo.original_price) || 0,
                    package_type: matchingTierKey,
                    accommodation_type: tierInfo.accommodation_type || d.accommodation_type,
                    inclusions_details: {
                        ...(d.inclusions_details || {}),
                        ...(tierInfo.inclusions_details || {})
                    },
                    selected_tier: matchingTierKey
                });
            }
        } else if (d.package_type && d.package_type.toLowerCase() === ptLower) {
            results.push(d);
        }
    }
    return results;
}

// ─── FETCH ALL DESTINATIONS ───────────────────────────────────────────
export async function fetchDestinations(category = null, packageType = null, bypassCache = true) {
    let allDestinations = null;
    if (!bypassCache) {
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                allDestinations = JSON.parse(cached);
            }
        } catch (e) {
            console.warn('Error reading from sessionStorage:', e);
        }
    }

    if (!allDestinations) {
        const { data, error } = await supabase
            .from('destinations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        allDestinations = data;
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(allDestinations));
        } catch (e) {
            console.warn('Error writing to sessionStorage:', e);
        }
    }

    let filtered = [...allDestinations];
    if (category) {
        filtered = filtered.filter(d => d.category && d.category.toLowerCase() === category.toLowerCase());
    }
    if (packageType) {
        filtered = processDestinationsWithTiers(filtered, packageType);
    }
    return filtered;
}

// ─── FETCH SINGLE DESTINATION BY ID ───────────────────────────────────
export async function fetchDestinationById(id) {
    const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

// ─── SEARCH DESTINATIONS BY MULTIPLE FIELDS ──────────────────────────
export async function searchDestinations(query) {
    const searchQuery = `%${query}%`;
    const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .or(`title.ilike.${searchQuery},location.ilike.${searchQuery},continent.ilike.${searchQuery},category.ilike.${searchQuery},package_type.ilike.${searchQuery}`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// ─── CREATE NEW DESTINATION ───────────────────────────────────────────
export async function createDestination(destinationData) {
    const { data, error } = await supabase
        .from('destinations')
        .insert([destinationData])
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

// ─── UPDATE DESTINATION ───────────────────────────────────────────────
export async function updateDestination(id, destinationData) {
    const { data, error } = await supabase
        .from('destinations')
        .update(destinationData)
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

// ─── DELETE DESTINATION ───────────────────────────────────────────────
export async function deleteDestination(id) {
    const { error } = await supabase
        .from('destinations')
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
export async function uploadImage(file, folder = 'tour') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
            cacheControl: '31536000, public, immutable',
            upsert: false,
        });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

// ─── DELETE IMAGE FROM SUPABASE STORAGE ───────────────────────────────
export async function deleteImage(imageUrl) {
    if (!imageUrl || !imageUrl.includes(BUCKET_NAME)) return;

    try {
        // Extract path from the full URL
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split(`${BUCKET_NAME}/`);
        if (pathParts.length < 2) return;

        const filePath = pathParts[1];
        await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    } catch (err) {
        console.warn('Failed to delete image from storage:', err);
    }
}

// ─── UPLOAD BROCHURE (PDF) TO SUPABASE STORAGE ────────────────────────
export async function uploadBrochure(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `brochures/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

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

// ─── DELETE BROCHURE FROM SUPABASE STORAGE ────────────────────────────
export async function deleteBrochure(brochureUrl) {
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

// ─── HELPER: Check if URL is a full URL or local path ─────────────────
export function getImageSrc(imagePath) {
    if (!imagePath) return '/assets/img/tour/tour_3_1.jpg';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    return `/assets/img/tour/${imagePath}`;
}

export function getBannerSrc(bannerPath) {
    if (!bannerPath) return '/assets/img/destination/destination-details.jpg';
    if (bannerPath.startsWith('http://') || bannerPath.startsWith('https://')) {
        return bannerPath;
    }
    return `/assets/img/destination/${bannerPath}`;
}

// ─── TOUR PACKAGE ENQUIRIES CRUD ──────────────────────────────────────
export async function fetchPackageEnquiries() {
    const { data, error } = await supabase
        .from('package_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function updatePackageEnquiryStatus(id, status) {
    const { data, error } = await supabase
        .from('package_enquiries')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deletePackageEnquiry(id) {
    const { error } = await supabase
        .from('package_enquiries')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}

