"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Controller, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/controller";
import NiceSelect from "../Header/NiceSelect";
import { Link } from "react-router-dom";

function BannerThree() {
    const [mainSwiper, setMainSwiper] = useState(null);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const destinationOptions = [
        { value: "Australia", label: "Australia" },
        { value: "Dubai", label: "Dubai" },
        { value: "England", label: "England" },
        { value: "Sweden", label: "Sweden" },
        { value: "Thailand", label: "Thailand" },
        { value: "Switzerland", label: "Switzerland" },
    ];
    const adventureOptions = [
        { value: "Beach", label: "Beach" },
        { value: "Group Tour", label: "Group Tour" },
        { value: "Couple Tour", label: "Couple Tour" },
        { value: "Family Tour", label: "Family Tour" },
    ];
    const durationOptions = [
        { value: "1 days", label: "1 days" },
        { value: "2 days", label: "2 days" },
        { value: "3 days", label: "3 days" },
        { value: "4 days", label: "4 days" },
        { value: "5 days", label: "5 days" },
        { value: "6 days", label: "6 days" },
    ];
    const categoryOptions = [
        { value: "Luxury", label: "Luxury" },
        { value: "Deluxe", label: "Deluxe" },
        { value: "Economy", label: "Economy" },
    ];

    useEffect(() => {
        // Function to add animation classes
        const animationProperties = () => {
            document.querySelectorAll('[data-ani]').forEach((element) => {
                const animationName = element.getAttribute('data-ani');
                element.classList.add(animationName);
            });

            document.querySelectorAll('[data-ani-delay]').forEach((element) => {
                const delayTime = element.getAttribute('data-ani-delay');
                element.style.animationDelay = delayTime;
            });
        };

        animationProperties();
    }, []);
    const handleScroll = (e) => {
        e.preventDefault();
        document.getElementById("destination-sec")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="hero-3" id="hero">
            {/* Main Swiper */}
            <Swiper
                modules={[EffectFade, Autoplay, Controller, Navigation, Pagination]}
                loop={true}
                effect="fade"
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                pagination={{
                    el: ".slider-pagination",
                    type: "fraction",
                    renderFraction: (currentClass, totalClass) =>
                        `<span className="${currentClass}"></span> / <span className="${totalClass}"></span>`,
                }}
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }}
                controller={{ control: thumbsSwiper }} // Link to thumbs swiper
                onSwiper={setMainSwiper}
                className="hero-slider-3"
            >
                {/* Image Slides */}
                {[
                    { img: "/assets/img/hero/hero_bg_3_1.jpg", title: "Discover The World with Our Guide" },
                    { img: "/assets/img/hero/hero_bg_3_2.jpg", title: "Discover The World Best Destination" },
                    { img: "/assets/img/hero/hero_bg_3_3.jpg", title: "Capture Wonder Of The World" },
                    { img: "/assets/img/hero/hero_bg_3_4.jpg", title: "Explore the world with Tourm" },
                ].map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="hero-inner">
                            <div className="th-hero-bg" style={{ backgroundImage: `url(${slide.img})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}></div>
                            <div className="container">
                                <div className="hero-style3">
                                    <h1 className="hero-title" data-ani="slideinleft" data-ani-delay="0.2s">{slide.title}</h1>
                                    <p className="hero-text" data-ani="slideinleft" data-ani-delay="0.4s">
                                        Tourm is an international travel management company with 25 years of experience, specializing in business and maritime travel.
                                    </p>
                                    <div className="btn-group" data-ani="slideinup" data-ani-delay="0.6s">
                                        <Link to="/tour" className="th-btn style2 th-icon">
                                            Explore Tours
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Video Slide */}
                <SwiperSlide>
                    <div className="hero-inner">
                        {/* Video Background */}
                        <video autoPlay loop muted playsInline className="hero-video">
                            <source src="/assets/img/hero/hero-video3.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        <div className="container">
                            <div className="hero-style3">
                                <h1 className="hero-title" data-ani="slideinleft" data-ani-delay="0.2s">
                                    Travel experience with Tourm
                                </h1>
                                <p className="hero-text" data-ani="slideinleft" data-ani-delay="0.4s">
                                    Tourm is an international travel management company with 25 years of
                                    experience, specializing in business and maritime travel.
                                </p>
                                <div className="btn-group" data-ani="slideinup" data-ani-delay="0.6s">
                                    <Link to="/tour" className="th-btn style2 th-icon">Explore Tours</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>

            {/* Thumbnail Swiper */}
            <div className="hero3-wrapper">
                <div className="container">
                    <div className="row justify-content-center align-items-end flex-row-reverse">
                        <div className="col-lg-4">
                            <div className="hero3-swiper-custom">
                                <button className="swiper-button-next">
                                    <img src="/assets/img/icon/hero-arrow-right.svg" alt="Next" />
                                </button>
                                <div className="slider-pagination" />
                                <button className="swiper-button-prev">
                                    <img src="/assets/img/icon/hero-arrow-left.svg" alt="Prev" />
                                </button>
                            </div>

                            <Swiper
                                modules={[Controller]}
                                spaceBetween={10}
                                slidesPerView={1}
                                watchSlidesProgress={true}
                                controller={{ control: mainSwiper }} // Link to main swiper
                                onSwiper={setThumbsSwiper}
                                className="hero3Thumbs"
                            >
                                {[
                                    "/assets/img/hero/hero_bg_3_1.jpg",
                                    "/assets/img/hero/hero_bg_3_2.jpg",
                                    "/assets/img/hero/hero_bg_3_3.jpg",
                                    "/assets/img/hero/hero_bg_3_4.jpg",
                                    "/assets/img/hero/hero_bg_3_5.jpg",
                                ].map((thumb, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="hero-inner">
                                            <div className="hero3-card">
                                                <div className="hero-img">
                                                    <img src={thumb} alt={`Thumbnail ${index + 1}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        <div className="col-lg-8">
                            <div className="hero-booking style2">
                                <form action="mail.php" method="POST" className="booking-form style2 ajax-contact">
                                    <div className="input-wrap">
                                        <div className="row align-items-center justify-content-between">
                                            <div className="form-group col-md-6 col-xl-auto">
                                                <div className="icon">
                                                    <i className="fa-light fa-route" />
                                                </div>
                                                <div className="search-input">
                                                    <label>Destination</label>
                                                    <NiceSelect options={destinationOptions} defaultValue="Select Destination" />
                                                </div>
                                            </div>
                                            <div className="form-group col-md-6 col-xl-auto">
                                                <div className="icon">
                                                    <i className="fa-regular fa-person-hiking" />
                                                </div>
                                                <div className="search-input">
                                                    <label>Type</label>
                                                    <NiceSelect options={adventureOptions} defaultValue="Adventure" />
                                                </div>
                                            </div>
                                            <div className="form-group col-md-6 col-xl-auto">
                                                <div className="icon">
                                                    <i className="fa-light fa-clock" />
                                                </div>
                                                <div className="search-input">
                                                    <label>Duration</label>
                                                    <NiceSelect options={durationOptions} defaultValue="Duration" />
                                                </div>
                                            </div>
                                            <div className="form-btn col-md-6 col-xl-auto">
                                                <button className="th-btn" type='submit'>
                                                    <img src="/assets/img/icon/search.svg" alt="" />
                                                    Search
                                                </button>
                                            </div>
                                        </div>
                                        <p className="form-messages mb-0 mt-3" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="scroll-down">
                <Link to="/#destination-sec" onClick={handleScroll} className="scroll-wrap">
                    <span>
                        <img src="/assets/img/icon/down-arrow.svg" alt="" />
                    </span>
                    Scroll Down
                </Link>
            </div>
        </div>
    );
}

export default BannerThree;
