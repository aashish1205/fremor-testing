import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const MyAccountSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsLoggingOut(false);
            navigate('/');
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
            <div style={{ background: '#fff', borderRight: '1px solid #eaeaea', height: '100%', minHeight: '600px', padding: '24px 0' }}>
            <div style={{ padding: '0 24px', marginBottom: '16px', fontSize: '13px', fontWeight: 700, color: '#666', letterSpacing: '0.5px' }}>
                MY ACCOUNT
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>
                    <Link to="/my-account" style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', 
                        background: isActive('/my-account') ? '#f8f9fa' : 'transparent',
                        color: '#333', textDecoration: 'none', fontWeight: isActive('/my-account') ? 600 : 500,
                        borderRight: isActive('/my-account') ? '3px solid var(--theme-color, #e74c3c)' : 'none'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className="fa-regular fa-user" style={{ width: '20px', color: '#555' }} />
                            My Profile
                        </div>
                        {isActive('/my-account') && <span style={{ width: '6px', height: '6px', background: '#c53030', borderRadius: '50%' }}></span>}
                    </Link>
                </li>
                <li>
                    <Link to="/co-travellers" style={{ 
                        display: 'flex', alignItems: 'center', padding: '16px 24px', 
                        background: isActive('/co-travellers') ? '#f8f9fa' : 'transparent',
                        color: '#333', textDecoration: 'none', fontWeight: isActive('/co-travellers') ? 600 : 500,
                        borderRight: isActive('/co-travellers') ? '3px solid var(--theme-color, #e74c3c)' : 'none'
                    }}>
                        <i className="fa-regular fa-users" style={{ width: '20px', color: '#555', marginRight: '12px' }} />
                        Co-Travellers
                    </Link>
                </li>
                <li>
                    <Link to="/logged-in-devices" style={{ 
                        display: 'flex', alignItems: 'center', padding: '16px 24px', 
                        background: isActive('/logged-in-devices') ? '#f8f9fa' : 'transparent',
                        color: '#333', textDecoration: 'none', fontWeight: isActive('/logged-in-devices') ? 600 : 500,
                        borderRight: isActive('/logged-in-devices') ? '3px solid var(--theme-color, #e74c3c)' : 'none'
                    }}>
                        <i className="fa-regular fa-laptop-mobile" style={{ width: '20px', color: '#555', marginRight: '12px' }} />
                        Logged In Devices
                    </Link>
                </li>
                <li>
                    <button onClick={handleLogout} style={{ 
                        display: 'flex', alignItems: 'center', padding: '16px 24px', width: '100%', textAlign: 'left',
                        background: 'transparent', border: 'none', color: '#333', cursor: 'pointer', fontWeight: 500
                    }}>
                        <i className="fa-regular fa-arrow-right-from-bracket" style={{ width: '20px', color: '#555', marginRight: '12px' }} />
                        Logout
                    </button>
                </li>
            </ul>

            <div style={{ height: '1px', background: '#eaeaea', margin: '24px 24px' }}></div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>
                    <Link to="#" style={{ 
                        display: 'flex', alignItems: 'center', padding: '12px 24px', 
                        color: '#555', textDecoration: 'none', fontWeight: 500, fontSize: '14px'
                    }}>
                        <i className="fa-regular fa-key" style={{ width: '20px', marginRight: '12px' }} />
                        Reset Password
                    </Link>
                </li>
            </ul>
        </div>
        </>
    );
};

export default MyAccountSidebar;
