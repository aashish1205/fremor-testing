import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAdminSearch } from './AdminSearchContext';
import './AdminLayout.css';

const AdminLayout = ({ children, email }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { globalSearchTerm, setGlobalSearchTerm } = useAdminSearch();

    useEffect(() => {
        // Reset search term whenever user navigates between dashboard sections
        setGlobalSearchTerm('');
    }, [location.pathname, setGlobalSearchTerm]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsLoggingOut(false);
            navigate('/admin/login');
        }
    };

    return (
        <>
            {isLoggingOut && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    zIndex: 999999,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "fadeIn 0.3s ease"
                }}>
                    <div style={{
                        width: "55px",
                        height: "55px",
                        border: "4px solid rgba(231, 76, 60, 0.15)",
                        borderTop: "4px solid var(--theme-color, #e74c3c)",
                        borderRadius: "50%",
                        animation: "spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                        boxShadow: "0 10px 30px rgba(231, 76, 60, 0.1)",
                        marginBottom: "20px"
                    }} />
                    <h4 style={{
                        fontFamily: "var(--title-font, sans-serif)",
                        fontWeight: 700,
                        color: "#1b1b1b",
                        fontSize: "18px",
                        letterSpacing: "0.5px",
                        margin: 0,
                        textAlign: "center"
                    }}>
                        Signing Out...
                    </h4>
                    <p style={{
                        fontSize: "13px",
                        color: "#777",
                        marginTop: "6px",
                        marginBottom: 0
                    }}>
                        Securing your session
                    </p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
            <div className="admin-dashboard-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <img src="/assets/img/logo/FremorLogo.png" alt="Fremor Logo" />
                </div>
                
                <nav className="admin-sidebar-nav">
                    <NavLink 
                        to="/admin/dashboard" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-chart-line"></i>
                        Dashboard
                    </NavLink>

                    <NavLink 
                        to="/admin/team" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-user-shield"></i>
                        Team Members
                    </NavLink>
                    
                    <NavLink 
                        to="/admin/travellers" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-users"></i>
                        Travellers
                    </NavLink>
                    
                    <NavLink 
                        to="/admin/destinations" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-map-location-dot"></i>
                        Tour Packages
                    </NavLink>
                    
                    <NavLink 
                        to="/admin/visas" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-passport"></i>
                        Manage Visas
                    </NavLink>

                    <NavLink 
                        to="/admin/visa-enquiries" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-envelope-open-text"></i>
                        Visa Enquiries
                    </NavLink>

                    <NavLink 
                        to="/admin/package-enquiries" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-rectangle-list"></i>
                        Package Enquiries
                    </NavLink>

                    

                    <NavLink 
                        to="/admin/cruises" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-ship"></i>
                        Cruise Packages
                    </NavLink>

                    {/*<NavLink 
                        to="/admin/tours" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-route"></i>
                        Tours
                    </NavLink>*/}

                    <NavLink 
                        to="/admin/blogs" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-newspaper"></i>
                        Blogs
                    </NavLink>

                     <NavLink 
                        to="/admin/instagram-gallery" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fab fa-instagram"></i>
                        Instagram Gallery
                    </NavLink>

                    <NavLink 
                        to="/admin/testimonials" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-comments"></i>
                        Testimonials Texts
                    </NavLink>

                   

                    <NavLink 
                        to="/admin/customer-video-reviews" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-video"></i>
                        Testimonal Videos
                    </NavLink>
                </nav>
            </aside>

            {/* Main Wrapper */}
            <div className="admin-main-wrapper">
                {/* Header */}
                <header className="admin-header">
                    <div className="admin-header-search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                            type="text" 
                            placeholder="Search across dashboard..." 
                            value={globalSearchTerm}
                            onChange={(e) => setGlobalSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="admin-header-right">
                        <button className="admin-icon-btn">
                            <i className="fa-regular fa-bell"></i>
                            <span className="badge">3</span>
                        </button>
                        
                        <div className="admin-profile">
                            <button className="admin-profile-btn">
                                <div className="admin-profile-avatar">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                                <div className="admin-profile-info d-none d-md-flex">
                                    <span className="admin-profile-name">{email || 'Admin'}</span>
                                    <span className="admin-profile-role">Superadmin</span>
                                </div>
                                <i className="fa-solid fa-chevron-down ms-2 text-muted" style={{ fontSize: '0.8rem' }}></i>
                            </button>
                            
                            <div className="admin-dropdown">
                                <button className="admin-dropdown-item">
                                    <i className="fa-regular fa-user"></i> My Profile
                                </button>
                                <button className="admin-dropdown-item">
                                    <i className="fa-solid fa-gear"></i> Settings
                                </button>
                                <hr style={{ margin: '0.5rem 0', borderColor: '#e2e8f0' }} />
                                <button className="admin-dropdown-item logout" onClick={handleLogout}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="admin-main-content">
                    {children}
                </main>
            </div>
        </div>
        </>
    );
};

export default AdminLayout;
