import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DestinationCard from './DestinationCard';
import DestinationCardTwo from './DestinationCardTwo';
import { fetchDestinations, searchDestinations } from '../../services/destinationService';
import { fetchBlogs, getBlogImageSrc } from '../../services/blogService';
import CallbackCard from '../Forms/CallbackCard';

function DestinationInner({ category: propCategory }) {
    const [activeTab, setActiveTab] = useState('tab-grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams] = useSearchParams();
    const [recentBlogs, setRecentBlogs] = useState([]);
    const category = propCategory || searchParams.get('category');
    const packageType = searchParams.get('package_type');

    // Filter states
    const [selectedMinPrice, setSelectedMinPrice] = useState(0);
    const [selectedMaxPrice, setSelectedMaxPrice] = useState(300000);
    const [minPriceLimit, setMinPriceLimit] = useState(0);
    const [maxPriceLimit, setMaxPriceLimit] = useState(300000);
    const [selectedDurations, setSelectedDurations] = useState([]);
    const [selectedAccommodations, setSelectedAccommodations] = useState([]);
    const [selectedPackageTypes, setSelectedPackageTypes] = useState([]);
    const [activeSlider, setActiveSlider] = useState('min');
    const [showAllDurations, setShowAllDurations] = useState(false);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
        if (!clientX) return;
        const clickX = clientX - rect.left;
        const width = rect.width;
        if (!width) return;
        const clickPercent = (clickX / width) * 100;
        
        const limitDiff = maxPriceLimit - minPriceLimit;
        const minPercent = limitDiff === 0 ? 0 : ((selectedMinPrice - minPriceLimit) / limitDiff) * 100;
        const maxPercent = limitDiff === 0 ? 100 : ((selectedMaxPrice - minPriceLimit) / limitDiff) * 100;
        
        const distToMin = Math.abs(clickPercent - minPercent);
        const distToMax = Math.abs(clickPercent - maxPercent);
        
        if (distToMin < distToMax) {
            setActiveSlider('min');
        } else {
            setActiveSlider('max');
        }
    };
    
    const postsPerPage = 12;

    // Initialize price limits and reset active filters when master destinations list is loaded
    useEffect(() => {
        if (destinations.length > 0) {
            const prices = destinations.map(d => d.price).filter(p => typeof p === 'number');
            const minP = prices.length ? Math.min(...prices) : 0;
            const maxP = prices.length ? Math.max(...prices) : 300000;
            setMinPriceLimit(minP);
            setMaxPriceLimit(maxP);
            setSelectedMinPrice(minP);
            setSelectedMaxPrice(maxP);
            setSelectedDurations([]);
            setSelectedAccommodations([]);
            setSelectedPackageTypes([]);
        }
    }, [destinations]);

    // Reset page on filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedMinPrice, selectedMaxPrice, selectedDurations, selectedAccommodations, selectedPackageTypes]);

    const urlSearchQuery = searchParams.get('search') || '';

    // Fetch destinations on mount and when filters change
    useEffect(() => {
        loadDestinations();
        loadRecentBlogs();
        // Reset to first page when category, package_type or search query changes
        setCurrentPage(1);
    }, [category, packageType, urlSearchQuery]);

    const loadRecentBlogs = async () => {
        try {
            const blogsData = await fetchBlogs();
            setRecentBlogs(blogsData.slice(0, 3));
        } catch (err) {
            console.error('Error fetching recent blogs:', err);
        }
    };

    const loadDestinations = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const searchParamVal = searchParams.get('search') || '';
            setSearchQuery(searchParamVal);

            let data;
            if (searchParamVal.trim() !== '') {
                data = await searchDestinations(searchParamVal);
                // Also apply category/packageType filters to search results if present
                if (category) {
                    data = data.filter(d => d.category && d.category.toLowerCase() === category.toLowerCase());
                }
                if (packageType) {
                    data = data.filter(d => d.package_type && d.package_type.toLowerCase() === packageType.toLowerCase());
                }
            } else {
                data = await fetchDestinations(category, packageType);
            }
            setDestinations(data);
        } catch (err) {
            console.error('Error fetching destinations:', err);
            setError('Failed to load destinations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            setCurrentPage(1);
            if (searchQuery.trim() === '') {
                const data = await fetchDestinations(category, packageType);
                setDestinations(data);
            } else {
                let data = await searchDestinations(searchQuery);
                // Also apply category/packageType filters to search results if present
                if (category) {
                    data = data.filter(d => d.category && d.category.toLowerCase() === category.toLowerCase());
                }
                if (packageType) {
                    data = data.filter(d => d.package_type && d.package_type.toLowerCase() === packageType.toLowerCase());
                }
                setDestinations(data);
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filtered destinations list
    const displayedDestinations = destinations.filter(dest => {
        // Price Filter (only apply if adjusted from default limits)
        const price = dest.price || 0;
        const isPriceAdjusted = selectedMinPrice !== minPriceLimit || selectedMaxPrice !== maxPriceLimit;
        if (isPriceAdjusted) {
            if (price < selectedMinPrice || price > selectedMaxPrice) return false;
        }

        // Duration Filter
        if (selectedDurations.length > 0) {
            const nights = dest.nights || 0;
            if (!selectedDurations.includes(nights)) return false;
        }

        // Accommodation Filter
        if (selectedAccommodations.length > 0) {
            const acc = dest.accommodation_type || '3 Star';
            if (!selectedAccommodations.includes(acc)) return false;
        }

        // Package Type (Category Type) Filter
        if (selectedPackageTypes.length > 0) {
            const type = (dest.package_type || 'Standard').toLowerCase();
            const selectedLower = selectedPackageTypes.map(t => t.toLowerCase());
            if (!selectedLower.includes(type)) return false;
        }

        return true;
    });

    const totalPages = Math.ceil(displayedDestinations.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = displayedDestinations.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Extract unique durations (nights) from loaded destinations
    const uniqueNights = Array.from(new Set(destinations.map(d => d.nights || 0))).sort((a, b) => a - b);
    
    // Standard accommodations options
    const accommodationOptions = ['2 Star', '3 Star', '4 Star', '5 Star'];

    // Dynamic Counts calculations (Independent from other sidebar filters to reflect active catalog options)
    const getDurationCount = (nightsVal) => {
        return destinations.filter(dest => (dest.nights || 0) === nightsVal).length;
    };

    const getAccommodationCount = (accVal) => {
        return destinations.filter(dest => {
            const acc = dest.accommodation_type || '3 Star';
            return acc === accVal;
        }).length;
    };

    const handleDurationToggle = (nightsVal) => {
        setSelectedDurations(prev => 
            prev.includes(nightsVal) 
                ? prev.filter(n => n !== nightsVal) 
                : [...prev, nightsVal]
        );
    };

    const handleAccommodationToggle = (accVal) => {
        setSelectedAccommodations(prev => 
            prev.includes(accVal) 
                ? prev.filter(a => a !== accVal) 
                : [...prev, accVal]
        );
    };

    const getPackageTypeCount = (typeVal) => {
        return destinations.filter(dest => {
            const type = dest.package_type || 'Standard';
            return type.toLowerCase() === typeVal.toLowerCase();
        }).length;
    };

    const handlePackageTypeToggle = (typeVal) => {
        setSelectedPackageTypes(prev => 
            prev.includes(typeVal) 
                ? prev.filter(t => t !== typeVal) 
                : [...prev, typeVal]
        );
    };

    return (
        <section className="space">
            <div className="container">
                <div className="th-sort-bar">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-md-4">
                            <div className="search-form-area">
                                <form className="search-form" onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        placeholder="Search destinations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button type="submit">
                                        <i className="fa-light fa-magnifying-glass" />
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <div className="sorting-filter-wrap">
                                <div className="nav" role="tablist">
                                    <Link
                                        to="#"
                                        id="tab-destination-grid"
                                        data-bs-toggle="tab"
                                        data-bs-target="#tab-grid"
                                        role="tab"
                                        aria-controls="tab-grid"
                                        aria-selected="true"
                                        className={`${activeTab === 'tab-grid' ? 'active' : ''}`}
                                        type="button"
                                        onClick={() => setActiveTab('tab-grid')}
                                    >
                                        <i className="fa-light fa-grid-2" />
                                    </Link>
                                    <Link
                                        to="#"
                                        id="tab-destination-list"
                                        data-bs-toggle="tab"
                                        data-bs-target="#tab-list"
                                        role="tab"
                                        aria-controls="tab-list"
                                        aria-selected="false"
                                        className={`${activeTab === 'tab-list' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('tab-list')}
                                    >
                                        <i className="fa-solid fa-list" />
                                    </Link>
                                </div>
                                <form className="woocommerce-ordering" method="get">
                                    <select
                                        name="orderby"
                                        className="orderby"
                                        aria-label="destination order"
                                    >
                                        <option value="menu_order" >
                                            Default Sorting
                                        </option>
                                        <option value="popularity">Sort by popularity</option>
                                        <option value="rating">Sort by average rating</option>
                                        <option value="date">Sort by latest</option>
                                        <option value="price">Sort by price: low to high</option>
                                        <option value="price-desc">Sort by price: high to low</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xxl-9 col-lg-8">
                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3" style={{ color: '#666' }}>Loading destinations...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="alert alert-danger text-center" role="alert">
                                <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                {error}
                                <button className="btn btn-outline-danger btn-sm ms-3" onClick={loadDestinations}>
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && (destinations.length === 0 || displayedDestinations.length === 0) && (
                            <div className="text-center py-5">
                                <i className="fa-light fa-map-location-dot" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                                <h4 className="mt-3" style={{ color: '#999' }}>No destinations found</h4>
                                <p style={{ color: '#aaa' }}>
                                    {destinations.length === 0 
                                        ? (searchQuery ? 'Try a different search term.' : 'Destinations will appear here once added.')
                                        : 'No destinations match your active refine search filters.'}
                                </p>
                            </div>
                        )}

                        {/* Content */}
                        {!loading && !error && displayedDestinations.length > 0 && (
                            <div className="tab-content" id="nav-tabContent">
                                <div className={`tab-pane fade ${activeTab === 'tab-grid' ? 'show active' : ''}`} id="tab-grid" role="tabpanel"
                                >
                                    <div className="row gy-30">
                                        {currentPosts.map((data) => (
                                            <div key={data.id} className="col-xxl-4 col-xl-6">
                                                <DestinationCard
                                                    destinationID={data.id}
                                                    destinationImage={data.image}
                                                    destinationTitle={data.title}
                                                    destinationPrice={data.price}
                                                    destinationDuration={data.duration}
                                                    destinationPriceUnit={data.price_unit}
                                                    destinationNights={data.nights}
                                                    destinationDays={data.days}
                                                    rating={data.rating}
                                                    ratingCount={data.rating_count}
                                                    originalPrice={data.original_price}
                                                    isRecommended={data.is_recommended}
                                                    badgeText={data.badge_text}
                                                    loyaltyPoints={data.loyalty_points}
                                                    inclusions={data.inclusions}
                                                    location={data.location}
                                                    itinerarySummary={data.itinerary_summary}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={`tab-pane fade ${activeTab === 'tab-list' ? 'show active' : ''}`} id="tab-list" role="tabpanel"
                                >
                                    <div className="row gy-30">
                                        {currentPosts.map((data) => (
                                            <div key={data.id} className="col-12">
                                                <DestinationCardTwo
                                                    destinationID={data.id}
                                                    destinationImage={data.image}
                                                    destinationTitle={data.title}
                                                    destinationPrice={`₹${data.price}`}
                                                    destinationDuration={data.duration}
                                                    destinationPriceUnit={data.price_unit}
                                                    destinationNights={data.nights}
                                                    destinationDays={data.days}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && !error && totalPages > 1 && (
                            <div className="th-pagination text-center mt-60 mb-0">
                                <ul>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <li key={i}>
                                            <Link
                                                className={currentPage === i + 1 ? 'active' : ''}
                                                to="#"
                                                onClick={() => handlePageChange(i + 1)}
                                            >
                                                {i + 1}
                                            </Link>
                                        </li>
                                    ))}
                                    {currentPage < totalPages && (
                                        <li>
                                            <Link className="next-page" to="#" onClick={() => handlePageChange(currentPage + 1)}>
                                                Next <img src="/assets/img/icon/arrow-right4.svg" alt="" />
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="col-xxl-3 col-lg-4">
                        <aside className="sidebar-area style2">
                            <div className="widget refine-search-widget">
                                <h3 className="widget_title" style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>Refine Search</h3>
                                
                                {/* 1. Price Per Person */}
                                <div className="filter-section mb-4">
                                    <h4 className="filter-title fw-bold mb-3" style={{ fontSize: '16px', color: '#1e293b' }}>Price Per Person</h4>
                                    <div className="price-slider-container px-1">
                                        <div 
                                            className="double-range-slider position-relative" 
                                            style={{ height: '24px', cursor: 'pointer' }}
                                            onMouseMove={handleMouseMove}
                                            onTouchMove={handleMouseMove}
                                        >
                                            <input
                                                type="range"
                                                min={minPriceLimit}
                                                max={maxPriceLimit}
                                                step={100}
                                                value={selectedMinPrice}
                                                onChange={(e) => {
                                                    const val = Math.min(Number(e.target.value), selectedMaxPrice - 100);
                                                    setSelectedMinPrice(val);
                                                }}
                                                className="thumb thumb--left"
                                                style={{ zIndex: activeSlider === 'min' ? '5' : '3' }}
                                            />
                                            <input
                                                type="range"
                                                min={minPriceLimit}
                                                max={maxPriceLimit}
                                                step={100}
                                                value={selectedMaxPrice}
                                                onChange={(e) => {
                                                    const val = Math.max(Number(e.target.value), selectedMinPrice + 100);
                                                    setSelectedMaxPrice(val);
                                                }}
                                                className="thumb thumb--right"
                                                style={{ zIndex: activeSlider === 'max' ? '5' : '3' }}
                                            />
                                            <div className="slider-track" />
                                            <div className="slider-range" style={{ 
                                                left: minPriceLimit === maxPriceLimit ? '0%' : `${((selectedMinPrice - minPriceLimit) / (maxPriceLimit - minPriceLimit)) * 100}%`,
                                                width: minPriceLimit === maxPriceLimit ? '100%' : `${((selectedMaxPrice - selectedMinPrice) / (maxPriceLimit - minPriceLimit)) * 100}%`
                                            }} />
                                        </div>
                                        <div className="d-flex justify-content-between mt-1 text-dark fw-bold" style={{ fontSize: '14px' }}>
                                            <span>₹{selectedMinPrice.toLocaleString()}</span>
                                            <span>₹{selectedMaxPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Duration */}
                                <div className="filter-section mb-4 border-top pt-3">
                                    <h4 className="filter-title fw-bold mb-3" style={{ fontSize: '16px', color: '#1e293b' }}>Duration</h4>
                                    <div className="filter-options">
                                        {(() => {
                                            const activeDurations = uniqueNights.filter(nightsVal => getDurationCount(nightsVal) > 0);
                                            const displayedDurations = showAllDurations ? activeDurations : activeDurations.slice(0, 3);
                                            
                                            return (
                                                <>
                                                    {displayedDurations.map(nightsVal => {
                                                        const count = getDurationCount(nightsVal);
                                                        const label = `${nightsVal}N`;
                                                        const isChecked = selectedDurations.includes(nightsVal);
                                                        const chkId = `duration-chk-${nightsVal}`;
                                                        return (
                                                            <div key={nightsVal} className="filter-checkbox-item d-flex align-items-center justify-content-between mb-2">
                                                                <div className="d-flex align-items-center">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        id={chkId}
                                                                        checked={isChecked}
                                                                        onChange={() => handleDurationToggle(nightsVal)}
                                                                        className="filter-checkbox"
                                                                        style={{ cursor: 'pointer' }}
                                                                    />
                                                                    <label htmlFor={chkId} className="mb-0 cursor-pointer fw-semibold text-secondary-emphasis" style={{ fontSize: '15px' }}>
                                                                        {label}
                                                                    </label>
                                                                </div>
                                                                <span className="text-muted small">({count})</span>
                                                            </div>
                                                        );
                                                    })}
                                                    {activeDurations.length === 0 && (
                                                        <p className="text-muted small mb-0">No durations available</p>
                                                    )}
                                                    {activeDurations.length > 3 && (
                                                        <button 
                                                            type="button"
                                                            onClick={() => setShowAllDurations(!showAllDurations)} 
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#0d496e',
                                                                fontWeight: '700',
                                                                fontSize: '14px',
                                                                padding: '0',
                                                                marginTop: '8px',
                                                                cursor: 'pointer',
                                                                transition: 'color 0.3s ease',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.color = '#FFB114'}
                                                            onMouseLeave={(e) => e.target.style.color = '#0d496e'}
                                                        >
                                                            {showAllDurations ? 'Show Less' : `+ Show More (${activeDurations.length - 3} more)`}
                                                        </button>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* 3. Accommodation Type */}
                                <div className="filter-section border-top pt-3">
                                    <h4 className="filter-title fw-bold mb-3" style={{ fontSize: '16px', color: '#1e293b' }}>Accommodation Type</h4>
                                    <div className="filter-options">
                                        {(() => {
                                            const activeAccommodations = accommodationOptions.filter(accVal => getAccommodationCount(accVal) > 0);
                                            return (
                                                <>
                                                    {activeAccommodations.map(accVal => {
                                                        const count = getAccommodationCount(accVal);
                                                        const isChecked = selectedAccommodations.includes(accVal);
                                                        const accId = `accommodation-chk-${accVal.replace(/\s+/g, '-')}`;
                                                        return (
                                                            <div key={accVal} className="filter-checkbox-item d-flex align-items-center justify-content-between mb-2">
                                                                <div className="d-flex align-items-center">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        id={accId}
                                                                        checked={isChecked}
                                                                        onChange={() => handleAccommodationToggle(accVal)}
                                                                        className="filter-checkbox"
                                                                        style={{ cursor: 'pointer' }}
                                                                    />
                                                                    <label htmlFor={accId} className="mb-0 cursor-pointer fw-semibold text-secondary-emphasis" style={{ fontSize: '15px' }}>
                                                                        {accVal} Hotels
                                                                    </label>
                                                                </div>
                                                                <span className="text-muted small">({count})</span>
                                                            </div>
                                                        );
                                                    })}
                                                    {activeAccommodations.length === 0 && (
                                                        <p className="text-muted small mb-0">No accommodation types available</p>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* 4. Category Type (Package Type) */}
                                {(() => {
                                    const activePackageTypes = ['Standard', 'Premium', 'Luxury'].filter(typeVal => getPackageTypeCount(typeVal) > 0);
                                    if (activePackageTypes.length === 0) return null;
                                    return (
                                        <div className="filter-section border-top pt-3 mt-3">
                                            <h4 className="filter-title fw-bold mb-3" style={{ fontSize: '16px', color: '#1e293b' }}>Category Type</h4>
                                            <div className="filter-options">
                                                {activePackageTypes.map(typeVal => {
                                                    const count = getPackageTypeCount(typeVal);
                                                    const isChecked = selectedPackageTypes.includes(typeVal);
                                                    const chkId = `package-type-chk-${typeVal.toLowerCase()}`;
                                                    return (
                                                        <div key={typeVal} className="filter-checkbox-item d-flex align-items-center justify-content-between mb-2">
                                                            <div className="d-flex align-items-center">
                                                                <input 
                                                                    type="checkbox" 
                                                                    id={chkId}
                                                                    checked={isChecked}
                                                                    onChange={() => handlePackageTypeToggle(typeVal)}
                                                                    className="filter-checkbox"
                                                                    style={{ cursor: 'pointer' }}
                                                                />
                                                                <label htmlFor={chkId} className="mb-0 cursor-pointer fw-semibold text-secondary-emphasis" style={{ fontSize: '15px' }}>
                                                                    {typeVal} Package
                                                                </label>
                                                            </div>
                                                            <span className="text-muted small">({count})</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                            
                            <CallbackCard />

                            <div className="widget  ">
                                <h3 className="widget_title">Recent Blog Posts</h3>
                                <div className="recent-post-wrap">
                                    {recentBlogs.map((blog) => (
                                        <div className="recent-post" key={blog.id}>
                                            <div className="media-img">
                                                <Link to={`/blog/${blog.id}`}>
                                                    <img
                                                        src={getBlogImageSrc(blog.main_image)}
                                                        alt="Blog"
                                                    />
                                                </Link>
                                            </div>
                                            <div className="media-body">
                                                <h4 className="post-title">
                                                    <Link className="text-inherit" to={`/blog/${blog.id}`}>
                                                        {blog.title}
                                                    </Link>
                                                </h4>
                                                <div className="recent-post-meta">
                                                    <Link to={`/blog/${blog.id}`}>
                                                        <i className="fa-regular fa-calendar" />
                                                        {new Date(blog.created_at).toLocaleDateString()}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/*<div
                                className="widget widget_offer  "
                                data-bg-src="/assets/img/bg/widget_bg_1.jpg"
                                style={{ backgroundImage: "url(/assets/img/bg/colorkit.png)" }}
                            >
                                <div className="offer-banner">
                                    <div className="offer">
                                        <h6 className="box-title">
                                            Need Help? We Are Here To Help You
                                        </h6>
                                        <div className="banner-logo">
                                            <img src="/assets/img/logo/FremorLogo.png" alt="Fremor" />
                                        </div>
                                        <div className="offer">
                                            <h6 className="offer-title">You Get Online support</h6>
                                            <Link className="offter-num" to={+919920499911}>
                                                +91 9920499911
                                            </Link>
                                        </div>
                                        <Link to="/contact" className="th-btn style2 th-icon">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>*/}
                        </aside>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default DestinationInner
