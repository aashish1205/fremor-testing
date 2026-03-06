import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function TourGuideThree() {
    return (
        <section
            className="bg-smoke position-relative space"
            style={{ backgroundImage: "url()" }}
        >
            <div className="container z-index-common">
                <div className="title-area text-center">
                    <span className="sub-title">Our Team</span>
                    <h2 className="sec-title">Meet with Sailor</h2>
                </div>
                <div className="slider-area teamSlider4">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={true}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            576: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            992: { slidesPerView: 2 },
                            1200: { slidesPerView: 3 },
                        }}
                        navigation={{
                            nextEl: ".slider-next",
                            prevEl: ".slider-prev",
                        }}
                        pagination={{ el: ".slider-pagination", clickable: true }}
                    >
                        {/* Single Item */}
                        <SwiperSlide>
                            <div className="th-team team-grid style2">
                                <div className="team-img">
                                    <img src="/assets/img/team/team_img_1_1.jpg" alt="Team" />
                                </div>
                                <div className="team-img2">
                                    <img src="/assets/img/team/team_2_1.jpg" alt="Team" />
                                </div>
                                <div className="team-content">
                                    <div className="media-body">
                                        <h3 className="box-title">
                                            <Link to="/tour-guide/1">Michel Smith</Link>
                                        </h3>
                                        <span className="team-desig">Tourist Guide</span>
                                        <div className="th-social">
                                            <Link target="_blank" to="https://facebook.com/">
                                                <i className="fab fa-facebook-f" />
                                            </Link>
                                            <Link target="_blank" to="https://twitter.com/">
                                                <i className="fab fa-twitter" />
                                            </Link>
                                            <Link target="_blank" to="https://linkedin.com/">
                                                <i className="fab fa-linkedin-in" />
                                            </Link>
                                            <Link target="_blank" to="https://youtube.com/">
                                                <i className="fab fa-youtube" />
                                            </Link>
                                            <Link target="_blank" to="https://instagram.com/">
                                                <i className="fab fa-instagram" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        {/* Single Item */}
                        <SwiperSlide>
                            <div className="th-team team-grid style2">
                                <div className="team-img">
                                    <img src="/assets/img/team/team_img_1_2.jpg" alt="Team" />
                                </div>
                                <div className="team-img2">
                                    <img src="/assets/img/team/team_2_2.jpg" alt="Team" />
                                </div>
                                <div className="team-content">
                                    <div className="media-body">
                                        <h3 className="box-title">
                                            <Link to="/tour-guide/2">Janny Willson</Link>
                                        </h3>
                                        <span className="team-desig">Tourist Guide</span>
                                        <div className="th-social">
                                            <Link target="_blank" to="https://facebook.com/">
                                                <i className="fab fa-facebook-f" />
                                            </Link>
                                            <Link target="_blank" to="https://twitter.com/">
                                                <i className="fab fa-twitter" />
                                            </Link>
                                            <Link target="_blank" to="https://linkedin.com/">
                                                <i className="fab fa-linkedin-in" />
                                            </Link>
                                            <Link target="_blank" to="https://youtube.com/">
                                                <i className="fab fa-youtube" />
                                            </Link>
                                            <Link target="_blank" to="https://instagram.com/">
                                                <i className="fab fa-instagram" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        {/* Single Item */}
                        <SwiperSlide>
                            <div className="th-team team-grid style2">
                                <div className="team-img">
                                    <img src="/assets/img/team/team_img_1_3.jpg" alt="Team" />
                                </div>
                                <div className="team-img2">
                                    <img src="/assets/img/team/team_2_3.jpg" alt="Team" />
                                </div>
                                <div className="team-content">
                                    <div className="media-body">
                                        <h3 className="box-title">
                                            <Link to="/tour-guide/3">Jacob Jones</Link>
                                        </h3>
                                        <span className="team-desig">Tourist Guide</span>
                                        <div className="th-social">
                                            <Link target="_blank" to="https://facebook.com/">
                                                <i className="fab fa-facebook-f" />
                                            </Link>
                                            <Link target="_blank" to="https://twitter.com/">
                                                <i className="fab fa-twitter" />
                                            </Link>
                                            <Link target="_blank" to="https://linkedin.com/">
                                                <i className="fab fa-linkedin-in" />
                                            </Link>
                                            <Link target="_blank" to="https://youtube.com/">
                                                <i className="fab fa-youtube" />
                                            </Link>
                                            <Link target="_blank" to="https://instagram.com/">
                                                <i className="fab fa-instagram" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        {/* Single Item */}
                        <SwiperSlide>
                            <div className="th-team team-grid style2">
                                <div className="team-img">
                                    <img src="/assets/img/team/team_img_1_1.jpg" alt="Team" />
                                </div>
                                <div className="team-img2">
                                    <img src="/assets/img/team/team_2_1.jpg" alt="Team" />
                                </div>
                                <div className="team-content">
                                    <div className="media-body">
                                        <h3 className="box-title">
                                            <Link to="/tour-guide/1">Michel Smith</Link>
                                        </h3>
                                        <span className="team-desig">Tourist Guide</span>
                                        <div className="th-social">
                                            <Link target="_blank" to="https://facebook.com/">
                                                <i className="fab fa-facebook-f" />
                                            </Link>
                                            <Link target="_blank" to="https://twitter.com/">
                                                <i className="fab fa-twitter" />
                                            </Link>
                                            <Link target="_blank" to="https://linkedin.com/">
                                                <i className="fab fa-linkedin-in" />
                                            </Link>
                                            <Link target="_blank" to="https://youtube.com/">
                                                <i className="fab fa-youtube" />
                                            </Link>
                                            <Link target="_blank" to="https://instagram.com/">
                                                <i className="fab fa-instagram" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        {/* Single Item */}
                        <SwiperSlide>
                            <div className="th-team team-grid style2">
                                <div className="team-img">
                                    <img src="/assets/img/team/team_img_1_2.jpg" alt="Team" />
                                </div>
                                <div className="team-img2">
                                    <img src="/assets/img/team/team_2_2.jpg" alt="Team" />
                                </div>
                                <div className="team-content">
                                    <div className="media-body">
                                        <h3 className="box-title">
                                            <Link to="/tour-guide/2">Janny Willson</Link>
                                        </h3>
                                        <span className="team-desig">Tourist Guide</span>
                                        <div className="th-social">
                                            <Link target="_blank" to="https://facebook.com/">
                                                <i className="fab fa-facebook-f" />
                                            </Link>
                                            <Link target="_blank" to="https://twitter.com/">
                                                <i className="fab fa-twitter" />
                                            </Link>
                                            <Link target="_blank" to="https://linkedin.com/">
                                                <i className="fab fa-linkedin-in" />
                                            </Link>
                                            <Link target="_blank" to="https://youtube.com/">
                                                <i className="fab fa-youtube" />
                                            </Link>
                                            <Link target="_blank" to="https://instagram.com/">
                                                <i className="fab fa-instagram" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        {/* Single Item */}
                        <SwiperSlide>
                            <div className="th-team team-grid style2">
                                <div className="team-img">
                                    <img src="/assets/img/team/team_img_1_3.jpg" alt="Team" />
                                </div>
                                <div className="team-img2">
                                    <img src="/assets/img/team/team_2_3.jpg" alt="Team" />
                                </div>
                                <div className="team-content">
                                    <div className="media-body">
                                        <h3 className="box-title">
                                            <Link to="/tour-guide/3">Jacob Jones</Link>
                                        </h3>
                                        <span className="team-desig">Tourist Guide</span>
                                        <div className="th-social">
                                            <Link target="_blank" to="https://facebook.com/">
                                                <i className="fab fa-facebook-f" />
                                            </Link>
                                            <Link target="_blank" to="https://twitter.com/">
                                                <i className="fab fa-twitter" />
                                            </Link>
                                            <Link target="_blank" to="https://linkedin.com/">
                                                <i className="fab fa-linkedin-in" />
                                            </Link>
                                            <Link target="_blank" to="https://youtube.com/">
                                                <i className="fab fa-youtube" />
                                            </Link>
                                            <Link target="_blank" to="https://instagram.com/">
                                                <i className="fab fa-instagram" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        {/* Single Item */}
                        <SwiperSlide>
                            <div className="th-team team-grid style2">
                                <div className="team-img">
                                    <img src="/assets/img/team/team_img_1_1.jpg" alt="Team" />
                                </div>
                                <div className="team-img2">
                                    <img src="/assets/img/team/team_2_1.jpg" alt="Team" />
                                </div>
                                <div className="team-content">
                                    <div className="media-body">
                                        <h3 className="box-title">
                                            <Link to="/tour-guide/1">Michel Smith</Link>
                                        </h3>
                                        <span className="team-desig">Tourist Guide</span>
                                        <div className="th-social">
                                            <Link target="_blank" to="https://facebook.com/">
                                                <i className="fab fa-facebook-f" />
                                            </Link>
                                            <Link target="_blank" to="https://twitter.com/">
                                                <i className="fab fa-twitter" />
                                            </Link>
                                            <Link target="_blank" to="https://linkedin.com/">
                                                <i className="fab fa-linkedin-in" />
                                            </Link>
                                            <Link target="_blank" to="https://youtube.com/">
                                                <i className="fab fa-youtube" />
                                            </Link>
                                            <Link target="_blank" to="https://instagram.com/">
                                                <i className="fab fa-instagram" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        {/* Single Item */}
                        <SwiperSlide>
                            <div className="th-team team-grid style2">
                                <div className="team-img">
                                    <img src="/assets/img/team/team_img_1_2.jpg" alt="Team" />
                                </div>
                                <div className="team-img2">
                                    <img src="/assets/img/team/team_2_2.jpg" alt="Team" />
                                </div>
                                <div className="team-content">
                                    <div className="media-body">
                                        <h3 className="box-title">
                                            <Link to="/tour-guide/2">Janny Willson</Link>
                                        </h3>
                                        <span className="team-desig">Tourist Guide</span>
                                        <div className="th-social">
                                            <Link target="_blank" to="https://facebook.com/">
                                                <i className="fab fa-facebook-f" />
                                            </Link>
                                            <Link target="_blank" to="https://twitter.com/">
                                                <i className="fab fa-twitter" />
                                            </Link>
                                            <Link target="_blank" to="https://linkedin.com/">
                                                <i className="fab fa-linkedin-in" />
                                            </Link>
                                            <Link target="_blank" to="https://youtube.com/">
                                                <i className="fab fa-youtube" />
                                            </Link>
                                            <Link target="_blank" to="https://instagram.com/">
                                                <i className="fab fa-instagram" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                    <div className="slider-pagination" />
                    <button className="slider-arrow slider-prev">
                        <img src="/assets/img/icon/right-arrow2.svg" alt="Prev" />
                    </button>
                    <button className="slider-arrow slider-next">
                        <img src="/assets/img/icon/left-arrow2.svg" alt="Next" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default TourGuideThree;