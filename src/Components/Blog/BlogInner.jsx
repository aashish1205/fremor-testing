import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogPost from './BlogPost';
import { fetchBlogs } from '../../services/blogService';

function BlogInner() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4; // Show 4 blogs per page

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
                            <div className="widget widget_categories">
                                <h3 className="widget_title">Categories</h3>
                                <ul>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            City Tour
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Beach Tours
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Wildlife Tours
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            News &amp; Tips
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="widget widget_tag_cloud">
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
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BlogInner;
