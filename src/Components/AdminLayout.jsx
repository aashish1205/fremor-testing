import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AdminLayout.css';

const AdminLayout = ({ children, email }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    return (
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
                        to="/admin/destinations" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-map-location-dot"></i>
                        Destinations
                    </NavLink>

                    <NavLink 
                        to="/admin/cruises" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-ship"></i>
                        Cruises
                    </NavLink>

                    <NavLink 
                        to="/admin/tours" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-route"></i>
                        Tours
                    </NavLink>

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
                </nav>
            </aside>

            {/* Main Wrapper */}
            <div className="admin-main-wrapper">
                {/* Header */}
                <header className="admin-header">
                    <div className="admin-header-search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Search across dashboard..." />
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
    );
};

export default AdminLayout;
