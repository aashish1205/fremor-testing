import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { fetchCruises, getCruiseImageSrc } from "../../services/cruiseService";

function CruiseCard() {
    const [cruises, setCruises] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCruises();
    }, []);

    const loadCruises = async () => {
        try {
            setLoading(true);
            const data = await fetchCruises();
            setCruises(data || []);
        } catch (error) {
            console.error("Error fetching cruises:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderCruiseItem = (cruise) => (
        <div className="tour-box style2 th-ani gsap-cursor h-100">
            <div className="tour-box_img global-img">
                <Link to={`/cruise-details/${cruise.id}`}>
                    <img 
                        src={getCruiseImageSrc(cruise.main_image)} 
                        alt={cruise.title} 
                        style={{ width: "100%", height: "250px", objectFit: "cover" }}
                    />
                </Link>
            </div>
            <div className="tour-content d-flex flex-column" style={{flex: 1}}>
                <h3 className="box-title">
                    <Link to={`/cruise-details/${cruise.id}`}>{cruise.title}</Link>
                </h3>
                <div className="tour-rating">
                    <div
                        className="star-rating"
                        role="img"
                        aria-label={`Rated ${cruise.rating || '5.00'} out of 5`}
                    >
                        <span style={{ width: `${(cruise.rating / 5) * 100 || 100}%` }}>
                            Rated
                            <strong className="rating">{cruise.rating ? parseFloat(cruise.rating).toFixed(2) : '5.00'}</strong> out of 5 based on{" "}
                            <span className="rating">{cruise.rating ? parseFloat(cruise.rating).toFixed(1) : '5.0'}</span>({cruise.rating ? parseFloat(cruise.rating).toFixed(1) : '5.0'} Rating)
                        </span>
                    </div>
                    <Link
                        to={`/cruise-details/${cruise.id}`}
                        className="woocommerce-review-link"
                    >
                        (<span className="count">{cruise.rating ? parseFloat(cruise.rating).toFixed(1) : '5.0'}</span>
                        Rating)
                    </Link>
                </div>
                <div className="tour-list mb-auto">
                    <ul>
                        <li>
                            Length<span>{cruise.length || 'N/A'}</span>
                        </li>
                        <li>
                            Capacity<span>{cruise.capacity || 'N/A'}</span>
                        </li>
                        <li>
                            Type<span>{cruise.type || 'N/A'}</span>
                        </li>
                    </ul>
                </div>
                <div className="tour-action mt-3">
                    <h4 className="tour-box_price">
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#687176', display: 'block' }}>Starting from</span>
                        <span className="currency">₹{cruise.price_per_day || '0.00'}</span>
                    </h4>
                    <Link to={`/cruise-details/${cruise.id}`} className="th-btn style4 th-icon">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );

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
                                Explore our extensive range of high-quality yachts, perfect for your next marine adventure.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="slider-area tour-slider">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : cruises.length === 0 ? (
                        <div className="text-center py-5">
                            <h4 className="text-muted">No cruises available at the moment.</h4>
                        </div>
                    ) : cruises.length <= 2 ? (
                        <div className="row justify-content-center">
                            {cruises.map((cruise) => (
                                <div className="col-md-6 col-lg-4 mb-4" key={cruise.id}>
                                    {renderCruiseItem(cruise)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={24}
                            slidesPerView={1}
                            loop={cruises.length > 3}
                            breakpoints={{
                                576: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                992: { slidesPerView: 2 },
                                1200: { slidesPerView: 3 },
                            }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            className="th-slider has-shadow slider-drag-wrap"
                        >
                            {cruises.map((cruise) => (
                                <SwiperSlide key={cruise.id}>
                                    {renderCruiseItem(cruise)}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
        </section>
    );
}

export default CruiseCard;
