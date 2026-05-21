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
                <div className="sidemenu-content" onClick={(e) => e.stopPropagation()}>
                    <button className="closeButton sideMenuCls" onClick={onClose} aria-label="Close">
                        <i className="far fa-times" />
                    </button>
                    <div className="widget  ">
                        <div className="th-widget-about">
                            <div className="about-logo">
                                <Link to="/">
                                    <img src="/assets/img/logo/FremorLogo-white.png" alt="Fremor" />
                                </Link>
                            </div>
                            <p className="about-text">
                                Explore the world with Fremor. Discover bespoke travel destinations, luxury cruises, and seamless visa processing.
                            </p>
                            <div className="th-social">
                                <a href="https://www.facebook.com/people/Fremor-global/61562522722104/" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-facebook-f" />
                                </a>
                                <a href="https://in.linkedin.com/company/fremor-global" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-linkedin-in" />
                                </a>
                                <a href="https://www.instagram.com/fremorglobal/" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-instagram" />
                                </a>
                                <a href="https://www.whatsapp.com/" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-whatsapp" />
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    {/* We can hide or replace recent posts widget since it has placeholder blogs */}
                    
                    <div className="widget  ">
                        <h3 className="widget_title">Get In Touch</h3>
                        <div className="th-widget-contact">
                            <div className="info-box_text">
                                <div className="icon">
                                    <img src="/assets/img/icon/phone.svg" alt="img" />
                                </div>
                                <div className="details">
                                    <p>
                                        <Link to="tel:+919920499911" className="info-box_link">
                                            +91 9920499911
                                        </Link>
                                    </p>
                                    <p>
                                        <Link to="tel:+918657004943" className="info-box_link">
                                            +91 8657004943
                                        </Link>
                                    </p>
                                </div>
                            </div>
                            <div className="info-box_text">
                                <div className="icon">
                                    <img src="/assets/img/icon/envelope.svg" alt="img" />
                                </div>
                                <div className="details">
                                    <p>
                                        <Link to="mailto:connect@fremorglobal.com" className="info-box_link">
                                            connect@fremorglobal.com
                                        </Link>
                                    </p>
                                    <p>
                                        <Link to="mailto:askari.rizvi@fremorglobal.com" className="info-box_link">
                                            askari.rizvi@fremorglobal.com
                                        </Link>
                                    </p>
                                </div>
                            </div>
                            <div className="info-box_text">
                                <div className="icon">
                                    <img src="/assets/img/icon/location-dot.svg" alt="img" />
                                </div>
                                <div className="details">
                                    <p>11th floor, Urmi Estate Ganpatrao Kadam Marg, Lower Parel-west, Mumbai- 400013</p>
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
