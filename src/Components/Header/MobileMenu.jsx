import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MobileMenu({ isOpen, onClose }) {
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeShopMenu, setActiveShopMenu] = useState(false); // Shop submenu state
    const menuRefs = useRef({});

    // Toggle dropdown menu
    const toggleMenu = (index) => {
        if (index !== 6) {
            setActiveMenu(activeMenu === index ? null : index);
        }
    };

    // Handle Shop menu separately
    const toggleShopMenu = (e) => {
        e.stopPropagation(); // Prevent menu from closing
        setActiveShopMenu(!activeShopMenu);
    };

    // Apply height animation when activeMenu changes
    useEffect(() => {
        Object.keys(menuRefs.current).forEach((key) => {
            const submenu = menuRefs.current[key];
            if (submenu) {
                submenu.style.height = activeMenu == key ? `${submenu.scrollHeight}px` : "0px";
            }
        });
    }, [activeMenu]);

    return (
        <div className={`th-menu-wrapper onepage-nav ${isOpen ? "th-body-visible" : ""}`}
            style={{ visibility: isOpen ? "visible" : "hidden" }}>

            <div className="th-menu-area text-center">
                <button className="th-menu-toggle" onClick={onClose} aria-label="Close">
                    <i className="fal fa-times" />
                </button>

                <div className="mobile-logo">
                    <Link to="/">
                        <img src="assets/img/logo/FremorLogoblack.png"  alt="Tourm" style={{ width: "140px", height: "auto", maxWidth: "140px" }}/>
                    </Link>
                </div>

                <div className="th-mobile-menu">
                    <ul>
                        {/* Home */}
                        <li className={`menu-item-has-children mega-menu-wrap th-item-has-children ${activeMenu === 1 ? "th-active" : ""}`}>
                            <Link to="#" onClick={() => toggleMenu(1)}>Home
                            </Link>
                            <ul
                                ref={(el) => (menuRefs.current[1] = el)}
                                className="th-submenu"
                                style={{ height: "0px", overflow: "hidden", transition: "height 0.3s ease-in-out" }}
                            >
                                <li><Link to="/">Home Travel</Link></li>
                                <li><Link to="/home-tour">Home Tour</Link></li>
                                <li><Link to="/home-agency">Home Agency</Link></li>
                                <li><Link to="/home-yacht">Home Yacht</Link></li>
                            </ul>
                        </li>

                        {/* About Us */}
                        <li><Link to="/about">About Us</Link></li>

                        {/* Destination */}
                        <li className={`menu-item-has-children th-item-has-children ${activeMenu === 2 ? "th-active" : ""}`}>
                            <Link to="#" onClick={() => toggleMenu(2)}>Destination</Link>
                            <ul
                                ref={(el) => (menuRefs.current[2] = el)}
                                className="th-submenu"
                                style={{ height: "0px", overflow: "hidden", transition: "height 0.3s ease-in-out" }}
                            >
                                <li><Link to="/destination">Destination</Link></li>
                                <li><Link to="/destination/1">Destination Details</Link></li>
                            </ul>
                        </li>

                        {/* Service */}
                        <li className={`menu-item-has-children th-item-has-children ${activeMenu === 3 ? "th-active" : ""}`}>
                            <Link to="#" onClick={() => toggleMenu(3)}>Service</Link>
                            <ul
                                ref={(el) => (menuRefs.current[3] = el)}
                                className="th-submenu"
                                style={{ height: "0px", overflow: "hidden", transition: "height 0.3s ease-in-out" }}
                            >
                                <li><Link to="/service">Services</Link></li>
                                <li><Link to="/service-details">Service Details</Link></li>
                            </ul>
                        </li>

                        {/* Activities */}
                        <li className={`menu-item-has-children th-item-has-children ${activeMenu === 4 ? "th-active" : ""}`}>
                            <Link to="#" onClick={() => toggleMenu(4)}>Activities</Link>
                            <ul
                                ref={(el) => (menuRefs.current[4] = el)}
                                className="th-submenu"
                                style={{ height: "0px", overflow: "hidden", transition: "height 0.3s ease-in-out" }}
                            >
                                <li><Link to="/activities">Activities</Link></li>
                                <li><Link to="/activities-details">Activities Details</Link></li>
                            </ul>
                        </li>

                        {/* Pages */}

                        <li className={`menu-item-has-children th-item-has-children ${activeMenu === 5 ? "th-active" : ""}`}>
                            <Link to="#" onClick={() => toggleMenu(5)}>Pages</Link>
                            <ul
                                ref={(el) => (menuRefs.current[5] = el)}
                                className="th-submenu"
                                style={{ height: "0px", overflow: "hidden", transition: "height 0.3s ease-in-out" }}
                            >
                                <li><Link to="/shop">Shop</Link></li>
                                <li><Link to="/shop-details">Shop Details</Link></li>
                                <li><Link to="/cart">Cart Page</Link></li>
                                <li><Link to="/checkout">Checkout</Link></li>
                                <li><Link to="/wishlist">Wishlist</Link></li>
                                <li><Link to="/gallery">Gallery</Link></li>
                                <li><Link to="/tour">Our Tour</Link></li>
                                <li><Link to="/tour-details">Tour Details</Link></li>
                                <li><Link to="/resort">Resort Page</Link></li>
                                <li><Link to="/resot/1">Resort Details</Link></li>
                                <li><Link to="/tour-guide">Tour Guide</Link></li>
                                <li><Link to="/tour-guide/1">Tour Guider Details</Link></li>
                                <li><Link to="/faq">Faq Page</Link></li>
                                <li><Link to="/price">Price Page</Link></li>
                                <li><Link to="/error">Error Page</Link></li>
                            </ul>
                        </li>


                        {/* Blog */}
                        <li className={`menu-item-has-children th-item-has-children ${activeMenu === 7 ? "th-active" : ""}`}>
                            <Link to="#" onClick={() => toggleMenu(7)}>Blog</Link>
                            <ul
                                ref={(el) => (menuRefs.current[7] = el)}
                                className="th-submenu"
                                style={{ height: "0px", overflow: "hidden", transition: "height 0.3s ease-in-out" }}
                            >
                                <li><Link to="/blog">Blog</Link></li>
                                <li><Link to="/blog/1">Blog Details</Link></li>
                            </ul>
                        </li>

                        {/* Contact */}
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default MobileMenu;
