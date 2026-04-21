import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchBlogById, getBlogImageSrc } from '../../services/blogService';

function BlogDetailsMain() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBlog = async () => {
            try {
                const data = await fetchBlogById(id);
                setBlog(data);
            } catch (error) {
                console.error("Error loading blog details:", error);
            } finally {
                setLoading(false);
            }
        };
        loadBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center space-top space-extra-bottom" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted">Loading article details...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="text-center space-top space-extra-bottom" style={{ minHeight: '60vh' }}>
                <h2 className="mb-3 text-danger">Article Not Found</h2>
                <p>We could not find the magazine article you were looking for.</p>
                <Link to="/blog" className="th-btn mt-3">Back to Magazine</Link>
            </div>
        );
    }

    // Safely parse JSON strings if they are stored as strings instead of jsonb arrays
    const parseArraySafe = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
            try { return JSON.parse(data); } catch (e) { return []; }
        }
        return [];
    };

    const places = parseArraySafe(blog.places_to_visit);
    const activities = parseArraySafe(blog.activities);
    const gallery = parseArraySafe(blog.image_gallery);

    const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    return (
        <section className="th-blog-wrapper blog-details space-top space-extra-bottom">
            <div className="container shape-mockup-wrap">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="th-blog blog-single">
                            <div className="blog-img">
                                <img src={getBlogImageSrc(blog.main_image)} alt={blog.title} className="w-100 object-fit-cover rounded" style={{ maxHeight: '550px' }} />
                            </div>
                            <div className="blog-content pt-4">
                                <div className="blog-meta">
                                    <span className="author">
                                        <i className="fa-light fa-user" />
                                        by {blog.author || 'David Smith'}
                                    </span>
                                    <span>
                                        <i className="fa-regular fa-calendar" />
                                        {formattedDate}
                                    </span>
                                    <span>
                                        <i className="fa-solid fa-layer-group" />
                                        {blog.category || 'Magazine'}
                                    </span>
                                </div>
                                
                                <h2 className="blog-title">{blog.title}</h2>
                                
                                {/* Main Content */}
                                <div className="blog-text mt-4 text-justify" style={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: '1.8' }}>
                                    {blog.content}
                                </div>

                                {/* Places to Visit Section */}
                                {places && places.length > 0 && (
                                    <div className="mt-5">
                                        <h4 className="h4 mb-4 text-theme"><i className="fa-solid fa-map-location-dot me-2"></i> Must-Visit Places</h4>
                                        <div className="row gy-4">
                                            {places.map((place, index) => (
                                                <div className="col-md-6" key={index}>
                                                    <div className="p-4 bg-light rounded shadow-sm border-start border-theme border-4 h-100 flex-column d-flex">
                                                        <h5 className="h6 mb-2 fw-bold">{place.title}</h5>
                                                        <p className="mb-0 text-muted">{place.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Activities to Perform Section */}
                                {activities && activities.length > 0 && (
                                    <div className="mt-5">
                                        <h4 className="h4 mb-4 text-theme"><i className="fa-solid fa-person-hiking me-2"></i> Exciting Activities</h4>
                                        <ul className="list-group list-group-flush shadow-sm rounded">
                                            {activities.map((activity, index) => (
                                                <li className="list-group-item bg-light p-4 border-bottom" key={index}>
                                                    <div className="d-flex flex-column flex-sm-row align-items-start gap-3">
                                                        <div className="flex-shrink-0 text-theme mt-1">
                                                            <i className="fa-solid fa-check-circle" style={{fontSize: '24px'}}></i>
                                                        </div>
                                                        <div>
                                                            <h5 className="h6 mb-1 fw-bold">{activity.title}</h5>
                                                            <p className="mb-0 text-muted">{activity.description}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Image Gallery Section */}
                                {gallery && gallery.length > 0 && (
                                    <div className="mt-5">
                                        <h4 className="h4 mb-4 text-theme"><i className="fa-solid fa-images me-2"></i> Gallery</h4>
                                        <div className="row gy-4">
                                            {gallery.map((img, index) => (
                                                <div className="col-12 col-sm-6" key={index}>
                                                    <img src={getBlogImageSrc(img)} alt={`Gallery item ${index+1}`} className="w-100 rounded object-fit-cover shadow-sm" style={{ height: '300px' }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Share Tools */}
                                <div className="share-links clearfix mt-5 border-top pt-4">
                                    <div className="row justify-content-between">
                                        <div className="col-md-auto text-xl-end">
                                            <div className="share-links_wrapp">
                                                <span className="share-links-title">Share Article:</span>
                                                <div className="social-links">
                                                    <Link to="https://www.facebook.com/"><i className="fab fa-facebook-f" /></Link>
                                                    <Link to="https://www.twitter.com/"><i className="fab fa-twitter" /></Link>
                                                    <Link to="https://www.linkedin.com/"><i className="fab fa-linkedin-in" /></Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sidebar Area */}
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            <div className="widget widget_search">
                                <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                                    <input type="text" placeholder="Search" required />
                                    <button type="submit">
                                        <i className="far fa-search" />
                                    </button>
                                </form>
                            </div>
                            <div className="widget widget_categories">
                                <h3 className="widget_title">Categories</h3>
                                <ul>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> City Tour</Link></li>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> Beach Tours</Link></li>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> Wildlife Tours</Link></li>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> Adventure Tours</Link></li>
                                </ul>
                            </div>
                            <div className="widget widget_tag_cloud">
                                <h3 className="widget_title">Popular Tags</h3>
                                <div className="tagcloud">
                                    <Link to="/blog">Tour</Link>
                                    <Link to="/blog">Adventure</Link>
                                    <Link to="/blog">Luxury</Link>
                                    <Link to="/blog">Travel</Link>
                                </div>
                            </div>
                            <div className="widget widget_offer" style={{ background: "url(/assets/img/bg/widget_bg_1.jpg)" }}>
                                <div className="offer-banner">
                                    <div className="offer">
                                        <h6 className="box-title">Need Help? We Are Here To Help You</h6>
                                        <div className="banner-logo">
                                            <img src="/assets/img/logo/FremorLogo.png" alt="Fremor" />
                                        </div>
                                        <div className="offer">
                                            <h6 className="offer-title">You Get Online support</h6>
                                            <Link className="offter-num" to="tel:+256214203215">+256 214 203 215</Link>
                                        </div>
                                        <Link to="/contact" className="th-btn style2 th-icon">Contact Us</Link>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BlogDetailsMain;
