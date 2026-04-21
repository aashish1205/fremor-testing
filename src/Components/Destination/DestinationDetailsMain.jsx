import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, EffectFade } from "swiper/modules";
import { fetchDestinationById, getImageSrc } from '../../services/destinationService';
import EnquirePopupForm from '../Forms/EnquirePopupForm';

function DestinationDetailsMain() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeTab, setActiveTab] = useState("");
    const [destinationPost, setDestinationPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEnquireOpen, setIsEnquireOpen] = useState(false);
    const { id } = useParams();

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
    const highlights = destinationPost.highlights_list?.length > 0 ? destinationPost.highlights_list : ["No highlights available."];
    const included = destinationPost.included_list?.length > 0 ? destinationPost.included_list : ["N/A"];
    const excluded = destinationPost.excluded_list?.length > 0 ? destinationPost.excluded_list : ["N/A"];

    return (
        <section className="space">
            <div className="container shape-mockup-wrap">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="tour-page-single">
                            <div className="slider-area tour-slider1">
                                <Swiper
                                    modules={[Navigation, Thumbs, EffectFade]}
                                    effect="fade"
                                    loop={true}
                                    spaceBetween={10}
                                    navigation={{
                                        prevEl: ".slider-prev",
                                        nextEl: ".slider-next",
                                    }}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    className="swiper th-slider mb-4"
                                    id="tourSlider4"
                                >
                                    {images.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="tour-slider-img" style={{ aspectRatio: '1508/880', width: '100%', overflow: 'hidden' }}>
                                                <img src={img} alt={`Slide ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <Swiper
                                    modules={[Navigation, Thumbs]}
                                    loop={true}
                                    spaceBetween={25}
                                    slidesPerView={3}
                                    watchSlidesProgress
                                    onSwiper={setThumbsSwiper}
                                    className="swiper th-slider tour-thumb-slider"
                                >
                                    {images.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="tour-slider-img" style={{ height: '120px' }}>
                                                <img src={img} alt={`Thumbnail ${index + 1}`} style={{ height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <button data-slider-prev="#tourSlider4" className="slider-arrow style3 slider-prev">
                                    <img src="/assets/img/icon/hero-arrow-left.svg" alt="" />
                                </button>
                                <button data-slider-next="#tourSlider4" className="slider-arrow style3 slider-next">
                                    <img src="/assets/img/icon/hero-arrow-right.svg" alt="" />
                                </button>
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
                                <div className="d-flex justify-content-between align-items-center mb-4">
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

                                <h2 className="box-title">Highlights</h2>
                                <p className="box-text mb-30">
                                    {destinationPost.highlights_text || "Explore the amazing highlights of this destination."}
                                </p>
                                <div className="checklist mb-50">
                                    <ul>
                                        {highlights.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <h2 className="box-title">Basic Information</h2>
                                <p className="blog-text mb-35">
                                    {destinationPost.basic_info_text || "General information about arriving and departing."}
                                </p>
                                <div className="destination-checklist mb-50">
                                    <div className="checklist style2 d-flex gap-5">
                                        <ul>
                                            <li><span className='fw-bold me-2'>Location:</span> {destinationPost.location || destinationPost.title}</li>
                                            <li><span className='fw-bold me-2'>Rating:</span> {destinationPost.rating}</li>
                                        </ul>
                                    </div>
                                </div>

                                <h2 className="box-title">Included and Excluded</h2>
                                <div className="destination-checklist d-flex gap-5">
                                    <div className="checklist style2 style4 w-50">
                                        <ul>
                                            {included.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="checklist style5 w-50">
                                        <ul>
                                            {excluded.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {itinerary.length > 0 && (
                                    <>
                                        <h3 className="page-title mt-50 mb-0">Tour Plan</h3>
                                        <div>
                                            <ul className="nav nav-tabs tour-tab mt-10" role="tablist">
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
                                                                <div className="mb-4">
                                                                    <img 
                                                                        src={getImageSrc(dayObj.image)} 
                                                                        alt={dayObj.day} 
                                                                        className="w-100 rounded" 
                                                                        style={{ aspectRatio: '1508/880', objectFit: 'cover' }} 
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
                                    </>
                                )}

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
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> City Tour</Link></li>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> Beach Tours</Link></li>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> Wildlife Tours</Link></li>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> Adventure Tours</Link></li>
                                </ul>
                            </div>
                            <div className="widget widget_tag_cloud  ">
                                <h3 className="widget_title">Popular Tags</h3>
                                <div className="tagcloud">
                                    <Link to="/blog">Tour</Link>
                                    <Link to="/blog">Adventure</Link>
                                    <Link to="/blog">Rent</Link>
                                    <Link to="/blog">Luxury</Link>
                                    <Link to="/blog">Travel</Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
            
            <EnquirePopupForm 
                isOpen={isEnquireOpen} 
                onClose={() => setIsEnquireOpen(false)} 
                destinationTitle={destinationPost?.title} 
            />
        </section>
    );
}

export default DestinationDetailsMain;
