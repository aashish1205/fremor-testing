import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { fetchDestinations, getImageSrc } from "../../services/destinationService";

import MobileMenu from "./MobileMenu";
import LoginForm from "./LoginForm";

function HeaderOne() {

    const [isSticky, setIsSticky] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
    const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
    
    // Auth state
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("");
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const location = useLocation();
    const currentPath = location.pathname;

    const navigate = useNavigate();
    const suggestionsRef = useRef(null);
    const mobileSuggestionsRef = useRef(null);

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

    // Autocomplete suggestion state
    const [allDestinations, setAllDestinations] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

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

    // Fetch destinations on mount
    useEffect(() => {
        const loadDests = async () => {
            try {
                const data = await fetchDestinations();
                setAllDestinations(data || []);
            } catch (err) {
                console.error("Failed to load destinations for navbar suggestions:", err);
            }
        };
        loadDests();
    }, []);

    // Click outside suggestions dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isMobileSearchActive) {
                if (mobileSuggestionsRef.current && !mobileSuggestionsRef.current.contains(e.target)) {
                    setShowSuggestions(false);
                }
            } else {
                if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
                    setShowSuggestions(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileSearchActive]);

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
                (d.category && d.category.toLowerCase().includes(query))
            ).slice(0, 6);
            setSuggestions(filtered);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchVal.trim() !== "") {
            navigate(`/destination?search=${encodeURIComponent(searchVal)}`);
            setShowSuggestions(false);
        }
    };

    /* Helper Functions */
    const isActive = (path) => currentPath === path;
    const isParentActive = (paths) =>
        paths.some((path) => currentPath.startsWith(path));

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!isProfileDropdownOpen) return;
        const handleOutsideClick = () => {
            setIsProfileDropdownOpen(false);
        };
        const timer = setTimeout(() => {
            document.addEventListener("click", handleOutsideClick);
        }, 0);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [isProfileDropdownOpen]);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                extractName(session.user);
            } else {
                // Check if this is the first time the user is visiting in this session
                const hasVisited = sessionStorage.getItem('hasVisited');
                if (!hasVisited) {
                    // Show login popup after 5 seconds
                    setTimeout(() => {
                        setIsLoginFormOpen(true);
                    }, 5000);
                    sessionStorage.setItem('hasVisited', 'true');
                }
            }
        };
        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user);
                extractName(session.user);
            } else {
                setUser(null);
                setUserName("");
            }
        });

        const handleOpenLogin = () => {
            setIsLoginFormOpen(true);
        };
        window.addEventListener('open-login-modal', handleOpenLogin);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('open-login-modal', handleOpenLogin);
        };
    }, []);

    const extractName = (userObj) => {
        const metadata = userObj.user_metadata || {};
        if (metadata.full_name) {
            setUserName(metadata.full_name);
        } else if (metadata.first_name) {
            setUserName(`${metadata.first_name} ${metadata.last_name || ''}`.trim());
        } else {
            setUserName("User");
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsProfileDropdownOpen(false);
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            {isLoggingOut && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    zIndex: 999999,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "fadeIn 0.3s ease"
                }}>
                    <div style={{
                        width: "55px",
                        height: "55px",
                        border: "4px solid rgba(231, 76, 60, 0.15)",
                        borderTop: "4px solid var(--theme-color, #e74c3c)",
                        borderRadius: "50%",
                        animation: "spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                        boxShadow: "0 10px 30px rgba(231, 76, 60, 0.1)",
                        marginBottom: "20px"
                    }} />
                    <h4 style={{
                        fontFamily: "var(--title-font, sans-serif)",
                        fontWeight: 700,
                        color: "#1b1b1b",
                        fontSize: "18px",
                        letterSpacing: "0.5px",
                        margin: 0,
                        textAlign: "center"
                    }}>
                        Signing Out...
                    </h4>
                    <p style={{
                        fontSize: "13px",
                        color: "#777",
                        marginTop: "6px",
                        marginBottom: 0
                    }}>
                        Securing your session
                    </p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
            <header className="th-header header-layout1" style={{ position: 'relative', zIndex: 9999 }}>
                {/* Header Top - Hidden on Mobile to save vertical space */}
                <div className="header-top d-none d-lg-block">
                    <div className="header-container">
                        <div className="row justify-content-center justify-content-xl-between align-items-center">
                            <div className="col-auto d-none d-md-block">
                                <div className="header-links">
                                    <ul>
                                        <li className="d-none d-xl-inline-block">
                                            <i className="fa-sharp fa-regular fa-location-dot" />
                                            <span>Lower Parel-west, Mumbai-400073</span>
                                        </li>
                                        {/*<li className="d-none d-xl-inline-block">
                                            <i className="fa-regular fa-clock" />
                                            <span>Monday to Saturday: 8.00 am - 7.00 pm</span>
                                        </li>*/}
                                    </ul>
                                </div>
                            </div>

                            <div className="col-auto">
                                <div className="header-right">
                                    
                                    <div className="header-links">
                                        <ul>
                                            <li className="d-none d-md-inline-block">
                                                <Link
                                                    className={isActive("/faq") ? "active" : ""}
                                                    to="/faq"
                                                >
                                                    FAQ
                                                </Link>
                                            </li>
                                            <li className="d-none d-md-inline-block">
                                                <Link
                                                    className={isActive("/contact") ? "active" : ""}
                                                    to="/contact"
                                                >
                                                    Support
                                                </Link>
                                            </li>
                                            <li>
                                                {user ? (
                                                    <div style={{ position: "relative" }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                                            style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: 600 }}
                                                        >
                                                            Hi, {userName}
                                                            <i className="fa-regular fa-chevron-down" style={{ fontSize: "12px" }} />
                                                        </button>
                                                        {isProfileDropdownOpen && (
                                                            <div style={{
                                                                position: "absolute", top: "100%", right: 0,
                                                                background: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                                padding: "8px 0", minWidth: "150px", zIndex: 1000, marginTop: "8px", border: "1px solid #eaeaea"
                                                            }}>
                                                                <Link to="/my-account" style={{ display: "block", padding: "10px 16px", color: "#333", textDecoration: "none", fontSize: "14px", fontWeight: 500 }} onClick={() => setIsProfileDropdownOpen(false)}>
                                                                    <i className="fa-regular fa-user me-2" /> My Profile
                                                                </Link>
                                                                <button onClick={handleLogout} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", background: "none", border: "none", borderTop: "1px solid #f1f1f1", color: "#c53030", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}>
                                                                    <i className="fa-regular fa-arrow-right-from-bracket me-2" /> Logout
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsLoginFormOpen(true)}
                                                        style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: 600 }}
                                                    >
                                                        Login/Create Account
                                                        <i className="fa-regular fa-user ms-2" />
                                                    </button>
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Mobile Search Overlay */}
                        {isMobileSearchActive && (
                            <div className="mobile-search-overlay" ref={mobileSuggestionsRef}>
                                <div className="mobile-search-overlay-content">
                                    <button
                                        type="button"
                                        className="mobile-search-close-btn"
                                        onClick={() => {
                                            setIsMobileSearchActive(false);
                                            setSearchVal("");
                                            setShowSuggestions(false);
                                        }}
                                        aria-label="Close search"
                                    >
                                        <i className="fa-light fa-arrow-left" />
                                    </button>
                                    <form onSubmit={handleSearchSubmit} className="mobile-search-overlay-form">
                                        <input
                                            type="text"
                                            value={searchVal}
                                            onChange={handleInputChange}
                                            onFocus={() => setShowSuggestions(true)}
                                            placeholder={`Search '${placeholderText}'...`}
                                            autoFocus
                                        />
                                        <button type="submit" className="mobile-search-overlay-submit-btn" aria-label="Submit search">
                                            <i className="fa-light fa-magnifying-glass" />
                                        </button>
                                    </form>
                                </div>

                                {/* Mobile suggestions dropdown */}
                                {showSuggestions && searchVal.trim() !== "" && (
                                    <div className="mobile-search-suggestions-dropdown">
                                        {suggestions.length > 0 ? (
                                            suggestions.map((sug) => (
                                                <Link
                                                    key={sug.id}
                                                    to={`/destination/${sug.id}`}
                                                    className="suggestion-item"
                                                    onClick={() => {
                                                        setShowSuggestions(false);
                                                        setIsMobileSearchActive(false);
                                                    }}
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
                        )}
                    </div>
                </div>

                <div className={`sticky-wrapper ${isSticky ? "sticky" : ""}`}>
                    <div className="menu-area">
                        <div className="header-container">
                            <div className="row align-items-center justify-content-between">

                                {/* Logo */}
                                <div className="col-auto">
                                    <div className="header-logo">
                                        <Link to="/">
                                            <img
                                                src="/assets/img/logo/FremorLogo.png"
                                                alt="Fremor"
                                            />
                                        </Link>
                                    </div>
                                </div>

                                {/* Search box (when sticky) */}
                                {isSticky && (
                                    <div className="col sticky-search-col">
                                        <div className="navbar-search-container" ref={suggestionsRef}>
                                            <form onSubmit={handleSearchSubmit} className="navbar-search-form">
                                                <i className="fa-light fa-magnifying-glass navbar-search-icon" />
                                                <input
                                                    type="text"
                                                    value={searchVal}
                                                    onChange={handleInputChange}
                                                    onFocus={() => setShowSuggestions(true)}
                                                    placeholder={`Search '${placeholderText}'...`}
                                                />
                                                <button type="submit" className="navbar-search-submit-btn">
                                                    Search
                                                </button>
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
                                )}

                                {/* Main Menu */}
                                <div className="col-auto ms-auto me-xl-5">
                                    <nav className="main-menu d-none d-xl-inline-block">
                                        <ul>

                                            <li>
                                                <Link className={isActive("/") ? "active" : ""} to="/">
                                                    Home
                                                </Link>
                                            </li>

                                           

                                            

                                            {/* Destination */}
                                            <li className={`menu-item-has-children ${isParentActive(["/destination"]) ? "active" : ""}`}>
                                                <Link to="/destination">
                                                    Explore Tours
                                                </Link>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <Link to="/destination/outbound">Global</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/destination/inbound">Inbound (India)</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/destination/domestic">Domestic</Link>
                                                    </li>
                                                </ul>
                                            </li>

                                            {/* Service */}
                                            {/*<li className={`menu-item-has-children ${isParentActive(["/service"]) ? "active" : ""}`}>
                                                <Link to="#">Service</Link>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <Link to="/service">Services</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/service/1">Service Details</Link>
                                                    </li>
                                                </ul>
                                            </li>*/}

                                            {/* Activities */}
                                            {/*<li className={`menu-item-has-children ${isParentActive(["/activities"]) ? "active" : ""}`}>
                                                <Link to="#">Activities</Link>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <Link to="/activities">Activities</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/activities-details">Activities Details</Link>
                                                    </li>
                                                </ul>
                                            </li>*/}

                                            {/* Blog */}
                                            {/*<li className={`menu-item-has-children ${isParentActive(["/blog"]) ? "active" : ""}`}>
                                                <Link to="#">Blogs</Link>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <Link to="/blog">Blog</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/blog/1">Blog Details</Link>
                                                    </li>
                                                </ul>
                                            </li>*/}


                                         

                                             {/* Visa */}
                                            <li>
                                                <Link className={isActive("/visa") ? "active" : ""} to="/visa">
                                                    Visa
                                                </Link>
                                            </li>



                                            {/* Cruise */}
                                            <li>
                                                <Link className={isActive("/cruise") ? "active" : ""} to="/cruise">
                                                   Cruises
                                                </Link>
                                            </li>

                                            {/* About */}
                                            <li>
                                                <Link className={isActive("/about") ? "active" : ""} to="/about">
                                                    About Us
                                                </Link>
                                            </li>

                                            {/* Contact */}
                                            {/*<li>
                                                <Link className={isActive("/contact") ? "active" : ""} to="/contact">
                                                    Contact Us
                                                </Link>
                                            </li>*/}

                                             {/*  <li>
                                                <Link className={isActive("/blog") ? "active" : ""} to="/blog">
                                                    Magzine
                                                </Link>
                                            </li>*/}

                                           

                                        </ul>
                                    </nav>

                                    <div className="d-flex align-items-center gap-3">
                                        {!isSticky && (
                                            <div className="d-block d-xl-none" style={{ position: "relative" }}>
                                                <button
                                                    type="button"
                                                    onClick={() => user ? setIsProfileDropdownOpen(!isProfileDropdownOpen) : setIsLoginFormOpen(true)}
                                                    style={{ background: "none", border: "none", color: "var(--white-color, #ffffff)", cursor: "pointer", fontSize: "22px", padding: 0 }}
                                                    aria-label="User Account"
                                                >
                                                    <i className="fa-regular fa-circle-user" />
                                                </button>
                                                {user && isProfileDropdownOpen && (
                                                    <div style={{
                                                        position: "absolute",
                                                        top: "100%",
                                                        right: 0,
                                                        background: "#fff",
                                                        borderRadius: "8px",
                                                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                                        padding: "8px 0",
                                                        minWidth: "160px",
                                                        zIndex: 10000,
                                                        marginTop: "10px",
                                                        border: "1px solid #eaeaea",
                                                        textAlign: "left"
                                                    }}>
                                                        <div style={{
                                                            padding: "8px 16px",
                                                            fontSize: "12px",
                                                            color: "#666",
                                                            borderBottom: "1px solid #f1f1f1",
                                                            fontWeight: "600"
                                                        }}>
                                                            Hi, {userName}
                                                        </div>
                                                        <Link 
                                                            to="/my-account" 
                                                            style={{ 
                                                                display: "block", 
                                                                padding: "10px 16px", 
                                                                color: "#333", 
                                                                textDecoration: "none", 
                                                                fontSize: "14px", 
                                                                fontWeight: 500 
                                                            }} 
                                                            onClick={() => setIsProfileDropdownOpen(false)}
                                                        >
                                                            <i className="fa-regular fa-user me-2" /> My Profile
                                                        </Link>
                                                        <button 
                                                            onClick={handleLogout} 
                                                            style={{ 
                                                                display: "block", 
                                                                width: "100%", 
                                                                textAlign: "left", 
                                                                padding: "10px 16px", 
                                                                background: "none", 
                                                                border: "none", 
                                                                borderTop: "1px solid #f1f1f1", 
                                                                color: "#c53030", 
                                                                cursor: "pointer", 
                                                                fontSize: "14px", 
                                                                fontWeight: 500 
                                                            }}
                                                        >
                                                            <i className="fa-regular fa-arrow-right-from-bracket me-2" /> Logout
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            className="th-menu-toggle d-block d-xl-none"
                                            onClick={() => setIsMobileMenuOpen(true)}
                                        >
                                            <i className="far fa-bars" />
                                        </button>
                                    </div>
                                </div>



                            </div>
                        </div>

                    </div>
                </div>
            </header>

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onLoginClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLoginFormOpen(true);
                }}
            />
            <LoginForm
                isOpen={isLoginFormOpen}
                onClose={() => setIsLoginFormOpen(false)}
            />

            <style>{`
                /* Navbar Search Box Styling */
                .sticky-search-col {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0 15px;
                }
                .navbar-search-container {
                    position: relative;
                    width: 100%;
                    max-width: 320px;
                    margin: 0 auto;
                    z-index: 1001;
                }
                .navbar-search-form {
                    display: flex;
                    align-items: center;
                    background: #ffffff;
                    border: 1px solid rgba(0,0,0,0.06);
                    border-radius: 50px;
                    padding: 2px 2px 2px 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
                    width: 100%;
                }
                .navbar-search-form:hover {
                    box-shadow: 0 6px 18px rgba(0,0,0,0.12);
                    border-color: rgba(0,0,0,0.15);
                }
                .navbar-search-form:focus-within {
                    background: #ffffff;
                    border-color: #0d496e;
                    box-shadow: 0 4px 18px rgba(13, 73, 110, 0.15);
                }
                .navbar-search-form i.navbar-search-icon {
                    color: #64748b;
                    font-size: 14px;
                    margin-right: 8px;
                    transition: color 0.3s ease;
                }
                .navbar-search-form input {
                    border: none;
                    outline: none;
                    background: transparent;
                    width: 100%;
                    padding: 3px 0;
                    font-size: 13px;
                    color: #1e293b;
                    font-weight: 500;
                }
                .navbar-search-form input::placeholder {
                    color: #94a3b8;
                    font-style: normal;
                }
                .navbar-search-submit-btn {
                    background: #FFB114;
                    color: #0d496e;
                    border: none;
                    border-radius: 50px;
                    padding: 4px 14px;
                    font-weight: 700;
                    font-size: 10.5px;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-transform: uppercase;
                }
                .navbar-search-submit-btn:hover {
                    background: #0d496e;
                    color: #ffffff;
                    box-shadow: 0 2px 8px rgba(13, 73, 110, 0.2);
                }
                /* Suggestions Dropdown in Navbar */
                .navbar-search-container .search-suggestions-dropdown {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    right: 0;
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    border: 1px solid rgba(0,0,0,0.06);
                    overflow: hidden;
                    z-index: 10002;
                    padding: 6px 0;
                    animation: dropdownFadeIn 0.2s ease-out;
                    text-align: left;
                }
                .navbar-search-container .suggestion-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 15px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    gap: 10px;
                    text-decoration: none !important;
                }
                .navbar-search-container .suggestion-item:hover {
                    background: #f4f8fa;
                }
                .navbar-search-container .suggestion-img {
                    width: 38px;
                    height: 38px;
                    border-radius: 6px;
                    object-fit: cover;
                    background-color: #eee;
                }
                .navbar-search-container .suggestion-info {
                    flex: 1;
                }
                .navbar-search-container .suggestion-title {
                    font-size: 13px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                    line-height: 1.2;
                }
                .navbar-search-container .suggestion-meta {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 1px;
                }
                .navbar-search-container .suggestion-category {
                    font-size: 9px;
                    font-weight: 600;
                    text-transform: uppercase;
                    background: #e2e8f0;
                    color: #475569;
                    padding: 1px 6px;
                    border-radius: 10px;
                }
                .navbar-search-container .suggestion-price {
                    font-size: 11px;
                    font-weight: 700;
                    color: #0d496e;
                }
                .navbar-search-container .suggestion-no-results {
                    padding: 10px 15px;
                    color: #64748b;
                    font-size: 13px;
                    font-style: italic;
                }
                /* Mobile Search Toggle Button */
                .mobile-search-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: #ffffff;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 5px;
                    transition: all 0.2s ease;
                    margin-right: 5px;
                }
                .mobile-search-btn:hover {
                    color: #FFB114;
                    transform: scale(1.05);
                }

                /* Mobile Search Overlay styling */
                .mobile-search-overlay {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    height: 75px !important;
                    background-color: #0d496e !important;
                    z-index: 999999 !important;
                    display: none;
                    align-items: center !important;
                    padding: 0 15px !important;
                    box-sizing: border-box !important;
                    animation: slideDownOverlay 0.25s ease-out forwards !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                }
                
                @keyframes slideDownOverlay {
                    0% {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .mobile-search-overlay-content {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    gap: 10px;
                }

                .mobile-search-close-btn {
                    background: none;
                    border: none;
                    color: #ffffff;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                
                .mobile-search-close-btn:hover {
                    transform: scale(1.1);
                    color: #FFB114;
                }

                .mobile-search-overlay-form {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    background: #ffffff;
                    border-radius: 50px;
                    padding: 2px 2px 2px 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .mobile-search-overlay-form input {
                    flex: 1;
                    border: none;
                    outline: none;
                    background: transparent;
                    padding: 4px 0;
                    font-size: 13px;
                    color: #1e293b;
                    font-weight: 500;
                }

                .mobile-search-overlay-submit-btn {
                    background: #FFB114;
                    color: #0d496e;
                    border: none;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    cursor: pointer;
                    transition: background 0.2s ease, color 0.2s ease;
                }

                .mobile-search-overlay-submit-btn:hover {
                    background: #0d496e;
                    color: #ffffff;
                }

                .mobile-search-suggestions-dropdown {
                    position: fixed !important;
                    top: 75px !important;
                    left: 0 !important;
                    right: 0 !important;
                    background: #ffffff !important;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
                    border-top: 1px solid rgba(0, 0, 0, 0.05) !important;
                    max-height: calc(100vh - 75px) !important;
                    overflow-y: auto !important;
                    z-index: 999999 !important;
                    padding: 6px 0 !important;
                    animation: dropdownFadeIn 0.2s ease-out !important;
                    text-align: left !important;
                }

                @media (max-width: 1199px) {
                    .sticky-wrapper.sticky .header-logo img {
                        max-width: 95px !important;
                        transition: max-width 0.3s ease;
                    }
                    .navbar-search-container {
                        max-width: 170px;
                    }
                    .navbar-search-form {
                        padding: 2px 2px 2px 10px;
                    }
                    .navbar-search-form i.navbar-search-icon {
                        font-size: 13px;
                        margin-right: 5px;
                    }
                    .navbar-search-form input {
                        font-size: 12px;
                        padding: 4px 0;
                    }
                    .navbar-search-submit-btn {
                        padding: 4px 10px;
                        font-size: 10px;
                    }
                }
                @media (max-width: 991px) {
                    .sticky-search-col {
                        display: none !important;
                    }
                    .mobile-search-btn {
                        display: block;
                    }
                    .mobile-search-overlay {
                        display: flex !important;
                    }
                }
            `}</style>
        </>
    );
}

export default HeaderOne;