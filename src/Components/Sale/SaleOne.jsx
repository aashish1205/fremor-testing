import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function SaleOne() {
    return (
        <section
            className="position-relative bg-smoke overflow-hidden space"
            id="service-sec"
            style={{ backgroundImage: "url('/assets/img/cruises/cruisebanner.jpg')" }}
        >
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 offset-lg-3">
                        <div className="title-area text-center">
                            <span className="sub-title">For Sale &amp; Rent</span>
                            <h2 className="sec-title">Choose Your Perfect Yacht</h2>
                            <p className="sec-text">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="slider-area tour-slider">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        loop={true}
                        breakpoints={{
                            576: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            992: { slidesPerView: 2 },
                            1200: { slidesPerView: 3 },
                        }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        className="th-slider has-shadow slider-drag-wrap"
                    >
                        <SwiperSlide>
                            <div className="tour-box style2 th-ani gsap-cursor">
                                <div className="tour-box_img global-img">
                                    <img src="/assets/img/cruises/AQUAVITAboat1.jpg" alt="" />
                                </div>
                                <div className="tour-content">
                                    <h3 className="box-title">
                                        <Link to="/tour-details">Aquavita Boat</Link>
                                    </h3>
                                    <div className="tour-rating">
                                        <div
                                            className="star-rating"
                                            role="img"
                                            aria-label="Rated 5.00 out of 5"
                                        >
                                            <span style={{ width: "100%" }}>
                                                Rated
                                                <strong className="rating">5.00</strong> out of 5 based on{" "}
                                                <span className="rating">4.8</span>(4.8 Rating)
                                            </span>
                                        </div>
                                        <Link
                                            to="/tour-details"
                                            className="woocommerce-review-link"
                                        >
                                            (<span className="count">4.8</span>
                                            Rating)
                                        </Link>
                                    </div>
                                    <div className="tour-list">
                                        <ul>
                                            <li>
                                                Length<span>50 m</span>
                                            </li>
                                            <li>
                                                Capacity<span>08</span>
                                            </li>
                                            <li>
                                                Type<span>Catamaran</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tour-action">
                                        <h4 className="tour-box_price">
                                            <span className="currency">$980.00</span>/per day
                                        </h4>
                                        <Link to="/contact" className="th-btn style4 th-icon">
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="tour-box style2 th-ani gsap-cursor">
                                <div className="tour-box_img global-img">
                                    <img src="/assets/img/cruises/goldenodyssey.jpg" alt="" />
                                </div>
                                <div className="tour-content">
                                    <h3 className="box-title">
                                        <Link to="/tour-details">Golden Odyssey</Link>
                                    </h3>
                                    <div className="tour-rating">
                                        <div
                                            className="star-rating"
                                            role="img"
                                            aria-label="Rated 5.00 out of 5"
                                        >
                                            <span style={{ width: "100%" }}>
                                                Rated
                                                <strong className="rating">5.00</strong> out of 5 based on{" "}
                                                <span className="rating">4.8</span>(4.8 Rating)
                                            </span>
                                        </div>
                                        <Link
                                            to="/tour-details"
                                            className="woocommerce-review-link"
                                        >
                                            (<span className="count">4.8</span>
                                            Rating)
                                        </Link>
                                    </div>
                                    <div className="tour-list">
                                        <ul>
                                            <li>
                                                Length<span>50 m</span>
                                            </li>
                                            <li>
                                                Capacity<span>08</span>
                                            </li>
                                            <li>
                                                Type<span>Catamaran</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tour-action">
                                        <h4 className="tour-box_price">
                                            <span className="currency">$980.00</span>/per day
                                        </h4>
                                        <Link to="/contact" className="th-btn style4 th-icon">
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="tour-box style2 th-ani gsap-cursor">
                                <div className="tour-box_img global-img">
                                    <img src="/assets/img/cruises/LuxuryMotorYacht.jpg" alt="" />
                                </div>
                                <div className="tour-content">
                                    <h3 className="box-title">
                                        <Link to="/tour-details">Luxury Motor Yacht</Link>
                                    </h3>
                                    <div className="tour-rating">
                                        <div
                                            className="star-rating"
                                            role="img"
                                            aria-label="Rated 5.00 out of 5"
                                        >
                                            <span style={{ width: "100%" }}>
                                                Rated
                                                <strong className="rating">5.00</strong> out of 5 based on{" "}
                                                <span className="rating">4.8</span>(4.8 Rating)
                                            </span>
                                        </div>
                                        <Link
                                            to="/tour-details"
                                            className="woocommerce-review-link"
                                        >
                                            (<span className="count">4.8</span>
                                            Rating)
                                        </Link>
                                    </div>
                                    <div className="tour-list">
                                        <ul>
                                            <li>
                                                Length<span>50 m</span>
                                            </li>
                                            <li>
                                                Capacity<span>08</span>
                                            </li>
                                            <li>
                                                Type<span>Catamaran</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tour-action">
                                        <h4 className="tour-box_price">
                                            <span className="currency">$980.00</span>/per day
                                        </h4>
                                        <Link to="/contact" className="th-btn style4 th-icon">
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="tour-box style2 th-ani gsap-cursor">
                                <div className="tour-box_img global-img">
                                    <img src="/assets/img/cruises/AQUAVITAboat1.jpg" alt="" />
                                </div>
                                <div className="tour-content">
                                    <h3 className="box-title">
                                        <Link to="/tour-details">Aquavita Boat</Link>
                                    </h3>
                                    <div className="tour-rating">
                                        <div
                                            className="star-rating"
                                            role="img"
                                            aria-label="Rated 5.00 out of 5"
                                        >
                                            <span style={{ width: "100%" }}>
                                                Rated
                                                <strong className="rating">5.00</strong> out of 5 based on{" "}
                                                <span className="rating">4.8</span>(4.8 Rating)
                                            </span>
                                        </div>
                                        <Link
                                            to="/tour-details"
                                            className="woocommerce-review-link"
                                        >
                                            (<span className="count">4.8</span>
                                            Rating)
                                        </Link>
                                    </div>
                                    <div className="tour-list">
                                        <ul>
                                            <li>
                                                Length<span>50 m</span>
                                            </li>
                                            <li>
                                                Capacity<span>08</span>
                                            </li>
                                            <li>
                                                Type<span>Catamaran</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tour-action">
                                        <h4 className="tour-box_price">
                                            <span className="currency">$980.00</span>/per day
                                        </h4>
                                        <Link to="/contact" className="th-btn style4 th-icon">
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="tour-box style2 th-ani gsap-cursor">
                                <div className="tour-box_img global-img">
                                    <img src="/assets/img/cruises/goldenodyssey.jpg" alt="" />
                                </div>
                                <div className="tour-content">
                                    <h3 className="box-title">
                                        <Link to="/tour-details">Golden Odyssey</Link>
                                    </h3>
                                    <div className="tour-rating">
                                        <div
                                            className="star-rating"
                                            role="img"
                                            aria-label="Rated 5.00 out of 5"
                                        >
                                            <span style={{ width: "100%" }}>
                                                Rated
                                                <strong className="rating">5.00</strong> out of 5 based on{" "}
                                                <span className="rating">4.8</span>(4.8 Rating)
                                            </span>
                                        </div>
                                        <Link
                                            to="/tour-details"
                                            className="woocommerce-review-link"
                                        >
                                            (<span className="count">4.8</span>
                                            Rating)
                                        </Link>
                                    </div>
                                    <div className="tour-list">
                                        <ul>
                                            <li>
                                                Length<span>50 m</span>
                                            </li>
                                            <li>
                                                Capacity<span>08</span>
                                            </li>
                                            <li>
                                                Type<span>Catamaran</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tour-action">
                                        <h4 className="tour-box_price">
                                            <span className="currency">$980.00</span>/per day
                                        </h4>
                                        <Link to="/contact" className="th-btn style4 th-icon">
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="tour-box style2 th-ani gsap-cursor">
                                <div className="tour-box_img global-img">
                                    <img src="/assets/img/cruises/LuxuryMotorYacht.jpg" alt="" />
                                </div>
                                <div className="tour-content">
                                    <h3 className="box-title">
                                        <Link to="/tour-details">Luxury Motor Yacht</Link>
                                    </h3>
                                    <div className="tour-rating">
                                        <div
                                            className="star-rating"
                                            role="img"
                                            aria-label="Rated 5.00 out of 5"
                                        >
                                            <span style={{ width: "100%" }}>
                                                Rated
                                                <strong className="rating">5.00</strong> out of 5 based on{" "}
                                                <span className="rating">4.8</span>(4.8 Rating)
                                            </span>
                                        </div>
                                        <Link
                                            to="/tour-details"
                                            className="woocommerce-review-link"
                                        >
                                            (<span className="count">4.8</span>
                                            Rating)
                                        </Link>
                                    </div>
                                    <div className="tour-list">
                                        <ul>
                                            <li>
                                                Length<span>50 m</span>
                                            </li>
                                            <li>
                                                Capacity<span>08</span>
                                            </li>
                                            <li>
                                                Type<span>Catamaran</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tour-action">
                                        <h4 className="tour-box_price">
                                            <span className="currency">$980.00</span>/per day
                                        </h4>
                                        <Link to="/contact" className="th-btn style4 th-icon">
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default SaleOne;
