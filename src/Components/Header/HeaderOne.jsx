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
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                extractName(session.user);
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
        await supabase.auth.signOut();
        setIsProfileDropdownOpen(false);
    };

    return (
        <>
            <header className="th-header header-layout1">
                {/* Header Top */}
                <div className="header-top">
                    <div className="container th-container">
                        <div className="row justify-content-center justify-content-xl-between align-items-center">
                            <div className="col-auto d-none d-md-block">
                                <div className="header-links">
                                    <ul>
                                        <li className="d-none d-xl-inline-block">
                                            <i className="fa-sharp fa-regular fa-location-dot" />
                                            <span>Lower Parel-west, Mumbai-400073</span>
                                        </li>
                                        <li className="d-none d-xl-inline-block">
                                            <i className="fa-regular fa-clock" />
                                            <span>Monday to Saturday: 8.00 am - 7.00 pm</span>
                                        </li>
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
                                            {/*<li>
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
                                            </li>*/}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`sticky-wrapper ${isSticky ? "sticky" : ""}`}>
                    <div className="menu-area">
                        <div className="container th-container">
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
                                            <li className={`menu-item-has-children ${isActive("/destination") ? "active" : ""}`}>
                                                <Link to="/destination">
                                                    Destinations
                                                </Link>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <Link to="/destination?category=Inbound">Inbound (India)</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/destination?category=Outbound">Outbound (International)</Link>
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

                                               <li>
                                                <Link className={isActive("/blog") ? "active" : ""} to="/blog">
                                                   Fremor Magzine
                                                </Link>
                                            </li>

                                           

                                        </ul>
                                    </nav>

                                    <button
                                        type="button"
                                        className="th-menu-toggle d-block d-xl-none"
                                        onClick={() => setIsMobileMenuOpen(true)}
                                    >
                                        <i className="far fa-bars" />
                                    </button>
                                </div>

                                {/* Button */}
                                <div className="col-auto d-none d-xl-block">
                                    <div className="header-button">
                                        <Link to="/contact" className="th-btn style3 th-icon">
                                            Book Now
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div
                            className="logo-bg bg-mask"
                            style={{
                                WebkitMaskImage: "url(/assets/img/logo_bg_mask.png)",
                                maskImage: "url(/assets/img/logo_bg_mask.png)",
                            }}
                        />
                    </div>
                </div>
            </header>

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />
            <LoginForm
                isOpen={isLoginFormOpen}
                onClose={() => setIsLoginFormOpen(false)}
            />
        </>
    );
}

export default HeaderOne;