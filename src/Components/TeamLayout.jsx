import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const TeamLayout = ({ children, teamMember }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('team_session');
        navigate('/team/login');
    };

    const isTabAllowed = (role, path) => {
        // Backward compatibility
        if (role === 'team_member' || !role) return true;

        const normalized = path.toLowerCase();
        if (role === 'Blog Writer') {
            return normalized === '/team/blogs';
        }
        if (role === 'Package Editor') {
            return normalized === '/team/destinations' || normalized === '/team/cruises';
        }
        if (role === 'Customer Support') {
            return normalized === '/team/travellers' ||
                   normalized === '/team/testimonials' ||
                   normalized === '/team/instagram-gallery' ||
                   normalized === '/team/customer-video-reviews';
        }
        if (role === 'Visa Support Executive') {
            return normalized === '/team/visas' ||
                   normalized === '/team/visa-enquiries';
        }
        if (role === 'All') {
            return normalized !== '/team/dashboard';
        }
        return true;
    };

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <img src="/assets/img/logo/FremorLogo.png" alt="Fremor Logo" />
                </div>
                
                <nav className="admin-sidebar-nav">
                    {isTabAllowed(teamMember?.role, '/team/dashboard') && (
                        <NavLink 
                            to="/team/dashboard" 
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <i className="fa-solid fa-house-user"></i>
                            Welcome
                        </NavLink>
                    )}

                    {isTabAllowed(teamMember?.role, '/team/travellers') && (
                        <NavLink 
                            to="/team/travellers" 
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <i className="fa-solid fa-users"></i>
                            Travellers
                        </NavLink>
                    )}
                    
                    {isTabAllowed(teamMember?.role, '/team/destinations') && (
                        <NavLink 
                            to="/team/destinations" 
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <i className="fa-solid fa-map-location-dot"></i>
                            Destinations
                        </NavLink>
                    )}

                    {isTabAllowed(teamMember?.role, '/team/cruises') && (
                        <NavLink 
                            to="/team/cruises" 
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <i className="fa-solid fa-ship"></i>
                            Cruises
                        </NavLink>
                    )}

                    {isTabAllowed(teamMember?.role, '/team/blogs') && (
                        <NavLink 
                            to="/team/blogs" 
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <i className="fa-solid fa-newspaper"></i>
                            Blogs
                        </NavLink>
                    )}

                    {isTabAllowed(teamMember?.role, '/team/visas') && (
                        <NavLink 
                            to="/team/visas" 
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <i className="fa-solid fa-passport"></i>
                            Manage Visas
                        </NavLink>
                    )}

                    {isTabAllowed(teamMember?.role, '/team/visa-enquiries') && (
                        <NavLink 
                            to="/team/visa-enquiries" 
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <i className="fa-solid fa-clipboard-list"></i>
                            Visa Enquiries
                        </NavLink>
                    )}

                    {isTabAllowed(teamMember?.role, '/team/testimonials') && (
                        <NavLink 
                            to="/team/testimonials" 
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <i className="fa-solid fa-comments"></i>
                            Testimonials
                        </NavLink>
                    )}

                    {isTabAllowed(teamMember?.role, '/team/instagram-gallery') && (
                        <NavLink 
                            to="/team/instagram-gallery" 
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <i className="fab fa-instagram"></i>
                            Instagram Gallery
                        </NavLink>
                    )}

                    {isTabAllowed(teamMember?.role, '/team/customer-video-reviews') && (
                        <NavLink 
                            to="/team/customer-video-reviews" 
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <i className="fa-solid fa-video"></i>
                            Customer Videos
                        </NavLink>
                    )}
                </nav>
            </aside>

            {/* Main Wrapper */}
            <div className="admin-main-wrapper">
                {/* Header */}
                <header className="admin-header">
                    <div className="admin-header-search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Search team resources..." />
                    </div>

                    <div className="admin-header-right">
                        <button className="admin-icon-btn">
                            <i className="fa-regular fa-bell"></i>
                        </button>
                        
                        <div className="admin-profile">
                            <button className="admin-profile-btn">
                                <div className="admin-profile-avatar" style={{ backgroundColor: '#10b981' }}>
                                    {(teamMember?.name?.[0] || 'T').toUpperCase()}
                                </div>
                                <div className="admin-profile-info d-none d-md-flex">
                                    <span className="admin-profile-name">{teamMember?.name || 'Team Member'}</span>
                                    <span className="admin-profile-role">{teamMember?.role || 'Fremor Team'}</span>
                                </div>
                                <i className="fa-solid fa-chevron-down ms-2 text-muted" style={{ fontSize: '0.8rem' }}></i>
                            </button>
                            
                            <div className="admin-dropdown">
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

export default TeamLayout;
