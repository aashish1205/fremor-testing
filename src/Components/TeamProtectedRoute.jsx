import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import TeamLayout from './TeamLayout';

const TeamProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [teamMember, setTeamMember] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const sessionData = localStorage.getItem('team_session');
            if (sessionData) {
                try {
                    const member = JSON.parse(sessionData);
                    if (member && member.role === 'team_member') {
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

    return <TeamLayout teamMember={teamMember}>{children}</TeamLayout>;
};

export default TeamProtectedRoute;
