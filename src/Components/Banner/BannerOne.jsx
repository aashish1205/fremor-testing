import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDestinations, getImageSrc } from '../../services/destinationService';

function BannerOne() {
    const navigate = useNavigate();

    // Auto-typing animation state
    const searchPlaceholders = [
        "Bali, India",
        "Switzerland",
        "Paris, France",
        "Kyoto, Japan",
        "Maldives",
        "New York, USA",
        "Singapore",
        "London, UK",
        "Dubai, UAE"
    ];
    const [placeholderText, setPlaceholderText] = useState("");
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // Dynamic search suggestion state
    const [allDestinations, setAllDestinations] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const heroSearchRef = useRef(null);
    const stickySearchRef = useRef(null);

    // Sticky search position state
    const [isStickySearch, setIsStickySearch] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(80);

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

    // Placeholder Typing Animation Effect
    useEffect(() => {
        let timer;
        const currentWord = searchPlaceholders[placeholderIndex];
        
        if (isDeleting) {
            timer = setTimeout(() => {
                setPlaceholderText(prev => prev.slice(0, -1));
            }, 55);
        } else {
            timer = setTimeout(() => {
                setPlaceholderText(prev => currentWord.slice(0, prev.length + 1));
            }, 105);
        }

        if (!isDeleting && placeholderText === currentWord) {
            timer = setTimeout(() => {
                setIsDeleting(true);
            }, 2000);
        } else if (isDeleting && placeholderText === "") {
            setIsDeleting(false);
            setPlaceholderIndex(prev => (prev + 1) % searchPlaceholders.length);
        }

        return () => clearTimeout(timer);
    }, [placeholderText, isDeleting, placeholderIndex]);

    // Fetch destinations for search autocomplete suggestions
    useEffect(() => {
        const loadDests = async () => {
            try {
                const data = await fetchDestinations();
                setAllDestinations(data || []);
            } catch (err) {
                console.error("Failed to load destinations for search suggestions:", err);
            }
        };
        loadDests();
    }, []);

    // Listen to scroll to determine stickiness of search box
    useEffect(() => {
        const updateHeaderHeight = () => {
            const headerSticky = document.querySelector('.sticky-wrapper');
            if (headerSticky) {
                setNavbarHeight(headerSticky.offsetHeight || 80);
            }
        };

        const handleScroll = () => {
            setIsStickySearch(window.scrollY > 450);
            updateHeaderHeight();
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", updateHeaderHeight);
        
        updateHeaderHeight();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", updateHeaderHeight);
        };
    }, []);

    // Click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                (heroSearchRef.current && !heroSearchRef.current.contains(e.target)) &&
                (stickySearchRef.current && !stickySearchRef.current.contains(e.target))
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setSearchVal(val);
        setShowSuggestions(true);
        
        if (val.trim() === "") {
            setSuggestions([]);
        } else {
            const query = val.toLowerCase();
            const filtered = allDestinations.filter(d => 
                (d.title && d.title.toLowerCase().includes(query)) ||
                (d.category && d.category.toLowerCase().includes(query)) ||
                (d.location && d.location.toLowerCase().includes(query)) ||
                (d.continent && d.continent.toLowerCase().includes(query)) ||
                (d.package_type && d.package_type.toLowerCase().includes(query))
            ).slice(0, 6);
            setSuggestions(filtered);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchVal.trim() !== "") {
            navigate(`/destination?search=${encodeURIComponent(searchVal)}`);
        }
    };

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

                /* Premium Glassmorphic Hero Search Box */
                .hero-search-container {
                    width: 100%;
                    max-width: 650px;
                    margin: 35px auto 0;
                    position: relative;
                    z-index: 100;
                }

                .hero-search-wrapper {
                    background: rgba(255, 255, 255, 0.12);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    border-radius: 50px;
                    padding: 8px 8px 8px 25px;
                    display: flex;
                    align-items: center;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                }

                .hero-search-wrapper:focus-within {
                    background: rgba(255, 255, 255, 0.22);
                    border-color: rgba(255, 255, 255, 0.5);
                    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }

                .hero-search-wrapper i.search-icon {
                    color: #ffffff;
                    font-size: 20px;
                    margin-right: 15px;
                    opacity: 0.85;
                }

                .hero-search-wrapper input {
                    background: transparent;
                    border: none;
                    outline: none;
                    width: 100%;
                    padding: 12px 0;
                    font-size: 17px;
                    color: #ffffff;
                    font-weight: 500;
                    font-family: inherit;
                }

                .hero-search-wrapper input::placeholder {
                    color: rgba(255, 255, 255, 0.75);
                    font-style: italic;
                }

                .hero-search-btn {
                    background: #0d496e;
                    color: #ffffff;
                    border: none;
                    border-radius: 50px;
                    padding: 12px 30px;
                    font-weight: 700;
                    font-size: 15px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }

                .hero-search-btn:hover {
                    background: #115c8a;
                    transform: scale(1.03);
                    box-shadow: 0 5px 15px rgba(13, 73, 110, 0.4);
                }

                /* Autocomplete dropdown suggestions */
                .search-suggestions-dropdown {
                    position: absolute;
                    top: calc(100% + 10px);
                    left: 0;
                    right: 0;
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
                    border: 1px solid rgba(0,0,0,0.08);
                    overflow: hidden;
                    z-index: 1000;
                    padding: 8px 0;
                    animation: dropdownFadeIn 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
                    text-align: left;
                }

                @keyframes dropdownFadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .suggestion-item {
                    display: flex;
                    align-items: center;
                    padding: 10px 20px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    gap: 15px;
                    text-decoration: none !important;
                }

                .suggestion-item:hover {
                    background: #f4f8fa;
                }

                .suggestion-img {
                    width: 50px;
                    height: 50px;
                    border-radius: 8px;
                    object-fit: cover;
                    background-color: #eee;
                }

                .suggestion-info {
                    flex: 1;
                }

                .suggestion-title {
                    font-size: 15px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                }

                .suggestion-meta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 2px;
                }

                .suggestion-category {
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    background: #e2e8f0;
                    color: #475569;
                    padding: 2px 8px;
                    border-radius: 20px;
                }

                .suggestion-price {
                    font-size: 13px;
                    font-weight: 700;
                    color: #0d496e;
                }

                .suggestion-no-results {
                    padding: 15px 20px;
                    color: #64748b;
                    font-size: 14px;
                    font-style: italic;
                }

                /* Scroll Sticky Search Bar */
                .sticky-search-bar-container {
                    position: fixed;
                    left: 0;
                    right: 0;
                    background-color: #AED4E0;
                    padding: 6px 20px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    z-index: 9998;
                    animation: stickySearchSlideDown 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
                    transition: top 0.3s ease;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                @keyframes stickySearchSlideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .sticky-search-inner {
                    width: 100%;
                    max-width: 600px;
                    position: relative;
                }

                .sticky-search-form {
                    display: flex;
                    align-items: center;
                    background: #ffffff;
                    border-radius: 50px;
                    padding: 4px 4px 4px 18px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    width: 100%;
                }

                .sticky-search-form i.sticky-search-icon {
                    color: #64748b;
                    font-size: 16px;
                    margin-right: 10px;
                }

                .sticky-search-form input {
                    border: none;
                    outline: none;
                    background: transparent;
                    width: 100%;
                    padding: 5px 0;
                    font-size: 14px;
                    color: #1e293b;
                    font-weight: 500;
                }

                .sticky-search-form input::placeholder {
                    color: #94a3b8;
                    font-style: italic;
                }

                .sticky-search-submit-btn {
                    background: #0d496e;
                    color: #ffffff;
                    border: none;
                    border-radius: 50px;
                    padding: 7px 20px;
                    font-weight: 700;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-transform: uppercase;
                }

                .sticky-search-submit-btn:hover {
                    background: #115c8a;
                }

                @media (max-width: 768px) {
                    .hero-search-container {
                        margin-top: 25px;
                        padding: 0 10px;
                    }
                    .hero-search-wrapper {
                        padding: 6px 6px 6px 15px;
                    }
                    .hero-search-wrapper i.search-icon {
                        font-size: 16px;
                        margin-right: 8px;
                    }
                    .hero-search-wrapper input {
                        font-size: 14px;
                        padding: 8px 0;
                    }
                    .hero-search-btn {
                        padding: 8px 18px;
                        font-size: 13px;
                    }
                    .search-suggestions-dropdown {
                        padding: 4px 0;
                        border-radius: 12px;
                    }
                    .suggestion-item {
                        padding: 8px 15px;
                        gap: 10px;
                    }
                    .suggestion-img {
                        width: 40px;
                        height: 40px;
                        border-radius: 6px;
                    }
                    .suggestion-title {
                        font-size: 13px;
                    }
                    .suggestion-price {
                        font-size: 11px;
                    }
                    .sticky-search-bar-container {
                        padding: 4px 10px;
                    }
                    .sticky-search-form {
                        padding: 3px 3px 3px 12px;
                    }
                    .sticky-search-form i.sticky-search-icon {
                        font-size: 14px;
                        margin-right: 8px;
                    }
                    .sticky-search-form input {
                        font-size: 12px;
                        padding: 4px 0;
                    }
                    .sticky-search-submit-btn {
                        padding: 5px 12px;
                        font-size: 11px;
                    }
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

                    {/* Hero Search Box with Autocomplete suggestions */}
                    <div className="hero-search-container" ref={heroSearchRef}>
                        <form onSubmit={handleSearchSubmit}>
                            <div className="hero-search-wrapper">
                                <i className="fa-light fa-magnifying-glass search-icon" />
                                <input
                                    type="text"
                                    value={searchVal}
                                    onChange={handleInputChange}
                                    onFocus={() => setShowSuggestions(true)}
                                    placeholder={`Search '${placeholderText}'...`}
                                />
                                <button type="submit" className="hero-search-btn">
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && searchVal.trim() !== "" && (
                            <div className="search-suggestions-dropdown">
                                {suggestions.length > 0 ? (
                                    suggestions.map((sug) => (
                                        <Link 
                                            key={sug.id} 
                                            to={`/destination/${sug.id}`} 
                                            className="suggestion-item"
                                            onClick={() => setShowSuggestions(false)}
                                        >
                                            <img 
                                                src={getImageSrc(sug.image)} 
                                                alt={sug.title} 
                                                className="suggestion-img" 
                                            />
                                            <div className="suggestion-info">
                                                <div className="suggestion-title">{sug.title}</div>
                                                <div className="suggestion-meta">
                                                    {sug.category && (
                                                        <span className="suggestion-category">{sug.category}</span>
                                                    )}
                                                    {sug.price && (
                                                        <span className="suggestion-price">₹{sug.price.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="suggestion-no-results">
                                        No destinations found for "{searchVal}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
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

