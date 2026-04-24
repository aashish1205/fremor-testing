import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { fetchBlogs, getBlogImageSrc } from "../../services/blogService";

function BlogFour() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const data = await fetchBlogs();
            // Get first 5 blogs
            setBlogs(data.slice(0, 5));
        } catch (error) {
            console.error("Failed to load blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <section className="bg-smoke overflow-hidden space" id="blog-sec">
            <div className="container shape-mockup-wrap">
                <div className="mb-30 text-center text-md-start">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-md-7">
                            <div className="title-area mb-md-0">
                                <span className="sub-title">News And Blog</span>
                                <h2 className="sec-title">Fremor's Latest News and Insights</h2>
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
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : (
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
                        {blogs.map((blog) => (
                            <SwiperSlide key={blog.id}>
                                <div className="blog-box style2 th-ani">
                                    <div className="blog-img global-img">
                                        <img src={getBlogImageSrc(blog.main_image)} alt={blog.title} style={{ height: '250px', objectFit: 'cover', width: '100%' }} />
                                    </div>
                                    <div className="blog-box_content">
                                        <div className="blog-meta">
                                            <Link className="author" to={`/blog/${blog.id}`}>
                                                {formatDate(blog.created_at)}
                                            </Link>
                                            <Link to={`/blog/${blog.id}`}>6 min read</Link>
                                        </div>
                                        <h3 className="box-title">
                                            <Link to={`/blog/${blog.id}`}>
                                                {blog.title}
                                            </Link>
                                        </h3>
                                        <Link to={`/blog/${blog.id}`} className="th-btn style4 th-icon">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

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
