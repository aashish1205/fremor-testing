import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import MobileMenu from "./MobileMenu";
import LoginForm from "./LoginForm";

function HeaderOne() {

    const [isSticky, setIsSticky] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
    
    // Auth state
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("");
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const location = useLocation();
    const currentPath = location.pathname;

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

        return () => {
            subscription.unsubscribe();
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
                                                        <Link to="/destination/inbound">Inbound (India)</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/destination/outbound">Outbound (International)</Link>
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
                                        <button
                                            type="button"
                                            className="th-menu-toggle d-block d-xl-none"
                                            onClick={() => setIsMobileMenuOpen(true)}
                                        >
                                            <i className="far fa-bars" />
                                        </button>
                                    </div>
                                </div>

                                {isSticky && (
                                    <div className="col-auto d-none d-xl-block">
                                        <div className="header-button">
                                            {user ? (
                                                <div style={{ position: "relative" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "8px",
                                                            background: "none",
                                                            border: "none",
                                                            color: "var(--white-color, #ffffff)",
                                                            cursor: "pointer",
                                                            fontWeight: 600,
                                                            fontSize: "16px",
                                                            padding: "10px 15px"
                                                        }}
                                                    >
                                                        Hi, {userName}
                                                        <i className="fa-regular fa-chevron-down" style={{ fontSize: "12px" }} />
                                                    </button>
                                                    {isProfileDropdownOpen && (
                                                        <div style={{
                                                            position: "absolute", top: "100%", right: 0,
                                                            background: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                                            padding: "8px 0", minWidth: "160px", zIndex: 10000, marginTop: "10px", border: "1px solid #eaeaea",
                                                            textAlign: "left"
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
                                                    className="th-btn style3"
                                                    style={{ padding: "13px 26px", fontSize: "14px", borderRadius: "30px" }}
                                                >
                                                    Login / Create Account
                                                    <i className="fa-regular fa-user ms-2" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

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
        </>
    );
}

export default HeaderOne;