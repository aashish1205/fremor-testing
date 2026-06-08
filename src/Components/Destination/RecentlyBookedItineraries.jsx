import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Link } from 'react-router-dom';
import { fetchDestinations, getImageSrc } from '../../services/destinationService';
import { supabase } from '../../supabaseClient';

function RecentlyBookedItineraries() {
    const [itineraries, setItineraries] = useState([]);
    const [filteredItineraries, setFilteredItineraries] = useState([]);
    const [locations, setLocations] = useState(['All Destinations']);
    const [selectedLocation, setSelectedLocation] = useState('All Destinations');
    const [selectedPrice, setSelectedPrice] = useState('All');
    const [loading, setLoading] = useState(true);
    const [swiperRef, setSwiperRef] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [headingText, setHeadingText] = useState('Recently Booked Itineraries');
    const [badgeText, setBadgeText] = useState('143+ trips booked last week');

    // Helper to render title with hand-drawn circle on the first word
    const renderHeading = (fullHeading) => {
        if (!fullHeading) return <span className="recently-accent">Recently</span>;
        const words = fullHeading.trim().split(' ');
        if (words.length === 0) return '';
        const firstWord = words[0];
        const restOfHeading = words.slice(1).join(' ');
        return (
            <>
                <span className="recently-accent">{firstWord}</span> {restOfHeading}
            </>
        );
    };

    // List of pastel colors for avatar backgrounds
    const avatarColors = [
        '#ec4899', // pink-500
        '#f97316', // orange-500
        '#eab308', // yellow-500
        '#a855f7', // purple-500
        '#3b82f6', // blue-500
        '#10b981', // emerald-500
        '#06b6d4', // cyan-500
    ];

    // Simple hash function to consistently assign colors based on name
    const getAvatarColor = (name) => {
        if (!name) return avatarColors[0];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % avatarColors.length;
        return avatarColors[index];
    };

    // Indian cities/states for mock data fallback
    const indianCities = ['Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Kochi', 'Jaipur'];
    const mockNames = ['Sandhya', 'Sunil', 'Santhi', 'Rohan', 'Anjali', 'Deepak', 'Meera', 'Vikram', 'Pooja', 'Karan'];

    // Generate mock details if booking text is empty
    const getBookingDetails = (item, index) => {
        if (item.recent_booking_text && item.recent_booking_text.trim() !== '') {
            return item.recent_booking_text;
        }
        const name = mockNames[index % mockNames.length];
        const city = indianCities[(index * 3) % indianCities.length];
        const timeAgo = `${((index + 1) * 3) % 24 || 1}hr ago`;
        return `${name} from ${city} • ${timeAgo}`;
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                
                // 1. Fetch settings from Supabase (gracefully fallback if table does not exist yet)
                try {
                    const { data: settingsData, error: settingsError } = await supabase
                        .from('recently_booked_settings')
                        .select('*')
                        .eq('id', 1)
                        .maybeSingle();
                    if (settingsData && !settingsError) {
                        setHeadingText(settingsData.heading || 'Recently Booked Itineraries');
                        setBadgeText(settingsData.badge_text || '143+ trips booked last week');
                    }
                } catch (e) {
                    console.warn("Failed to fetch settings from recently_booked_settings table:", e);
                }

                // 2. Query Supabase directly to bypass any sessionStorage caching issues
                const { data, error } = await supabase
                    .from('destinations')
                    .select('*')
                    .eq('show_recently_booked', true)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                
                setItineraries(data);
                setFilteredItineraries(data);

                // Collect unique locations/countries for the dropdown filter
                const uniqueLocations = ['All Destinations', ...new Set(data.map(dest => {
                    // Normalize location string if it's "City, Country" to extract country or state
                    const loc = dest.location || '';
                    const parts = loc.split(',');
                    return parts[parts.length - 1].trim();
                }).filter(Boolean))];
                setLocations(uniqueLocations);
            } catch (err) {
                console.error("Failed to load recently booked data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Filter effect when selection changes
    useEffect(() => {
        let results = [...itineraries];

        // 1. Filter by location
        if (selectedLocation !== 'All Destinations') {
            results = results.filter(dest => {
                const loc = dest.location || '';
                return loc.toLowerCase().includes(selectedLocation.toLowerCase());
            });
        }

        // 2. Filter by price range
        if (selectedPrice !== 'All') {
            results = results.filter(dest => {
                const priceVal = parseFloat(dest.price) || 0;
                const isLuxury = dest.package_type?.toLowerCase() === 'luxury';
                
                if (selectedPrice === 'Under ₹50K') {
                    return priceVal < 50000;
                } else if (selectedPrice === '₹50K to ₹1.5L') {
                    return priceVal >= 50000 && priceVal <= 150000;
                } else if (selectedPrice === '₹1.5L to ₹2.5L') {
                    return priceVal > 150000 && priceVal <= 250000;
                } else if (selectedPrice === 'Luxury') {
                    return isLuxury || priceVal > 250000;
                }
                return true;
            });
        }

        setFilteredItineraries(results);
    }, [selectedLocation, selectedPrice, itineraries]);

    const handleLocationSelect = (loc) => {
        setSelectedLocation(loc);
        setDropdownOpen(false);
    };

    return (
        <section className="recently-booked-sec py-5" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
            <style dangerouslySetInnerHTML={{__html: `
                .recently-booked-sec {
                    width: 100%;
                    position: relative;
                    padding: 80px 0;
                }
                .rb-title-area {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    margin-bottom: 30px;
                    flex-direction: column;
                }
                .rb-main-title {
                    font-size: 38px;
                    font-weight: 900;
                    color: #0c486e;
                    line-height: 1.25;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .recently-accent {
                    position: relative;
                    display: inline-block;
                    padding: 0px 8px;
                    margin-right: 4px;
                }
                .recently-accent::after {
                    content: "";
                    position: absolute;
                    top: -6px;
                    left: -4px;
                    right: -4px;
                    bottom: -2px;
                    border: 2px solid #FFB114;
                    border-radius: 60% 40% 55% 45% / 40% 50% 40% 60%;
                    transform: rotate(-1.5deg);
                    pointer-events: none;
                }
                .rb-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background-color: #f0f9ff;
                    border: 1px solid #bae6fd;
                    border-radius: 30px;
                    padding: 8px 16px;
                    font-size: 13.5px;
                    font-weight: 700;
                    color: #0d496e;
                    box-shadow: 0 2px 4px rgba(13, 73, 110, 0.05);
                }
                .rb-controls-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                    flex-wrap: wrap;
                    gap: 20px;
                }
                .rb-filters-group {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .rb-dropdown-container {
                    position: relative;
                    z-index: 100;
                }
                .rb-dropdown-btn {
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 30px;
                    padding: 10px 22px;
                    font-size: 14.5px;
                    font-weight: 600;
                    color: #475569;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                }
                .rb-dropdown-btn:hover {
                    border-color: #cbd5e1;
                    background-color: #f1f5f9;
                }
                .rb-dropdown-menu {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    background-color: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
                    width: 200px;
                    max-height: 250px;
                    overflow-y: auto;
                    padding: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .rb-dropdown-item {
                    border: none;
                    background: none;
                    padding: 8px 16px;
                    text-align: left;
                    font-size: 14px;
                    font-weight: 500;
                    color: #64748b;
                    border-radius: 8px;
                    cursor: pointer;
                    width: 100%;
                    transition: all 0.2s ease;
                }
                .rb-dropdown-item:hover, .rb-dropdown-item.active {
                    background-color: #ecfdf5;
                    color: #065f46;
                    font-weight: 600;
                }
                .rb-price-pill {
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    color: #64748b;
                    padding: 10px 24px;
                    border-radius: 30px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .rb-price-pill:hover {
                    border-color: #cbd5e1;
                    background-color: #f1f5f9;
                }
                .rb-price-pill.active {
                    background-color: #0d496e;
                    border-color: #0d496e;
                    color: #ffffff;
                }
                .rb-nav-arrows {
                    display: flex;
                    gap: 12px;
                }
                .rb-nav-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background-color: #f0f9ff;
                    color: #0d496e;
                    border: 1px solid #e2e8f0;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 8px rgba(13, 73, 110, 0.05);
                }
                .rb-nav-btn:hover {
                    background-color: #0d496e;
                    color: #ffffff;
                    border-color: #0d496e;
                    transform: scale(1.05);
                }
                .rb-nav-btn:active {
                    transform: scale(0.95);
                }
                .rb-card {
                    background-color: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.15);
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .rb-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
                    border-color: #cbd5e1;
                }
                .rb-card-header {
                    background-color: #1e293b;
                    padding: 12px 18px;
                    display: flex;
                    align-items: center;
                }
                .rb-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ffffff;
                    font-weight: 700;
                    font-size: 14px;
                    margin-right: 10px;
                    flex-shrink: 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .rb-header-text {
                    color: #ffffff;
                    font-size: 13.5px;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .rb-img-wrap {
                    width: 100%;
                    height: 200px;
                    overflow: hidden;
                    position: relative;
                }
                .rb-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                .rb-card:hover .rb-img {
                    transform: scale(1.08);
                }
                .rb-body {
                    padding: 16px 20px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }
                .rb-card-title {
                    font-size: 17.5px;
                    font-weight: 700;
                    color: #0f172a;
                    line-height: 1.35;
                    margin-bottom: 8px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    transition: color 0.3s ease;
                }
                .rb-card-title a {
                    color: inherit;
                    text-decoration: none;
                }
                .rb-card-title a:hover {
                    color: #10b981;
                }
                .rb-meta-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #64748b;
                    font-size: 13.5px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                .rb-meta-icon {
                    color: #94a3b8;
                }
                .rb-category-badge {
                    display: inline-block;
                    font-size: 10.5px;
                    font-weight: 800;
                    padding: 4px 12px;
                    border-radius: 20px;
                    letter-spacing: 0.5px;
                    align-self: flex-start;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                }
                .rb-badge-couple { background-color: #fce7f3; color: #db2777; }
                .rb-badge-family { background-color: #f3e8ff; color: #7c3aed; }
                .rb-badge-solo { background-color: #fef3c7; color: #d97706; }
                .rb-badge-default { background-color: #e0f2fe; color: #0284c7; }
                
                .rb-card-divider {
                    height: 1px;
                    background-color: #e2e8f0;
                    margin-top: auto;
                    margin-bottom: 12px;
                }
                .rb-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .rb-price-info {
                    display: flex;
                    flex-direction: column;
                }
                .rb-price {
                    font-size: 20px;
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1.1;
                }
                .rb-price-unit {
                    font-size: 11.5px;
                    color: #64748b;
                    font-weight: 600;
                    margin-top: 4px;
                }
                .rb-btn-details {
                    background-color: #0d496e;
                    color: #ffffff !important;
                    font-weight: 700;
                    font-size: 13.5px;
                    padding: 10px 18px;
                    border-radius: 8px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(13, 73, 110, 0.15);
                }
                .rb-btn-details:hover {
                    background-color: #FFB114;
                    color: #113d48 !important;
                    box-shadow: 0 4px 12px rgba(255, 177, 20, 0.25);
                    transform: translateY(-1px);
                }
                .rb-btn-details:active {
                    transform: translateY(1px);
                }
                
                /* Responsive Styling */
                @media(min-width: 768px) {
                    .rb-title-area {
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 40px;
                    }
                }
                @media(max-width: 992px) {
                    .rb-main-title {
                        font-size: 30px;
                    }
                    .recently-accent::after {
                        top: -4px;
                        left: -2px;
                        right: -2px;
                    }
                }
                @media(max-width: 768px) {
                    .rb-controls-row {
                        flex-direction: column;
                        align-items: flex-start;
                        margin-bottom: 30px;
                    }
                    .rb-nav-arrows {
                        align-self: flex-end;
                        margin-top: -10px;
                    }
                }
            `}} />
            
            <div className="container">
                {/* Header Title and Heart Badge */}
                <div className="rb-title-area">
                    <h2 className="rb-main-title">
                        {renderHeading(headingText)}
                    </h2>
                    <div className="rb-badge">
                        <span>❤️</span> {badgeText}
                    </div>
                </div>

                {/* Filters and Slider Controls */}
                <div className="rb-controls-row">
                    <div className="rb-filters-group">
                        {/* Locations Dropdown */}
                        <div className="rb-dropdown-container">
                            <button 
                                className="rb-dropdown-btn"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                            >
                                {selectedLocation}
                                <i className={`fa-solid fa-chevron-${dropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '11px' }}></i>
                            </button>
                            {dropdownOpen && (
                                <div className="rb-dropdown-menu">
                                    {locations.map((loc, idx) => (
                                        <button
                                            key={idx}
                                            className={`rb-dropdown-item ${selectedLocation === loc ? 'active' : ''}`}
                                            onClick={() => handleLocationSelect(loc)}
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price pills */}
                        {['All', 'Under ₹50K', '₹50K to ₹1.5L', '₹1.5L to ₹2.5L', 'Luxury'].map((priceRange) => (
                            <button
                                key={priceRange}
                                className={`rb-price-pill ${selectedPrice === priceRange ? 'active' : ''}`}
                                onClick={() => setSelectedPrice(priceRange)}
                            >
                                {priceRange}
                            </button>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <div className="rb-nav-arrows">
                        <button className="rb-nav-btn" onClick={() => swiperRef?.slidePrev()} aria-label="Previous Slide">
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <button className="rb-nav-btn" onClick={() => swiperRef?.slideNext()} aria-label="Next Slide">
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

                {/* Swiper Slider */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Retrieving recently booked itineraries...</p>
                    </div>
                ) : filteredItineraries.length > 0 ? (
                    <div className="slider-drag-wrap">
                        <Swiper
                            onSwiper={setSwiperRef}
                            breakpoints={{
                                0: { slidesPerView: 1 },
                                576: { slidesPerView: 1.5, spaceBetween: 16 },
                                768: { slidesPerView: 2, spaceBetween: 20 },
                                992: { slidesPerView: 2.5, spaceBetween: 24 },
                                1200: { slidesPerView: 3, spaceBetween: 24 }
                            }}
                            spaceBetween={24}
                            grabCursor={true}
                            className="swiper has-shadow"
                        >
                            {filteredItineraries.map((item, index) => {
                                const bookingInfo = getBookingDetails(item, index);
                                const initials = bookingInfo.trim().substring(0, 1).toUpperCase();
                                const avatarBg = getAvatarColor(bookingInfo);

                                // Determine category badge styling
                                const tag = (item.recent_booking_tag || item.tour_type || 'Package').trim().toUpperCase();
                                let tagClass = 'rb-badge-default';
                                if (tag.includes('COUPLE') || tag.includes('HONEYMOON')) {
                                    tagClass = 'rb-badge-couple';
                                } else if (tag.includes('FAMILY') || tag.includes('GROUP')) {
                                    tagClass = 'rb-badge-family';
                                } else if (tag.includes('SOLO')) {
                                    tagClass = 'rb-badge-solo';
                                }

                                // Format price nicely
                                const formattedPrice = parseFloat(item.price)?.toLocaleString('en-IN') || item.price;
                                const durationText = item.nights > 0 
                                    ? `${item.nights} nights / ${item.price_unit?.toLowerCase() || 'person'}` 
                                    : `${item.duration || '5 Nights'} / ${item.price_unit?.toLowerCase() || 'person'}`;

                                return (
                                    <SwiperSlide key={item.id} style={{ height: 'auto' }}>
                                        <div className="rb-card">
                                            {/* Header Booking Activity Bar */}
                                            <div className="rb-card-header">
                                                <div className="rb-avatar" style={{ backgroundColor: avatarBg }}>
                                                    {initials}
                                                </div>
                                                <div className="rb-header-text" title={bookingInfo}>
                                                    {bookingInfo}
                                                </div>
                                            </div>

                                            {/* Card Image */}
                                            <div className="rb-img-wrap">
                                                <img 
                                                    src={getImageSrc(item.image)} 
                                                    alt={item.title} 
                                                    className="rb-img"
                                                    onError={(e) => { e.target.src = '/assets/img/tour/tour_3_1.jpg'; }}
                                                />
                                            </div>

                                            {/* Card Details Body */}
                                            <div className="rb-body">
                                                <h3 className="rb-card-title">
                                                    <Link to={`/destination/${item.id}`}>{item.title}</Link>
                                                </h3>

                                                <div className="rb-meta-row">
                                                    <i className="fa-solid fa-location-dot rb-meta-icon"></i>
                                                    <span>{item.itinerary_summary || item.location}</span>
                                                </div>

                                                <span className={`rb-category-badge ${tagClass}`}>
                                                    {tag}
                                                </span>

                                                <div className="rb-card-divider"></div>

                                                {/* Card Footer price & CTA */}
                                                <div className="rb-footer">
                                                    <div className="rb-price-info">
                                                        <span className="rb-price">₹{formattedPrice}</span>
                                                        <span className="rb-price-unit">{durationText}</span>
                                                    </div>
                                                    <Link to={`/destination/${item.id}`} className="rb-btn-details">
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                ) : (
                    <div className="text-center py-5 border rounded bg-light">
                        <i className="fa-solid fa-plane-slash text-muted mb-3" style={{ fontSize: '48px' }}></i>
                        <p className="text-muted fw-semibold">No itineraries found matching the selected filters.</p>
                        <p className="small text-muted mt-1">Make sure you have packages marked as "Show in Recently Booked" in your dashboard.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default RecentlyBookedItineraries;
