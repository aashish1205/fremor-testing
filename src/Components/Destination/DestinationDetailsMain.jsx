import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, EffectFade } from "swiper/modules";
import { fetchDestinationById, getImageSrc } from '../../services/destinationService';
import EnquirePopupForm from '../Forms/EnquirePopupForm';
import CallbackCard from '../Forms/CallbackCard';

function DestinationDetailsMain() {
    const [activeTab, setActiveTab] = useState("");
    const [destinationPost, setDestinationPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEnquireOpen, setIsEnquireOpen] = useState(false);
    const [selectedHighlight, setSelectedHighlight] = useState(null);
    const [hoverHighlight, setHoverHighlight] = useState(null);
    const hoverTimeout = useRef(null);
    const { id } = useParams();

    const handleMouseEnter = (hl) => {
        if (window.innerWidth >= 992 && window.matchMedia("(hover: hover)").matches) {
            if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
            setHoverHighlight(hl);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 992 && window.matchMedia("(hover: hover)").matches) {
            hoverTimeout.current = setTimeout(() => {
                setHoverHighlight(null);
            }, 150);
        }
    };

    useEffect(() => {
        const loadDestination = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchDestinationById(id);
                setDestinationPost(data);
                if (data && data.itinerary && data.itinerary.length > 0) {
                    setActiveTab(data.itinerary[0].day);
                }
            } catch (err) {
                console.error('Error fetching destination:', err);
                setError('Destination not found!');
            } finally {
                setLoading(false);
            }
        };

        if (id) loadDestination();
    }, [id]);

    if (loading) return <div className="text-center py-5"><h3>Loading destination...</h3></div>;
    if (error || !destinationPost) return <div className="text-center py-5"><h3>{error || 'Destination not found'}</h3></div>;

    const FallbackImages = [
        "/assets/img/destination/destination_details_1.jpg",
        "/assets/img/destination/destination_details_2.jpg",
        "/assets/img/destination/destination_details_3.jpg",
        "/assets/img/destination/destination_details_1.jpg",
    ];

    let images = [getImageSrc(destinationPost.image)];
    if (destinationPost.gallery_images && destinationPost.gallery_images.length > 0) {
        images = [images[0], ...destinationPost.gallery_images.map(getImageSrc)];
    } else {
        images = [...images, ...FallbackImages.slice(1)];
    }

    const itinerary = destinationPost.itinerary?.length > 0 ? destinationPost.itinerary : [];
    const richHighlights = destinationPost.rich_highlights?.length > 0 ? destinationPost.rich_highlights : [];
    const included = destinationPost.included_list?.length > 0 ? destinationPost.included_list : ["N/A"];
    const excluded = destinationPost.excluded_list?.length > 0 ? destinationPost.excluded_list : ["N/A"];

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .highlights-rich-section .highlight-card-wrapper {
                    perspective: 1000px;
                }
                .highlights-rich-section .highlight-card {
                    transform-origin: center bottom;
                }
                .highlights-rich-section .highlight-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 40px rgba(12, 72, 110, 0.2) !important;
                }
                .highlight-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.6);
                    z-index: 999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(5px);
                    opacity: 0;
                    animation: fadeIn 0.3s forwards;
                    padding: 20px;
                }
                .highlight-modal-content {
                    background: #fff;
                    border-radius: 20px;
                    overflow: hidden;
                    width: 100%;
                    max-width: 850px;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: row;
                    position: relative;
                    box-shadow: 0 25px 80px rgba(0,0,0,0.5);
                    transform: scale(0.9);
                    animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                .highlight-modal-close {
                    position: absolute;
                    top: 15px; right: 15px;
                    background: #fff;
                    border: none;
                    width: 35px; height: 35px;
                    border-radius: 50%;
                    font-size: 20px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    z-index: 10;
                    color: #333;
                }
                @keyframes fadeIn { to { opacity: 1; } }
                @keyframes scaleUp { to { transform: scale(1); } }
                @media (max-width: 768px) {
                    .highlight-modal-content {
                        flex-direction: column;
                        overflow-y: auto;
                    }
                }
                
                .highlights-slider-wrapper {
                    position: relative;
                    padding: 0 40px;
                }
                .hl-nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px; height: 40px;
                    background: #fff;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    cursor: pointer;
                    z-index: 10;
                    color: #0c486e;
                    border: 1px solid #eee;
                    transition: all 0.3s;
                }
                .hl-nav-btn:hover {
                    background: #0c486e;
                    color: #fff;
                }
                .hl-prev { left: -10px; }
                .hl-next { right: -10px; }

                /* Desktop Hover Popup */
                .highlight-hover-modal-content {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 850px;
                    max-width: 90vw;
                    min-height: 250px;
                    background: #fff;
                    z-index: 9999999;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 25px 80px rgba(0,0,0,0.5);
                    animation: scaleUp 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    display: flex;
                }

                /* Mobile Tour Plan Scrollable Tabs */
                .tour-plan-tabs {
                    flex-wrap: wrap;
                }
                @media (max-width: 991px) {
                    .tour-plan-tabs {
                        flex-wrap: nowrap !important;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none; /* Firefox */
                        -ms-overflow-style: none;  /* IE and Edge */
                        padding-bottom: 10px !important;
                    }
                    .tour-plan-tabs::-webkit-scrollbar {
                        display: none; /* Chrome, Safari and Opera */
                    }
                    .tour-plan-tabs .nav-item {
                        flex: 0 0 auto;
                    }
                }
            `}} />
        <section className="space">
            <div className="container shape-mockup-wrap">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="tour-page-single">
                            <div className="tour-single-img mb-4" style={{ overflow: 'hidden', borderRadius: '16px', backgroundColor: '#f8f9fa' }}>
                                <img 
                                    src={images[0]} 
                                    alt={destinationPost.title} 
                                    style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }} 
                                />
                            </div>
                            <div className="page-content">
                                <div className="page-meta mb-45">
                                    <Link className="page-tag mr-5" to="/destination">
                                        Destination
                                    </Link>
                                    <span className="ratting">
                                        <i className="fa-sharp fa-solid fa-star" />
                                        <span>{destinationPost.rating || 4.8}</span>
                                    </span>
                                </div>
                                <h2 className="box-title">{destinationPost.title}</h2>
                                <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-start align-items-md-center mb-4 gap-3">
                                    <h4 className="tour-price m-0">
                                        <span className="text-muted d-block" style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px', color: '#687176' }}>Starting from</span>
                                        <span className="currency">₹{destinationPost.price}</span>/{destinationPost.price_unit || 'Person'}
                                    </h4>
                                    <button className="th-btn style3" onClick={() => setIsEnquireOpen(true)}>
                                        <i className="fa-solid fa-paper-plane me-2"></i> Enquire Now
                                    </button>
                                </div>
                                <p className="box-text mb-30">
                                    {destinationPost.description_1 || "No description provided."}
                                </p>
                                <p className="box-text mb-50">
                                    {destinationPost.description_2 || ""}
                                </p>

                                {itinerary.length > 0 && (
                                    <div className="mb-50 mt-4">
                                        <h2 className="box-title">Tour Plan</h2>
                                        <div>
                                            <ul className="nav nav-tabs tour-tab mt-10 tour-plan-tabs" role="tablist" style={{ borderBottom: 'none', paddingBottom: '5px' }}>
                                                {itinerary.map((dayObj) => (
                                                    <li className="nav-item" key={dayObj.day} role="presentation">
                                                        <button
                                                            className={`nav-link ${activeTab === dayObj.day ? "active" : ""}`}
                                                            onClick={() => setActiveTab(dayObj.day)}
                                                            type="button"
                                                            role="tab"
                                                        >
                                                            {dayObj.day}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="tab-content">
                                                {itinerary.map((dayObj) => (
                                                    <div
                                                        key={dayObj.day}
                                                        className={`tab-pane fade ${activeTab === dayObj.day ? "show active" : ""}`}
                                                        role="tabpanel"
                                                    >
                                                        <div className="tour-grid-plan">
                                                            {dayObj.image && (
                                                                <div className="mb-4 bg-light rounded" style={{ overflow: 'hidden' }}>
                                                                    <img 
                                                                        src={getImageSrc(dayObj.image)} 
                                                                        alt={dayObj.day} 
                                                                        className="w-100" 
                                                                        style={{ height: 'auto', maxHeight: '500px', objectFit: 'contain' }} 
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="checklist">
                                                                <ul>
                                                                    {dayObj.activities.map((item, index) => (
                                                                        <li key={index}>{item}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {richHighlights && richHighlights.length > 0 && (
                                    <div className="mb-50 mt-5 highlights-rich-section position-relative">
                                        <div className="d-flex justify-content-between align-items-center mb-30">
                                            <div>
                                                <h2 className="box-title m-0">Highlights</h2>
                                                <p className="box-text m-0 mt-2">
                                                    {destinationPost.highlights_text || "Explore the amazing highlights of this destination. Click on any card to view details."}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="highlights-slider-wrapper">
                                            <div className="hl-nav-btn hl-prev"><i className="fa-solid fa-chevron-left"></i></div>
                                            <div className="hl-nav-btn hl-next"><i className="fa-solid fa-chevron-right"></i></div>
                                            <Swiper
                                                modules={[Navigation]}
                                                navigation={{ prevEl: '.hl-prev', nextEl: '.hl-next' }}
                                                loop={richHighlights.length > 3}
                                                spaceBetween={20}
                                                slidesPerView={3}
                                                breakpoints={{
                                                    0: { slidesPerView: 1 },
                                                    768: { slidesPerView: 2 },
                                                    1024: { slidesPerView: 3 }
                                                }}
                                                className="highlights-swiper"
                                            >
                                                {richHighlights.map((hl, i) => (
                                                    <SwiperSlide key={i} style={{ padding: '10px 0 30px' }}>
                                                        <div 
                                                            className="highlight-card-wrapper position-relative" 
                                                            onMouseEnter={() => handleMouseEnter(hl)}
                                                            onMouseLeave={handleMouseLeave}
                                                            onClick={() => {
                                                                if (window.innerWidth < 992 || window.matchMedia("(hover: none)").matches) {
                                                                    setSelectedHighlight(hl);
                                                                }
                                                            }}
                                                        >
                                                            <div className="highlight-card" style={{ 
                                                                borderRadius: '16px', overflow: 'hidden', 
                                                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)', cursor: 'pointer',
                                                                transition: 'all 0.3s ease', background: '#fff'
                                                            }}>
                                                                <div style={{ height: '220px', width: '100%', overflow: 'hidden' }}>
                                                                    <img src={getImageSrc(hl.image)} alt={hl.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                </div>
                                                                <div className="p-3 bg-white text-center">
                                                                    <h5 className="m-0" style={{ fontSize: '18px', fontWeight: '700', color: '#0c486e' }}>{hl.title}</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        </div>
                                    </div>
                                )}

                                <h2 className="box-title">Basic Information</h2>
                                <p className="blog-text mb-35">
                                    {destinationPost.basic_info_text || "General information about arriving and departing."}
                                </p>
                                <div className="destination-checklist mb-50">
                                    <div className="checklist style2 d-flex flex-column flex-md-row gap-3 gap-md-5">
                                        <ul>
                                            <li><span className='fw-bold me-2'>Location:</span> {destinationPost.location || destinationPost.title}</li>
                                            <li><span className='fw-bold me-2'>Rating:</span> {destinationPost.rating}</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="table-responsive mb-50" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(12, 72, 110, 0.15)', border: '1px solid #f0f0f0' }}>
                                    <table className="table table-bordered mb-0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ backgroundColor: '#0c486e', color: 'white', padding: '15px 20px', textAlign: 'left', width: '50%', fontSize: '18px', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none' }}>
                                                    <i className="fa-solid fa-check-circle me-2"></i> Inclusions
                                                </th>
                                                <th style={{ backgroundColor: '#dc3545', color: 'white', padding: '15px 20px', textAlign: 'left', width: '50%', fontSize: '18px', borderBottom: 'none' }}>
                                                    <i className="fa-solid fa-times-circle me-2"></i> Exclusions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '20px', verticalAlign: 'top', borderRight: '1px solid #dee2e6' }}>
                                                    <div className="checklist style2 style4">
                                                        <ul style={{ marginBottom: 0 }}>
                                                            {included.map((item, i) => (
                                                                <li key={i}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '20px', verticalAlign: 'top' }}>
                                                    <div className="checklist style5">
                                                        <ul style={{ marginBottom: 0 }}>
                                                            {excluded.map((item, i) => (
                                                                <li key={i}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Download Brochure Section */}
                                {destinationPost.brochure_url && (
                                    <div className="brochure-download-section mt-50 mb-30" style={{
                                        background: 'linear-gradient(135deg, #0c2340 0%, #1a4a7a 100%)',
                                        borderRadius: '16px',
                                        padding: '40px 35px',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-20px',
                                            right: '-20px',
                                            width: '120px',
                                            height: '120px',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '50%'
                                        }}></div>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-30px',
                                            right: '60px',
                                            width: '80px',
                                            height: '80px',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '50%'
                                        }}></div>
                                        <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                                            <div style={{
                                                width: '70px',
                                                height: '70px',
                                                background: 'rgba(255,255,255,0.1)',
                                                borderRadius: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <i className="fa-solid fa-file-pdf" style={{
                                                    fontSize: '32px',
                                                    color: '#ff6b6b'
                                                }}></i>
                                            </div>
                                            <div className="flex-grow-1 text-center text-md-start">
                                                <h4 style={{
                                                    color: '#ffffff',
                                                    fontWeight: 700,
                                                    marginBottom: '8px',
                                                    fontSize: '22px'
                                                }}>
                                                    Download Full Package Brochure
                                                </h4>
                                                <p style={{
                                                    color: 'rgba(255,255,255,0.7)',
                                                    margin: 0,
                                                    fontSize: '15px',
                                                    lineHeight: '1.5'
                                                }}>
                                                    Get the complete details of this {destinationPost.title} package including
                                                    pricing, itinerary, hotel details, and more.
                                                </p>
                                            </div>
                                            <a
                                                href={destinationPost.brochure_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                className="th-btn style3 th-icon"
                                                style={{
                                                    whiteSpace: 'nowrap',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '15px 30px',
                                                    fontSize: '16px',
                                                    fontWeight: 600,
                                                    flexShrink: 0
                                                }}
                                                id="download-brochure-btn"
                                            >
                                                <i className="fa-solid fa-download"></i>
                                                Download Brochure
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* SIDEBAR ... */}
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            <div className="widget widget_search  ">
                                <form className="search-form">
                                    <input type="text" placeholder="Search" />
                                    <button type="submit">
                                        <i className="far fa-search" />
                                    </button>
                                </form>
                            </div>
                            <div className="widget widget_categories  ">
                                <h3 className="widget_title">Categories</h3>
                                <ul>
                                    <li>
                                        <Link to="/destination?package_type=Standard">
                                            <i className="fa-solid fa-box text-primary me-2"></i>
                                            Standard Package
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/destination?package_type=Premium">
                                            <i className="fa-solid fa-gem text-info me-2"></i>
                                            Premium Package
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/destination?package_type=Luxury">
                                            <i className="fa-solid fa-crown text-warning me-2"></i>
                                            Luxury Package
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <CallbackCard />
                        </aside>
                    </div>
                </div>
            </div>
            
            {hoverHighlight && (
                <div 
                    className="highlight-hover-modal-content d-none d-lg-flex" 
                    onMouseEnter={() => handleMouseEnter(hoverHighlight)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div style={{ width: '50%', flexShrink: 0 }}>
                        <img src={getImageSrc(hoverHighlight.image)} alt={hoverHighlight.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ width: '50%', padding: '40px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ color: '#0c486e', fontWeight: 'bold', marginBottom: '20px' }}>{hoverHighlight.title}</h3>
                        <p className="text-muted m-0" style={{ fontSize: '16px', lineHeight: '1.7' }}>{hoverHighlight.description}</p>
                    </div>
                </div>
            )}
            
            {selectedHighlight && (
                <div className="highlight-modal-overlay" onClick={() => setSelectedHighlight(null)}>
                    <div className="highlight-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="highlight-modal-close" onClick={() => setSelectedHighlight(null)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <div style={{ width: '100%', flex: '1 1 50%', minHeight: '250px' }}>
                            <img src={getImageSrc(selectedHighlight.image)} alt={selectedHighlight.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ width: '100%', flex: '1 1 50%', padding: '40px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h3 style={{ color: '#0c486e', fontWeight: 'bold', marginBottom: '20px' }}>{selectedHighlight.title}</h3>
                            <p className="text-muted m-0" style={{ fontSize: '16px', lineHeight: '1.7' }}>{selectedHighlight.description}</p>
                        </div>
                    </div>
                </div>
            )}

            <EnquirePopupForm 
                isOpen={isEnquireOpen} 
                onClose={() => setIsEnquireOpen(false)} 
                destinationTitle={destinationPost?.title} 
            />
        </section>
        </>
    );
}

export default DestinationDetailsMain;
