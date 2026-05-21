import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogPost from './BlogPost';
import { fetchBlogs } from '../../services/blogService';
import { fetchDestinations, getImageSrc } from '../../services/destinationService';

function BlogInner() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4; // Show 4 blogs per page

    const [destinations, setDestinations] = useState([]);
    const [destinationsLoading, setDestinationsLoading] = useState(true);

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                const data = await fetchBlogs();
                setBlogs(data);
            } catch (error) {
                console.error("Error loading blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        loadBlogs();
    }, []);

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

    const totalPages = Math.ceil(blogs.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <section className="th-blog-wrapper space-top space-extra-bottom">
            <div className="container">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-2 text-muted">Loading Articles...</p>
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-5 border rounded bg-light mb-4">
                                <h3 className="h4 text-muted">No articles found yet.</h3>
                                <p>Check back later for exciting travel stories and magazine articles!</p>
                            </div>
                        ) : (
                            <>
                                {currentPosts.map((blog) => (
                                    <BlogPost key={blog.id} blog={blog} />
                                ))}
                                
                                {totalPages > 1 && (
                                    <div className="th-pagination">
                                        <ul>
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <li key={i}>
                                                    <Link
                                                        className={currentPage === i + 1 ? 'active' : ''}
                                                        to="#"
                                                        onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                                                    >
                                                        {i + 1}
                                                    </Link>
                                                </li>
                                            ))}
                                            {currentPage < totalPages && (
                                                <li>
                                                    <Link className="next-page" to="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}>
                                                        Next <img src="/assets/img/icon/arrow-right4.svg" alt="" />
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    
                    {/* Sidebar Area */}
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            <div className="widget widget_search">
                                <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                                    <input type="text" placeholder="Search" />
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
                                    <Link to="/blog">Rent</Link>
                                    <Link to="/blog">Innovate</Link>
                                    <Link to="/blog">Hotel</Link>
                                    <Link to="/blog">Modern</Link>
                                    <Link to="/blog">Luxury</Link>
                                    <Link to="/blog">Travel</Link>
                                </div>
                            </div>*/}
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BlogInner;
