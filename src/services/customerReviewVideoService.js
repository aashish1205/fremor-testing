import { supabase } from '../supabaseClient';

// Fetch all video reviews (with sessionStorage caching to reduce DB reads)
export const fetchCustomerVideoReviews = async (forceRefresh = false, isAdmin = false) => {
    try {
        if (!forceRefresh) {
            const cachedData = localStorage.getItem('fremor_video_reviews');
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                return isAdmin ? parsed : parsed.filter(item => item.is_active !== false);
            }
        }

        let query = supabase
            .from('customer_video_reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (!isAdmin) {
            query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) throw error;
        
        // Save to cache if loaded as admin so we have all data cached
        if (isAdmin) {
            localStorage.setItem('fremor_video_reviews', JSON.stringify(data));
        }
        return data;
    } catch (error) {
        console.error('Error fetching customer video reviews:', error);
        return [];
    }
};

// Add a new video review
export const addCustomerVideoReview = async (reviewData) => {
    try {
        const { data, error } = await supabase
            .from('customer_video_reviews')
            .insert([reviewData])
            .select();

        if (error) throw error;
        
        // Clear cache on new write
        localStorage.removeItem('fremor_video_reviews');
        return { success: true, data };
    } catch (error) {
        console.error('Error adding customer video review:', error);
        return { success: false, error: error.message };
    }
};

// Update an existing video review
export const updateCustomerVideoReview = async (id, reviewData) => {
    try {
        const { data, error } = await supabase
            .from('customer_video_reviews')
            .update(reviewData)
            .eq('id', id)
            .select();

        if (error) throw error;

        // Clear cache on update
        localStorage.removeItem('fremor_video_reviews');
        return { success: true, data };
    } catch (error) {
        console.error('Error updating customer video review:', error);
        return { success: false, error: error.message };
    }
};

// Delete a video review
export const deleteCustomerVideoReview = async (id, videoUrl) => {
    try {
        // 1. Extract file path from URL if it's from our storage bucket
        if (videoUrl && videoUrl.includes('customer_videos')) {
            const urlParts = videoUrl.split('/customer_videos/');
            if (urlParts.length > 1) {
                const filePath = urlParts[1];
                // Try to delete from storage
                const { error: storageError } = await supabase.storage
                    .from('customer_videos')
                    .remove([filePath]);
                if (storageError) {
                    console.warn('Failed to delete file from storage, but continuing with DB deletion', storageError);
                }
            }
        }

        // 2. Delete from database
        const { error } = await supabase
            .from('customer_video_reviews')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        // Clear cache
        localStorage.removeItem('fremor_video_reviews');
        return { success: true };
    } catch (error) {
        console.error('Error deleting customer video review:', error);
        return { success: false, error: error.message };
    }
};

// Upload video to storage
export const uploadCustomerVideo = async (file) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('customer_videos')
            .upload(filePath, file, {
                cacheControl: '31536000, public, immutable',
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('customer_videos')
            .getPublicUrl(filePath);

        return { success: true, url: data.publicUrl };
    } catch (error) {
        console.error('Error uploading video:', error);
        return { success: false, error: error.message };
    }
};

// Toggle active status
export const toggleCustomerVideoReviewActive = async (id, isActive) => {
    try {
        const { data, error } = await supabase
            .from('customer_video_reviews')
            .update({ is_active: isActive })
            .eq('id', id)
            .select();

        if (error) throw error;
        localStorage.removeItem('fremor_video_reviews');
        return { success: true, data };
    } catch (error) {
        console.error('Error toggling customer video review active status:', error);
        return { success: false, error: error.message };
    }
};
