import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

function BlogFour() {
    return (
        <section className="bg-smoke overflow-hidden space" id="blog-sec">
            <div className="container shape-mockup-wrap">
                <div className="mb-30 text-center text-md-start">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-md-7">
                            <div className="title-area mb-md-0">
                                <span className="sub-title">News And Blog</span>
                                <h2 className="sec-title">Tourm's Latest News and Insights</h2>
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <Link to="/blog" className="th-btn style4 th-icon">
                                See More Articles
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Swiper Slider */}
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1200: { slidesPerView: 3 },
                    }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    className="th-slider has-shadow"
                >
                    <SwiperSlide>
                        <div className="blog-box style2 th-ani">
                            <div className="blog-img global-img">
                                <img src="/assets/img/blog/blog_4_1.jpg" alt="blog" />
                            </div>
                            <div className="blog-box_content">
                                <div className="blog-meta">
                                    <Link className="author" to="/blog">
                                        Sep 05 2024
                                    </Link>
                                    <Link to="/blog">6 min read</Link>
                                </div>
                                <h3 className="box-title">
                                    <Link to="/blog/1">
                                        Experiencing Paradise in The Maldives
                                    </Link>
                                </h3>
                                <Link to="/blog/1" className="th-btn style4 th-icon">
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="blog-box style2 th-ani">
                            <div className="blog-img global-img">
                                <img src="/assets/img/blog/blog_4_2.jpg" alt="blog" />
                            </div>
                            <div className="blog-box_content">
                                <div className="blog-meta">
                                    <Link className="author" to="/blog">
                                        Sep 06 2024
                                    </Link>
                                    <Link to="/blog">7 min read</Link>
                                </div>
                                <h3 className="box-title">
                                    <Link to="/blog/1">
                                        Discovering Paradise in The Indonesia Bali
                                    </Link>
                                </h3>
                                <Link to="/blog/1" className="th-btn style4 th-icon">
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="blog-box style2 th-ani">
                            <div className="blog-img global-img">
                                <img src="/assets/img/blog/blog_4_3.jpg" alt="blog" />
                            </div>
                            <div className="blog-box_content">
                                <div className="blog-meta">
                                    <Link className="author" to="/blog">
                                        Sep 07 2024
                                    </Link>
                                    <Link to="/blog">8 min read</Link>
                                </div>
                                <h3 className="box-title">
                                    <Link to="/blog/1">
                                        Journey to Paradise in The Wang Beach in London
                                    </Link>
                                </h3>
                                <Link to="/blog/1" className="th-btn style4 th-icon">
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="blog-box style2 th-ani">
                            <div className="blog-img global-img">
                                <img src="/assets/img/blog/blog_4_1.jpg" alt="blog" />
                            </div>
                            <div className="blog-box_content">
                                <div className="blog-meta">
                                    <Link className="author" to="/blog">
                                        Sep 09 2024
                                    </Link>
                                    <Link to="/blog">9 min read</Link>
                                </div>
                                <h3 className="box-title">
                                    <Link to="/blog/1">
                                    Experiencing Paradise in The Maldives
                                    </Link>
                                </h3>
                                <Link to="/blog/1" className="th-btn style4 th-icon">
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="blog-box style2 th-ani">
                            <div className="blog-img global-img">
                                <img src="/assets/img/blog/blog_4_2.jpg" alt="blog" />
                            </div>
                            <div className="blog-box_content">
                                <div className="blog-meta">
                                    <Link className="author" to="/blog">
                                        Sep 10 2024
                                    </Link>
                                    <Link to="/blog">10 min read</Link>
                                </div>
                                <h3 className="box-title">
                                    <Link to="/blog/1">
                                    Discovering Paradise in The Indonesia Bali
                                    </Link>
                                </h3>
                                <Link to="/blog/1" className="th-btn style4 th-icon">
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="blog-box style2 th-ani">
                            <div className="blog-img global-img">
                                <img src="/assets/img/blog/blog_4_3.jpg" alt="blog" />
                            </div>
                            <div className="blog-box_content">
                                <div className="blog-meta">
                                    <Link className="author" to="/blog">
                                        Sep 12 2024
                                    </Link>
                                    <Link to="/blog">11 min read</Link>
                                </div>
                                <h3 className="box-title">
                                    <Link to="/blog/1">
                                        Journey to Paradise in The Wang Beach in London
                                    </Link>
                                </h3>
                                <Link to="/blog/1" className="th-btn style4 th-icon">
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
                <div
                    className="shape-mockup spin d-none d-xxl-block"
                    style={{ top: '0%', left: '-18%' }}
                >
                    <img src="/assets/img/shape/shape_13.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape2 d-none d-xl-block"
                    style={{ bottom: '5%', left: '-12%' }}
                >
                    <img src="/assets/img/shape/shape_2.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape3 d-none d-xxl-block"
                    style={{ bottom: '12%', left: '-17%' }}
                >
                    <img src="/assets/img/shape/shape_3.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup movingX d-none d-xxl-block"
                    style={{ top: '15%', right: '-15%' }}
                >
                    <img src="/assets/img/shape/shape_14.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup d-none d-xxl-block"
                    style={{ bottom: '-12%', right: '-21%' }}
                >
                    <img src="/assets/img/shape/shape_15.png" alt="shape" />
                </div>

            </div>
        </section>
    );
}

export default BlogFour;
