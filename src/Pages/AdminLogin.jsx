import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Auto-login if session exists
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session && session.user?.user_metadata?.role === 'admin') {
                navigate('/admin/destinations');
            }
        };
        checkSession();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            
            // Check for admin role
            if (data.user?.user_metadata?.role !== 'admin') {
                await supabase.auth.signOut();
                throw new Error("Access Denied: Admin role is required to access this portal.");
            }
            
            // Redirect will happen automatically if we add logic or simply push
            navigate('/admin/destinations');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address to reset password.');
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/admin/login',
            });
            
            if (error) throw error;
            setMessage('Password reset email sent! Please check your inbox.');
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
                
                <h2 className="admin-login-title">Admin Portal</h2>
                <p className="admin-login-subtitle">Sign in to manage your content</p>

                {error && <div className="admin-login-alert error">{error}</div>}
                {message && <div className="admin-login-alert success">{message}</div>}

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
                                placeholder="connect@fremorglobal.com"
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
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn-forgot" 
                            onClick={handleForgotPassword}
                            disabled={loading}
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary-login" 
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
