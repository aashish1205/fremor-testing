import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

function BlogPost(props) {
    const { blogID, blogImage, blogTitle } = props;
    return (
        <>
            {/* Single Blog Post */}
            <div className="th-blog blog-single has-post-thumbnail">
                <div className="blog-img">
                    <Link to={`/blog/${blogID}`}>
                        <img src={`/assets/img/blog/${blogImage}`} alt="Blog" />
                    </Link>
                </div>
                <div className="blog-content">
                    <div className="blog-meta">
                        <Link className="author" to="/blog">
                            <i className="fa-light fa-user" />
                            by David Smith
                        </Link>
                        <Link to="/blog">
                            <i className="fa-solid fa-calendar-days" />
                            05 May, 2025
                        </Link>
                        <Link to={`/blog/${blogID}`}>
                            <img src="/assets/img/icon/map.svg" alt="" />
                            Tour Guide
                        </Link>
                    </div>
                    <h2 className="blog-title">
                        <Link to={`/blog/${blogID}`}>
                            {blogTitle ? blogTitle : 'Living sustainability: A day in the life at Realar Residence'}
                        </Link>
                    </h2>
                    <p className="blog-text">
                        Uniquely pursue emerging experiences before liemerging content.
                        Efficiently underwhelm customer directed total linkage after B2C
                        synergy. Dynamically simplify superior human capital whereas
                        efficient infrastructures generate business web-readiness after
                        wireless outsourcing.
                    </p>
                </div>
            </div>

            {/* Blog Post with Swiper Slider */}
            <div className="th-blog blog-single has-post-thumbnail">
                <div className="blog-img th-slider">
                    <Swiper
                        modules={[Navigation, EffectFade]}
                        navigation={{ prevEl: ".slider-prev", nextEl: ".slider-next" }}
                        effect="fade"
                        loop={true}
                    >
                        <SwiperSlide>
                            <Link to={`/blog/${blogID}`}>
                                <img src="/assets/img/blog/blog-s-1-2.jpg" alt="Blog" />
                            </Link>
                        </SwiperSlide>
                        <SwiperSlide>
                            <Link to={`/blog/${blogID}`}>
                                <img src="/assets/img/blog/blog-s-1-4.jpg" alt="Blog" />
                            </Link>
                        </SwiperSlide>
                    </Swiper>
                    <button className="slider-arrow slider-prev">
                        <i className="far fa-arrow-left" />
                    </button>
                    <button className="slider-arrow slider-next">
                        <i className="far fa-arrow-right" />
                    </button>
                </div>
                <div className="blog-content">
                    <div className="blog-meta">
                        <Link className="author" to="/blog">
                            <i className="fa-light fa-user" />
                            by David Smith
                        </Link>
                        <Link to="/blog">
                            <i className="fa-solid fa-calendar-days" />
                            05 May, 2025
                        </Link>
                        <Link to={`/blog/${blogID}`}>
                            <img src="/assets/img/icon/map.svg" alt="" />
                            Tour Guide
                        </Link>
                    </div>
                    <h2 className="blog-title">
                        <Link to={`/blog/${blogID}`}>
                            Exploring The Green Spaces Of Realar Residence
                        </Link>
                    </h2>
                    <p className="blog-text">
                        Uniquely pursue emerging experiences before liemerging content.
                        Efficiently underwhelm customer directed total linkage after B2C
                        synergy. Dynamically simplify superior human capital whereas
                        efficient infrastructures generate business web-readiness after
                        wireless outsourcing.
                    </p>
                </div>
            </div>

            {/* Blog Post Without Image */}
            <div className="th-blog blog-single has-post-thumbnail">
                <div className="blog-content">
                    <div className="blog-meta">
                        <Link className="author" to="/blog">
                            <i className="fa-light fa-user" />
                            by David Smith
                        </Link>
                        <Link to="/blog">
                            <i className="fa-solid fa-calendar-days" />
                            05 May, 2025
                        </Link>
                        <Link to={`/blog/${blogID}`}>
                            <img src="/assets/img/icon/map.svg" alt="" />
                            Tour Guide
                        </Link>
                    </div>
                    <h2 className="blog-title">
                        <Link to={`/blog/${blogID}`}>
                            Enrich Your Mind Envision Your Future Education for Success
                        </Link>
                    </h2>
                    <p className="blog-text">
                        Uniquely pursue emerging experiences before liemerging content.
                        Efficiently underwhelm customer directed total linkage after B2C
                        synergy. Dynamically simplify superior human capital whereas
                        efficient infrastructures generate business web-readiness after
                        wireless outsourcing.
                    </p>
                </div>
            </div>

            {/* Blog Post with Video */}
            <div className="th-blog blog-single has-post-thumbnail">
                <div className="blog-img" data-overlay="bg-title" data-opacity={5}>
                    <Link to={`/blog/${blogID}`}>
                        <img src="/assets/img/blog/blog-s-1-2.jpg" alt="Blog" />
                    </Link>
                    <Link to="https://www.youtube.com/watch?v=cQfIUPw72Dk" className="play-btn popup-video">
                        <i className="fas fa-play" />
                    </Link>
                </div>
                <div className="blog-content">
                    <div className="blog-meta">
                        <Link className="author" to="/blog">
                            <i className="fa-light fa-user" />
                            by David Smith
                        </Link>
                        <Link to="/blog">
                            <i className="fa-solid fa-calendar-days" />
                            05 May, 2025
                        </Link>
                        <Link to={`/blog/${blogID}`}>
                            <img src="/assets/img/icon/map.svg" alt="" />
                            Tour Guide
                        </Link>
                    </div>
                    <h2 className="blog-title">
                        <Link to={`/blog/${blogID}`}>
                            University class starting soon while the lovely valley team works
                        </Link>
                    </h2>
                    <p className="blog-text">
                        Uniquely pursue emerging experiences before liemerging content.
                        Efficiently underwhelm customer directed total linkage after B2C
                        synergy. Dynamically simplify superior human capital whereas
                        efficient infrastructures generate business web-readiness after
                        wireless outsourcing.
                    </p>
                </div>
            </div>
        </>
    )
}

export default BlogPost
