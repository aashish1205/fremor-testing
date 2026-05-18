import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { fetchGalleryImages, getGalleryImageSrc } from "../../services/instagramGalleryService";
import "swiper/css";

const FALLBACK_REELS = [
    '/assets/img/gallery/gallery_4_1.jpg',
    '/assets/img/gallery/gallery_4_2.jpg',
    '/assets/img/gallery/gallery_4_3.jpg',
    '/assets/img/gallery/gallery_4_4.jpg',
    '/assets/img/gallery/gallery_4_5.jpg',
];

function InstagramReels() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const videoRefs = useRef([]);

    useEffect(() => {
        loadReels();
    }, []);

    const loadReels = async () => {
        try {
            const data = await fetchGalleryImages();
            if (data && data.length > 0) {
                setReels(data);
            } else {
                setReels(FALLBACK_REELS.map((src, i) => ({
                    id: `fallback-${i}`,
                    image_url: src,
                    video_url: null,
                    instagram_link: 'https://www.instagram.com/fremorglobal/',
                    caption: 'Fremor Global'
                })));
            }
        } catch (err) {
            console.warn('Failed to load reels:', err);
            setReels(FALLBACK_REELS.map((src, i) => ({
                id: `fallback-${i}`,
                image_url: src,
                video_url: null,
                instagram_link: 'https://www.instagram.com/fremorglobal/',
                caption: 'Fremor Global'
            })));
        } finally {
            setLoading(false);
        }
    };

    const handleSlideChange = (swiper) => {
        videoRefs.current.forEach((video, index) => {
            if (video) {
                if (index === swiper.activeIndex) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });
    };

    const slidesData = reels.length > 0 && reels.length < 5
        ? [...reels, ...reels, ...reels]
        : reels.length >= 5
            ? [...reels, ...reels]
            : reels;

    if (loading) {
        return (
            <div className="instagram-reels-area" style={{ padding: '60px 0', textAlign: 'center' }}>
                <div className="spinner-border text-primary" roleStatus></div>
            </div>
        );
    }

    return (
        <div className="instagram-reels-area" style={{ 
            background: '#0f0f0f',
            padding: '40px 0',
            overflow: 'hidden'
        }}>
            <div className="container-fluid">
                <div className="title-area text-center mb-4">
                    <h2 className="sec-title" style={{ color: '#fff', fontSize: '1.5rem' }}>
                        <i className="fab fa-instagram me-2"></i>
                        Follow Us on Instagram
                    </h2>
                </div>
                <div className="slider-area">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={16}
                        centeredSlides={false}
                        loop={true}
                        direction="horizontal"
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            reverseDirection: false,
                        }}
                        speed={800}
                        breakpoints={{
                            0: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                            1400: { slidesPerView: 5 },
                        }}
                        onSlideChange={handleSlideChange}
                        className="instagram-reels-slider"
                    >
                        {slidesData.map((item, index) => {
                            const imgSrc = getGalleryImageSrc(item.image_url);
                            const hasVideo = item.video_url;
                            const instagramLink = item.instagram_link || 'https://www.instagram.com/fremorglobal/';

                            return (
                                <SwiperSlide key={`${item.id || index}-${index}`}>
                                    <a 
                                        href={instagramLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div className="reel-card" style={{
                                            position: 'relative',
                                            width: '100%',
                                            paddingTop: '177.78%',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: '#000',
                                            cursor: 'pointer'
                                        }}>
                                            {hasVideo ? (
                                                <video
                                                    ref={el => videoRefs.current[index] = el}
                                                    src={item.video_url}
                                                    muted
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
                                            ) : (
                                                <img
                                                    src={imgSrc}
                                                    alt={item.caption || 'Instagram Reel'}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            )}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                padding: '12px',
                                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ color: '#fff', fontSize: '12px' }}>
                                                    <i className="fab fa-instagram me-1"></i>
                                                    {hasVideo ? 'Reel' : 'Post'}
                                                </span>
                                                {hasVideo && (
                                                    <span style={{ color: '#fff', fontSize: '10px', opacity: 0.8 }}>
                                                        <i className="fas fa-play"></i>
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                opacity: 0,
                                                transition: 'opacity 0.3s',
                                                pointerEvents: 'none'
                                            }} className="play-icon">
                                                <i className="fas fa-play" style={{ 
                                                    color: '#fff', 
                                                    fontSize: '2rem',
                                                    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                                                }}></i>
                                            </div>
                                        </div>
                                    </a>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
            <style>{`
                .instagram-reels-area .swiper-wrapper {
                    transition-timing-function: linear;
                }
                .reel-card:hover .play-icon {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
}

export default InstagramReels;