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

    const categories = [
        { name: 'COUPLE', img: '/assets/img/couple_travel.png' },
        { name: 'FAMILY', img: '/assets/img/family_travel.png' },
        { name: 'FRIENDS', img: '/assets/img/friends_travel.png' },
        { name: 'SOLO', img: '/assets/img/solo_travel.png' }
    ];

    return (
        <div className="new-hero-section">
            <style dangerouslySetInnerHTML={{__html: `
                .new-hero-section {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    background-color: #ffffff; /* White background */
                }

                .video-container {
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    min-height: 500px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .hero-video-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    z-index: 1;
                }

                .hero-overlay-dark {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.4);
                    z-index: 2;
                }

                .hero-content {
                    position: relative;
                    z-index: 3;
                    text-align: center;
                    padding: 0 20px;
                    margin-top: -50px;
                }

                .hero-main-title {
                    color: #fff;
                    font-weight: 900;
                    font-size: 48px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 0;
                    line-height: 1.2;
                    text-shadow: 0 4px 10px rgba(0,0,0,0.5);
                }

                /* Overlapping Section */
                .overlap-wrapper {
                    position: relative;
                    z-index: 10;
                    margin-top: -35px; /* Overlaps the video for search bar */
                    padding: 0 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .search-bar-wrapper {
                    width: 100%;
                    max-width: 800px;
                    background: #fff;
                    border-radius: 50px;
                    padding: 8px 10px 8px 25px;
                    display: flex;
                    align-items: center;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); 
                    border: 2px solid rgba(74, 222, 128, 0.8);
                    position: relative;
                    z-index: 11;
                }

                .search-bar-wrapper i {
                    color: #333;
                    font-size: 22px;
                    margin-right: 15px;
                }

                .search-bar-wrapper input {
                    border: none;
                    outline: none;
                    width: 100%;
                    padding: 15px 0;
                    font-size: 18px;
                    color: #333;
                    font-weight: 500;
                }

                .category-box {
                    width: 100%;
                    max-width: 1200px;
                    margin-top: 50px;
                    margin-bottom: 60px;
                    position: relative;
                    text-align: center;
                    padding: 50px 20px;
                    background: linear-gradient(135deg, #0c486e 0%, #acd2e0 100%);
                    border-radius: 40px;
                    box-shadow: 0 25px 50px rgba(172, 210, 224, 0.3);
                }

                .category-title {
                    color: #ffffff; /* White color */
                    font-size: 42px;
                    font-weight: 900;
                    margin-bottom: 60px;
                    position: relative;
                    z-index: 2;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    text-shadow: 0 4px 15px rgba(12, 72, 110, 0.6); /* Dark glowing effect */
                }

                .category-items-container {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 40px;
                    position: relative;
                    z-index: 2;
                }

                .cat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .cat-item:hover {
                    transform: translateY(-15px);
                }

                .cat-img-wrapper {
                    width: 220px;
                    height: 300px;
                    overflow: hidden;
                    border-radius: 110px 110px 30px 30px; /* Arch shape */
                    margin-bottom: 25px;
                    background: #1b8a58;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.4);
                    border: 4px solid rgba(255,255,255,0.15);
                    transition: all 0.4s ease;
                    position: relative;
                }
                
                .cat-img-wrapper::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    border-radius: 110px 110px 30px 30px;
                    box-shadow: inset 0 0 0 0 rgba(172, 210, 224, 0);
                    transition: all 0.4s ease;
                    pointer-events: none;
                }

                .cat-item:hover .cat-img-wrapper {
                    border-color: #acd2e0;
                    box-shadow: 0 25px 50px rgba(172, 210, 224, 0.5);
                }

                .cat-item:hover .cat-img-wrapper::after {
                    box-shadow: inset 0 0 20px rgba(172, 210, 224, 0.6);
                }

                .cat-img-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .cat-item:hover .cat-img-wrapper img {
                    transform: scale(1.15);
                }

                .cat-name {
                    color: #fff;
                    font-size: 18px;
                    font-weight: 800;
                    letter-spacing: 1.5px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(12, 72, 110, 0.3);
                    padding: 10px 25px;
                    border-radius: 30px;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    border: 1px solid rgba(255,255,255,0.3);
                }

                .cat-item:hover .cat-name {
                    background: #acd2e0;
                    color: #0c486e;
                    border-color: #acd2e0;
                    box-shadow: 0 10px 20px rgba(172, 210, 224, 0.5);
                }

                /* Marquee Section */
                .marquee-container {
                    background: linear-gradient(90deg, #0c486e, #acd2e0, #0c486e);
                    background-size: 200% auto;
                    color: #fff;
                    padding: 15px 0;
                    overflow: hidden;
                    white-space: nowrap;
                    width: 100%;
                    position: relative;
                    z-index: 2;
                    box-shadow: 0 -10px 30px rgba(0,0,0,0.2);
                    animation: gradientShift 10s ease infinite;
                }
                
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .marquee-content {
                    display: inline-block;
                    animation: marquee 25s linear infinite;
                    font-size: 20px;
                    font-weight: 800;
                    letter-spacing: 1px;
                }

                .marquee-content span {
                    margin-right: 50px;
                    text-transform: uppercase;
                }

                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                
                /* Mobile specific styles */
                @media (max-width: 768px) {
                    .video-container {
                        height: 100vh;
                        min-height: 400px;
                        align-items: center;
                        padding-bottom: 0;
                    }
                    .hero-content {
                        margin-top: -30px;
                    }
                    .hero-main-title {
                        font-size: 32px;
                    }
                    .overlap-wrapper {
                        margin-top: -25px;
                    }
                    .search-bar-wrapper {
                        padding: 6px 10px 6px 20px;
                    }
                    .search-bar-wrapper i {
                        font-size: 18px;
                        margin-right: 10px;
                    }
                    .search-bar-wrapper input {
                        font-size: 15px;
                        padding: 12px 0;
                    }
                    .category-box {
                        margin-top: 40px;
                        margin-bottom: 30px;
                        padding: 30px 15px;
                        border-radius: 30px;
                    }
                    .category-title {
                        font-size: 30px;
                        margin-bottom: 40px;
                    }
                    .category-items-container {
                        gap: 20px;
                        padding: 0;
                    }
                    .cat-item {
                        width: calc(50% - 10px);
                    }
                    .cat-img-wrapper {
                        width: 100%;
                        max-width: 150px;
                        height: 200px;
                        border-radius: 75px 75px 20px 20px;
                        margin-bottom: 15px;
                    }
                    .cat-name {
                        font-size: 13px;
                        padding: 6px 15px;
                    }
                    .marquee-container {
                        padding: 10px 0;
                    }
                    .marquee-content {
                        font-size: 16px;
                    }
                }

                /* Floating Action Button for Plan with Trippie */
                .fab-trippie {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background: #fff;
                    color: #0c4a3e;
                    padding: 10px 20px;
                    border-radius: 30px;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                    z-index: 100;
                    cursor: pointer;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .fab-trippie:hover {
                    transform: scale(1.05) translateY(-5px);
                }
                .fab-trippie img {
                    width: 30px;
                    height: 30px;
                }
            `}} />

            {/* Video Background */}
            <div className="video-container">
                <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="hero-video-bg"
                >
                    <source src="https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/Videos/videoplayback.webm" type="video/mp4" />
                    Your browser does not support HTML5 video.
                </video>
                <div className="hero-overlay-dark"></div>

                <div className="hero-content">
                    <h1 className="hero-main-title">
                        Plan Your Sooper <br/>Hit Holiday — Your Way
                    </h1>
                </div>
            </div>

            {/* Overlapping Section */}
            {/*<div className="overlap-wrapper">
                <div className="search-bar-wrapper">
                    <i className="fa-regular fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search countries, cities" />
                </div>

                <div className="category-box">
                    <h3 className="category-title">Who's coming along?</h3>
                    
                    <div className="category-items-container">
                        {categories.map((cat, index) => (
                            <div className="cat-item" key={index}>
                                <div className="cat-img-wrapper">
                                    <img src={cat.img} alt={cat.name} />
                                </div>
                                <div className="cat-name">
                                    {cat.name} <i className="fa-solid fa-chevron-right" style={{fontSize: '12px'}}></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>*/}

            {/* Marquee */}
           {/*} <div className="marquee-container">
                <div className="marquee-content">
                    <span>#StartTheTripFromHome</span>
                    <span>#StartTheTripFromHome</span>
                    <span>#StartTheTripFromHome</span>
                    <span>#StartTheTripFromHome</span>
                    <span>#StartTheTripFromHome</span>
                    <span>#StartTheTripFromHome</span>
                    <span>#StartTheTripFromHome</span>
                    <span>#StartTheTripFromHome</span>
                    
                    <span>#StartTheTripFromHome</span>
                    <span>#StartTheTripFromHome</span>
                    <span>#StartTheTripFromHome</span>
                    <span>#StartTheTripFromHome</span>
                </div>
            </div> */}

            {/* Mobile Plan with Trippie Floating Button (visible on all screens but matches the mobile design) */}
           {/* <div className="fab-trippie">
                <div style={{
                    width: '30px',
                    height: '30px',
                    background: '#0c486e',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    marginRight: '5px'
                }}>
                    <i className="fa-solid fa-play"></i>
                </div>
                Plan with Fremor
            </div>*/}
        </div>
    );
}

export default BannerOne;

