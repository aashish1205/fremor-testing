import React from 'react';

const TeamDashboard = () => {
    // Assuming teamMember details were passed down or can be fetched from local storage
    const teamSession = JSON.parse(localStorage.getItem('team_session') || '{}');

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                        Welcome to the Team Dashboard!
                    </h2>
                    <p style={{ color: '#64748b', margin: 0 }}>
                        Hello {teamSession.name}, this is your secure workspace.
                    </p>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-12">
                    <div style={{ 
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                        padding: '3rem 2rem', 
                        borderRadius: '16px', 
                        color: 'white',
                        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
                                Ready to make an impact?
                            </h3>
                            <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', marginBottom: '2rem' }}>
                                This dashboard is currently being set up. Soon, you will have access to custom tools, reports, and modules assigned to you by the Superadmin. Stay tuned!
                            </p>
                            <button style={{ 
                                background: 'white', 
                                color: '#059669', 
                                border: 'none', 
                                padding: '0.8rem 2rem', 
                                borderRadius: '30px', 
                                fontWeight: '700', 
                                fontSize: '1rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                            }}>
                                Get Started
                            </button>
                        </div>
                        <i className="fa-solid fa-rocket" style={{
                            position: 'absolute',
                            right: '-20px',
                            bottom: '-20px',
                            fontSize: '12rem',
                            opacity: 0.1,
                            transform: 'rotate(-15deg)'
                        }}></i>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12 col-md-6">
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', height: '100%' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>
                            <i className="fa-solid fa-bullhorn text-primary me-2"></i> Announcements
                        </h4>
                        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                            <h5 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Welcome to Fremor Team Portal</h5>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>We are excited to have you on board. Your modules will be appearing here shortly as they are developed.</p>
                        </div>
                    </div>
                </div>
                
                <div className="col-12 col-md-6">
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', height: '100%' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>
                            <i className="fa-solid fa-id-card text-success me-2"></i> Your Profile
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Name</span>
                                <span style={{ fontWeight: '500', color: '#0f172a' }}>{teamSession.name}</span>
                            </li>
                            <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Email</span>
                                <span style={{ fontWeight: '500', color: '#0f172a' }}>{teamSession.email}</span>
                            </li>
                            <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Phone</span>
                                <span style={{ fontWeight: '500', color: '#0f172a' }}>{teamSession.phone || 'Not provided'}</span>
                            </li>
                            <li style={{ padding: '0.75rem 0', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Role</span>
                                <span style={{ fontWeight: '500', color: '#10b981' }}>Team Member</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamDashboard;
