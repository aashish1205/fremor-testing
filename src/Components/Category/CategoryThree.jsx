import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

function CategoryThree() {
    const categories = [
        { id: 1, name: "Cruises", image: "/assets/img/category/category_1_1.jpg" },
        { id: 2, name: "Hiking", image: "/assets/img/category/category_1_2.jpg" },
        { id: 3, name: "Airbirds", image: "/assets/img/category/category_1_3.jpg" },
        { id: 4, name: "Wildlife", image: "/assets/img/category/category_1_4.jpg" },
        { id: 5, name: "Walking", image: "/assets/img/category/category_1_5.jpg" },
        { id: 6, name: "Cruises", image: "/assets/img/category/category_1_1.jpg" },
        { id: 7, name: "Hiking", image: "/assets/img/category/category_1_2.jpg" },
        { id: 8, name: "Airbirds", image: "/assets/img/category/category_1_3.jpg" },
        { id: 9, name: "Wildlife", image: "/assets/img/category/category_1_4.jpg" },
        { id: 10, name: "Walking", image: "/assets/img/category/category_1_5.jpg" },
    ];

    return (
        <section
            className="category-area3 bg-smoke space"
            style={{ backgroundImage: "url(/assets/img/bg/line-pattern3.png)" }}
        >
            <div className="container th-container">
                <div className="title-area text-center">
                    <span className="sub-title">Wonderful Place For You</span>
                    <h2 className="sec-title">Tour Categories</h2>
                </div>
                <div className="slider-area">
                    <Swiper
                        modules={[ Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            576: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            992: { slidesPerView: 3 },
                            1200: { slidesPerView: 3 },
                            1400: { slidesPerView: 5 },
                        }}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000 }}
                        className="th-slider has-shadow category-slider3"
                    >
                        {categories.map((category) => (
                            <SwiperSlide key={category.id}>
                                <div className="category-card single2">
                                    <div className="box-img global-img">
                                        <img src={category.image} alt={category.name} />
                                    </div>
                                    <h3 className="box-title">
                                        <Link to="/destination">{category.name}</Link>
                                    </h3>
                                    <Link className="line-btn" to="/destination">
                                        See more
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default CategoryThree;
