import { supabase } from '../supabaseClient';

const CACHE_KEY = 'fremor_wishlist_cache';

// Add a destination to the user's wishlist
export async function addToWishlist(userId, destinationId) {
    const { data, error } = await supabase
        .from('wishlists')
        .insert([{ user_id: userId, destination_id: destinationId }])
        .select()
        .single();

    if (error) throw error;

    try {
        sessionStorage.removeItem(`${CACHE_KEY}_${userId}`);
    } catch (e) {
        console.warn('Error clearing wishlist cache:', e);
    }
    return data;
}

// Remove a destination from the user's wishlist
export async function removeFromWishlist(userId, destinationId) {
    const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('destination_id', destinationId);

    if (error) throw error;

    try {
        sessionStorage.removeItem(`${CACHE_KEY}_${userId}`);
    } catch (e) {
        console.warn('Error clearing wishlist cache:', e);
    }
    return true;
}

// Check if a specific destination is in the user's wishlist
export async function checkIfWishlisted(userId, destinationId) {
    if (!userId || !destinationId) return false;
    try {
        const wishlist = await getUserWishlist(userId);
        return wishlist.some(item => item.destinations && String(item.destinations.id) === String(destinationId));
    } catch (e) {
        console.error('Error checking wishlist status from cache, falling back to DB:', e);
        const { data, error } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', userId)
            .eq('destination_id', destinationId)
            .maybeSingle();

        if (error) {
            console.error('Error checking wishlist status:', error);
            return false;
        }
        return !!data;
    }
}

// Get all wishlisted tour packages for a specific user
export async function getUserWishlist(userId) {
    if (!userId) return [];
    
    let cached = null;
    try {
        const data = sessionStorage.getItem(`${CACHE_KEY}_${userId}`);
        if (data) {
            cached = JSON.parse(data);
        }
    } catch (e) {
        console.warn('Error reading wishlist cache:', e);
    }
    
    if (cached) {
        return cached;
    }

    const { data, error } = await supabase
        .from('wishlists')
        .select(`
            id,
            created_at,
            destinations (
                id,
                title,
                image,
                price,
                nights,
                days,
                category
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    const wishlistData = data || [];
    try {
        sessionStorage.setItem(`${CACHE_KEY}_${userId}`, JSON.stringify(wishlistData));
    } catch (e) {
        console.warn('Error writing wishlist cache:', e);
    }
    return wishlistData;
}
