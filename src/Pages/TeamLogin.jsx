import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AdminLogin.css';

const TeamLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Auto-login if session exists
        const checkSession = () => {
            const teamSession = localStorage.getItem('team_session');
            if (teamSession) {
                navigate('/team/dashboard');
            }
        };
        checkSession();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Securely query the team_login function which bypasses RLS for this specific check
            const { data, error } = await supabase.rpc('team_login', {
                p_email: email,
                p_password: password
            });

            if (error || !data || data.length === 0) {
                throw new Error("Invalid email or password.");
            }
            
            const teamData = data[0];
            
            // On success, store the team member's session locally
            localStorage.setItem('team_session', JSON.stringify({
                id: teamData.id,
                name: teamData.name,
                email: teamData.email,
                phone: teamData.phone,
                role: 'team_member'
            }));
            
            // Redirect to team dashboard
            navigate('/team/dashboard');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                {/* Logo Section */}
                <div className="admin-login-logo">
                    <img src="/assets/img/logo/FremorLogo.png" alt="Fremor Logo" />
                </div>
                
                <h2 className="admin-login-title">Team Portal</h2>
                <p className="admin-login-subtitle">Sign in to your team dashboard</p>

                {error && <div className="admin-login-alert error">{error}</div>}

                <form className="admin-login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <i className="fa-regular fa-envelope input-icon"></i>
                            <input 
                                type="email" 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="yourname@fremorglobal.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <i className="fa-solid fa-lock input-icon"></i>
                            <input 
                                type="password" 
                                id="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your assigned password"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary-login mt-4" 
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeamLogin;
