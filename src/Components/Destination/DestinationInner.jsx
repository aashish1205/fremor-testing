import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DestinationCard from './DestinationCard';
import DestinationCardTwo from './DestinationCardTwo';
import { fetchDestinations, searchDestinations } from '../../services/destinationService';
import { fetchBlogs, getBlogImageSrc } from '../../services/blogService';

function DestinationInner() {
    const [activeTab, setActiveTab] = useState('tab-grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams] = useSearchParams();
    const [recentBlogs, setRecentBlogs] = useState([]);
    const category = searchParams.get('category');
    const packageType = searchParams.get('package_type');
    
    const postsPerPage = 9;

    // Fetch destinations on mount and when filters change
    useEffect(() => {
        loadDestinations();
        loadRecentBlogs();
        // Reset to first page when category or package_type changes
        setCurrentPage(1);
    }, [category, packageType]);

    const loadRecentBlogs = async () => {
        try {
            const blogsData = await fetchBlogs();
            setRecentBlogs(blogsData.slice(0, 3));
        } catch (err) {
            console.error('Error fetching recent blogs:', err);
        }
    };

    const loadDestinations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchDestinations(category, packageType);
            setDestinations(data);
        } catch (err) {
            console.error('Error fetching destinations:', err);
            setError('Failed to load destinations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            setCurrentPage(1);
            if (searchQuery.trim() === '') {
                const data = await fetchDestinations();
                setDestinations(data);
            } else {
                const data = await searchDestinations(searchQuery);
                setDestinations(data);
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(destinations.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = destinations.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <section className="space">
            <div className="container">
                <div className="th-sort-bar">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-md-4">
                            <div className="search-form-area">
                                <form className="search-form" onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        placeholder="Search destinations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button type="submit">
                                        <i className="fa-light fa-magnifying-glass" />
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <div className="sorting-filter-wrap">
                                <div className="nav" role="tablist">
                                    <Link
                                        to="#"
                                        id="tab-destination-grid"
                                        data-bs-toggle="tab"
                                        data-bs-target="#tab-grid"
                                        role="tab"
                                        aria-controls="tab-grid"
                                        aria-selected="true"
                                        className={`${activeTab === 'tab-grid' ? 'active' : ''}`}
                                        type="button"
                                        onClick={() => setActiveTab('tab-grid')}
                                    >
                                        <i className="fa-light fa-grid-2" />
                                    </Link>
                                    <Link
                                        to="#"
                                        id="tab-destination-list"
                                        data-bs-toggle="tab"
                                        data-bs-target="#tab-list"
                                        role="tab"
                                        aria-controls="tab-list"
                                        aria-selected="false"
                                        className={`${activeTab === 'tab-list' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('tab-list')}
                                    >
                                        <i className="fa-solid fa-list" />
                                    </Link>
                                </div>
                                <form className="woocommerce-ordering" method="get">
                                    <select
                                        name="orderby"
                                        className="orderby"
                                        aria-label="destination order"
                                    >
                                        <option value="menu_order" >
                                            Default Sorting
                                        </option>
                                        <option value="popularity">Sort by popularity</option>
                                        <option value="rating">Sort by average rating</option>
                                        <option value="date">Sort by latest</option>
                                        <option value="price">Sort by price: low to high</option>
                                        <option value="price-desc">Sort by price: high to low</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xxl-9 col-lg-8">
                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3" style={{ color: '#666' }}>Loading destinations...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="alert alert-danger text-center" role="alert">
                                <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                {error}
                                <button className="btn btn-outline-danger btn-sm ms-3" onClick={loadDestinations}>
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && destinations.length === 0 && (
                            <div className="text-center py-5">
                                <i className="fa-light fa-map-location-dot" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                                <h4 className="mt-3" style={{ color: '#999' }}>No destinations found</h4>
                                <p style={{ color: '#aaa' }}>
                                    {searchQuery ? 'Try a different search term.' : 'Destinations will appear here once added.'}
                                </p>
                            </div>
                        )}

                        {/* Content */}
                        {!loading && !error && destinations.length > 0 && (
                            <div className="tab-content" id="nav-tabContent">
                                <div className={`tab-pane fade ${activeTab === 'tab-grid' ? 'show active' : ''}`} id="tab-grid" role="tabpanel"
                                >
                                    <div className="row gy-30">
                                        {currentPosts.map((data) => (
                                            <div key={data.id} className="col-xxl-4 col-xl-6">
                                                <DestinationCard
                                                    destinationID={data.id}
                                                    destinationImage={data.image}
                                                    destinationTitle={data.title}
                                                    destinationPrice={`₹${data.price}`}
                                                    destinationDuration={data.duration}
                                                    destinationPriceUnit={data.price_unit}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={`tab-pane fade ${activeTab === 'tab-list' ? 'show active' : ''}`} id="tab-list" role="tabpanel"
                                >
                                    <div className="row gy-30">
                                        {currentPosts.map((data) => (
                                            <div key={data.id} className="col-12">
                                                <DestinationCardTwo
                                                    destinationID={data.id}
                                                    destinationImage={data.image}
                                                    destinationTitle={data.title}
                                                    destinationPrice={`₹${data.price}`}
                                                    destinationDuration={data.duration}
                                                    destinationPriceUnit={data.price_unit}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && !error && totalPages > 1 && (
                            <div className="th-pagination text-center mt-60 mb-0">
                                <ul>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <li key={i}>
                                            <Link
                                                className={currentPage === i + 1 ? 'active' : ''}
                                                to="#"
                                                onClick={() => handlePageChange(i + 1)}
                                            >
                                                {i + 1}
                                            </Link>
                                        </li>
                                    ))}
                                    {currentPage < totalPages && (
                                        <li>
                                            <Link className="next-page" to="#" onClick={() => handlePageChange(currentPage + 1)}>
                                                Next <img src="/assets/img/icon/arrow-right4.svg" alt="" />
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="col-xxl-3 col-lg-4">
                        <aside className="sidebar-area style2">
                            <div className="widget widget_categories  ">
                                <h3 className="widget_title">Categories</h3>
                                <ul>
                                    <li>
                                        <Link to="/destination?package_type=Standard">
                                            <i className="fa-solid fa-box text-primary me-2"></i>
                                            Standard Package
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/destination?package_type=Premium">
                                            <i className="fa-solid fa-gem text-info me-2"></i>
                                            Premium Package
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/destination?package_type=Luxury">
                                            <i className="fa-solid fa-crown text-warning me-2"></i>
                                            Luxury Package
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="widget  ">
                                <h3 className="widget_title">Recent Blog Posts</h3>
                                <div className="recent-post-wrap">
                                    {recentBlogs.map((blog) => (
                                        <div className="recent-post" key={blog.id}>
                                            <div className="media-img">
                                                <Link to={`/blog/${blog.id}`}>
                                                    <img
                                                        src={getBlogImageSrc(blog.main_image)}
                                                        alt="Blog"
                                                    />
                                                </Link>
                                            </div>
                                            <div className="media-body">
                                                <h4 className="post-title">
                                                    <Link className="text-inherit" to={`/blog/${blog.id}`}>
                                                        {blog.title}
                                                    </Link>
                                                </h4>
                                                <div className="recent-post-meta">
                                                    <Link to={`/blog/${blog.id}`}>
                                                        <i className="fa-regular fa-calendar" />
                                                        {new Date(blog.created_at).toLocaleDateString()}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="widget widget_tag_cloud  ">
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
                            <div
                                className="widget widget_offer  "
                                data-bg-src="/assets/img/bg/widget_bg_1.jpg"
                                style={{ backgroundImage: "url(/assets/img/bg/colorkit.png)" }}
                            >
                                <div className="offer-banner">
                                    <div className="offer">
                                        <h6 className="box-title">
                                            Need Help? We Are Here To Help You
                                        </h6>
                                        <div className="banner-logo">
                                            <img src="/assets/img/logo/FremorLogo.png" alt="Fremor" />
                                        </div>
                                        <div className="offer">
                                            <h6 className="offer-title">You Get Online support</h6>
                                            <Link className="offter-num" to={+919920499911}>
                                                +91 9920499911
                                            </Link>
                                        </div>
                                        <Link to="/contact" className="th-btn style2 th-icon">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default DestinationInner
