import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

function CategoryTwo() {
    const swiperRef = useRef(null);
    const categories = [
        { id: 1, title: "Cruises", img: "/assets/img/category/category_1_1.jpg" },
        { id: 2, title: "Hiking", img: "/assets/img/category/category_1_2.jpg" },
        { id: 3, title: "Airbirds", img: "/assets/img/category/category_1_3.jpg" },
        { id: 4, title: "Wildlife", img: "/assets/img/category/category_1_4.jpg" },
        { id: 5, title: "Walking", img: "/assets/img/category/category_1_5.jpg" },
        { id: 6, title: "Cruises", img: "/assets/img/category/category_1_1.jpg" },
        { id: 7, title: "Hiking", img: "/assets/img/category/category_1_2.jpg" },
        { id: 8, title: "Airbirds", img: "/assets/img/category/category_1_3.jpg" },
        { id: 9, title: "Wildlife", img: "/assets/img/category/category_1_4.jpg" },
        { id: 10, title: "Walking", img: "/assets/img/category/category_1_5.jpg" },
    ];

    useEffect(() => {
        if (!swiperRef.current) return;

        const swiperInstance = swiperRef.current.swiper;

        // ✅ Start autoplay properly
        if (swiperInstance && swiperInstance.autoplay) {
            swiperInstance.autoplay.start();
        }

        // ✅ Custom pagination with numbers
        if (swiperInstance.pagination) {
            swiperInstance.pagination.renderBullet = function (index, className) {
                let formattedNumber = index + 1 < 10 ? "0" + (index + 1) : index + 1;
                return `<span class="${className} number">${formattedNumber}</span>`;
            };
            swiperInstance.pagination.init();
            swiperInstance.pagination.update();
        }
        const multiplier = { translate: 0.1, rotate: 0.0 };

        const calculateWheel = () => {
            const slides = document.querySelectorAll(".single2");
            slides.forEach((slide) => {
                const rect = slide.getBoundingClientRect();
                const r = window.innerWidth * 0.5 - (rect.x + rect.width * 0.5);
                let ty = Math.abs(r) * multiplier.translate - rect.width * multiplier.translate;
                if (ty < 0) ty = 0;

                const transformOrigin = r < 0 ? "left top" : "right top";
                slide.style.transform = `translate(0, ${ty}px) rotate(${-r * multiplier.rotate}deg)`;
                slide.style.transformOrigin = transformOrigin;
            });
        };

        const raf = () => {
            requestAnimationFrame(raf);
            calculateWheel();
        };

        raf();

        return () => cancelAnimationFrame(raf); // Cleanup on unmount
    }, []);

    return (
        <section className="category-area2 bg-top-center">
            <div className="container th-container">
                <div className="title-area text-center">
                    <span className="sub-title">Wonderful Place For You</span>
                    <h2 className="sec-title">Tour Categories</h2>
                </div>

                <Swiper
                    ref={swiperRef}
                    modules={[Pagination]}
                    spaceBetween={60}
                    slidesPerView={5}
                    centeredSlides={true}
                    loop={true}
                    grabCursor={true}
                    pagination={{ clickable: true, el: ".swiper-pagination", type: "bullets" }}
                    breakpoints={{
                        300: { slidesPerView: 1, spaceBetween: 30 },
                        600: { slidesPerView: 2, spaceBetween: 30 },
                        768: { slidesPerView: 3, spaceBetween: 30 },
                        1024: { slidesPerView: 4, spaceBetween: 40 },
                        1280: { slidesPerView: 5, spaceBetween: 60 },
                    }}
                >
                    {categories.map((category) => (
                        <SwiperSlide key={category.id}>
                            <div className="category-card single2">
                                <div className="box-img global-img">
                                    <img src={category.img} alt={category.title} />
                                </div>
                                <h3 className="box-title">
                                    <Link to="/destination">{category.title}</Link>
                                </h3>
                                <Link className="line-btn" to="/destination">
                                    See more
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                <div className="swiper-pagination position-relative"></div>
                </Swiper>
            </div>
        </section>
    );
}

export default CategoryTwo;
