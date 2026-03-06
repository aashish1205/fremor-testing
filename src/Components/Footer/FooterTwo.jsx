import React from 'react'
import { Link } from 'react-router-dom'

function FooterTwo() {
    return (
        <footer className="footer-wrapper bg-title footer-layout2">
            <div className="widget-area">
                <div className="container">
                    <div className="newsletter-area">
                        <div className="newsletter-top">
                            <div className="row gy-4 align-items-center">
                                <div className="col-lg-5">
                                    <h2 className="newsletter-title text-white text-capitalize mb-0">
                                        get updated the latest newsletter
                                    </h2>
                                </div>
                                <div className="col-lg-7">
                                    <form className="newsletter-form style2">
                                        <input
                                            className="form-control "
                                            type="email"
                                            placeholder="Enter Email"
                                            required=""
                                        />
                                        <button type="submit" className="th-btn style1">
                                            Subscribe Now <img src="/assets/img/icon/plane2.svg" alt="" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-between">
                        <div className="col-md-6 col-xl-3">
                            <div className="widget footer-widget">
                                <div className="th-widget-about">
                                    <div className="about-logo">
                                        <Link to="/">
                                            <img src="/assets/img/logo-white.svg" alt="Tourm" />
                                        </Link>
                                    </div>
                                    <p className="about-text">
                                        Rapidiously myocardinate cross-platform intellectual capital
                                        model. Appropriately create interactive infrastructures
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
                                        <Link to="https://instagram.com/">
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget widget_nav_menu footer-widget">
                                <h3 className="widget_title">Quick Links</h3>
                                <div className="menu-all-pages-container">
                                    <ul className="menu">
                                        <li>
                                            <Link to="/">Home</Link>
                                        </li>
                                        <li>
                                            <Link to="/about">About us</Link>
                                        </li>
                                        <li>
                                            <Link to="/service">Our Service</Link>
                                        </li>
                                        <li>
                                            <Link to="/contact">Terms of Service</Link>
                                        </li>
                                        <li>
                                            <Link to="/contact">Tour Booking Now</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget footer-widget">
                                <h3 className="widget_title">Get In Touch</h3>
                                <div className="th-widget-contact">
                                    <div className="info-box_text">
                                        <div className="icon">
                                            <img src="/assets/img/icon/phone.svg" alt="img" />
                                        </div>
                                        <div className="details">
                                            <p>
                                                <Link to="/tel:+01234567890" className="info-box_link">
                                                    +01 234 567 890
                                                </Link>
                                            </p>
                                            <p>
                                                <Link to="/tel:+09876543210" className="info-box_link">
                                                    +09 876 543 210
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
                                                <Link
                                                    to="/mailto:mailinfo00@tourm.com"
                                                    className="info-box_link"
                                                >
                                                    mailinfo00@tourm.com
                                                </Link>
                                            </p>
                                            <p>
                                                <Link
                                                    to="/mailto:support24@tourm.com"
                                                    className="info-box_link"
                                                >
                                                    support24@tourm.com
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-box_text">
                                        <div className="icon">
                                            <img src="/assets/img/icon/location-dot.svg" alt="img" />
                                        </div>
                                        <div className="details">
                                            <p>789 Inner Lane, Holy park, California, USA</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget footer-widget">
                                <h3 className="widget_title">Instagram Post</h3>
                                <div className="sidebar-gallery">
                                    <div className="gallery-thumb">
                                        <img
                                            src="/assets/img/widget/gallery_1_1.jpg"
                                            alt="Gallery"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="/assets/img/widget/gallery_1_2.jpg"
                                            alt="Gallery"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="/assets/img/widget/gallery_1_3.jpg"
                                            alt="Gallery"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="/assets/img/widget/gallery_1_4.jpg"
                                            alt="Gallery"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="/assets/img/widget/gallery_1_5.jpg"
                                            alt="Gallery"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                    <div className="gallery-thumb">
                                        <img
                                            src="/assets/img/widget/gallery_1_6.jpg"
                                            alt="Gallery"
                                        />
                                        <Link
                                            target="_blank"
                                            to="https://www.instagram.com/"
                                            className="gallery-btn"
                                        >
                                            <i className="fab fa-instagram" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-wrap">
                <div className="container">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-md-6">
                            <p className="copyright-text">
                                Copyright 2025 <Link to="/">Tourm</Link>. All Rights
                                Reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-end d-none d-md-block">
                            <div className="footer-card">
                                <span className="title">We Accept</span>
                                <img src="/assets/img/shape/cards.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="shape-mockup movingX d-none d-xxl-block"
                style={{
                    top: "24%",
                    left: "5%",
                }}
            >
                <img src="/assets/img/shape/shape_8.png" alt="shape" />
            </div>
        </footer>

    )
}

export default FooterTwo
