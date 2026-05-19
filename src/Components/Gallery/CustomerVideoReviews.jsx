import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { fetchCustomerVideoReviews } from "../../services/customerReviewVideoService";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function CustomerVideoReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const videoRefs = useRef([]);

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            const data = await fetchCustomerVideoReviews();
            if (data && data.length > 0) {
                setReviews(data);
            }
        } catch (err) {
            console.warn('Failed to load customer video reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (item) => {
        setSelectedItem(item);
        setIsMuted(false); // default to sound on in modal
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };



    if (loading) {
        return (
            <div className="customer-video-reels-area" style={{ padding: '60px 0', textAlign: 'center', background: '#000' }}>
                <div className="spinner-border text-light" role="status"></div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return null; // Don't show the section if no videos are available
    }

    return (
        <div className="customer-video-reels-area" style={{ 
            background: '#000',
            padding: '80px 0 60px',
            overflow: 'hidden'
        }}>
            <div className="container-fluid px-0">
                <div className="title-area text-center mb-5">
                    <h2 className="sec-title" style={{ color: '#fff', fontSize: '2.5rem', fontWeight: '800', textTransform: 'uppercase' }}>
                        STORIES OF OUR TRAVELLERS <span style={{ color: '#ff3366' }}>❤️</span>
                    </h2>
                    <div className="d-flex justify-content-center align-items-center gap-4 mt-3 flex-wrap">
                        <div className="d-flex align-items-center gap-2">
                            <img src="/assets/img/icon/google-logo.png" alt="Google" style={{ width: '24px', height: '24px', objectFit: 'contain', background: 'white', borderRadius: '50%', padding: '2px' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }} />
                            <i className="fa-brands fa-google text-white" style={{ display: 'none', fontSize: '20px' }}></i>
                            <div className="text-start">
                                <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>4.6/5 <i className="fa-solid fa-star text-warning" style={{ fontSize: '12px' }}></i></div>
                                <div style={{ color: '#aaa', fontSize: '12px' }}>8250 reviews</div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <i className="fa-brands fa-facebook" style={{ color: '#1877F2', fontSize: '24px' }}></i>
                            <div className="text-start">
                                <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>4.8/5 <i className="fa-solid fa-star text-warning" style={{ fontSize: '12px' }}></i></div>
                                <div style={{ color: '#aaa', fontSize: '12px' }}>1440 reviews</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="slider-area px-3 px-md-5" style={{ position: 'relative' }}>
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        spaceBetween={20}
                        centeredSlides={reviews.length > 2}
                        centerInsufficientSlides={true}
                        loop={reviews.length >= 4}
                        navigation={true}
                        direction="horizontal"
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            reverseDirection: false,
                        }}
                        speed={800}
                        breakpoints={{
                            0: { slidesPerView: 1.5, spaceBetween: 15 },
                            576: { slidesPerView: 2.5, spaceBetween: 15 },
                            768: { slidesPerView: 3.5, spaceBetween: 20 },
                            1024: { slidesPerView: 4.5, spaceBetween: 20 },
                            1400: { slidesPerView: 5.5, spaceBetween: 25 },
                        }}
                        className="customer-reels-slider"
                    >
                        {reviews.map((item, index) => (
                            <SwiperSlide key={item.id}>
                                <div 
                                    className="video-review-card" 
                                    onClick={() => openModal(item)}
                                    style={{
                                        position: 'relative',
                                        width: '100%',
                                        paddingTop: '145%', // slightly shorter aspect ratio
                                        borderRadius: '120px 120px 20px 20px', // Stadium top shape
                                        overflow: 'hidden',
                                        background: '#1a1a1a',
                                        cursor: 'pointer',
                                        border: '1px solid #333'
                                    }}
                                >
                                    <video
                                        ref={el => videoRefs.current[index] = el}
                                        src={item.video_url}
                                        muted
                                        autoPlay
                                        playsInline
                                        loop
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    
                                    {/* Play icon overlay on hover */}
                                    <div className="play-overlay">
                                        <div className="play-btn-circle">
                                            <i className="fas fa-play"></i>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="text-center mt-3">
                                    <h5 className="mb-1" style={{ color: '#fff', fontSize: '15px', fontWeight: '600' }}>
                                        {item.customer_name}
                                    </h5>
                                    {item.trip_tag && (
                                        <span className="badge rounded-pill" style={{ background: '#333', color: '#ccc', fontWeight: 'normal', fontSize: '12px', padding: '5px 12px' }}>
                                            {item.trip_tag}
                                        </span>
                                    )}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* Video Modal */}
            {modalOpen && selectedItem && (
                <div className="video-modal-overlay" onClick={closeModal}>
                    <button className="video-modal-close" onClick={closeModal}>
                        <i className="fas fa-times"></i>
                    </button>
                    
                    <div className="video-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="row g-0 h-100 align-items-center justify-content-center">
                            
                            {/* Left Side: Video */}
                            <div className="col-lg-6 col-md-8 h-100 d-flex justify-content-center position-relative p-2 p-md-4">
                                <div className="modal-video-container" style={{ position: 'relative', height: '100%', maxHeight: '90vh', aspectRatio: '9/16', background: '#000', borderRadius: '16px', overflow: 'hidden' }}>
                                    <video
                                        src={selectedItem.video_url}
                                        autoPlay
                                        playsInline
                                        loop
                                        muted={isMuted}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            outline: 'none'
                                        }}
                                    />
                                    
                                    {/* Mute/Unmute toggle */}
                                    <button 
                                        className="mute-toggle-btn"
                                        onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                                    >
                                        <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
                                    </button>

                                    {/* Optional View Packages button at bottom */}
                                    <button className="btn btn-success view-packages-btn w-100" style={{ position: 'absolute', bottom: '10px', left: '10px', width: 'calc(100% - 20px) !important', zIndex: 10, borderRadius: '8px', fontWeight: 'bold' }}>
                                        View Packages
                                    </button>
                                </div>
                            </div>
                            
                            {/* Right Side: Text Review */}
                            <div className="col-lg-5 col-md-8 p-2 p-md-4" style={{ height: 'fit-content' }}>
                                <div className="review-text-card" style={{ background: '#222', borderRadius: '16px', padding: '30px', color: 'white' }}>
                                    <h4 style={{ color: '#fff', fontWeight: '700', marginBottom: '10px' }}>
                                        {selectedItem.customer_name}
                                    </h4>
                                    
                                    {selectedItem.trip_tag && (
                                        <div className="mb-4">
                                            <span style={{ background: '#333', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>
                                                {selectedItem.trip_tag}
                                            </span>
                                        </div>
                                    )}
                                    
                                    <p style={{ color: '#ddd', fontSize: '15px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                                        {selectedItem.review_text || "No review text provided."}
                                    </p>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .customer-video-reels-area .swiper-slide {
                    transition: all 0.3s ease;
                    opacity: 0.6;
                    transform: scale(0.9);
                }
                .customer-video-reels-area .swiper-slide-active {
                    opacity: 1;
                    transform: scale(1);
                }
                .customer-video-reels-area .swiper-wrapper {
                    align-items: center;
                }
                .customer-video-reels-area .swiper-button-next,
                .customer-video-reels-area .swiper-button-prev {
                    background: rgba(255, 255, 255, 0.8);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    color: #000;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                }
                .customer-video-reels-area .swiper-button-next:after,
                .customer-video-reels-area .swiper-button-prev:after {
                    font-size: 16px;
                    font-weight: bold;
                }
                .video-review-card:hover .play-overlay {
                    opacity: 1;
                }
                .play-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .play-btn-circle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    border: 1px solid rgba(255,255,255,0.4);
                }
                .video-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0,0,0,0.9);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(10px);
                }
                .video-modal-close {
                    position: absolute;
                    top: 30px;
                    right: 30px;
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 30px;
                    cursor: pointer;
                    z-index: 10000;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.1);
                    transition: background 0.3s;
                }
                .video-modal-close:hover {
                    background: rgba(255,255,255,0.3);
                }
                .video-modal-content {
                    position: relative;
                    width: 100%;
                    max-width: 1200px;
                    height: 100%;
                }
                .mute-toggle-btn {
                    position: absolute;
                    bottom: 70px;
                    right: 15px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(0,0,0,0.6);
                    color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    cursor: pointer;
                }
                .mute-toggle-btn:hover {
                    background: rgba(0,0,0,0.8);
                }
                
                @media (max-width: 991px) {
                    .video-modal-content .row {
                        flex-direction: column;
                        overflow-y: auto;
                    }
                    .modal-video-container {
                        max-height: 70vh !important;
                    }
                }
                
                @media (max-width: 768px) {
                    .customer-video-reels-area .sec-title {
                        font-size: 1.8rem !important;
                    }
                    .video-modal-close {
                        top: 10px;
                        right: 10px;
                        width: 40px;
                        height: 40px;
                        font-size: 20px;
                    }
                }
            `}</style>
        </div>
    );
}

export default CustomerVideoReviews;
