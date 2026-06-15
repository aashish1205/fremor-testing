import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

export default function ContinentTabs() {
    const { continent: pathContinent } = useParams();
    const [searchParams] = useSearchParams();
    
    // Normalise the continent name (e.g. "north-america" -> "North America")
    const formatContinentName = (str) => {
        if (!str) return null;
        return decodeURIComponent(str)
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const currentContinent = formatContinentName(pathContinent) || searchParams.get('continent');
    
    console.log("ContinentTabs rendered, continent query:", currentContinent);

    const [isNavbarSticky, setIsNavbarSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsNavbarSticky(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const continents = [
        { label: 'All Global', value: null, icon: 'fa-solid fa-globe' },
        { label: 'Asia', value: 'Asia', icon: 'fa-solid fa-earth-asia' },
        { label: 'Europe', value: 'Europe', icon: 'fa-solid fa-earth-europe' },
        { label: 'Africa', value: 'Africa', icon: 'fa-solid fa-earth-africa' },
        { label: 'North America', value: 'North America', icon: 'fa-solid fa-earth-americas' },
        { label: 'South America', value: 'South America', icon: 'fa-solid fa-earth-americas' },
        { label: 'Australia', value: 'Australia', icon: 'fa-solid fa-earth-oceania' }
    ];

    const isActive = (val) => {
        if (val === null) return !currentContinent;
        return currentContinent?.toLowerCase() === val.toLowerCase();
    };

    return (
        <div className={`continent-tabs-section ${isNavbarSticky ? 'navbar-sticky' : ''}`} style={{ 
            position: 'sticky',
            top: 'var(--sticky-top, 0px)',
            zIndex: 99,
            background: '#ffffff',
            padding: '5px 0',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            transition: 'top 0.15s ease-out, padding 0.3s ease'
        }}>
            <div className="container">
                <div className="d-flex justify-content-center">
                    <div className="continent-tabs-wrapper" style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#ffffff',
                        padding: '3px',
                        borderRadius: '99px',
                        boxShadow: '0 2px 10px rgba(13, 73, 110, 0.04)',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        maxWidth: '100%',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        gap: '3px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <style>{`
                            .continent-tabs-section {
                                --sticky-top: 0px;
                            }
                            .continent-tabs-section.navbar-sticky {
                                --sticky-top: 90px;
                            }
                            .continent-tabs-wrapper::-webkit-scrollbar {
                                display: none;
                            }
                            .continent-tab-item {
                                display: inline-flex;
                                align-items: center;
                                gap: 6px;
                                padding: 5px 14px;
                                border-radius: 99px;
                                font-size: 12px;
                                font-weight: 700;
                                color: #475569;
                                text-decoration: none;
                                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                cursor: pointer;
                                border: 1px solid transparent;
                            }
                            .continent-tab-item:hover {
                                background-color: rgba(13, 73, 110, 0.05);
                                color: #0d496e;
                                transform: translateY(-1px);
                            }
                            .continent-tab-item.active {
                                background: linear-gradient(135deg, #0d496e 0%, #1e3a8a 100%);
                                color: #ffffff;
                                box-shadow: 0 3px 10px rgba(13, 73, 110, 0.18);
                            }
                            .continent-tab-item.active i {
                                color: #FFB114 !important;
                                transform: scale(1.05);
                            }
                            @media (max-width: 1199px) {
                                .continent-tabs-section.navbar-sticky {
                                    --sticky-top: 80px;
                                }
                            }
                            @media (max-width: 991px) {
                                .continent-tabs-section {
                                    padding: 4px 0 !important;
                                }
                                .continent-tabs-section.navbar-sticky {
                                    --sticky-top: 70px;
                                }
                                .continent-tab-item {
                                    padding: 4px 10px;
                                    font-size: 11.5px;
                                    gap: 5px;
                                }
                            }
                            @media (max-width: 768px) {
                                .continent-tab-item {
                                    padding: 4px 8px;
                                    font-size: 11px;
                                    gap: 4px;
                                }
                            }
                        `}</style>
                        {continents.map((c) => {
                            const url = c.value 
                                ? `/destination/outbound/${c.value.toLowerCase().replace(/\s+/g, '-')}`
                                : '/destination/outbound';
                            
                            return (
                                <Link 
                                    key={c.label}
                                    to={url}
                                    className={`continent-tab-item ${isActive(c.value) ? 'active' : ''}`}
                                >
                                    <i className={c.icon} style={{ 
                                        color: isActive(c.value) ? '#FFB114' : '#0d496e',
                                        fontSize: '15px',
                                        transition: 'all 0.3s'
                                    }}></i>
                                    {c.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

