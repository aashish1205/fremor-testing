import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useDataTable } from '../hooks/useDataTable';
import AdminPagination from '../Components/Admin/AdminPagination';

const TeamAdmin = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [saving, setSaving] = useState(false);

    const { 
        searchTerm, 
        handleSearch, 
        currentPage, 
        setCurrentPage, 
        totalPages, 
        paginatedData,
        totalItems
    } = useDataTable(team, ['name', 'email', 'phone', 'created_by']);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('fremor_team')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                // Ignore error if table doesn't exist yet, just show empty list
                if (error.code === '42P01') {
                    setTeam([]);
                } else {
                    throw error;
                }
            } else {
                setTeam(data || []);
            }
        } catch (err) {
            console.error('Error fetching team:', err);
            setError('Failed to fetch team members. Have you run the SQL script?');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setSaving(true);
            // Get current superadmin email
            const { data: { session } } = await supabase.auth.getSession();
            const adminEmail = session?.user?.email || 'Unknown Admin';

            const { error } = await supabase
                .from('fremor_team')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password, // In a real app, hash this!
                    created_by: adminEmail
                }]);

            if (error) throw error;

            // Reset form and modal
            setFormData({ name: '', email: '', phone: '', password: '' });
            setShowModal(false);
            
            // Refresh list
            fetchTeam();
            alert('Team member added successfully!');
        } catch (err) {
            console.error('Error saving team member:', err);
            alert(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this team member?')) return;

        try {
            const { error } = await supabase
                .from('fremor_team')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchTeam();
        } catch (err) {
            console.error('Error deleting team member:', err);
            alert('Failed to delete team member.');
        }
    };

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
                        Team Management
                    </h2>
                    <p style={{ color: '#64748b', margin: 0 }}>Add and manage members for the Team Dashboard.</p>
                </div>
                <div className="d-flex gap-3 align-items-center">
                    <div className="position-relative">
                        <i className="fa-solid fa-search position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                        <input 
                            type="text" 
                            placeholder="Search team..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control ps-5"
                            style={{ minWidth: '250px', borderRadius: '8px' }}
                        />
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: '500', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}
                    >
                        <i className="fa-solid fa-plus me-2"></i> Add Team Member
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                {loading ? (
                    <div className="text-center py-5">
                        <i className="fa-solid fa-spinner fa-spin fa-2x text-primary mb-3"></i>
                        <p>Loading team members...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : team.length === 0 ? (
                    <div className="text-center py-5 text-muted">No team members found in the system. Add one to get started.</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle" style={{ minWidth: '900px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none' }}>MEMBER</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none' }}>CONTACT</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none' }}>ADDED BY</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none' }}>JOINED</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none', textAlign: 'right' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            {searchTerm ? 'No members found matching your search.' : 'No members found in the system.'}
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '1rem 0.5rem', border: 'none' }}>
                                                <div className="d-flex align-items-center">
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', marginRight: '1rem', overflow: 'hidden' }}>
                                                        {(u.name?.[0] || 'T').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{u.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Team Member</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem', border: 'none' }}>
                                                <div style={{ color: '#334155', fontWeight: '500' }}>{u.email}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.phone || 'No phone'}</div>
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem', border: 'none', color: '#475569' }}>
                                                {u.created_by || 'System'}
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem', border: 'none', color: '#475569' }}>
                                                {formatDate(u.created_at)}
                                            </td>
                                            <td style={{ padding: '1rem 0.5rem', border: 'none', textAlign: 'right' }}>
                                                <button 
                                                    onClick={() => handleDelete(u.id)}
                                                    style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.4rem 1rem', borderRadius: '6px', color: '#ef4444', fontWeight: '600', fontSize: '0.85rem' }}
                                                >
                                                    <i className="fa-regular fa-trash-can"></i> Remove
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

            {/* Modal for adding team member */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '500px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        margin: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '90vh',
                        overflow: 'hidden'
                    }}>
                        <div style={{ borderBottom: '1px solid #f1f5f9', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h5 style={{ fontWeight: '700', color: '#0f172a', margin: 0 }}>Add Team Member</h5>
                            <button 
                                type="button" 
                                onClick={() => setShowModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#64748b', cursor: 'pointer', lineHeight: 1 }}
                            >
                                &times;
                            </button>
                        </div>
                        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label" style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Full Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required 
                                        placeholder="e.g. Jane Doe"
                                        style={{ borderRadius: '8px', padding: '0.6rem 1rem' }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required 
                                        placeholder="e.g. jane@fremor.com"
                                        style={{ borderRadius: '8px', padding: '0.6rem 1rem' }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Phone Number</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="e.g. +91 9876543210"
                                        style={{ borderRadius: '8px', padding: '0.6rem 1rem' }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label" style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Password</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required 
                                        placeholder="Assign a secure password"
                                        style={{ borderRadius: '8px', padding: '0.6rem 1rem' }}
                                    />
                                    <div className="form-text mt-2" style={{ fontSize: '0.8rem' }}>
                                        The team member will use this password to log in.
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button 
                                        type="button" 
                                        className="btn btn-light" 
                                        onClick={() => setShowModal(false)}
                                        style={{ borderRadius: '8px', fontWeight: '500', padding: '0.6rem 1.25rem' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={saving}
                                        style={{ borderRadius: '8px', fontWeight: '500', padding: '0.6rem 1.25rem', background: '#2563eb', border: 'none' }}
                                    >
                                        {saving ? 'Adding...' : 'Add Member'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamAdmin;
