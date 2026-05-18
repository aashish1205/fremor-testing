import React, { useState } from 'react'
import Modal from './Modal';
import { Link } from 'react-router-dom';

function GalleryThree() {
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
        <div className="overflow-hidden space-bottom">
            <div className="container">
                <div className="title-area text-center">
                    <span className="sub-title">Make Your Tour More Pleasure</span>
                    <h2 className="sec-title">Recent Gallery</h2>
                </div>
                <div className="row gy-24 gx-24 justify-content-center">
                    <div className="col-lg-3">
                        <div className="gallery-box style2">
                            <div className="gallery-img global-img">
                                <Link
                                    to="/assets/img/gallery/gallery_3_1.jpg"
                                    className="popup-image"
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                    <img
                                        src="/assets/img/gallery/gallery_3_1.jpg"
                                        alt="gallery"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="gallery-box style2">
                            <div className="gallery-img global-img">
                                <Link
                                    to="/assets/img/gallery/gallery_3_2.jpg"
                                    className="popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_3_2.jpg', e)}
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                    <img
                                        src="/assets/img/gallery/gallery_3_2.jpg"
                                        alt="gallery"
                                        onClick={(e) => openModal('/assets/img/gallery/gallery_3_2.jpg', e)}
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="gallery-box style2">
                            <div className="gallery-img global-img">
                                <Link
                                    to="/assets/img/gallery/gallery_3_4.jpg"
                                    className="popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_3_4.jpg', e)}
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                    <img
                                        src="/assets/img/gallery/gallery_3_4.jpg"
                                        alt="gallery"
                                        onClick={(e) => openModal('/assets/img/gallery/gallery_3_4.jpg', e)}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 ">
                        <div className="gallery-box style2">
                            <div className="gallery-img global-img">
                                <Link
                                    to="/assets/img/gallery/gallery_3_3.jpg"
                                    className="popup-image"
                                    onClick={(e) => openModal('/assets/img/gallery/gallery_3_3.jpg', e)}
                                >
                                    <div className="icon-btn">
                                        <i className="fal fa-magnifying-glass-plus" />
                                    </div>
                                    <img
                                        src="/assets/img/gallery/gallery_3_3.jpg"
                                        alt="gallery"
                                        onClick={(e) => openModal('/assets/img/gallery/gallery_3_3.jpg', e)}
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="gallery-box-wrapp">
                            <div className="gallery-box style2">
                                <div className="gallery-img global-img">
                                    <Link
                                        to="/assets/img/gallery/gallery_3_5.jpg"
                                        className="popup-image"
                                        onClick={(e) => openModal('/assets/img/gallery/gallery_3_5.jpg', e)}
                                    >
                                        <div className="icon-btn">
                                            <i className="fal fa-magnifying-glass-plus" />
                                        </div>
                                        <img
                                            src="/assets/img/gallery/gallery_3_5.jpg"
                                            alt="gallery"
                                            onClick={(e) => openModal('/assets/img/gallery/gallery_3_5.jpg', e)}
                                        />
                                    </Link>
                                </div>
                            </div>
                            <div className="gallery-box style2">
                                <div className="gallery-img global-img">
                                    <Link
                                        to="/assets/img/gallery/gallery_3_6.jpg"
                                        className="popup-image"
                                        onClick={(e) => openModal('/assets/img/gallery/gallery_3_6.jpg', e)}
                                    >
                                        <div className="icon-btn">
                                            <i className="fal fa-magnifying-glass-plus" />
                                        </div>
                                        <img
                                            src="/assets/img/gallery/gallery_3_6.jpg"
                                            alt="gallery"
                                            onClick={(e) => openModal('/assets/img/gallery/gallery_3_6.jpg', e)}
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
        </div>

    )
}

export default GalleryThree
