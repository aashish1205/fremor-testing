import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

function DestinationThree() {
    const destinations = [
        { id: 1, name: "Dubai, UAE", image: "/assets/img/destination/destination_3_1.jpg" },
        { id: 2, name: "Japan", image: "/assets/img/destination/destination_3_2.jpg" },
        { id: 3, name: "Switzerland", image: "/assets/img/destination/destination_3_3.jpg" },
        { id: 4, name: "Brazil", image: "/assets/img/destination/destination_3_4.jpg" },
        { id: 5, name: "Dubai, UAE", image: "/assets/img/destination/destination_3_1.jpg" },
        { id: 6, name: "Japan", image: "/assets/img/destination/destination_3_2.jpg" },
        { id: 7, name: "Switzerland", image: "/assets/img/destination/destination_3_3.jpg" },
        { id: 8, name: "Brazil", image: "/assets/img/destination/destination_3_4.jpg" },
    ];

    return (
        <section
            className="position-relative overflow-hidden space"
            id="destination-sec"
            style={{ backgroundImage: "url(/assets/img/bg/line-pattern3.png)" }}
        >
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col-lg-6">
                        <div className="title-area">
                            <span className="sub-title">Top Destination</span>
                            <h2 className="sec-title">Popular Destination</h2>
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <h2 className="destination-title">
                            <span className="counter-number">850</span>+&nbsp;Destinations
                        </h2>
                        <p className="sec-text mb-30">
                            One of the most well-liked travel companies for people looking to
                            experience adventure and see the world is Tourm.
                        </p>
                    </div>
                </div>

                {/* Swiper Slider */}
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        576: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        992: { slidesPerView: 2 },
                        1200: { slidesPerView: 3 },
                        1300: { slidesPerView: 4 },
                    }}
                    autoplay={{ delay: 3000 }}
                    className="th-slider has-shadow"
                >
                    {destinations.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="destination-item th-ani">
                                <div className="destination-item_img global-img">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="destination-content">
                                    <h3 className="box-title">
                                        <Link to="/destination/1">{item.name}</Link>
                                    </h3>
                                    <p className="destination-text">25 Listing</p>
                                    <Link to="/contact" className="th-btn style4 th-icon">
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="destination-btn text-center mt-60">
                    <Link to="/destination" className="th-btn style3 th-icon">
                        View All
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default DestinationThree;
