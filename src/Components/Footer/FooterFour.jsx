import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Gallery/Modal';
import { fetchGalleryImages, getGalleryImageSrc } from '../../services/instagramGalleryService';

function FooterFour() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [galleryImages, setGalleryImages] = useState([]);

    useEffect(() => {
        const loadImages = async () => {
            try {
                const data = await fetchGalleryImages();
                setGalleryImages(data.slice(0, 6)); // Display max 6 images in the footer
            } catch (error) {
                console.error("Error loading gallery images:", error);
            }
        };
        loadImages();
    }, []);

    // Function to open the modal with the selected image
    const openModal = (imageSrc, event) => {
        event.preventDefault(); // Prevent default link behavior
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };
    
        // Function to close the modal
        const closeModal = () => {
            setIsModalOpen(false);
        };
    return (
        <footer className="footer-wrapper bg-title footer-layout2 shape-mockup-wrap">
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
                                            <img src="/assets/img/logo/FremorLogo.png" alt="Tourm" />
                                        </Link>
                                    </div>
                                    <p className="about-text">
                                        Rapidiously myocardinate cross-platform intellectual capital
                                        model. Appropriately create interactive infrastructures
                                    </p>
                                    <div className="th-social">
                                        <Link to="https://www.facebook.com/people/Fremor-global/61562522722104/">
                                            <i className="fab fa-facebook-f" />
                                        </Link>
                                       
                                        <Link to="https://in.linkedin.com/company/fremor-global">
                                            <i className="fab fa-linkedin-in" />
                                        </Link>
                                        <Link to="https://www.whatsapp.com/">
                                            <i className="fab fa-whatsapp" />
                                        </Link>
                                        <Link to="https://www.instagram.com/fremorglobal/">
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
                                        {/*<li>
                                            <Link to="/service">Our Service</Link>
                                        </li>*/}
                                        <li>
                                            <Link to="/terms">Terms of Service</Link>
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
                                                <Link
                                                    to="mailto:connect@fremorglobal.com"
                                                    className="info-box_link"
                                                >
                                                    connect@fremorglobal.com
                                                </Link>
                                            </p>
                                            <p>
                                                <Link
                                                    to="mailto:askari.rizvi@fremorglobal.com"
                                                    className="info-box_link"
                                                >
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
                        <div className="col-md-6 col-xl-auto">
                            <div className="widget footer-widget">
                                <h3 className="widget_title">Instagram Post</h3>
                                <div className="sidebar-gallery">
                                    {galleryImages.map((image) => (
                                        <div className="gallery-thumb" key={image.id}>
                                            <img
                                                src={getGalleryImageSrc(image.image_url)}
                                                alt="Gallery"
                                                onClick={(e) => openModal(getGalleryImageSrc(image.image_url), e)}
                                            />
                                            <Link
                                                to={getGalleryImageSrc(image.image_url)}
                                                className="gallery-btn popup-image"
                                                onClick={(e) => openModal(getGalleryImageSrc(image.image_url), e)}
                                            >
                                                <i className="fab fa-instagram" />
                                            </Link>
                                        </div>
                                    ))}
                                    {galleryImages.length === 0 && (
                                        <p className="text-white">No images available.</p>
                                    )}
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
                style={{ top: '24%', left: '5%' }}
            >
                <img src="/assets/img/shape/shape_8.png" alt="shape" />
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
            <style>{`
                .footer-wrapper a:hover, 
                .footer-wrapper .info-box_link:hover, 
                .footer-wrapper .th-social a:hover, 
                .footer-wrapper .menu-all-pages-container a:hover {
                    color: white !important;
                }
            `}</style>
        </footer>

    )
}

export default FooterFour
