import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useDataTable } from '../hooks/useDataTable';
import AdminPagination from '../Components/Admin/AdminPagination';

const TravellersAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { 
        searchTerm, 
        handleSearch, 
        currentPage, 
        setCurrentPage, 
        totalPages, 
        paginatedData,
        totalItems
    } = useDataTable(users, ['first_name', 'last_name', 'email', 'phone', 'nationality']);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewUser = (u) => {
        navigate(`/admin/travellers/${u.id}`);
    };

    // Helper to format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div style={{ paddingBottom: '3rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                        Travellers Management
                    </h2>
                    <p style={{ color: '#64748b', margin: 0 }}>View and manage your registered users and their details.</p>
                </div>
                <div className="d-flex gap-3 align-items-center">
                    <div className="position-relative">
                        <i className="fa-solid fa-search position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                        <input 
                            type="text" 
                            placeholder="Search travellers..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control ps-5"
                            style={{ minWidth: '250px', borderRadius: '8px' }}
                        />
                    </div>
                    <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: '500', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>
                        <i className="fa-solid fa-download me-2"></i> Export Users
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Total Travellers</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{users.length}</h3>
                            </div>
                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#3b82f615', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                <i className="fa-solid fa-users"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                {loading ? (
                    <div className="text-center py-5">
                        <i className="fa-solid fa-spinner fa-spin fa-2x text-primary mb-3"></i>
                        <p>Loading travellers...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : users.length === 0 ? (
                    <div className="text-center py-5 text-muted">No travellers found in the system.</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle" style={{ minWidth: '900px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none' }}>USER</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none' }}>CONTACT</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none' }}>NATIONALITY</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none' }}>JOINED</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none', textAlign: 'right' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            {searchTerm ? 'No travellers found matching your search.' : 'No travellers found in the system.'}
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => handleViewUser(u)}>
                                            <td style={{ padding: '1rem 0.5rem', border: 'none' }}>
                                                <div className="d-flex align-items-center">
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', marginRight: '1rem', overflow: 'hidden' }}>
                                                        {u.avatar_url ? (
                                                            <img src={u.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            (u.first_name?.[0] || 'U').toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{`${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Guest User'}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.gender || 'Not specified'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem', border: 'none' }}>
                                                <div style={{ color: '#334155', fontWeight: '500' }}>{u.email}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.phone || 'No phone'}</div>
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem', border: 'none', color: '#475569' }}>
                                                {u.nationality || 'N/A'}
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem', border: 'none', color: '#475569' }}>
                                                {formatDate(u.created_at)}
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem', border: 'none', textAlign: 'right' }}>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleViewUser(u); }}
                                                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.4rem 1rem', borderRadius: '6px', color: '#3b82f6', fontWeight: '600', fontSize: '0.85rem' }}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        
                        <AdminPagination 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                            onPageChange={setCurrentPage} 
                            totalItems={totalItems}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravellersAdmin;
