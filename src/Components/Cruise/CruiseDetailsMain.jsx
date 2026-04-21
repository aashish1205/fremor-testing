import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, EffectFade } from "swiper/modules";
import { fetchCruiseById, getCruiseImageSrc } from '../../services/cruiseService';
import EnquirePopupForm from '../Forms/EnquirePopupForm';

function CruiseDetailsMain() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [cruisePost, setCruisePost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEnquireOpen, setIsEnquireOpen] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const loadCruise = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchCruiseById(id);
                setCruisePost(data);
            } catch (err) {
                console.error('Error fetching cruise:', err);
                setError('Cruise not found!');
            } finally {
                setLoading(false);
            }
        };

        if (id) loadCruise();
    }, [id]);

    if (loading) return <div className="text-center py-5"><h3>Loading cruise details...</h3></div>;
    if (error || !cruisePost) return <div className="text-center py-5"><h3>{error || 'Cruise not found'}</h3></div>;

    let images = [getCruiseImageSrc(cruisePost.main_image)];
    if (cruisePost.image_gallery && cruisePost.image_gallery.length > 0) {
        images = [images[0], ...cruisePost.image_gallery.map(getCruiseImageSrc)];
    }

    const parseArraySafe = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
            try { return JSON.parse(data); } catch(e) { return []; }
        }
        return [];
    };

    const itinerary = parseArraySafe(cruisePost.itinerary_ports);
    const costs = parseArraySafe(cruisePost.costs_list);
    const notes = parseArraySafe(cruisePost.important_notes);

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
                                    loop={images.length > 1}
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
                                {images.length > 1 && (
                                    <Swiper
                                        modules={[Navigation, Thumbs]}
                                        loop={false}
                                        spaceBetween={25}
                                        slidesPerView={Math.min(3, images.length)}
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
                                )}
                                {images.length > 1 && (
                                    <>
                                        <button data-slider-prev="#tourSlider4" className="slider-arrow style3 slider-prev">
                                            <img src="/assets/img/icon/hero-arrow-left.svg" alt="" />
                                        </button>
                                        <button data-slider-next="#tourSlider4" className="slider-arrow style3 slider-next">
                                            <img src="/assets/img/icon/hero-arrow-right.svg" alt="" />
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="page-content">
                                <div className="page-meta mb-45">
                                    <Link className="page-tag mr-5" to="/cruise">
                                        Cruise
                                    </Link>
                                    <span className="ratting">
                                        <i className="fa-sharp fa-solid fa-star" />
                                        <span>{Number(cruisePost.rating).toFixed(1) || "5.0"}</span>
                                    </span>
                                </div>
                                <h2 className="box-title">{cruisePost.title}</h2>
                                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                                    <h4 className="tour-price m-0">
                                        <span className="text-muted d-block" style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px', color: '#687176' }}>Starting from</span>
                                        <span className="currency">₹{cruisePost.price_per_day}</span>
                                    </h4>
                                    <button className="th-btn style3" onClick={() => setIsEnquireOpen(true)}>
                                        <i className="fa-solid fa-paper-plane me-2"></i> Enquire Now
                                    </button>
                                </div>
                                <h3 className="h4 fw-bold mt-4" style={{ color: 'var(--title-color)' }}>Description</h3>
                                <p className="box-text mb-30" style={{ lineHeight: '1.8', color: '#666', fontSize: '15px' }}>
                                    {cruisePost.description || "No description provided."}
                                </p>
                                
                                <h3 className="h4 fw-bold mt-5 mb-4" style={{ color: 'var(--title-color)' }}>
                                    <i className="fa-solid fa-ship me-2" style={{ color: 'var(--theme-color)' }}></i> Basic Information
                                </h3>
                                <div className="destination-checklist mb-5">
                                    <div className="checklist style2 d-flex gap-4 flex-wrap p-4 rounded-4 shadow-sm" style={{ background: '#f8fbfc', border: '1px solid #eef2f5' }}>
                                        <ul className="d-flex w-100 justify-content-around m-0 p-0" style={{ listStyle: 'none' }}>
                                            <li className="d-flex flex-column align-items-center text-center">
                                                <i className="fa-solid fa-anchor mb-2" style={{ fontSize: '24px', color: 'var(--theme-color)' }}></i>
                                                <span className="text-muted small">Type</span>
                                                <span className="fw-bold fs-6">{cruisePost.type || 'N/A'}</span>
                                            </li>
                                            <li className="d-flex flex-column align-items-center text-center">
                                                <i className="fa-solid fa-ruler-combined mb-2" style={{ fontSize: '24px', color: 'var(--theme-color)' }}></i>
                                                <span className="text-muted small">Length</span>
                                                <span className="fw-bold fs-6">{cruisePost.length || 'N/A'}</span>
                                            </li>
                                            <li className="d-flex flex-column align-items-center text-center">
                                                <i className="fa-solid fa-users mb-2" style={{ fontSize: '24px', color: 'var(--theme-color)' }}></i>
                                                <span className="text-muted small">Capacity</span>
                                                <span className="fw-bold fs-6">{cruisePost.capacity || 'N/A'} Guests</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Itinerary Table */}
                                {itinerary.length > 0 && (
                                    <>
                                        <h3 className="h4 fw-bold mt-5 mb-4" style={{ color: 'var(--title-color)' }}>
                                            <i className="fa-solid fa-map-location-dot me-2" style={{ color: 'var(--theme-color)' }}></i> Cruise Itinerary
                                        </h3>
                                        <div className="table-responsive mb-5 border-0 rounded-4 shadow-sm" style={{ overflow: 'hidden' }}>
                                            <table className="table table-hover text-center mb-0" style={{ borderCollapse: 'hidden' }}>
                                                <thead>
                                                    <tr style={{ background: 'var(--theme-color)', color: '#fff' }}>
                                                        <th className="py-3 font-weight-bold border-0" style={{ color: '#fff' }}>Day</th>
                                                        <th className="py-3 font-weight-bold border-0" style={{ color: '#fff' }}>Port</th>
                                                        <th className="py-3 font-weight-bold border-0" style={{ color: '#fff' }}>Arrival</th>
                                                        <th className="py-3 font-weight-bold border-0" style={{ color: '#fff' }}>Departure</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white">
                                                    {itinerary.map((row, i) => (
                                                        <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                            <td className="fw-bold py-3" style={{ color: 'var(--theme-color)' }}>{row.day}</td>
                                                            <td className="py-3 font-weight-bold text-dark">{row.port}</td>
                                                            <td className="py-3 text-muted">{row.arrival}</td>
                                                            <td className="py-3 text-muted">{row.departure}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                {/* Total Costs */}
                                {costs.length > 0 && (
                                    <>
                                        <h3 className="h4 fw-bold mt-5 mb-4" style={{ color: 'var(--title-color)' }}>
                                            <i className="fa-solid fa-tags me-2" style={{ color: 'var(--theme-color)' }}></i> Total Cost Breakdown
                                        </h3>
                                        <div className="mb-5">
                                            <div className="row g-4">
                                                {costs.map((cost, idx) => (
                                                    <div key={idx} className="col-md-6">
                                                        <div className="p-4 border-0 rounded-4 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f4f7f9 100%)', borderLeft: '4px solid var(--theme-color)' }}>
                                                            <h5 className="mb-2" style={{ color: '#333', fontSize: '1rem', fontWeight: 600, lineHeight: '1.4' }}>{cost.title}</h5>
                                                            <h4 className="mb-0 fw-bold" style={{ color: 'var(--title-color)' }}>{cost.fare}</h4>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="mt-3 text-muted fst-italic small">
                                                <i className="fa-solid fa-circle-info me-1" style={{ color: 'var(--theme-color)' }}></i> Please note – Rates are dynamic and cabins are subjected to availability.
                                            </p>
                                        </div>
                                    </>
                                )}

                                {/* Important Notes */}
                                {notes.length > 0 && (
                                    <>
                                        <h3 className="h4 fw-bold mt-5 mb-4" style={{ color: 'var(--title-color)' }}>
                                            <i className="fa-solid fa-clipboard-check me-2" style={{ color: 'var(--theme-color)' }}></i> Important Notes
                                        </h3>
                                        <div className="p-4 border-0 rounded-4 shadow-sm bg-white mb-5" style={{ border: '1px solid #eee' }}>
                                            <ul className="list-unstyled mb-0 m-0 p-0" style={{ display: 'grid', rowGap: '12px' }}>
                                                {notes.map((note, idx) => (
                                                    <li key={idx} className="d-flex align-items-start">
                                                        <i className="fa-solid fa-check mt-1 me-3" style={{ color: 'var(--theme-color)', fontSize: '14px' }}></i>
                                                        <span style={{ color: '#555', lineHeight: '1.6', fontSize: '15px' }}>{note}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}

                                {/* Download Brochure Section */}
                                {cruisePost.brochure_url && (
                                    <div className="brochure-download-section mt-50 mb-30" style={{
                                        background: 'linear-gradient(135deg, #0c2340 0%, #1a4a7a 100%)',
                                        borderRadius: '16px',
                                        padding: '40px 35px',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
                                        <div style={{ position: 'absolute', bottom: '-30px', right: '60px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>
                                        <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                                            <div style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <i className="fa-solid fa-file-pdf" style={{ fontSize: '32px', color: '#ffffff' }}></i>
                                            </div>
                                            <div className="flex-grow-1 text-center text-md-start">
                                                <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '8px', fontSize: '22px' }}>
                                                    Download Full Package Brochure
                                                </h4>
                                                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '15px', lineHeight: '1.5' }}>
                                                    Get the complete details of this {cruisePost.title} package including pricing, itinerary, port details, and more.
                                                </p>
                                            </div>
                                            <a
                                                href={cruisePost.brochure_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                className="th-btn style3 th-icon"
                                                style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '15px 30px', fontSize: '16px', fontWeight: 600, flexShrink: 0 }}
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
                    {/* SIDEBAR */}
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            <div className="widget widget_search">
                                <form className="search-form">
                                    <input type="text" placeholder="Search" />
                                    <button type="submit">
                                        <i className="far fa-search" />
                                    </button>
                                </form>
                            </div>
                            <div className="widget widget_categories">
                                <h3 className="widget_title">Categories</h3>
                                <ul>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> City Tour</Link></li>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> Beach Tours</Link></li>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> Wildlife Tours</Link></li>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> Adventure Tours</Link></li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
            
            <EnquirePopupForm 
                isOpen={isEnquireOpen} 
                onClose={() => setIsEnquireOpen(false)} 
                destinationTitle={cruisePost?.title} 
            />
        </section>
    );
}

export default CruiseDetailsMain;
