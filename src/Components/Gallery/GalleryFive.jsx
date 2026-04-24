import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import { fetchGalleryImages, getGalleryImageSrc } from "../../services/instagramGalleryService";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Static fallback images used when Supabase returns no data
const FALLBACK_IMAGES = [
    '/assets/img/gallery/gallery_4_1.jpg',
    '/assets/img/gallery/gallery_4_2.jpg',
    '/assets/img/gallery/gallery_4_3.jpg',
    '/assets/img/gallery/gallery_4_4.jpg',
    '/assets/img/gallery/gallery_4_5.jpg',
];

function GalleryFive() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGallery();
    }, []);

    const loadGallery = async () => {
        try {
            const data = await fetchGalleryImages();
            if (data && data.length > 0) {
                setGalleryItems(data);
            } else {
                // Fallback to static images
                setGalleryItems(FALLBACK_IMAGES.map((src, i) => ({
                    id: `fallback-${i}`,
                    image_url: src,
                    instagram_link: 'https://www.instagram.com/fremorglobal/',
                    caption: 'Fremor Global'
                })));
            }
        } catch (err) {
            console.warn('Failed to load gallery from Supabase, using fallback:', err);
            setGalleryItems(FALLBACK_IMAGES.map((src, i) => ({
                id: `fallback-${i}`,
                image_url: src,
                instagram_link: 'https://www.instagram.com/fremorglobal/',
                caption: 'Fremor Global'
            })));
        } finally {
            setLoading(false);
        }
    };

    const openModal = (imageSrc, event) => {
        event.preventDefault();
        setModalImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    // Duplicate items if fewer than 5 to make Swiper loop work smoothly
    const slidesData = galleryItems.length > 0 && galleryItems.length < 5
        ? [...galleryItems, ...galleryItems, ...galleryItems]
        : galleryItems.length >= 5
            ? [...galleryItems, ...galleryItems]
            : galleryItems;

    if (loading) {
        return (
            <div className="sidebar-gallery-area space">
                <div className="container-fluid">
                    <div className="slider-area" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '300px'
                    }}>
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sidebar-gallery-area space">
            <div className="container-fluid">
                <div className="slider-area">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={20}
                        centeredSlides={true}
                        loop={true}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            576: { slidesPerView: 2 },
                            768: { slidesPerView: 2 },
                            992: { slidesPerView: 3 },
                            1200: { slidesPerView: 3 },
                            1300: { slidesPerView: 4 },
                        }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        className="th-slider has-shadow"
                    >
                        {slidesData.map((item, index) => {
                            const imgSrc = getGalleryImageSrc(item.image_url);
                            const instagramLink = item.instagram_link || 'https://www.instagram.com/fremorglobal/';

                            return (
                                <SwiperSlide key={`${item.id}-${index}`}>
                                    <div className="gallery-thumb style2 global-img">
                                        <img
                                            src={imgSrc}
                                            alt={item.caption || 'Gallery'}
                                            onClick={(e) => openModal(imgSrc, e)}
                                        />
                                        <a
                                            href={instagramLink}
                                            className="gallery-btn popup-image"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <i className="fab fa-instagram" />
                                        </a>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal} imageSrc={modalImage} />
        </div>
    );
}

export default GalleryFive;
