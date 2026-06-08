import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageSrc } from '../../services/destinationService';
import { supabase } from '../../supabaseClient';

function PackagesByDuration() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('3-5'); // '3-5', '6-9', or '10+'

    useEffect(() => {
        const loadPackages = async () => {
            try {
                setLoading(true);
                // Fetch directly from Supabase to bypass sessionStorage caching
                const { data, error } = await supabase
                    .from('destinations')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setPackages(data || []);
            } catch (err) {
                console.error("Failed to load packages for duration section:", err);
            } finally {
                setLoading(false);
            }
        };
        loadPackages();
    }, []);

    // Helper to extract numeric days from duration string (e.g. "7 Days", "5 Nights / 6 Days", "10D")
    const getDaysFromDuration = (durationStr) => {
        if (!durationStr) return 0;
        const match = durationStr.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };

    // Filter packages by active tab
    const getFilteredPackages = () => {
        return packages.filter(pkg => {
            // ONLY show packages that have an uploaded cover image
            if (!pkg.image || pkg.image.trim() === '') return false;

            const days = getDaysFromDuration(pkg.duration);
            if (activeTab === '3-5') {
                return days >= 3 && days <= 5;
            } else if (activeTab === '6-9') {
                return days >= 6 && days <= 9;
            } else if (activeTab === '10+') {
                return days >= 10;
            }
            return false;
        });
    };

    const tabPackages = getFilteredPackages();

    // Slice first 6 packages for our grid layout
    const item1 = tabPackages[0];
    const item2 = tabPackages[1];
    const item3 = tabPackages[2];
    const item4 = tabPackages[3];
    const item5 = tabPackages[4];
    const item6 = tabPackages[5];

    // Helper to format price
    const formatPrice = (priceVal) => {
        if (!priceVal) return '0';
        return parseFloat(priceVal).toLocaleString('en-IN');
    };

    const renderCard = (pkg, customClass = '') => {
        if (!pkg) return null;
        return (
            <Link to={`/destination/${pkg.id}`} className={`pbd-card ${customClass}`} key={pkg.id}>
                <div className="pbd-card-img-wrap">
                    <img 
                        src={getImageSrc(pkg.image)} 
                        alt={pkg.title} 
                        className="pbd-card-img" 
                        onError={(e) => { e.target.src = '/assets/img/tour/tour_3_1.jpg'; }}
                    />
                </div>
                <div className="pbd-card-overlay"></div>
                <div className="pbd-card-content">
                    <h3 className="pbd-card-title">{pkg.title}</h3>
                    <p className="pbd-card-price">From ₹{formatPrice(pkg.price)}</p>
                </div>
            </Link>
        );
    };

    return (
        <section className="packages-by-duration-sec py-5" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
            <style dangerouslySetInnerHTML={{__html: `
                .packages-by-duration-sec {
                    width: 100%;
                    position: relative;
                    padding: 60px 0;
                }
                .pbd-title-area {
                    margin-bottom: 30px;
                }
                .pbd-main-title {
                    font-size: 30px;
                    font-weight: 800;
                    color: #0c486e;
                    line-height: 1.25;
                    margin: 0 0 20px 0;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-family: var(--title-font, sans-serif);
                }
                .pbd-accent {
                    position: relative;
                    display: inline-block;
                    padding: 0px 8px;
                    margin-right: 4px;
                }
                .pbd-accent::after {
                    content: "";
                    position: absolute;
                    top: -6px;
                    left: -4px;
                    right: -4px;
                    bottom: -2px;
                    border: 2px solid #FFB114;
                    border-radius: 60% 40% 55% 45% / 40% 50% 40% 60%;
                    transform: rotate(-1.5deg);
                    pointer-events: none;
                }
                .pbd-tabs-container {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }
                .pbd-tab-btn {
                    background-color: transparent;
                    border: 1px solid #cbd5e1;
                    color: #64748b;
                    padding: 8px 24px;
                    border-radius: 30px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .pbd-tab-btn:hover {
                    border-color: #0d496e;
                    background-color: #f0f9ff;
                    color: #0d496e;
                }
                .pbd-tab-btn.active {
                    background-color: #0d496e;
                    border-color: #0d496e;
                    color: #ffffff;
                }
                .pbd-tab-btn.active:hover {
                    background-color: #FFB114;
                    border-color: #FFB114;
                    color: #113d48;
                }
                
                /* Grid Layout Styles */
                .pbd-grid {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr 1.2fr;
                    gap: 20px;
                    height: 520px;
                    min-height: 520px;
                }
                .pbd-col-left {
                    display: grid;
                    grid-template-rows: 1fr 1fr;
                    gap: 20px;
                    height: 100%;
                }
                .pbd-row-bottom {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    height: 100%;
                }
                .pbd-col-center {
                    height: 100%;
                }
                .pbd-col-right {
                    display: grid;
                    grid-template-rows: 1fr 1fr;
                    gap: 20px;
                    height: 100%;
                }
                
                /* Card Styles */
                .pbd-card {
                    position: relative;
                    border-radius: 16px;
                    overflow: hidden;
                    height: 100%;
                    cursor: pointer;
                    display: block;
                    text-decoration: none;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.04);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .pbd-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1);
                }
                .pbd-card-img-wrap {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1;
                }
                .pbd-card-img {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .pbd-card:hover .pbd-card-img {
                    transform: scale(1.08);
                }
                .pbd-card-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%);
                    z-index: 2;
                }
                .pbd-card-content {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    z-index: 3;
                    color: #ffffff;
                }
                .pbd-card-title {
                    font-size: 24px;
                    font-weight: 800;
                    color: #ffffff;
                    margin: 0 0 6px 0;
                    font-family: var(--title-font, sans-serif);
                    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    transition: color 0.3s ease;
                }
                .pbd-card:hover .pbd-card-title {
                    color: #FFB114;
                }
                .pbd-card-price {
                    font-size: 14px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.95);
                    margin: 0;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                }
                
                /* Responsive Grid Styling */
                @media(max-width: 992px) {
                    .pbd-grid {
                        grid-template-columns: 1fr 1fr;
                        height: auto;
                        min-height: auto;
                    }
                    .pbd-col-left, .pbd-col-right {
                        height: auto;
                    }
                    .pbd-col-center {
                        grid-column: span 2;
                        height: 350px;
                    }
                    .pbd-col-left {
                        height: 520px;
                    }
                    .pbd-col-right {
                        height: 520px;
                    }
                }
                @media(max-width: 768px) {
                    .pbd-grid {
                        grid-template-columns: 1fr;
                        height: auto;
                        gap: 15px;
                    }
                    .pbd-col-left {
                        grid-template-rows: 250px 250px;
                        height: auto;
                        gap: 15px;
                    }
                    .pbd-row-bottom {
                        grid-template-columns: 1fr;
                        height: auto;
                        gap: 15px;
                    }
                    .pbd-col-center {
                        grid-column: span 1;
                        height: 250px;
                    }
                    .pbd-col-right {
                        grid-template-rows: 250px 250px;
                        height: auto;
                        gap: 15px;
                    }
                }
            `}} />
            
            <div className="container">
                <div className="pbd-title-area">
                    <h2 className="pbd-main-title">
                        <span className="pbd-accent">Packages</span> by Duration
                    </h2>
                    
                    {/* Duration Selection Tabs */}
                    <div className="pbd-tabs-container">
                        <button 
                            className={`pbd-tab-btn ${activeTab === '3-5' ? 'active' : ''}`}
                            onClick={() => setActiveTab('3-5')}
                        >
                            3-5 Days
                        </button>
                        <button 
                            className={`pbd-tab-btn ${activeTab === '6-9' ? 'active' : ''}`}
                            onClick={() => setActiveTab('6-9')}
                        >
                            6-9 Days
                        </button>
                        <button 
                            className={`pbd-tab-btn ${activeTab === '10+' ? 'active' : ''}`}
                            onClick={() => setActiveTab('10+')}
                        >
                            10+ Days
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : tabPackages.length > 0 ? (
                    <div className="pbd-grid">
                        {/* Column 1 (Left): Spans Item 1 (top, wide) and Item 2 & 3 (bottom, side-by-side) */}
                        {(item1 || item2 || item3) && (
                            <div className="pbd-col-left">
                                {item1 ? renderCard(item1) : <div className="pbd-card bg-light border" style={{ borderRadius: '16px' }} />}
                                <div className="pbd-row-bottom">
                                    {item2 ? renderCard(item2) : <div className="pbd-card bg-light border" style={{ borderRadius: '16px' }} />}
                                    {item3 ? renderCard(item3) : <div className="pbd-card bg-light border" style={{ borderRadius: '16px' }} />}
                                </div>
                            </div>
                        )}

                        {/* Column 2 (Center): Tall Portrait Card for Item 4 */}
                        {item4 ? (
                            <div className="pbd-col-center">
                                {renderCard(item4)}
                            </div>
                        ) : (
                            <div className="pbd-col-center">
                                <div className="pbd-card bg-light border" style={{ borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    No package available
                                </div>
                            </div>
                        )}

                        {/* Column 3 (Right): Spans Item 5 (top) and Item 6 (bottom) */}
                        {(item5 || item6) && (
                            <div className="pbd-col-right">
                                {item5 ? renderCard(item5) : <div className="pbd-card bg-light border" style={{ borderRadius: '16px' }} />}
                                {item6 ? renderCard(item6) : <div className="pbd-card bg-light border" style={{ borderRadius: '16px' }} />}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-5 border rounded bg-light" style={{ borderRadius: '16px' }}>
                        <i className="fa-solid fa-plane-slash text-muted mb-3" style={{ fontSize: '48px' }}></i>
                        <p className="text-muted fw-semibold">No packages found for {activeTab === '3-5' ? '3 to 5' : activeTab === '6-9' ? '6 to 9' : '10 or more'} days.</p>
                        <p className="small text-muted mt-1">Add packages in the admin panel with durations in this range to see them here.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default PackagesByDuration;
