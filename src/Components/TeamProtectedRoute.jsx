import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import TeamLayout from './TeamLayout';
import { AdminSearchProvider } from './AdminSearchContext';

const TeamProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [teamMember, setTeamMember] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = () => {
            const sessionData = localStorage.getItem('team_session');
            if (sessionData) {
                try {
                    const member = JSON.parse(sessionData);
                    const validRoles = ['All', 'Blog Writer', 'Package Editor', 'Customer Support', 'Visa Support Executive', 'team_member'];
                    if (member && (validRoles.includes(member.role) || !member.role)) {
                        setTeamMember(member);
                        setIsAuthenticated(true);
                        return;
                    }
                } catch (e) {
                    console.error("Invalid team session format");
                }
            }
            setIsAuthenticated(false);
        };

        checkAuth();
    }, []);

    // While checking initial auth state
    if (isAuthenticated === null) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
                <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    Authorizing Team Access...
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/team/login" replace />;
    }

    const isRouteAllowed = (role, path) => {
        // Backward compatibility
        if (role === 'team_member' || !role) return true;

        const normalized = path.toLowerCase();
        if (role === 'Blog Writer') {
            return normalized.startsWith('/team/blogs');
        }
        if (role === 'Package Editor') {
            return normalized.startsWith('/team/destinations') || normalized.startsWith('/team/cruises');
        }
        if (role === 'Customer Support') {
            return normalized.startsWith('/team/travellers') ||
                   normalized.startsWith('/team/testimonials') ||
                   normalized.startsWith('/team/instagram-gallery') ||
                   normalized.startsWith('/team/customer-video-reviews') ||
                   normalized.startsWith('/team/package-enquiries');
        }
        if (role === 'Visa Support Executive') {
            return normalized.startsWith('/team/visas') ||
                   normalized.startsWith('/team/visa-enquiries');
        }
        if (role === 'All') {
            return !normalized.startsWith('/team/dashboard');
        }
        return true;
    };

    const getDefaultRoute = (role) => {
        if (role === 'Blog Writer') return '/team/blogs';
        if (role === 'Package Editor') return '/team/destinations';
        if (role === 'Customer Support') return '/team/travellers';
        if (role === 'Visa Support Executive') return '/team/visas';
        if (role === 'All') return '/team/travellers';
        return '/team/dashboard';
    };

    const currentRole = teamMember?.role || 'All';
    if (!isRouteAllowed(currentRole, location.pathname)) {
        const fallback = getDefaultRoute(currentRole);
        return <Navigate to={fallback} replace />;
    }

    return (
        <AdminSearchProvider>
            <TeamLayout teamMember={teamMember}>{children}</TeamLayout>
        </AdminSearchProvider>
    );
};

export default TeamProtectedRoute;
