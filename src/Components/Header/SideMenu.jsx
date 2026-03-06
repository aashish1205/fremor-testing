import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function SideMenu({ isOpen, onClose }) {
    const [activeMenu, setActiveMenu] = useState(null);
    
        // Toggle the active state of a dropdown menu
        const toggleMenu = (index) => {
            setActiveMenu(activeMenu === index ? null : index);
        };
    return (
        <>
            <div className={`sidemenu-wrapper sidemenu-info ${isOpen ? "show" : ""}`} style={{ visibility: isOpen ? "visible" : "hidden" }} onClick={onClose} aria-label="Close">
                <div className="sidemenu-content">
                    <button className="closeButton sideMenuCls" onClick={onClose} aria-label="Close">
                        <i className="far fa-times" />
                    </button>
                    <div className="widget  ">
                        <div className="th-widget-about">
                            <div className="about-logo">
                                <Link to="/">
                                    <img src="assets\img\logo\FremorLogo-white.png" alt="Tourm" />
                                </Link>
                            </div>
                            <p className="about-text">
                                Rapidiously myocardinate cross-platform intellectual capital model.
                                Appropriately create interactive infrastructures
                            </p>
                            <div className="th-social">
                                <Link to="https://www.facebook.com/">
                                    <i className="fab fa-facebook-f" />
                                </Link>
                                <Link to="https://www.twitter.com/">
                                    <i className="fab fa-twitter" />
                                </Link>
                                <Link to="https://www.linkedin.com/">
                                    <i className="fab fa-linkedin-in" />
                                </Link>
                                <Link to="https://www.whatsapp.com/">
                                    <i className="fab fa-whatsapp" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="widget  ">
                        <h3 className="widget_title">Recent Posts</h3>
                        <div className="recent-post-wrap">
                            <div className="recent-post">
                                <div className="media-img">
                                    <Link to="/blog/1">
                                        <img src="assets/img/blog/recent-post-1-1.jpg" alt="Blog Image" />
                                    </Link>
                                </div>
                                <div className="media-body">
                                    <div className="recent-post-meta">
                                        <Link to="/blog">
                                            <i className="far fa-calendar" />
                                            24 Jun , 2025
                                        </Link>
                                    </div>
                                    <h4 className="post-title">
                                        <Link className="text-inherit" to="/blog/1">
                                            Where Vision Meets Concrete Reality
                                        </Link>
                                    </h4>
                                </div>
                            </div>
                            <div className="recent-post">
                                <div className="media-img">
                                    <Link to="/blog/1">
                                        <img src="assets/img/blog/recent-post-1-2.jpg" alt="Blog Image" />
                                    </Link>
                                </div>
                                <div className="media-body">
                                    <div className="recent-post-meta">
                                        <Link to="/blog">
                                            <i className="far fa-calendar" />
                                            22 Jun , 2025
                                        </Link>
                                    </div>
                                    <h4 className="post-title">
                                        <Link className="text-inherit" to="/blog/1">
                                            Raising the Bar in Construction.
                                        </Link>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="widget  ">
                        <h3 className="widget_title">Get In Touch</h3>
                        <div className="th-widget-contact">
                            <div className="info-box_text">
                                <div className="icon">
                                    <img src="assets/img/icon/phone.svg" alt="img" />
                                </div>
                                <div className="details">
                                    <p>
                                        <Link to="tel:+01234567890" className="info-box_link">
                                            +01 234 567 890
                                        </Link>
                                    </p>
                                    <p>
                                        <Link to="tel:+09876543210" className="info-box_link">
                                            +09 876 543 210
                                        </Link>
                                    </p>
                                </div>
                            </div>
                            <div className="info-box_text">
                                <div className="icon">
                                    <img src="assets/img/icon/envelope.svg" alt="img" />
                                </div>
                                <div className="details">
                                    <p>
                                        <Link to="mailto:mailinfo00@tourm.com" className="info-box_link">
                                            mailinfo00@tourm.com
                                        </Link>
                                    </p>
                                    <p>
                                        <Link to="mailto:support24@tourm.com" className="info-box_link">
                                            support24@tourm.com
                                        </Link>
                                    </p>
                                </div>
                            </div>
                            <div className="info-box_text">
                                <div className="icon">
                                    <img src="assets/img/icon/location-dot.svg" alt="img" />
                                </div>
                                <div className="details">
                                    <p>789 Inner Lane, Holy park, California, USA</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default SideMenu
