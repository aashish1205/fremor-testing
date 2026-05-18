import React, { useState } from 'react';
import Modal from './Modal';
import { Link } from 'react-router-dom';

function GalleryFour() {
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
        <div className="overflow-hidden space" id="gallery-sec">
            <div className="container-fuild">
                <div className="title-area mb-30 text-center">
                    <span className="sub-title">Explore Us</span>
                    <h2 className="sec-title">A truly exceptional experience</h2>
                </div>
                <div className="row gy-4 gallery-row4">
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/cruises/exploreh1.jpeg" alt="gallery"
                                    onClick={(e) => openModal('/assets/img/cruises/exploreh1.jpeg', e)}
                                />
                                <Link
                                    to="/assets/img/cruises/exploreh1.jpeg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/cruises/exploreh1.jpeg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/cruises/explores1.jpeg" alt="gallery"
                                    onClick={(e) => openModal('/assets/img/cruises/explores1.jpeg', e)} />
                                <Link
                                    to="/assets/img/cruises/explores1.jpeg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/cruises/explores1.jpeg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/cruises/explores3.jpeg" alt="gallery"
                                    onClick={(e) => openModal('/assets/img/cruises/explores3.jpeg', e)} />
                                <Link
                                    to="/assets/img/cruises/explores3.jpeg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/cruises/explores3.jpeg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/cruises/exploreh2.jpeg" alt="gallery"
                                    onClick={(e) => openModal('/assets/img/cruises/exploreh2.jpeg', e)} />
                                <Link
                                    to="/assets/img/cruises/exploreh2.jpeg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/cruises/exploreh2.jpeg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/cruises/exploreh3.jpeg" alt="gallery"
                                    onClick={(e) => openModal('/assets/img/cruises/exploreh3.jpeg', e)} />
                                <Link
                                    to="/assets/img/cruises/exploreh3.jpeg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/cruises/exploreh3.jpeg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/cruises/explores5.jpeg" alt="gallery"
                                    onClick={(e) => openModal('/assets/img/cruises/explores5.jpeg', e)} />
                                <Link
                                    to="/assets/img/cruises/explores5.jpeg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/cruises/explores5.jpeg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/cruises/explores2.jpeg" alt="gallery"
                                    />
                                <Link
                                    to="/assets/img/cruises/explores2.jpeg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/cruises/explores2.jpeg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="gallery-box style5">
                            <div className="gallery-img global-img">
                                <img src="/assets/img/cruises/6824.jpeg" alt="gallery"
                                    onClick={(e) => openModal('/assets/img/cruises/6824.jpeg', e)} />
                                <Link
                                    to="/assets/img/cruises/6824.jpeg"
                                    className="icon-btn popup-image"
                                    onClick={(e) => openModal('/assets/img/cruises/6824.jpeg', e)}
                                >
                                    <i className="fal fa-magnifying-glass-plus" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
        </div>
    )
}

export default GalleryFour
