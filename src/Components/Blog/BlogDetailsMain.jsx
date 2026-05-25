import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchBlogById, getBlogImageSrc } from '../../services/blogService';
import { fetchDestinations, getImageSrc } from '../../services/destinationService';

function BlogDetailsMain() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    const [destinations, setDestinations] = useState([]);
    const [destinationsLoading, setDestinationsLoading] = useState(true);

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

    useEffect(() => {
        const loadDestinations = async () => {
            try {
                const data = await fetchDestinations();
                // Show exactly 3 packages
                setDestinations(data.slice(0, 3));
            } catch (error) {
                console.error("Error loading destinations:", error);
            } finally {
                setDestinationsLoading(false);
            }
        };
        loadDestinations();
    }, []);

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
    const tips = parseArraySafe(blog.tips);

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
                                
                                {/* Short Description / Lead Summary */}
                                {blog.short_description && (
                                    <div className="blog-lead-summary mt-4 p-4 rounded text-muted" style={{ 
                                        fontSize: '1.15rem', 
                                        lineHeight: '1.8', 
                                        fontStyle: 'italic',
                                        background: '#f8fafc',
                                        borderLeft: '4px solid #0962E8',
                                        fontWeight: '500'
                                    }}>
                                        {blog.short_description}
                                    </div>
                                )}

                                {/* Quick Travel Facts Grid */}
                                {(blog.best_time || blog.duration || blog.budget || blog.visa_info) && (
                                    <div className="blog-travel-facts mt-5">
                                        <h4 className="h4 mb-4 text-theme"><i className="fa-solid fa-compass me-2"></i> Quick Travel Guide</h4>
                                        <div className="row g-3">
                                            {blog.best_time && (
                                                <div className="col-sm-6 col-md-3">
                                                    <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', padding: '1.25rem 1rem', borderRadius: '12px', textAlign: 'center', height: '100%' }}>
                                                        <div style={{ width: '40px', height: '40px', background: '#3b82f615', color: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontSize: '1.2rem' }}>
                                                            <i className="fa-regular fa-calendar-days"></i>
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Best Time</div>
                                                        <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '700', marginTop: '4px' }}>{blog.best_time}</div>
                                                    </div>
                                                </div>
                                            )}
                                            {blog.duration && (
                                                <div className="col-sm-6 col-md-3">
                                                    <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', padding: '1.25rem 1rem', borderRadius: '12px', textAlign: 'center', height: '100%' }}>
                                                        <div style={{ width: '40px', height: '40px', background: '#ec489915', color: '#ec4899', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontSize: '1.2rem' }}>
                                                            <i className="fa-regular fa-clock"></i>
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ideal Duration</div>
                                                        <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '700', marginTop: '4px' }}>{blog.duration}</div>
                                                    </div>
                                                </div>
                                            )}
                                            {blog.budget && (
                                                <div className="col-sm-6 col-md-3">
                                                    <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', padding: '1.25rem 1rem', borderRadius: '12px', textAlign: 'center', height: '100%' }}>
                                                        <div style={{ width: '40px', height: '40px', background: '#10b98115', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontSize: '1.2rem' }}>
                                                            <i className="fa-solid fa-indian-rupee-sign"></i>
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Est. Budget</div>
                                                        <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '700', marginTop: '4px' }}>{blog.budget}</div>
                                                    </div>
                                                </div>
                                            )}
                                            {blog.visa_info && (
                                                <div className="col-sm-6 col-md-3">
                                                    <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', padding: '1.25rem 1rem', borderRadius: '12px', textAlign: 'center', height: '100%' }}>
                                                        <div style={{ width: '40px', height: '40px', background: '#8b5cf615', color: '#8b5cf6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontSize: '1.2rem' }}>
                                                            <i className="fa-solid fa-passport"></i>
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Visa Required</div>
                                                        <div style={{ fontSize: '1rem', color: '#0f172a', fontWeight: '700', marginTop: '4px' }}>{blog.visa_info}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Main Content */}
                                <div className="blog-text mt-5 text-justify" style={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: '1.8' }}>
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

                                {/* Essential Travel Tips Section */}
                                {tips && tips.length > 0 && (
                                    <div className="mt-5">
                                        <h4 className="h4 mb-4 text-theme"><i className="fa-solid fa-lightbulb me-2"></i> Essential Travel Tips</h4>
                                        <div className="p-4 bg-light rounded shadow-sm border border-light">
                                            <ul className="list-unstyled mb-0" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {tips.map((tip, index) => (
                                                    <li key={index} className="d-flex align-items-start gap-2" style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.6' }}>
                                                        <i className="fa-solid fa-circle-check text-success mt-1" style={{ fontSize: '18px', flexShrink: 0 }}></i>
                                                        <span>{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
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
                            <div className="widget">
                                <h3 className="widget_title">Most Visited Destinations</h3>
                                <div className="recent-post-wrap">
                                    {destinationsLoading ? (
                                        <div className="text-center py-3">
                                            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                        </div>
                                    ) : destinations.length === 0 ? (
                                        <p className="text-muted small">No destinations found.</p>
                                    ) : (
                                        destinations.map((dest) => (
                                            <div className="recent-post" key={dest.id}>
                                                <div className="media-img">
                                                    <Link to={`/destination/${dest.id}`}>
                                                        <img
                                                            src={getImageSrc(dest.image)}
                                                            alt={dest.title}
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="media-body">
                                                    <h4 className="post-title">
                                                        <Link className="text-inherit" to={`/destination/${dest.id}`}>
                                                            {dest.title}
                                                        </Link>
                                                    </h4>
                                                    <div className="recent-post-meta" style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                                                        <span className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Starting from</span>
                                                        <span style={{ color: '#0962E8', fontWeight: '700', fontSize: '14px' }}>
                                                            ₹{dest.price}/{dest.price_unit || 'Person'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            {/*<div className="widget widget_tag_cloud">
                                <h3 className="widget_title">Popular Tags</h3>
                                <div className="tagcloud">
                                    <Link to="/blog">Tour</Link>
                                    <Link to="/blog">Adventure</Link>
                                    <Link to="/blog">Luxury</Link>
                                    <Link to="/blog">Travel</Link>
                                </div>
                            </div>*/}
                            {/*<div className="widget widget_offer" style={{ background: "url(/assets/img/bg/colorkit.png)" }}>
                                <div className="offer-banner">
                                    <div className="offer">
                                        <h6 className="box-title">Need Help? We Are Here To Help You</h6>
                                        <div className="banner-logo">
                                            <img src="/assets/img/logo/FremorLogo.png" alt="Fremor" />
                                        </div>
                                        <div className="offer">
                                            <h6 className="offer-title">You Get Online support</h6>
                                            <Link className="offter-num" to="tel:+919920499911">+91 9920499911</Link>
                                        </div>
                                        <Link to="/contact" className="th-btn style2 th-icon">Contact Us</Link>
                                    </div>
                                </div>
                            </div>*/}
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BlogDetailsMain;
