import React, { useState, useEffect } from 'react';
import { 
    fetchDestinations, 
    createDestination, 
    updateDestination, 
    deleteDestination, 
    uploadImage, 
    deleteImage, 
    uploadBrochure,
    deleteBrochure,
    getImageSrc,
    getBannerSrc
} from '../../services/destinationService';
import { useDataTable } from '../../hooks/useDataTable';
import { useAdminSearch } from '../AdminSearchContext';
import AdminPagination from '../Admin/AdminPagination';
import { supabase } from '../../supabaseClient';
import './AdminStyles.css';

function DestinationAdminPanel() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Recently Booked Section Settings states
    const [activeTab, setActiveTab] = useState('packages'); // 'packages' or 'recentlyBooked'
    const [sectionHeading, setSectionHeading] = useState('Recently Booked Itineraries');
    const [sectionBadge, setSectionBadge] = useState('143+ trips booked last week');
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [togglePackages, setTogglePackages] = useState([]);
    const [toggleSearchQuery, setToggleSearchQuery] = useState('');
    const [isSavingToggles, setIsSavingToggles] = useState(false);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    
    // Complex Form states for rich destinations
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        price: '',
        price_unit: 'Person',
        duration: '7 Days',
        location: '',
        rating: 4.8,
        rating_count: 0,
        original_price: '',
        badge_text: 'Recommended',
        is_recommended: false,
        loyalty_points: 0,
        inclusions: { hotel: true, sightseeing: true, meals: true, manager: true, flights: false, transfers: false, trains: false, cruises: false, activities: false, visa: false, insurance: false },
        inclusions_details: { hotel: '', meals: '', sightseeing: '', transfers: '', manager: '', flights: '', highlights: '', trains: '', cruises: '', activities: '', visa: '', insurance: '' },
        itinerary_summary: '',
        itinerary_route: '',
        tour_type: 'Group Tour',
        terms_conditions: '',
        image: '',
        banner_image: '',
        gallery_images: [],
        description_1: '',
        description_2: '',
        highlights_text: '',
        highlights_list: [''], // Array of strings (Legacy)
        rich_highlights: [{ title: '', description: '' }], // Array of objects
        basic_info_text: '',
        included_list: [''], // Array of strings
        excluded_list: [''], // Array of strings
        itinerary: [{ day: "Day 01", title: '', description: '', image: '', inclusions: [], location_name: '', latitude: '', longitude: '' }], // Array of objects
        brochure_url: '',
        category: 'Inbound',
        package_type: 'Standard',
        accommodation_type: '3 Star',
        nights: 0,
        days: 0,
        show_recently_booked: false,
        recent_booking_text: '',
        recent_booking_tag: '',
        continent: '',
        tier_pricing: {
            Standard: { price: '', original_price: '', accommodation_type: '3 Star', inclusions_details: { hotel: '' } },
            Premium: { price: '', original_price: '', accommodation_type: '4 Star', inclusions_details: { hotel: '' } },
            Luxury: { price: '', original_price: '', accommodation_type: '5 Star', inclusions_details: { hotel: '' } }
        }
    });

    
    const [primaryImageFile, setPrimaryImageFile] = useState(null);
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [galleryImageFiles, setGalleryImageFiles] = useState([]);
    const [originalImages, setOriginalImages] = useState({ image: '', banner_image: '', gallery_images: [], itinerary_images: [] });

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const { globalSearchTerm, setGlobalSearchTerm } = useAdminSearch();

    // Filter state for accommodation type
    const [filterAccommodation, setFilterAccommodation] = useState('All');

    // DataTable hook
    const { 
        searchTerm, 
        handleSearch, 
        currentPage, 
        setCurrentPage, 
        totalPages, 
        paginatedData,
        totalItems
    } = useDataTable(
        destinations.filter(d => filterAccommodation === 'All' || (d.accommodation_type || '3 Star') === filterAccommodation), 
        ['title', 'location', 'price'], 
        10, 
        globalSearchTerm, 
        setGlobalSearchTerm
    );

    useEffect(() => {
        loadDestinations();
        loadSectionSettings();
    }, []);

    const loadSectionSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('recently_booked_settings')
                .select('*')
                .eq('id', 1)
                .maybeSingle();
            if (data && !error) {
                setSectionHeading(data.heading || 'Recently Booked Itineraries');
                setSectionBadge(data.badge_text || '143+ trips booked last week');
            }
        } catch (err) {
            console.warn('Could not load recently booked settings', err);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const loadDestinations = async () => {
        try {
            setLoading(true);
            const data = await fetchDestinations();
            setDestinations(data);

            // Populate toggles array
            setTogglePackages(data.map(d => ({
                id: d.id,
                title: d.title,
                image: d.image,
                show_recently_booked: !!d.show_recently_booked,
                recent_booking_text: d.recent_booking_text || '',
                recent_booking_tag: d.recent_booking_tag || ''
            })));
        } catch (err) {
            console.error('Failed to load destinations', err);
            setError('Failed to load destinations');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSectionSettings = async (e) => {
        e.preventDefault();
        try {
            setIsSavingSettings(true);
            const { error } = await supabase
                .from('recently_booked_settings')
                .upsert({
                    id: 1,
                    heading: sectionHeading,
                    badge_text: sectionBadge
                });
            if (error) throw error;
            showToast('Homepage section settings saved successfully!');
        } catch (err) {
            console.error('Failed to save settings', err);
            showToast('Failed to save settings: ' + (err.message || err.details), 'error');
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleSaveToggles = async () => {
        try {
            setIsSavingToggles(true);

            // Find which packages have different values compared to the destinations state
            const updates = [];
            for (let toggle of togglePackages) {
                const original = destinations.find(d => d.id === toggle.id);
                if (original) {
                    const isChanged = 
                        !!original.show_recently_booked !== !!toggle.show_recently_booked ||
                        (original.recent_booking_text || '') !== toggle.recent_booking_text ||
                        (original.recent_booking_tag || '') !== toggle.recent_booking_tag;
                    
                    if (isChanged) {
                        updates.push(supabase
                            .from('destinations')
                            .update({
                                show_recently_booked: toggle.show_recently_booked,
                                recent_booking_text: toggle.recent_booking_text,
                                recent_booking_tag: toggle.recent_booking_tag
                            })
                            .eq('id', toggle.id)
                        );
                    }
                }
            }

            if (updates.length > 0) {
                const results = await Promise.all(updates);
                const errors = results.filter(r => r.error).map(r => r.error);
                if (errors.length > 0) {
                    throw new Error(errors[0].message || 'Some updates failed');
                }
                showToast(`Successfully updated ${updates.length} packages!`);
                await loadDestinations(); // Reload destinations to sync original state
            } else {
                showToast('No package settings were changed.');
            }
        } catch (err) {
            console.error('Failed to save package toggles', err);
            showToast('Failed to save changes: ' + err.message, 'error');
        } finally {
            setIsSavingToggles(false);
        }
    };

    const handleOpenModal = (mode = 'add', dest = null) => {
        setModalMode(mode);
        if (mode === 'edit' && dest) {
            const gallery = dest.gallery_images || [];
            const itin = dest.itinerary || [];
            const itinImages = itin.map(item => item.image).filter(Boolean);
            setOriginalImages({
                image: dest.image || '',
                banner_image: dest.banner_image || '',
                gallery_images: [...gallery],
                itinerary_images: [...itinImages]
            });
            setFormData({
                id: dest.id,
                title: dest.title || '',
                price: dest.price || '',
                price_unit: dest.price_unit || 'Person',
                duration: dest.duration || '7 Days',
                location: dest.location || '',
                rating: dest.rating || 4.8,
                rating_count: dest.rating_count || 0,
                original_price: dest.original_price || '',
                badge_text: dest.badge_text || 'Recommended',
                is_recommended: dest.is_recommended || false,
                loyalty_points: dest.loyalty_points || 0,
                inclusions: dest.inclusions || { hotel: true, sightseeing: true, meals: true, manager: true, flights: false, transfers: false, trains: false, cruises: false, activities: false, visa: false, insurance: false },
                inclusions_details: dest.inclusions_details || { hotel: '', meals: '', sightseeing: '', transfers: '', manager: '', flights: '', highlights: '', trains: '', cruises: '', activities: '', visa: '', insurance: '' },
                itinerary_summary: dest.itinerary_summary || '',
                itinerary_route: dest.itinerary_route || '',
                tour_type: dest.tour_type || 'Group Tour',
                terms_conditions: dest.terms_conditions || '',
                image: dest.image || '',
                banner_image: dest.banner_image || '',
                gallery_images: dest.gallery_images || [],
                description_1: dest.description_1 || '',
                description_2: dest.description_2 || '',
                highlights_text: dest.highlights_text || '',
                highlights_list: dest.highlights_list || [''],
                rich_highlights: dest.rich_highlights || [{ title: '', description: '' }],
                basic_info_text: dest.basic_info_text || '',
                included_list: dest.included_list || [''],
                excluded_list: dest.excluded_list || [''],
                itinerary: dest.itinerary?.length ? dest.itinerary.map(item => ({
                    day: item.day || '',
                    title: item.title || '',
                    description: item.description || '',
                    image: item.image || '',
                    inclusions: item.inclusions || [],
                    location_name: item.location_name || '',
                    latitude: item.latitude || '',
                    longitude: item.longitude || ''
                })) : [{ day: "Day 01", title: '', description: '', image: '', inclusions: [], location_name: '', latitude: '', longitude: '' }],
                brochure_url: dest.brochure_url || '',
                category: dest.category || 'Inbound',
                package_type: dest.package_type || 'Standard',
                accommodation_type: dest.accommodation_type || '3 Star',
                nights: dest.nights || 0,
                days: dest.days || 0,
                show_recently_booked: dest.show_recently_booked || false,
                recent_booking_text: dest.recent_booking_text || '',
                recent_booking_tag: dest.recent_booking_tag || '',
                continent: dest.continent || '',
                tier_pricing: {
                    Standard: {
                        price: dest.tier_pricing?.Standard?.price || '',
                        original_price: dest.tier_pricing?.Standard?.original_price || '',
                        accommodation_type: dest.tier_pricing?.Standard?.accommodation_type || '3 Star',
                        inclusions_details: {
                            hotel: dest.tier_pricing?.Standard?.inclusions_details?.hotel || ''
                        }
                    },
                    Premium: {
                        price: dest.tier_pricing?.Premium?.price || '',
                        original_price: dest.tier_pricing?.Premium?.original_price || '',
                        accommodation_type: dest.tier_pricing?.Premium?.accommodation_type || '4 Star',
                        inclusions_details: {
                            hotel: dest.tier_pricing?.Premium?.inclusions_details?.hotel || ''
                        }
                    },
                    Luxury: {
                        price: dest.tier_pricing?.Luxury?.price || '',
                        original_price: dest.tier_pricing?.Luxury?.original_price || '',
                        accommodation_type: dest.tier_pricing?.Luxury?.accommodation_type || '5 Star',
                        inclusions_details: {
                            hotel: dest.tier_pricing?.Luxury?.inclusions_details?.hotel || ''
                        }
                    }
                }
            });
        } else {
            setOriginalImages({
                image: '',
                banner_image: '',
                gallery_images: [],
                itinerary_images: []
            });
            setFormData({
                id: null,
                title: '',
                price: '',
                price_unit: 'Person',
                duration: '7 Days',
                location: '',
                rating: 4.8,
                rating_count: 0,
                original_price: '',
                badge_text: 'Recommended',
                is_recommended: false,
                loyalty_points: 0,
                inclusions: { hotel: true, sightseeing: true, meals: true, manager: true, flights: false, transfers: false, trains: false, cruises: false, activities: false, visa: false, insurance: false },
                inclusions_details: { hotel: '', meals: '', sightseeing: '', transfers: '', manager: '', flights: '', highlights: '', trains: '', cruises: '', activities: '', visa: '', insurance: '' },
                itinerary_summary: '',
                itinerary_route: '',
                tour_type: 'Group Tour',
                terms_conditions: '',
                image: '',
                banner_image: '',
                gallery_images: [],
                description_1: '',
                description_2: '',
                highlights_text: '',
                highlights_list: [''],
                rich_highlights: [{ title: '', description: '' }],
                basic_info_text: '',
                included_list: [''],
                excluded_list: [''],
                itinerary: [{ day: "Day 01", title: '', description: '', image: '', inclusions: [], location_name: '', latitude: '', longitude: '' }],
                brochure_url: '',
                category: 'Inbound',
                package_type: 'Standard',
                accommodation_type: '3 Star',
                nights: 0,
                days: 0,
                show_recently_booked: false,
                recent_booking_text: '',
                recent_booking_tag: '',
                continent: '',
                tier_pricing: {
                    Standard: { price: '', original_price: '', accommodation_type: '3 Star', inclusions_details: { hotel: '' } },
                    Premium: { price: '', original_price: '', accommodation_type: '4 Star', inclusions_details: { hotel: '' } },
                    Luxury: { price: '', original_price: '', accommodation_type: '5 Star', inclusions_details: { hotel: '' } }
                }
            });
        }
        setPrimaryImageFile(null);
        setBannerImageFile(null);
        setGalleryImageFiles([]);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTierPricingChange = (tier, field, value) => {
        setFormData(prev => {
            const currentTier = prev.tier_pricing?.[tier] || { price: '', original_price: '', accommodation_type: '', inclusions_details: { hotel: '' } };
            let updatedTier;
            if (field === 'hotel') {
                updatedTier = {
                    ...currentTier,
                    inclusions_details: {
                        ...(currentTier.inclusions_details || {}),
                        hotel: value
                    }
                };
            } else {
                updatedTier = {
                    ...currentTier,
                    [field]: value
                };
            }
            return {
                ...prev,
                tier_pricing: {
                    ...(prev.tier_pricing || {}),
                    [tier]: updatedTier
                }
            };
        });
    };

    // Generic Array Handlers
    const handleArrayItemChange = (listName, index, value) => {
        const newList = [...formData[listName]];
        newList[index] = value;
        setFormData(prev => ({ ...prev, [listName]: newList }));
    };

    const addArrayItem = (listName) => {
        setFormData(prev => ({ ...prev, [listName]: [...prev[listName], ''] }));
    };

    const removeArrayItem = (listName, index) => {
        const newList = [...formData[listName]];
        newList.splice(index, 1);
        if (newList.length === 0) newList.push('');
        setFormData(prev => ({ ...prev, [listName]: newList }));
    };

    // Rich Highlights Handlers
    const handleHighlightChange = (index, field, value) => {
        const newHighlights = [...formData.rich_highlights];
        newHighlights[index][field] = value;
        setFormData(prev => ({ ...prev, rich_highlights: newHighlights }));
    };

    const addHighlight = () => {
        setFormData(prev => ({ 
            ...prev, 
            rich_highlights: [...prev.rich_highlights, { title: '', description: '' }]  
        }));
    };

    const removeHighlight = (index) => {
        const newHighlights = [...formData.rich_highlights];
        newHighlights.splice(index, 1);
        if (newHighlights.length === 0) newHighlights.push({ title: '', description: '' });
        setFormData(prev => ({ ...prev, rich_highlights: newHighlights }));
    };

    // Itinerary Handlers
    const handleItineraryDayChange = (dayIndex, field, value) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[dayIndex][field] = value;
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const toggleItineraryInclusion = (dayIndex, incKey) => {
        const newItinerary = [...formData.itinerary];
        const day = newItinerary[dayIndex];
        if (!day.inclusions) {
            day.inclusions = [];
        }
        if (day.inclusions.includes(incKey)) {
            day.inclusions = day.inclusions.filter(item => item !== incKey);
        } else {
            day.inclusions = [...day.inclusions, incKey];
        }
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const addItineraryDay = () => {
        const dayCount = formData.itinerary.length + 1;
        const newDayName = `Day ${dayCount.toString().padStart(2, '0')}`;
        setFormData(prev => ({ 
            ...prev, 
            itinerary: [...prev.itinerary, { day: newDayName, title: '', description: '', image: '', inclusions: [], location_name: '', latitude: '', longitude: '' }]  
        }));
    };

    const removeItineraryDay = (dayIndex) => {
        const newItinerary = [...formData.itinerary];
        newItinerary.splice(dayIndex, 1);
        if (newItinerary.length === 0) newItinerary.push({ day: "Day 01", title: '', description: '', image: '', inclusions: [], location_name: '', latitude: '', longitude: '' });
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };



    const handleRemoveExistingGalleryImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            gallery_images: prev.gallery_images.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const handleRemovePendingGalleryFile = (indexToRemove) => {
        setGalleryImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const cleanArray = arr => arr ? arr.filter(item => typeof item === 'string' && item.trim() !== '') : [];
            let finalImage = formData.image;
            let finalBannerImage = formData.banner_image;
            let currentGallery = formData.gallery_images || [];

            if (primaryImageFile) {
                finalImage = await uploadImage(primaryImageFile, 'destination');
            }

            if (bannerImageFile) {
                finalBannerImage = await uploadImage(bannerImageFile, 'destination');
            }

            // Handle gallery images upload
            const newGalleryUrls = [];
            for (let file of galleryImageFiles) {
                const url = await uploadImage(file, 'destination');
                newGalleryUrls.push(url);
            }
            const finalGallery = [...currentGallery, ...newGalleryUrls];

            let numericPrice = parseFloat(formData.price.toString().replace(/[^0-9.]/g, ''));
            let numericRating = parseFloat(formData.rating) || 4.8;

            const cleanItinerary = [];
            for (let day of formData.itinerary) {
                if (day.day.trim() !== '') {
                    let finalDayImage = day.image || '';
                    if (day.pendingImageFile) {
                        finalDayImage = await uploadImage(day.pendingImageFile, 'destination');
                    }
                    cleanItinerary.push({
                        day: day.day,
                        title: day.title || '',
                        description: day.description || '',
                        image: finalDayImage,
                        inclusions: day.inclusions || [],
                        location_name: day.location_name || '',
                        latitude: day.latitude || '',
                        longitude: day.longitude || ''
                    });
                }
            }

            const cleanHighlights = [];
            for (let hl of formData.rich_highlights) {
                if (hl.title.trim() !== '' || hl.description.trim() !== '') {
                    cleanHighlights.push({
                        title: hl.title,
                        description: hl.description
                    });
                }
            }

            const dataToSave = {
                title: formData.title,
                price: numericPrice || 0,
                price_unit: formData.price_unit,
                duration: formData.duration,
                location: formData.location,
                rating: numericRating,
                rating_count: parseInt(formData.rating_count) || 0,
                original_price: parseFloat(formData.original_price) || 0,
                badge_text: formData.badge_text || 'Recommended',
                is_recommended: !!formData.is_recommended,
                loyalty_points: parseInt(formData.loyalty_points) || 0,
                inclusions: formData.inclusions || { hotel: true, sightseeing: true, meals: true, manager: true, flights: false, transfers: false, trains: false, cruises: false, activities: false, visa: false, insurance: false },
                inclusions_details: formData.inclusions_details || {},
                itinerary_summary: formData.itinerary_summary || '',
                itinerary_route: formData.itinerary_route || '',
                tour_type: formData.tour_type || 'Group Tour',
                terms_conditions: formData.terms_conditions || '',
                image: finalImage,
                banner_image: finalBannerImage,
                gallery_images: finalGallery,
                description_1: formData.description_1,
                description_2: formData.description_2,
                highlights_text: formData.highlights_text,
                highlights_list: cleanArray(formData.highlights_list),
                rich_highlights: cleanHighlights,
                basic_info_text: formData.basic_info_text,
                included_list: cleanArray(formData.included_list),
                excluded_list: cleanArray(formData.excluded_list),
                itinerary: cleanItinerary,
                brochure_url: formData.brochure_url,
                category: formData.category,
                package_type: formData.package_type,
                accommodation_type: formData.accommodation_type || '3 Star',
                nights: parseInt(formData.nights) || 0,
                days: parseInt(formData.days) || 0,
                show_recently_booked: !!formData.show_recently_booked,
                recent_booking_text: formData.recent_booking_text || '',
                recent_booking_tag: formData.recent_booking_tag || '',
                continent: formData.category === 'Outbound' ? (formData.continent || '') : null,
                tier_pricing: formData.tier_pricing || {}
            };

            // Dynamic brochure PDF is now generated automatically on client side, no upload needed

            if (modalMode === 'add') {
                await createDestination(dataToSave);
                showToast('Rich Destination created successfully!');
            } else {
                await updateDestination(formData.id, dataToSave);
                
                // Clean up orphaned images only after database save succeeds
                // 1. Primary image replacement
                if (originalImages.image && originalImages.image !== finalImage) {
                    await deleteImage(originalImages.image);
                }
                // 1.2. Banner image replacement
                if (originalImages.banner_image && originalImages.banner_image !== finalBannerImage) {
                    await deleteImage(originalImages.banner_image);
                }
                // 2. Removed gallery images
                for (let origUrl of originalImages.gallery_images) {
                    if (!finalGallery.includes(origUrl)) {
                        await deleteImage(origUrl);
                    }
                }
                // 3. Removed itinerary day images
                const newItinImages = cleanItinerary.map(day => day.image).filter(Boolean);
                for (let origUrl of originalImages.itinerary_images) {
                    if (!newItinImages.includes(origUrl)) {
                        await deleteImage(origUrl);
                    }
                }
                showToast('Rich Destination updated successfully!');
            }

            handleCloseModal();
            loadDestinations();
        } catch (err) {
            console.error('Submission failed', err);
            const errMsg = err.message || err.details || 'Failed to save destination.';
            showToast(`Failed to save: ${errMsg}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (dest) => {
        if (!dest) return;
        if (!window.confirm(`Are you sure you want to delete this destination: "${dest.title}"?`)) return;
        try {
            await deleteDestination(dest.id);
            
            // Delete main image
            if (dest.image) await deleteImage(dest.image);
            
            // Delete banner image
            if (dest.banner_image) await deleteImage(dest.banner_image);
            
            // Delete gallery images
            const gallery = dest.gallery_images;
            const parsedGallery = typeof gallery === 'string' ? JSON.parse(gallery) : gallery;
            if (Array.isArray(parsedGallery)) {
                for (let url of parsedGallery) {
                    await deleteImage(url);
                }
            }
            
            // Delete itinerary day images
            const itinerary = dest.itinerary;
            const parsedItinerary = typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary;
            if (Array.isArray(parsedItinerary)) {
                for (let day of parsedItinerary) {
                    if (day.image) await deleteImage(day.image);
                }
            }
            
            showToast('Destination deleted successfully!');
            loadDestinations();
        } catch (err) {
            console.error('Delete failed', err);
            showToast('Failed to delete destination.', 'error');
        }
    };

    // Helper widget
    const renderListInput = (label, listName) => (
        <div className="form-group mb-4">
            <label className="fw-bold d-block border-bottom pb-2 mb-3 mt-4 text-primary">{label}</label>
            {formData[listName].map((item, index) => (
                <div key={index} className="input-group mb-2">
                    <input 
                        type="text" 
                        value={item} 
                        onChange={(e) => handleArrayItemChange(listName, index, e.target.value)} 
                        className="form-control"
                        placeholder={`${label} item...`}
                    />
                    <button type="button" className="btn btn-outline-danger" onClick={() => removeArrayItem(listName, index)}>
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addArrayItem(listName)}>
                <i className="fa-solid fa-plus"></i> Add Item
            </button>
        </div>
    );

    const filteredTogglePackages = togglePackages.filter(pkg => 
        pkg.title?.toLowerCase().includes(toggleSearchQuery.toLowerCase())
    );

    return (
        <div className="admin-panel-container">
            {toast.show && (
                <div className={`admin-toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}

            <div className="admin-tabs-nav mb-4" style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #cbd5e1', paddingBottom: '0' }}>
                <button 
                    onClick={() => setActiveTab('packages')} 
                    style={{ 
                        padding: '12px 24px', 
                        fontWeight: '600', 
                        fontSize: '15px', 
                        border: 'none', 
                        borderBottom: activeTab === 'packages' ? '3px solid #10b981' : '3px solid transparent', 
                        backgroundColor: 'transparent', 
                        color: activeTab === 'packages' ? '#10b981' : '#64748b', 
                        cursor: 'pointer', 
                        transition: 'all 0.2s ease',
                        marginBottom: '-1px'
                    }}
                >
                    <i className="fa-solid fa-map-location-dot me-2"></i> Manage Tour Packages
                </button>
                <button 
                    onClick={() => setActiveTab('recentlyBooked')} 
                    style={{ 
                        padding: '12px 24px', 
                        fontWeight: '600', 
                        fontSize: '15px', 
                        border: 'none', 
                        borderBottom: activeTab === 'recentlyBooked' ? '3px solid #10b981' : '3px solid transparent', 
                        backgroundColor: 'transparent', 
                        color: activeTab === 'recentlyBooked' ? '#10b981' : '#64748b', 
                        cursor: 'pointer', 
                        transition: 'all 0.2s ease',
                        marginBottom: '-1px'
                    }}
                >
                    <i className="fa-solid fa-gear me-2"></i> Recently Booked Section Settings
                </button>
            </div>

            {activeTab === 'packages' && (
                <>
                    <div className="admin-panel-header d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <h2 className="m-0">Manage Dynamic Destinations</h2>
                        <div className="d-flex gap-3 align-items-center">
                            <div className="position-relative">
                                <i className="fa-solid fa-search position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                                <input 
                                    type="text" 
                                    placeholder="Search destinations..." 
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="form-control ps-5"
                                    style={{ width: '200px', borderRadius: '8px' }}
                                />
                            </div>
                            <select
                                value={filterAccommodation}
                                onChange={(e) => setFilterAccommodation(e.target.value)}
                                className="form-select border-secondary-subtle"
                                style={{ width: '140px', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' }}
                            >
                                <option value="All">All Hotels</option>
                                <option value="2 Star">2 Star</option>
                                <option value="3 Star">3 Star</option>
                                <option value="4 Star">4 Star</option>
                                <option value="5 Star">5 Star</option>
                            </select>
                            <button className="th-btn m-0" onClick={() => handleOpenModal('add')}>
                                <i className="fa-solid fa-plus me-2"></i> Add Destination
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="admin-loading">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : error ? (
                        <div className="admin-error">{error}</div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Thumbnail</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Type</th>
                                        <th>Accommodation</th>
                                        <th>Location</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4 text-muted">
                                                {searchTerm ? 'No destinations found matching your search.' : 'No destinations found.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedData.map(dest => (
                                            <tr key={dest.id}>
                                                <td>
                                                    <div className="admin-img-thumb truncate-img">
                                                        <img src={getImageSrc(dest.image)} alt={dest.title} />
                                                    </div>
                                                </td>
                                                <td><strong>{dest.title}</strong></td>
                                                <td>
                                                    <span style={{ fontWeight: '600', color: dest.category === 'Outbound' ? '#0d6efd' : dest.category === 'Domestic' ? '#fd7e14' : '#198754' }}>
                                                        {dest.category === 'Outbound' ? 'Global' : (dest.category || 'Inbound')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${dest.package_type === 'Luxury' ? 'bg-warning text-dark' : dest.package_type === 'Premium' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                                                        {dest.package_type || 'Standard'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-dark" style={{ fontSize: '11px' }}>
                                                        {dest.accommodation_type || '3 Star'}
                                                    </span>
                                                </td>
                                                <td>{dest.location || '-'}</td>
                                                <td>₹{dest.price}</td>
                                                <td>
                                                    <div className="admin-actions">
                                                        <button className="btn-edit" onClick={() => handleOpenModal('edit', dest)}>
                                                            <i className="fa-solid fa-pen"></i> Edit
                                                        </button>
                                                        <button className="btn-delete" onClick={() => handleDelete(dest)}>
                                                            <i className="fa-solid fa-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            
                            <AdminPagination 
                                currentPage={currentPage} 
                                totalPages={totalPages} 
                                onPageChange={setCurrentPage} 
                                totalItems={totalItems}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Tab 2: Recently Booked Config Panel */}
            {activeTab === 'recentlyBooked' && (
                <div className="recently-booked-settings-panel" style={{ animation: 'fadeIn 0.25s ease' }}>
                    {/* Part 1: Heading/Badge */}
                    <div className="card shadow-sm border-0 mb-4 p-4" style={{ borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                        <h4 className="border-bottom pb-2 text-primary" style={{ fontWeight: '700', fontSize: '18px' }}>
                            <i className="fa-solid fa-pen-to-square me-2"></i> Homepage Header Customization
                        </h4>
                        <form onSubmit={handleSaveSectionSettings} className="row mt-3">
                            <div className="col-md-6 mb-3">
                                <label className="fw-semibold mb-1 text-dark" style={{ fontSize: '14px' }}>Section Heading Text</label>
                                <input 
                                    type="text" 
                                    value={sectionHeading} 
                                    onChange={(e) => setSectionHeading(e.target.value)} 
                                    className="form-control" 
                                    placeholder="e.g. Recently Booked Itineraries" 
                                    required 
                                />
                                <small className="text-muted d-block mt-1">The first word will automatically receive the hand-drawn green accent circle on the homepage.</small>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="fw-semibold mb-1 text-dark" style={{ fontSize: '14px' }}>Heart Badge Text</label>
                                <input 
                                    type="text" 
                                    value={sectionBadge} 
                                    onChange={(e) => setSectionBadge(e.target.value)} 
                                    className="form-control" 
                                    placeholder="e.g. 143+ trips booked last week" 
                                    required 
                                />
                                <small className="text-muted d-block mt-1">Will show up next to the heart (❤️) icon badge.</small>
                            </div>
                            <div className="col-12 mt-2">
                                <button type="submit" className="th-btn m-0" disabled={isSavingSettings}>
                                    <i className="fa-solid fa-floppy-disk me-2"></i>
                                    {isSavingSettings ? 'Saving Settings...' : 'Save Header Settings'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Part 2: Bulk package toggles */}
                    <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
                        <h4 className="border-bottom pb-2 text-primary" style={{ fontWeight: '700', fontSize: '18px' }}>
                            <i className="fa-solid fa-rectangle-list me-2"></i> Tour Packages Visibility Toggles
                        </h4>
                        <p className="text-muted small">Toggle which packages show up in the "Recently Booked Itineraries" homepage section and edit their booking metadata directly. Remember to save changes at the bottom.</p>
                        
                        {/* Search Input for Toggles */}
                        <div className="d-flex justify-content-between align-items-center mb-3 mt-3 flex-wrap gap-2">
                            <div className="position-relative" style={{ minWidth: '320px' }}>
                                <i className="fa-solid fa-magnifying-glass position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                                <input 
                                    type="text" 
                                    placeholder="Search packages by title..." 
                                    value={toggleSearchQuery}
                                    onChange={(e) => setToggleSearchQuery(e.target.value)}
                                    className="form-control ps-5"
                                    style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                />
                                {toggleSearchQuery && (
                                    <button 
                                        type="button"
                                        onClick={() => setToggleSearchQuery('')}
                                        className="position-absolute border-0 bg-transparent"
                                        style={{ top: '50%', right: '12px', transform: 'translateY(-50%)', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </div>
                            <div className="text-muted small fw-semibold">
                                Showing {filteredTogglePackages.length} of {togglePackages.length} packages
                            </div>
                        </div>

                        <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                            <table className="admin-table align-middle m-0" style={{ minWidth: '700px' }}>
                                <thead className="sticky-top bg-light" style={{ zIndex: '2' }}>
                                    <tr>
                                        <th style={{ width: '80px' }}>Thumbnail</th>
                                        <th style={{ width: '220px' }}>Package Title</th>
                                        <th style={{ width: '120px', textAlign: 'center' }}>Show in Section?</th>
                                        <th>Recent Booking Display Text</th>
                                        <th style={{ width: '180px' }}>Tag (Badge)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTogglePackages.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-muted">
                                                {toggleSearchQuery ? 'No tour packages match your search.' : 'No tour packages found.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTogglePackages.map((pkg, idx) => (
                                            <tr key={pkg.id}>
                                                <td>
                                                    <div className="admin-img-thumb truncate-img">
                                                        <img src={getImageSrc(pkg.image)} alt={pkg.title} />
                                                    </div>
                                                </td>
                                                <td><strong>{pkg.title}</strong></td>
                                                <td className="text-center">
                                                     <button
                                                         type="button"
                                                         className={`btn btn-sm ${pkg.show_recently_booked ? 'btn-success' : 'btn-outline-secondary'}`}
                                                         onClick={() => {
                                                             setTogglePackages(prev => prev.map(p => p.id === pkg.id ? { ...p, show_recently_booked: !p.show_recently_booked } : p));
                                                         }}
                                                         style={{
                                                             borderRadius: '20px',
                                                             padding: '5px 12px',
                                                             fontSize: '11px',
                                                             fontWeight: '600',
                                                             minWidth: '80px',
                                                             backgroundColor: pkg.show_recently_booked ? '#10b981' : 'transparent',
                                                             borderColor: pkg.show_recently_booked ? '#10b981' : '#cbd5e1',
                                                             color: pkg.show_recently_booked ? '#ffffff' : '#64748b',
                                                             transition: 'all 0.15s ease'
                                                         }}
                                                     >
                                                         {pkg.show_recently_booked ? 'Active' : 'Inactive'}
                                                     </button>
                                                 </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        value={pkg.recent_booking_text} 
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setTogglePackages(prev => prev.map(p => p.id === pkg.id ? { ...p, recent_booking_text: val } : p));
                                                        }}
                                                        className="form-control form-control-sm"
                                                        placeholder="e.g. Sunil from Pune • 1hr ago (Leave empty for fallback)"
                                                        disabled={!pkg.show_recently_booked}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        value={pkg.recent_booking_tag} 
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setTogglePackages(prev => prev.map(p => p.id === pkg.id ? { ...p, recent_booking_tag: val } : p));
                                                        }}
                                                        className="form-control form-control-sm"
                                                        placeholder="e.g. COUPLE, SOLO, GROUP"
                                                        disabled={!pkg.show_recently_booked}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="d-flex justify-content-end mt-4">
                            <button 
                                onClick={handleSaveToggles} 
                                className="th-btn" 
                                disabled={isSavingToggles || togglePackages.length === 0}
                            >
                                <i className="fa-solid fa-floppy-disk me-2"></i>
                                {isSavingToggles ? 'Saving Changes...' : 'Save Packages Configuration'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="admin-modal-header sticky-top bg-white z-1">
                            <h3>{modalMode === 'add' ? 'Add New Destination' : 'Edit Rich Destination Data'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form px-4 pb-4">
                            
                            <h5 className="mt-2 text-primary border-bottom pb-2">Basic Information</h5>
                            <div className="row mt-3">
                                <div className="col-md-6 mb-3">
                                    <label>Destination Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Location * (City/State/Country)</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Selling Price * (Numeric)</label>
                                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Original Price (Strike-through, optional)</label>
                                    <input type="number" step="0.01" name="original_price" value={formData.original_price} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="col-md-6 mb-3">
                                     <label>Tour Category *</label>
                                     <select name="category" value={formData.category} onChange={handleInputChange} className="form-control" required>
                                         <option value="Outbound">Global</option>
                                         <option value="Inbound">Inbound (India)</option>
                                         <option value="Domestic">Domestic</option>
                                     </select>
                                 </div>
                                 {formData.category === 'Outbound' && (
                                     <div className="col-md-6 mb-3">
                                         <label>Continent *</label>
                                         <select name="continent" value={formData.continent || ''} onChange={handleInputChange} className="form-control" required={formData.category === 'Outbound'}>
                                             <option value="">-- Select Continent --</option>
                                             <option value="Europe">Europe</option>
                                             <option value="Africa">Africa</option>
                                             <option value="North America">North America</option>
                                             <option value="South America">South America</option>
                                             <option value="Australia">Australia</option>
                                             <option value="Asia">Asia</option>
                                         </select>
                                     </div>
                                 )}
                                <div className="col-md-6 mb-3">
                                    <label>Package Type *</label>
                                    <select name="package_type" value={formData.package_type} onChange={handleInputChange} className="form-control" required>
                                        <option value="Standard">Standard Package</option>
                                        <option value="Premium">Premium Package</option>
                                        <option value="Luxury">Luxury Package</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Accommodation Type *</label>
                                    <select name="accommodation_type" value={formData.accommodation_type} onChange={handleInputChange} className="form-control" required>
                                        <option value="2 Star">2 Star Hotel</option>
                                        <option value="3 Star">3 Star Hotel</option>
                                        <option value="4 Star">4 Star Hotel</option>
                                        <option value="5 Star">5 Star Hotel</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Price Unit *(Person/Package)</label>
                                    <input type="text" name="price_unit" value={formData.price_unit} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Duration * (e.g. 7 Days)</label>
                                    <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label>Nights *</label>
                                    <input type="number" min="0" name="nights" value={formData.nights} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label>Days *</label>
                                    <input type="number" min="0" name="days" value={formData.days} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label>Rating</label>
                                    <input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label>Rating Count</label>
                                    <input type="number" name="rating_count" value={formData.rating_count} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Loyalty Points Earned</label>
                                    <input type="number" name="loyalty_points" value={formData.loyalty_points} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="col-md-4 mb-3 d-flex align-items-center">
                                    <div className="form-check pt-4">
                                        <input 
                                            type="checkbox" 
                                            name="is_recommended" 
                                            id="is_recommended"
                                            checked={formData.is_recommended} 
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_recommended: e.target.checked }))} 
                                            className="form-check-input" 
                                        />
                                        <label htmlFor="is_recommended" className="form-check-label fw-bold ms-2">Is Recommended Badge</label>
                                    </div>
                                </div>
                                <div className="col-md-8 mb-3">
                                    <label>Badge Text</label>
                                    <input type="text" name="badge_text" value={formData.badge_text} onChange={handleInputChange} className="form-control" disabled={!formData.is_recommended} />
                                </div>
                                <div className="col-md-4 mb-3 d-flex align-items-center">
                                    <div className="form-check pt-4">
                                        <input 
                                            type="checkbox" 
                                            name="show_recently_booked" 
                                            id="show_recently_booked"
                                            checked={formData.show_recently_booked} 
                                            onChange={(e) => setFormData(prev => ({ ...prev, show_recently_booked: e.target.checked }))} 
                                            className="form-check-input" 
                                        />
                                        <label htmlFor="show_recently_booked" className="form-check-label fw-bold ms-2">Show in Recently Booked</label>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label>Recent Booking Text</label>
                                    <input type="text" name="recent_booking_text" value={formData.recent_booking_text} onChange={handleInputChange} className="form-control" placeholder="e.g., Sandhya from Bengaluru • 1hr ago" disabled={!formData.show_recently_booked} />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label>Recent Booking Tag</label>
                                    <input type="text" name="recent_booking_tag" value={formData.recent_booking_tag} onChange={handleInputChange} className="form-control" placeholder="e.g., COUPLE, FAMILY, SOLO" disabled={!formData.show_recently_booked} />
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label>Card Itinerary Summary (e.g. 3N Port Blair • 2N Havelock Island)</label>
                                    <input type="text" name="itinerary_summary" value={formData.itinerary_summary} onChange={handleInputChange} className="form-control" placeholder="3N Port Blair • 2N Havelock Island" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>{"Details Page Route (e.g. Port Blair (3N) -> Havelock Island (2N))"}</label>
                                    <input type="text" name="itinerary_route" value={formData.itinerary_route} onChange={handleInputChange} className="form-control" placeholder="Port Blair (3N) -> Havelock Island (2N)" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Gallery Tour Type Badge (e.g. Group Tour, Honeymoon Special)</label>
                                    <input type="text" name="tour_type" value={formData.tour_type} onChange={handleInputChange} className="form-control" placeholder="Group Tour" />
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label>Terms & Conditions (HTML supported)</label>
                                    <textarea name="terms_conditions" value={formData.terms_conditions} onChange={handleInputChange} className="form-control" rows="5" placeholder="Custom cancellation, booking policies..."></textarea>
                                </div>
                            </div>

                            <h5 className="mt-4 text-primary border-bottom pb-2">Multi-Tier Pricing & Hotels</h5>
                            <p className="text-muted small">Configure tier-specific prices, hotel classifications, and hotel names. These custom pricing tiers will be displayed dynamically in catalog filtering and search pages, as well as on the details page selector.</p>
                            <div className="row mt-3 mb-4">
                                {['Standard', 'Premium', 'Luxury'].map((tier) => {
                                    const tierData = formData.tier_pricing?.[tier] || { price: '', original_price: '', accommodation_type: '', inclusions_details: { hotel: '' } };
                                    return (
                                        <div key={tier} className="col-md-12 mb-3 p-3 border rounded bg-light">
                                            <h6 className="text-primary fw-semibold mb-2">{tier} Tier Settings</h6>
                                            <div className="row">
                                                <div className="col-md-3 mb-2">
                                                    <label className="small fw-semibold">Selling Price</label>
                                                    <input 
                                                        type="number" 
                                                        step="0.01" 
                                                        value={tierData.price || ''} 
                                                        onChange={(e) => handleTierPricingChange(tier, 'price', e.target.value)} 
                                                        className="form-control form-control-sm" 
                                                        placeholder="e.g. 85000" 
                                                    />
                                                </div>
                                                <div className="col-md-3 mb-2">
                                                    <label className="small fw-semibold">Original Price</label>
                                                    <input 
                                                        type="number" 
                                                        step="0.01" 
                                                        value={tierData.original_price || ''} 
                                                        onChange={(e) => handleTierPricingChange(tier, 'original_price', e.target.value)} 
                                                        className="form-control form-control-sm" 
                                                        placeholder="e.g. 100000" 
                                                    />
                                                </div>
                                                <div className="col-md-3 mb-2">
                                                    <label className="small fw-semibold">Accommodation Rating</label>
                                                    <select 
                                                        value={tierData.accommodation_type || ''} 
                                                        onChange={(e) => handleTierPricingChange(tier, 'accommodation_type', e.target.value)} 
                                                        className="form-control form-control-sm"
                                                    >
                                                        <option value="">-- Use Default --</option>
                                                        <option value="2 Star">2 Star Hotel</option>
                                                        <option value="3 Star">3 Star Hotel</option>
                                                        <option value="4 Star">4 Star Hotel</option>
                                                        <option value="5 Star">5 Star Hotel</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-3 mb-2">
                                                    <label className="small fw-semibold">Hotel Name(s)</label>
                                                    <input 
                                                        type="text" 
                                                        value={tierData.inclusions_details?.hotel || ''} 
                                                        onChange={(e) => handleTierPricingChange(tier, 'hotel', e.target.value)} 
                                                        className="form-control form-control-sm" 
                                                        placeholder="e.g. Radisson Blu" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <h5 className="mt-4 text-primary border-bottom pb-2">Hover Card Inclusions</h5>
                            <div className="row mt-3 mb-4">
                                <div className="col-md-12">
                                    <p className="text-muted small">Select the inclusions to show as icons when the card is hovered:</p>
                                    <div className="d-flex flex-wrap gap-4">
                                        {['hotel', 'sightseeing', 'meals', 'manager', 'flights', 'transfers', 'trains', 'cruises', 'activities', 'visa', 'insurance', 'highlights'].map((inc) => (
                                            <div key={inc} className="form-check">
                                                <input 
                                                    type="checkbox" 
                                                    id={`inc-${inc}`}
                                                    checked={formData.inclusions?.[inc] ?? false} 
                                                    onChange={(e) => {
                                                        const val = e.target.checked;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            inclusions: {
                                                                ...prev.inclusions,
                                                                [inc]: val
                                                            }
                                                        }));
                                                    }}
                                                    className="form-check-input" 
                                                />
                                                <label htmlFor={`inc-${inc}`} className="form-check-label text-capitalize ms-2 fw-semibold">
                                                    {inc === 'flights' ? 'Flights' : 
                                                     inc === 'transfers' ? 'Transfers/Cabs' : 
                                                     inc === 'manager' ? 'Tour Manager' : 
                                                     inc}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                             <h5 className="mt-4 text-primary border-bottom pb-2">Active Inclusions Details</h5>
                             <p className="text-muted small">Provide details for the enabled inclusions. If you want to render details as a table (e.g. for hotels), use pipe separation: <code>City | Hotel Name | Stars | Nights</code> on each line.</p>
                             <div className="row mt-3 mb-4">
                                {['hotel', 'meals', 'sightseeing', 'transfers', 'manager', 'flights', 'trains', 'cruises', 'activities', 'visa', 'insurance', 'highlights'].map((inc) => {
                                    const isEnabled = !!formData.inclusions?.[inc];
                                    if (!isEnabled) return null;
                                    
                                    const placeholders = {
                                        hotel: "e.g.\nPort Blair | S R Castle / Similar | ★★★ | 3 nights\nHavelock Island | Arina Island Resort Bergamont Hotels / Similar | ★★★ | 2 nights",
                                        meals: "e.g. Daily Buffet Breakfast at all hotels\nCandle Light Dinner on Havelock beach",
                                        sightseeing: "e.g. Cellular Jail Light & Sound Show\nCoral Safari Semi Submarine Ride\nRadhanagar Beach excursion",
                                        transfers: "e.g. Airport Pick & Drop via Private AC Cab\nInter-island cruise transfers via Nautika/Makruzz\nPrivate sightseeing transfers",
                                        manager: "e.g. Tour Guide assistance on spots\n24/7 dedicated local coordinator helpline",
                                        flights: "e.g. Ex-Kolkata roundtrip economy airfare on Indigo Airlines included",
                                        trains: "e.g. AC Train tickets booking from Delhi to Jaipur included",
                                        cruises: "e.g. Cordelia Cruise ocean view cabin stay details",
                                        activities: "e.g. Snorkeling, scuba diving session, and mountain trekking permits included",
                                        visa: "e.g. Single entry tourist visa approval fees included",
                                        insurance: "e.g. Comprehensive travel insurance covering medical emergencies and trip cancellation included",
                                        highlights: "e.g. Welcome drinks on arrival\nFerry tickets & entry permits\nSnorkeling session complimentary"
                                    };

                                    return (
                                        <div key={inc} className="col-md-6 mb-3">
                                            <label className="text-capitalize fw-bold">
                                                {inc === 'flights' ? 'Flights' : 
                                                 inc === 'transfers' ? 'Transfers/Cabs' : 
                                                 inc === 'manager' ? 'Tour Manager' : 
                                                 inc} Details
                                            </label>
                                            <textarea 
                                                name={`inclusions_details_${inc}`} 
                                                value={formData.inclusions_details?.[inc] || ''} 
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        inclusions_details: {
                                                            ...prev.inclusions_details,
                                                            [inc]: val
                                                        }
                                                    }));
                                                }} 
                                                className="form-control" 
                                                rows="3" 
                                                placeholder={placeholders[inc]}
                                            ></textarea>
                                        </div>
                                    );
                                })}
                            </div>

                            
                            <div className="form-group mb-4">
                                <label className="fw-bold text-dark">Cover Image</label>
                                <input type="file" accept="image/*" onChange={(e) => {
                                    if(e.target.files && e.target.files[0]) setPrimaryImageFile(e.target.files[0])
                                }} className="form-control mb-2" />
                                {primaryImageFile && (
                                    <div className="mb-2">
                                        <small className="text-primary d-block mb-1">New Cover Image Preview:</small>
                                        <img src={URL.createObjectURL(primaryImageFile)} style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} alt="New Cover Preview" />
                                    </div>
                                )}
                                {formData.image && !primaryImageFile && (
                                    <div className="mb-2">
                                        <small className="text-muted d-block mb-1">Current Cover Image:</small>
                                        <img src={getImageSrc(formData.image)} style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} alt="Current Cover" />
                                    </div>
                                )}
                            </div>

                            <div className="form-group mb-4">
                                <label className="fw-bold text-dark">Banner Image</label>
                                <small className="text-muted d-block mb-2">Recommended dimensions: <strong>2000 x 500 px</strong> (Aspect Ratio 4:1)</small>
                                <input type="file" accept="image/*" onChange={(e) => {
                                    if(e.target.files && e.target.files[0]) setBannerImageFile(e.target.files[0])
                                }} className="form-control mb-2" />
                                {bannerImageFile && (
                                    <div className="mb-2">
                                        <small className="text-primary d-block mb-1">New Banner Image Preview (4:1):</small>
                                        <img src={URL.createObjectURL(bannerImageFile)} style={{ width: '100%', maxWidth: '400px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} alt="New Banner Preview" />
                                    </div>
                                )}
                                {formData.banner_image && !bannerImageFile && (
                                    <div className="mb-2">
                                        <small className="text-muted d-block mb-1">Current Banner Image Preview (4:1):</small>
                                        <img src={getBannerSrc(formData.banner_image)} style={{ width: '100%', maxWidth: '400px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} alt="Current Banner" />
                                    </div>
                                )}
                            </div>

                            <div className="form-group mb-4 border p-3 rounded bg-light">
                                <label className="fw-bold text-dark d-block mb-2">Package Gallery Images</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    multiple 
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            const filesArray = Array.from(e.target.files);
                                            setGalleryImageFiles(prev => [...prev, ...filesArray]);
                                        }
                                    }} 
                                    className="form-control mb-3" 
                                />
                                
                                {/* 1. Existing Gallery Images */}
                                {formData.gallery_images && formData.gallery_images.length > 0 && (
                                    <div className="mb-3">
                                        <small className="text-muted d-block mb-2 fw-semibold">Currently Saved Gallery Photos (${formData.gallery_images.length}):</small>
                                        <div className="d-flex flex-wrap gap-3">
                                            {formData.gallery_images.map((imgUrl, idx) => (
                                                <div key={idx} className="position-relative" style={{ width: '100px', height: '70px' }}>
                                                    <img src={getImageSrc(imgUrl)} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} alt="Gallery Image" />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveExistingGalleryImage(idx)}
                                                        className="btn btn-danger p-0 d-flex align-items-center justify-content-center"
                                                        style={{ position: 'absolute', top: '-5px', right: '-5px', width: '20px', height: '20px', borderRadius: '50%', fontSize: '12px', border: 'none', backgroundColor: '#dc3545', color: 'white' }}
                                                        title="Remove Image"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* 2. New Gallery Images Pending Upload */}
                                {galleryImageFiles.length > 0 && (
                                    <div>
                                        <small className="text-primary d-block mb-2 fw-semibold">New Gallery Photos Pending Upload (${galleryImageFiles.length}):</small>
                                        <div className="d-flex flex-wrap gap-3">
                                            {galleryImageFiles.map((file, idx) => (
                                                <div key={idx} className="position-relative" style={{ width: '100px', height: '70px' }}>
                                                    <img src={URL.createObjectURL(file)} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} alt="Pending Gallery Image" />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemovePendingGalleryFile(idx)}
                                                        className="btn btn-danger p-0 d-flex align-items-center justify-content-center"
                                                        style={{ position: 'absolute', top: '-5px', right: '-5px', width: '20px', height: '20px', borderRadius: '50%', fontSize: '12px', border: 'none', backgroundColor: '#dc3545', color: 'white' }}
                                                        title="Cancel Upload"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>


                            <div className="form-group mb-3">
                                <label>Main Description Paragraph 1</label>
                                <textarea name="description_1" value={formData.description_1} onChange={handleInputChange} className="form-control" rows="3"></textarea>
                            </div>
                            <div className="form-group mb-4">
                                <label>Main Description Paragraph 2</label>
                                <textarea name="description_2" value={formData.description_2} onChange={handleInputChange} className="form-control" rows="3"></textarea>
                            </div>

                            <h5 className="mt-5 text-primary border-bottom pb-2">Highlights</h5>
                            <div className="form-group mb-3 mt-3">
                                <label>Highlights Intro text</label>
                                <textarea name="highlights_text" value={formData.highlights_text} onChange={handleInputChange} className="form-control" rows="2"></textarea>
                            </div>
                            
                            <label className="fw-bold d-block pb-2 mb-3 mt-4 text-primary">Rich Highlights (Cards)</label>
                            {formData.rich_highlights.map((hl, hlIndex) => (
                                <div key={hlIndex} className="card mb-3 shadow-sm border-0 bg-light p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <input 
                                            type="text" 
                                            value={hl.title} 
                                            onChange={(e) => handleHighlightChange(hlIndex, 'title', e.target.value)} 
                                            className="form-control w-75 fw-bold border-0 bg-white"
                                            placeholder="Highlight Title e.g., Swimming with Dolphins"
                                        />
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeHighlight(hlIndex)}>
                                            Remove Highlight
                                        </button>
                                    </div>
                                    <div className="mt-2">
                                        <label className="text-muted small mb-1">Highlight Description</label>
                                        <textarea 
                                            value={hl.description} 
                                            onChange={(e) => handleHighlightChange(hlIndex, 'description', e.target.value)} 
                                            className="form-control bg-white"
                                            rows="2"
                                            placeholder="Description for this highlight..."
                                        />
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="btn btn-primary d-block w-100 mb-4" onClick={addHighlight}>
                                <i className="fa-solid fa-plus me-1"></i> Add New Highlight
                            </button>

                            <h5 className="mt-5 text-primary border-bottom pb-2">Inclusions & Exclusions</h5>
                            <div className="form-group mb-3 mt-3">
                                <label>Basic Info Summary text</label>
                                <textarea name="basic_info_text" value={formData.basic_info_text} onChange={handleInputChange} className="form-control" rows="2"></textarea>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    {renderListInput('Included Items', 'included_list')}
                                </div>
                                <div className="col-md-6">
                                    {renderListInput('Excluded Items', 'excluded_list')}
                                </div>
                            </div>

                            <h5 className="mt-5 text-primary border-bottom pb-2 mb-3">Destination Itinerary</h5>
                            {formData.itinerary.map((dayObj, dayIndex) => (
                                <div key={dayIndex} className="card mb-4 shadow-sm border-0 bg-light p-3">
                                    <div className="row g-3">
                                        <div className="col-md-3">
                                            <label className="text-muted small fw-bold">Day Label</label>
                                            <input 
                                                type="text" 
                                                value={dayObj.day} 
                                                onChange={(e) => handleItineraryDayChange(dayIndex, 'day', e.target.value)} 
                                                className="form-control fw-bold"
                                                placeholder="e.g. Day 1"
                                            />
                                        </div>
                                        <div className="col-md-9">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <label className="text-muted small fw-bold">Day Title / Plan Name</label>
                                                <button type="button" className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => removeItineraryDay(dayIndex)}>
                                                    Remove Day
                                                </button>
                                            </div>
                                            <input 
                                                type="text" 
                                                value={dayObj.title || ''} 
                                                onChange={(e) => handleItineraryDayChange(dayIndex, 'title', e.target.value)} 
                                                className="form-control"
                                                placeholder="e.g., Arrive Port Blair – Cellular Jail – Light & Sound Show"
                                            />
                                        </div>
                                        
                                        <div className="col-md-12">
                                            <label className="text-muted small fw-bold">Day Description / Details</label>
                                            <textarea 
                                                value={dayObj.description || ''} 
                                                onChange={(e) => handleItineraryDayChange(dayIndex, 'description', e.target.value)} 
                                                className="form-control"
                                                rows="3"
                                                placeholder="Detailed description of activities, visits, and schedule for this day..."
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Map Location Name (optional)</label>
                                            <input 
                                                type="text" 
                                                value={dayObj.location_name || ''} 
                                                onChange={(e) => handleItineraryDayChange(dayIndex, 'location_name', e.target.value)} 
                                                className="form-control"
                                                placeholder="e.g. Cellular Jail"
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Latitude (optional)</label>
                                            <input 
                                                type="text" 
                                                value={dayObj.latitude || ''} 
                                                onChange={(e) => handleItineraryDayChange(dayIndex, 'latitude', e.target.value)} 
                                                className="form-control"
                                                placeholder="e.g. 11.6739"
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="text-muted small text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Longitude (optional)</label>
                                            <input 
                                                type="text" 
                                                value={dayObj.longitude || ''} 
                                                onChange={(e) => handleItineraryDayChange(dayIndex, 'longitude', e.target.value)} 
                                                className="form-control"
                                                placeholder="e.g. 92.7472"
                                            />
                                        </div>
                                        
                                        <div className="col-md-12 mb-3">
                                            <label className="text-muted small fw-bold d-block mb-2">Daily Included Icons (Select to highlight)</label>
                                            <div className="d-flex flex-wrap gap-2">
                                                {[
                                                    { key: 'hotel', label: 'Hotel', icon: 'fa-hotel', color: '#ec4899' },
                                                    { key: 'sightseeing', label: 'Sightseeing', icon: 'fa-binoculars', color: '#8b5cf6' },
                                                    { key: 'meals', label: 'Meals', icon: 'fa-utensils', color: '#f97316' },
                                                    { key: 'manager', label: 'Tour Manager', icon: 'fa-user-tie', color: '#d946ef' },
                                                    { key: 'flights', label: 'Flights', icon: 'fa-plane', color: '#06b6d4' },
                                                    { key: 'transfers', label: 'Transfers', icon: 'fa-car', color: '#eab308' },
                                                    { key: 'trains', label: 'Trains', icon: 'fa-train', color: '#10b981' },
                                                    { key: 'cruises', label: 'Cruises', icon: 'fa-ship', color: '#0ea5e9' },
                                                    { key: 'activities', label: 'Activities', icon: 'fa-person-hiking', color: '#14b8a6' },
                                                    { key: 'visa', label: 'Visa', icon: 'fa-passport', color: '#4f46e5' },
                                                    { key: 'insurance', label: 'Insurance', icon: 'fa-shield-halved', color: '#059669' },
                                                    { key: 'highlights', label: 'Highlights', icon: 'fa-star', color: '#b45309' }
                                                ].map((inc) => {
                                                    const isSelected = dayObj.inclusions?.includes(inc.key);
                                                    return (
                                                        <button
                                                            key={inc.key}
                                                            type="button"
                                                            onClick={() => toggleItineraryInclusion(dayIndex, inc.key)}
                                                            className="btn btn-sm d-inline-flex align-items-center gap-2"
                                                            style={{
                                                                borderRadius: '20px',
                                                                padding: '6px 14px',
                                                                fontSize: '11.5px',
                                                                fontWeight: '600',
                                                                transition: 'all 0.15s ease',
                                                                backgroundColor: isSelected ? inc.color : '#f1f5f9',
                                                                color: isSelected ? '#ffffff' : '#64748b',
                                                                border: isSelected ? `1.5px solid ${inc.color}` : '1.5px solid #e2e8f0',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <i className={`fa-solid ${inc.icon}`}></i>
                                                            <span>{inc.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <label className="text-muted small fw-bold">Day Image</label>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="form-control form-control-sm mb-2"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        const file = e.target.files[0];
                                                        const newItinerary = [...formData.itinerary];
                                                        newItinerary[dayIndex].pendingImageFile = file;
                                                        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
                                                    }
                                                }}
                                            />
                                            {dayObj.pendingImageFile && (
                                                <div className="mb-2">
                                                    <small className="text-primary d-block mb-1">New Day Image Preview:</small>
                                                    <img src={URL.createObjectURL(dayObj.pendingImageFile)} style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} alt="New Day Preview" />
                                                </div>
                                            )}
                                            {!dayObj.pendingImageFile && dayObj.image && (
                                                <div className="mb-2">
                                                    <small className="text-muted d-block mb-1">Current Day Image:</small>
                                                    <img src={getImageSrc(dayObj.image)} style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} alt="Current Day" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="btn btn-primary d-block w-100 mb-4" onClick={addItineraryDay}>
                                <i className="fa-solid fa-plus me-1"></i> Add New Itinerary Day
                            </button>

{/* Package brochure is now dynamically generated in real-time, no upload required */}

                            <div className="admin-modal-footer sticky-bottom bg-white pt-3 border-top mt-4 p-3">
                                <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="th-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Comprehensive Record'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DestinationAdminPanel;
