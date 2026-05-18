import React, { useState } from 'react';
import Modal from './Modal';
import { Link } from 'react-router-dom';

function GalleryTwo() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');

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
        <div
            className="gallery-area2 bg-top-center space"
            style={{
                backgroundImage: "url('/assets/img/bg/gallery_bg_1.jpg')",
                backgroundRepeat: "no-repeat",
            }}
            data-bg-src=""
        >
            <div className="container">
                <div className="row justify-content-lg-between justify-content-center align-items-center">
                    <div className="col-lg-7">
                        <div className="title-area text-center text-lg-start mb-20 pe-xl-5 me-xl-5">
                            <span className="sub-title">Best Memorable Places</span>
                            <h2 className="sec-title">
                                Explore the most beautiful place in the world
                            </h2>
                        </div>
                        <p className="sec-text style2 text-title mb-50">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod
                            tempor incididunt labore et dolore magna aliqua. Ut enim ad minim
                            veniam, quis nostrud exercitation.
                        </p>
                    </div>
                    <div className="col-auto">
                        <div className="sec-btn">
                            <Link to="/gallery" className="th-btn style3 th-icon">
                                Enter Gallery
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container th-container2 shape-mockup-wrap">
                <div className="row gy-24 gx-24 justify-content-center">
                    <div className="col-lg-3 gallery-box_wrapp">
                        <div className="gallery-box">
                            <div className="gallery-img global-img">
                                <Link
                                    to="/assets/img/gallery/gallery_2_1.jpg"
                                    className="popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_2_1.jpg', e)}
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                    <img
                                        src="/assets/img/gallery/gallery_2_1.jpg"
                                        alt="gallery"
                                        onClick={(e) => openModal('/assets/img/gallery/gallery_2_1.jpg', e)}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 gallery-box_wrapp">
                        <div className="gallery-box">
                            <div className="gallery-img global-img">
                                <Link
                                    to="/assets/img/gallery/gallery_2_2.jpg"
                                    className="popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_2_2.jpg', e)}
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                    <img
                                        src="/assets/img/gallery/gallery_2_2.jpg"
                                        alt="gallery"
                                        onClick={(e) => openModal('/assets/img/gallery/gallery_2_2.jpg', e)}
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="gallery-box">
                            <div className="gallery-img global-img">
                                <Link
                                    to="/assets/img/gallery/gallery_2_3.jpg"
                                    className="popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_2_3.jpg', e)}
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                    <img
                                        src="/assets/img/gallery/gallery_2_3.jpg"
                                        alt="gallery"
                                        onClick={(e) => openModal('/assets/img/gallery/gallery_2_3.jpg', e)}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 gallery-box_wrapp">
                        <div className="gallery-box">
                            <div className="gallery-img global-img">
                                <Link
                                    to="/assets/img/gallery/gallery_2_4.jpg"
                                    className="popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_2_4.jpg', e)}
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                    <img
                                        src="/assets/img/gallery/gallery_2_4.jpg"
                                        alt="gallery"
                                        onClick={(e) => openModal('/assets/img/gallery/gallery_2_4.jpg', e)}
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="gallery-box">
                            <div className="gallery-img global-img">
                                <Link
                                    to="/assets/img/gallery/gallery_2_5.jpg"
                                    className="popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_2_5.jpg', e)}
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                    <img
                                        src="/assets/img/gallery/gallery_2_5.jpg"
                                        alt="gallery"
                                        onClick={(e) => openModal('/assets/img/gallery/gallery_2_5.jpg', e)}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 gallery-box_wrapp">
                        <div className="gallery-box">
                            <div className="gallery-img global-img">
                                <Link
                                    to="/assets/img/gallery/gallery_2_6.jpg"
                                    className="popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_2_6.jpg', e)}
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                    <img
                                        src="/assets/img/gallery/gallery_2_6.jpg"
                                        alt="gallery"
                                        onClick={(e) => openModal('/assets/img/gallery/gallery_2_6.jpg', e)}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="shape-mockup movingX d-none d-xl-block"
                    style={{
                        bottom: "35%",
                        right: "-4%",
                    }}
                >
                    <img src="/assets/img/shape/shape_2_1.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup movingX d-none d-xl-block"
                    style={{
                        bottom: "8%",
                        left: "-10%",
                    }}
                >
                    <img src="/assets/img/shape/shape_2_4.png" alt="shape" />
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
        </div>

    )
}

export default GalleryTwo
