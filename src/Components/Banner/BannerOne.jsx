import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function BannerOne() {
    useEffect(() => {
        // Function to add animation classes
        const animationProperties = () => {
            document.querySelectorAll('[data-ani]').forEach((element) => {
                const animationName = element.getAttribute('data-ani');
                if (animationName) element.classList.add(animationName);
            });

            document.querySelectorAll('[data-ani-delay]').forEach((element) => {
                const delayTime = element.getAttribute('data-ani-delay');
                if (delayTime) element.style.animationDelay = delayTime;
            });
        };

        animationProperties();
    }, []);

    return (
        <div className="th-hero-wrapper hero-1" id="hero" style={{ position: 'relative', overflow: 'hidden' }}>
            
            {/* Inline CSS to handle video responsiveness cleanly */}
            <style dangerouslySetInnerHTML={{__html: `
                .hero-video-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    z-index: -2;
                }
                
                
                /* Desktop: Takes full height */
                @media (min-width: 769px) {
                    .th-hero-wrapper.hero-1 {
                        height: 100vh;
                        min-height: 700px;
                        display: flex;
                        align-items: center;
                    }
                    .hero-inner {
                        width: 100%;
                    }
                }

                /* Mobile: Adapts to video aspect ratio so it doesn't get cut entirely! */
                @media (max-width: 768px) {
                    .th-hero-wrapper.hero-1 {
                        min-height: auto !important;
                        height: auto;
                        aspect-ratio: 16 / 9; /* Ensure video container height naturally scales */
                        display: flex;
                        align-items: center;
                        background-color: #000;
                    }
                    .hero-video-bg {
                        object-fit: cover; /* With 16:9 aspect ratio, cover won't cut 16:9 videos */
                    }
                    .hero-style1 {
                        padding-top: 20px !important;
                        padding-bottom: 20px !important;
                    }
                    .hero-title {
                        font-size: 28px !important;
                    }
                }
            `}} />

            <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="hero-video-bg"
            >
                {/* Fallback to a local path. You can place your actual MP4 here! */}
                <source src="https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/Videos/videoplayback.webm" type="video/mp4" />
                Your browser does not support HTML5 video.
            </video>
            
            <div className="hero-overlay"></div>

            <div className="hero-inner text-center text-md-start">
                <div className="container">
                    <div className="hero-style1">
                        <span
                            className="sub-title style1 text-white"
                            data-ani="slideinup"
                            data-ani-delay="0.2s"
                        >
                            Get unforgettable pleasure with us
                        </span>
                        <h1
                            className="hero-title text-white"
                            data-ani="slideinup"
                            data-ani-delay="0.4s"
                        >
                            Let’s make your best trip with us
                        </h1>
                        <div
                            className="btn-group"
                            data-ani="slideinup"
                            data-ani-delay="0.6s"
                        >
                            <Link to="/tour" className="th-btn th-icon">
                                Explore Tours
                            </Link>
                            <Link to="/service" className="th-btn style2 th-icon">
                                Our Services
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BannerOne;
