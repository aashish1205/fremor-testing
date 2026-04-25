import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const TravellerDetailsAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [enquiries, setEnquiries] = useState([]);
    const [enquiriesLoading, setEnquiriesLoading] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const { data: userData, error: userError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (userError) throw userError;
            setUser(userData);

            // Fetch enquiries
            if (userData?.email) {
                setEnquiriesLoading(true);
                const { data: enqData, error: enqError } = await supabase
                    .from('enquiries')
                    .select('*')
                    .eq('email_address', userData.email)
                    .order('created_at', { ascending: false });

                if (enqError) throw enqError;
                setEnquiries(enqData || []);
            }
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Failed to fetch user details.');
        } finally {
            setLoading(false);
            setEnquiriesLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <i className="fa-solid fa-spinner fa-spin fa-2x text-primary mb-3"></i>
                <p>Loading traveller details...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="alert alert-danger m-4">
                {error || 'User not found.'}
                <br />
                <button className="btn btn-primary mt-3" onClick={() => navigate('/admin/travellers')}>
                    Back to Travellers
                </button>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                    <button 
                        onClick={() => navigate('/admin/travellers')}
                        style={{ background: '#f1f5f9', border: 'none', width: '40px', height: '40px', borderRadius: '8px', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                            Traveller Profile
                        </h2>
                        <p style={{ color: '#64748b', margin: 0 }}>Detailed information and activity</p>
                    </div>
                </div>
            </div>

            {/* Header Card */}
            <div style={{ background: 'white', padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div className="d-flex align-items-center">
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '600', marginRight: '1.25rem', overflow: 'hidden' }}>
                        {user.avatar_url ? (
                            <img src={user.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            (user.first_name?.[0] || 'U').toUpperCase()
                        )}
                    </div>
                    <div>
                        <h4 style={{ margin: 0, fontWeight: '700', color: '#0f172a', fontSize: '1.25rem' }}>{`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Guest User'}</h4>
                        <div style={{ color: '#64748b', fontSize: '0.95rem' }}>{user.email}</div>
                    </div>
                </div>
                <div className="d-none d-sm-block text-end">
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Joined Date</div>
                    <div style={{ fontWeight: '600', color: '#334155' }}>{formatDate(user.created_at)}</div>
                </div>
            </div>

            {/* Body */}
            <div className="row g-4">
                {/* Left Column: Personal Info */}
                <div className="col-lg-5">
                    <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Personal Information</h5>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <InfoRow label="Phone" value={user.phone} />
                            <InfoRow label="Gender" value={user.gender} />
                            <InfoRow label="Date of Birth" value={formatDate(user.date_of_birth)} />
                            <InfoRow label="Nationality" value={user.nationality} />
                            <InfoRow label="Marital Status" value={user.marital_status} />
                            <InfoRow label="Anniversary" value={formatDate(user.anniversary)} />
                            <InfoRow label="City of Residence" value={user.city_of_residence} />
                            <InfoRow label="State" value={user.state} />
                            <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.5rem 0' }}></div>
                            <h6 style={{ fontWeight: '600', color: '#334155', fontSize: '0.95rem', margin: '0.5rem 0' }}>Documents</h6>
                            <InfoRow label="Passport No." value={user.passport_no} />
                            <InfoRow label="Passport Expiry" value={formatDate(user.passport_expiry)} />
                            <InfoRow label="Issuing Country" value={user.passport_issuing_country} />
                            <InfoRow label="PAN Card" value={user.pan_card_number} />
                        </div>
                    </div>
                </div>

                {/* Right Column: CRM / Activity */}
                <div className="col-lg-7">
                    {/* Recent Enquiries */}
                    <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '1rem', fontSize: '1.1rem' }}>Recent Enquiries</h5>
                        
                        {enquiriesLoading ? (
                            <div className="text-center py-3 text-muted"><i className="fa-solid fa-spinner fa-spin me-2"></i>Loading enquiries...</div>
                        ) : enquiries.length === 0 ? (
                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                                <i className="fa-regular fa-folder-open mb-2" style={{ fontSize: '1.5rem' }}></i>
                                <div>No recent enquiries found for this user.</div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {enquiries.map(enq => (
                                    <div key={enq.id} style={{ border: '1px solid #f1f5f9', padding: '1rem', borderRadius: '8px', background: '#f8fafc' }}>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div style={{ fontWeight: '600', color: '#0f172a' }}>{enq.destination_title || 'General Enquiry'}</div>
                                            <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: '600' }}>
                                                {formatDate(enq.created_at)}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                                            <div><i className="fa-regular fa-calendar me-1"></i> {formatDate(enq.travel_start_date)} to {formatDate(enq.travel_end_date)}</div>
                                            <div><i className="fa-solid fa-users me-1"></i> {enq.no_of_adults} Adults, {enq.no_of_children} Children</div>
                                            {enq.contact_number && <div><i className="fa-solid fa-phone me-1"></i> {enq.contact_number}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Bookings Placeholder */}
                    <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h5 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '1rem', fontSize: '1.1rem' }}>Recent Bookings</h5>
                        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '8px', textAlign: 'center', color: '#64748b', border: '1px dashed #cbd5e1' }}>
                            <i className="fa-solid fa-plane-slash mb-2" style={{ fontSize: '1.5rem', color: '#94a3b8' }}></i>
                            <div style={{ fontWeight: '500', color: '#475569', marginBottom: '0.25rem' }}>No recent bookings found</div>
                            <div style={{ fontSize: '0.85rem' }}>When this user makes a booking, it will appear here.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component for label-value pairs
const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}>
        <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '500' }}>{label}</span>
        <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: '600', textAlign: 'right' }}>{value || <span style={{ color: '#cbd5e1', fontWeight: '400' }}>Not provided</span>}</span>
    </div>
);

export default TravellerDetailsAdmin;
