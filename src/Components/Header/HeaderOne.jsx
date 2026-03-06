import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import NiceSelect from "./NiceSelect";
import MobileMenu from "./MobileMenu";
import LoginForm from "./LoginForm";

function HeaderOne() {
    const languageOptions = [
        { value: "language", label: "Language" },
        { value: "CNY", label: "CNY" },
        { value: "EUR", label: "EUR" },
        { value: "AUD", label: "AUD" },
    ];

    const [isSticky, setIsSticky] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);

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
                                            <span>45 New Eskaton Road, Austria</span>
                                        </li>
                                        <li className="d-none d-xl-inline-block">
                                            <i className="fa-regular fa-clock" />
                                            <span>Sun to Friday: 8.00 am - 7.00 pm</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-auto">
                                <div className="header-right">
                                    <div className="currency-menu">
                                        <NiceSelect
                                            options={languageOptions}
                                            defaultValue="Language"
                                        />
                                    </div>

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
                                                <button
                                                    type="button"
                                                    onClick={() => setIsLoginFormOpen(true)}
                                                >
                                                    Sign In / Register
                                                    <i className="fa-regular fa-user" />
                                                </button>
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
                        <div className="container th-container">
                            <div className="row align-items-center justify-content-between">

                                {/* Logo */}
                                <div className="col-auto">
                                    <div className="header-logo">
                                        <Link to="/">
                                            <img
                                                src="assets/img/logo/FremorLogo.png"
                                                alt="Fremor"
                                            />
                                        </Link>
                                    </div>
                                </div>

                                {/* Main Menu */}
                                <div className="col-auto me-xl-auto">
                                    <nav className="main-menu d-none d-xl-inline-block">
                                        <ul>

                                            {/* Home */}
                                            <li className={`menu-item-has-children mega-menu-wrap ${isParentActive(["/", "/home-tour", "/home-agency", "/home-yacht"]) ? "active" : ""}`}>
                                                <Link className={isActive("/") ? "active" : ""} to="/">
                                                    Home
                                                </Link>

                                                {/* Mega Menu (unchanged) */}
                                                <ul className="mega-menu mega-menu-content">
                                                    <li>
                                                        <div className="container">
                                                            <div className="row gy-4">

                                                                {/* Home Travel */}
                                                                <div className="col-lg-3">
                                                                    <div className="mega-menu-box">
                                                                        <div className="mega-menu-img">
                                                                            <img src="/assets/img/pages/home-travel.jpg" alt="" />
                                                                            <div className="btn-wrap">
                                                                                <Link to="/" className="th-btn">
                                                                                    View Demo
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                        <h3 className="mega-menu-title">
                                                                            <Link to="/">
                                                                                <span>01.</span>Home Travel
                                                                            </Link>
                                                                        </h3>
                                                                    </div>
                                                                </div>

                                                                {/* Home Tour */}
                                                                <div className="col-lg-3">
                                                                    <div className="mega-menu-box">
                                                                        <div className="mega-menu-img">
                                                                            <img src="/assets/img/pages/home-tour.jpg" alt="" />
                                                                            <div className="btn-wrap">
                                                                                <Link to="/home-tour" className="th-btn">
                                                                                    View Demo
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                        <h3 className="mega-menu-title">
                                                                            <Link to="/home-tour">
                                                                                <span>02.</span>Home Tour
                                                                            </Link>
                                                                        </h3>
                                                                    </div>
                                                                </div>

                                                                {/* Home Agency */}
                                                                <div className="col-lg-3">
                                                                    <div className="mega-menu-box">
                                                                        <div className="mega-menu-img">
                                                                            <img src="/assets/img/pages/home-agency.jpg" alt="" />
                                                                            <div className="btn-wrap">
                                                                                <Link to="/home-agency" className="th-btn">
                                                                                    View Demo
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                        <h3 className="mega-menu-title">
                                                                            <Link to="/home-agency">
                                                                                <span>03.</span>Home Agency
                                                                            </Link>
                                                                        </h3>
                                                                    </div>
                                                                </div>

                                                                {/* Home Yacht */}
                                                                <div className="col-lg-3">
                                                                    <div className="mega-menu-box">
                                                                        <div className="mega-menu-img">
                                                                            <img src="/assets/img/pages/home-yacht.jpg" alt="" />
                                                                            <div className="btn-wrap">
                                                                                <Link to="/home-yacht" className="th-btn">
                                                                                    View Demo
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                        <h3 className="mega-menu-title">
                                                                            <Link to="/home-yacht">
                                                                                <span>04.</span>Home Yacht
                                                                            </Link>
                                                                        </h3>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </li>

                                            {/* About */}
                                            <li>
                                                <Link className={isActive("/about") ? "active" : ""} to="/about">
                                                    About Us
                                                </Link>
                                            </li>

                                            {/* Destination */}
                                            <li className={`menu-item-has-children ${isParentActive(["/destination"]) ? "active" : ""}`}>
                                                <Link to="#">Destination</Link>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <Link to="/destination">Destination</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/destination/1">Destination Details</Link>
                                                    </li>
                                                </ul>
                                            </li>

                                            {/* Service */}
                                            <li className={`menu-item-has-children ${isParentActive(["/service"]) ? "active" : ""}`}>
                                                <Link to="#">Service</Link>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <Link to="/service">Services</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/service/1">Service Details</Link>
                                                    </li>
                                                </ul>
                                            </li>

                                            {/* Activities */}
                                            <li className={`menu-item-has-children ${isParentActive(["/activities"]) ? "active" : ""}`}>
                                                <Link to="#">Activities</Link>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <Link to="/activities">Activities</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/activities-details">Activities Details</Link>
                                                    </li>
                                                </ul>
                                            </li>

                                            {/* Blog */}
                                            <li className={`menu-item-has-children ${isParentActive(["/blog"]) ? "active" : ""}`}>
                                                <Link to="#">Blog</Link>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <Link to="/blog">Blog</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/blog/1">Blog Details</Link>
                                                    </li>
                                                </ul>
                                            </li>

                                            {/* Cruise */}
                                            <li>
                                                <Link className={isActive("/cruise") ? "active" : ""} to="/cruise">
                                                   Cruises
                                                </Link>
                                            </li>

                                            {/* Contact */}
                                            <li>
                                                <Link className={isActive("/contact") ? "active" : ""} to="/contact">
                                                    Contact Us
                                                </Link>
                                            </li>

                                            {/* Visa */}
                                            <li>
                                                <Link className={isActive("/visa") ? "active" : ""} to="/visa">
                                                    Visa
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