import { supabase } from '../supabaseClient';

const BUCKET_NAME = 'blogs-images';

const CACHE_KEY = 'fremor_blogs_cache';

// ─── FETCH ALL BLOGS ───────────────────────────────────────────
export async function fetchBlogs() {
    let allBlogs = null;
    try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            allBlogs = JSON.parse(cached);
        }
    } catch (e) {
        console.warn('Error reading from sessionStorage:', e);
    }

    if (!allBlogs) {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        allBlogs = data;
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(allBlogs));
        } catch (e) {
            console.warn('Error writing to sessionStorage:', e);
        }
    }
    return allBlogs;
}

// ─── FETCH SINGLE BLOG BY ID ───────────────────────────────────
export async function fetchBlogById(id) {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

// ─── FETCH POPULAR BLOGS (BYPASS CACHE) ────────────────────────
export async function fetchPopularBlogs() {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_popular_story', true)
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) throw error;
    return data;
}


// ─── SEARCH BLOGS BY TITLE ─────────────────────────────────────
export async function searchBlogs(query) {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

// ─── CREATE NEW BLOG ───────────────────────────────────────────
export async function createBlog(blogData) {
    const { data, error } = await supabase
        .from('blogs')
        .insert([blogData])
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

// ─── UPDATE BLOG ───────────────────────────────────────────────
export async function updateBlog(id, blogData) {
    const { data, error } = await supabase
        .from('blogs')
        .update(blogData)
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

// ─── DELETE BLOG ───────────────────────────────────────────────
export async function deleteBlog(id) {
    const { error } = await supabase
        .from('blogs')
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
export async function uploadBlogImage(file, folder = 'blogs') {
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
export async function deleteBlogImage(imageUrl) {
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
export function getBlogImageSrc(imagePath) {
    if (!imagePath) return '/assets/img/blog/blog-s-1-2.jpg'; // default placeholder if none
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    return `/assets/img/blog/${imagePath}`;
}
