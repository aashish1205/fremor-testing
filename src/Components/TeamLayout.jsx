import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const TeamLayout = ({ children, teamMember }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('team_session');
        navigate('/team/login');
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
                        to="/team/dashboard" 
                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <i className="fa-solid fa-house-user"></i>
                        Welcome
                    </NavLink>
                    
                    {/* Add more team-specific modules here in the future */}
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
                                    <span className="admin-profile-role">Fremor Team</span>
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
