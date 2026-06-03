import React, { useState, useEffect } from 'react';
import { 
    fetchPackageEnquiries, 
    updatePackageEnquiryStatus, 
    deletePackageEnquiry 
} from '../../services/destinationService';
import { useDataTable } from '../../hooks/useDataTable';
import { useAdminSearch } from '../AdminSearchContext';
import AdminPagination from '../Admin/AdminPagination';

export default function PackageEnquiriesAdminPanel() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null); // For details modal
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const { globalSearchTerm, setGlobalSearchTerm } = useAdminSearch();

    // DataTable hook for client-side search and pagination
    const { 
        searchTerm, 
        handleSearch, 
        currentPage, 
        setCurrentPage, 
        totalPages, 
        paginatedData,
        totalItems
    } = useDataTable(
        enquiries, 
        ['full_name', 'email_address', 'contact_number', 'destination_title', 'departure_city', 'city_of_residence', 'status'], 
        10, 
        globalSearchTerm, 
        setGlobalSearchTerm
    );

    useEffect(() => {
        loadEnquiries();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const loadEnquiries = async () => {
        try {
            setLoading(true);
            const data = await fetchPackageEnquiries();
            setEnquiries(data || []);
        } catch (err) {
            console.error('Failed to load package enquiries:', err);
            setError('Failed to load enquiries from database.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updatePackageEnquiryStatus(id, newStatus);
            showToast(`Status updated to "${newStatus}"`);
            
            // Update local state
            setEnquiries(prev => prev.map(item => 
                item.id === id ? { ...item, status: newStatus } : item
            ));

            if (selectedEnquiry && selectedEnquiry.id === id) {
                setSelectedEnquiry(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            console.error('Failed to update status:', err);
            showToast('Failed to update enquiry status.', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) return;
        try {
            await deletePackageEnquiry(id);
            showToast('Enquiry deleted successfully!');
            setEnquiries(prev => prev.filter(item => item.id !== id));
            if (selectedEnquiry && selectedEnquiry.id === id) {
                setSelectedEnquiry(null);
            }
        } catch (err) {
            console.error('Delete failed:', err);
            showToast('Failed to delete enquiry.', 'error');
        }
    };

    // Calculate metrics
    const totalCount = enquiries.length;
    const pendingCount = enquiries.filter(e => e.status === 'Pending' || !e.status).length;
    const inProgressCount = enquiries.filter(e => e.status === 'In Progress').length;
    const completedCount = enquiries.filter(e => e.status === 'Completed').length;

    // Format dates helper
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={{ paddingBottom: '3rem' }}>
            {toast.show && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: '600',
                    zIndex: 9999,
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    background: toast.type === 'success' ? '#10b981' : '#ef4444',
                    animation: 'slideIn 0.3s ease'
                }}>
                    <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} me-2`}></i>
                    {toast.message}
                    <style>{`
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                        Package Enquiries
                    </h2>
                    <p style={{ color: '#64748b', margin: 0 }}>Review, search, and manage custom tour package enquiries filled out by travellers.</p>
                </div>
                <div className="d-flex gap-3 align-items-center">
                    <div className="position-relative">
                        <i className="fa-solid fa-search position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                        <input 
                            type="text" 
                            placeholder="Search enquiries..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control ps-5"
                            style={{ minWidth: '280px', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '0.5rem 1rem 0.5rem 2.5rem' }}
                        />
                    </div>
                </div>
            </div>

            {/* Metrics cards */}
            <div className="row g-4 mb-4">
                {[
                    { title: "Total Enquiries", value: totalCount, icon: "fa-envelope", color: "#3b82f6" },
                    { title: "Pending", value: pendingCount, icon: "fa-clock", color: "#f59e0b" },
                    { title: "In Progress", value: inProgressCount, icon: "fa-spinner", color: "#6366f1" },
                    { title: "Completed", value: completedCount, icon: "fa-circle-check", color: "#10b981" }
                ].map((stat, i) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={i}>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>{stat.title}</p>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{stat.value}</h3>
                                </div>
                                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                    <i className={`fa-solid ${stat.icon}`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Data Table */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                {loading ? (
                    <div className="text-center py-5">
                        <i className="fa-solid fa-spinner fa-spin fa-2x text-primary mb-3"></i>
                        <p>Loading package enquiries...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : enquiries.length === 0 ? (
                    <div className="text-center py-5 text-muted">No package enquiries found in the database.</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle" style={{ minWidth: '1000px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none' }}>CUSTOMER</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none' }}>TOUR PACKAGE</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none' }}>TRAVEL SCHEDULE</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none' }}>TIER & GUESTS</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none' }}>SUBMITTED ON</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none', textAlign: 'center' }}>STATUS</th>
                                    <th style={{ color: '#64748b', fontWeight: '600', fontSize: '0.85rem', padding: '1rem 0.5rem', border: 'none', textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                            {searchTerm ? 'No enquiries found matching your search.' : 'No enquiries found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map(e => (
                                        <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            {/* Customer contact info */}
                                            <td style={{ padding: '1rem 0.5rem', border: 'none' }}>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{e.full_name}</div>
                                                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                                        <i className="fa-regular fa-envelope me-1"></i>{e.email_address}
                                                    </div>
                                                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                                        <i className="fa-solid fa-phone me-1"></i>{e.contact_number || 'N/A'}
                                                    </div>
                                                    {e.city_of_residence && (
                                                        <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                                                            <i className="fa-solid fa-house-chimney me-1"></i>{e.city_of_residence}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Tour Package Title */}
                                            <td style={{ padding: '1rem 0.5rem', border: 'none' }}>
                                                <div style={{ fontWeight: '600', color: '#0d496e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <i className="fa-solid fa-map-location-dot text-primary"></i>
                                                    {e.destination_title}
                                                </div>
                                            </td>

                                            {/* Travel schedule */}
                                            <td style={{ padding: '1rem 0.5rem', border: 'none' }}>
                                                <div style={{ fontSize: '0.88rem', color: '#334155' }}>
                                                    <strong>From:</strong> {e.departure_city || 'N/A'}
                                                </div>
                                                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                                    <i className="fa-regular fa-calendar me-1"></i>
                                                    {formatDate(e.travel_start_date)} - {formatDate(e.travel_end_date)}
                                                </div>
                                            </td>

                                            {/* Guests and Tier */}
                                            <td style={{ padding: '1rem 0.5rem', border: 'none' }}>
                                                <span 
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '0.25em 0.6em',
                                                        fontSize: '75%',
                                                        fontWeight: '700',
                                                        lineHeight: '1',
                                                        textAlign: 'center',
                                                        whiteSpace: 'nowrap',
                                                        verticalAlign: 'baseline',
                                                        borderRadius: '0.25rem',
                                                        textTransform: 'capitalize',
                                                        marginBottom: '0.25rem',
                                                        backgroundColor: (e.package_tier || 'standard').toLowerCase() === 'luxury' ? '#fffbeb' : (e.package_tier || 'standard').toLowerCase() === 'premium' ? '#eff6ff' : '#f1f5f9',
                                                        color: (e.package_tier || 'standard').toLowerCase() === 'luxury' ? '#b45309' : (e.package_tier || 'standard').toLowerCase() === 'premium' ? '#1d4ed8' : '#475569',
                                                        border: `1px solid ${(e.package_tier || 'standard').toLowerCase() === 'luxury' ? '#fde68a' : (e.package_tier || 'standard').toLowerCase() === 'premium' ? '#bfdbfe' : '#cbd5e1'}`
                                                    }}
                                                >
                                                    {e.package_tier || 'Standard'}
                                                </span>
                                                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                                                    <strong>Adults:</strong> {e.no_of_adults || 1} • <strong>Kids:</strong> {e.no_of_children || 0}
                                                </div>
                                            </td>

                                            {/* Submitted on */}
                                            <td style={{ padding: '1rem 0.5rem', border: 'none', color: '#64748b', fontSize: '0.85rem' }}>
                                                {formatDateTime(e.created_at)}
                                            </td>

                                            {/* Status Dropdown */}
                                            <td style={{ padding: '1rem 0.5rem', border: 'none', textAlign: 'center' }}>
                                                <select
                                                    value={e.status || 'Pending'}
                                                    onChange={(evt) => handleStatusChange(e.id, evt.target.value)}
                                                    style={{
                                                        padding: '0.4rem 2rem 0.4rem 1rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.82rem',
                                                        fontWeight: '600',
                                                        border: '1px solid transparent',
                                                        outline: 'none',
                                                        cursor: 'pointer',
                                                        appearance: 'none',
                                                        WebkitAppearance: 'none',
                                                        textAlign: 'left',
                                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23${e.status === 'Completed' ? '137333' : e.status === 'In Progress' ? '1a73e8' : 'b06000'}' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'right 12px center',
                                                        backgroundSize: '12px',
                                                        backgroundColor: e.status === 'Completed' ? '#e6f4ea' : e.status === 'In Progress' ? '#e8f0fe' : '#fef3c7',
                                                        color: e.status === 'Completed' ? '#137333' : e.status === 'In Progress' ? '#1a73e8' : '#b06000',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                                        width: '135px',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '1rem 0.5rem', border: 'none', textAlign: 'right' }}>
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button 
                                                        onClick={() => setSelectedEnquiry(e)}
                                                        style={{ background: '#f1f5f9', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', color: '#475569', fontWeight: '600', fontSize: '0.85rem' }}
                                                    >
                                                        <i className="fa-solid fa-eye me-1"></i>View
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(e.id)}
                                                        style={{ background: '#fdf2f2', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', color: '#dc3545', fontWeight: '600', fontSize: '0.85rem' }}
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </div>
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

            {/* Details Modal */}
            {selectedEnquiry && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    animation: 'fadeIn 0.25s ease'
                }}>
                    <div style={{
                        background: 'white',
                        width: '100%',
                        maxWidth: '600px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        {/* Header */}
                        <div style={{ background: '#f8fafc', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                                Tour Package Enquiry Details
                            </h3>
                            <button 
                                onClick={() => setSelectedEnquiry(null)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer', outline: 'none', transition: 'color 0.2s' }}
                                onMouseOver={(evt) => evt.target.style.color = '#475569'}
                                onMouseOut={(evt) => evt.target.style.color = '#94a3b8'}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '75vh', overflowY: 'auto' }}>
                            {/* Customer Profile info */}
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Customer Profile</div>
                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>{selectedEnquiry.full_name}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                                        <i className="fa-regular fa-envelope me-2 text-primary" style={{ width: '16px' }}></i>{selectedEnquiry.email_address}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                                        <i className="fa-solid fa-phone me-2 text-primary" style={{ width: '16px' }}></i>{selectedEnquiry.contact_number || 'Not provided'}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                                        <i className="fa-solid fa-house-chimney me-2 text-primary" style={{ width: '16px' }}></i><strong>Resident City:</strong> {selectedEnquiry.city_of_residence || 'Not provided'}
                                    </div>
                                </div>
                            </div>

                            {/* Tour Package & Status info */}
                            <div className="row g-3">
                                <div className="col-12">
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Selected Tour Package</div>
                                    <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: '600', color: '#0d496e' }}>
                                        <i className="fa-solid fa-map-location-dot me-2 text-primary"></i>{selectedEnquiry.destination_title}
                                    </div>
                                </div>
                                
                                <div className="col-6">
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Package Tier</div>
                                    <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', color: '#334155', fontWeight: '600', textTransform: 'capitalize' }}>
                                        <span 
                                            style={{
                                                display: 'inline-block',
                                                padding: '0.35em 0.65em',
                                                fontSize: '75%',
                                                fontWeight: '700',
                                                lineHeight: '1',
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                                verticalAlign: 'baseline',
                                                borderRadius: '0.25rem',
                                                textTransform: 'capitalize',
                                                backgroundColor: (selectedEnquiry.package_tier || 'standard').toLowerCase() === 'luxury' ? '#fffbeb' : (selectedEnquiry.package_tier || 'standard').toLowerCase() === 'premium' ? '#eff6ff' : '#f1f5f9',
                                                color: (selectedEnquiry.package_tier || 'standard').toLowerCase() === 'luxury' ? '#b45309' : (selectedEnquiry.package_tier || 'standard').toLowerCase() === 'premium' ? '#1d4ed8' : '#475569',
                                                border: `1px solid ${(selectedEnquiry.package_tier || 'standard').toLowerCase() === 'luxury' ? '#fde68a' : (selectedEnquiry.package_tier || 'standard').toLowerCase() === 'premium' ? '#bfdbfe' : '#cbd5e1'}`
                                            }}
                                        >
                                            {selectedEnquiry.package_tier || 'Standard'}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Update Status</div>
                                    <div>
                                        <select
                                            value={selectedEnquiry.status || 'Pending'}
                                            onChange={(evt) => handleStatusChange(selectedEnquiry.id, evt.target.value)}
                                            style={{
                                                padding: '0.5rem 2rem 0.5rem 1rem',
                                                borderRadius: '8px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                border: '1px solid #e2e8f0',
                                                outline: 'none',
                                                cursor: 'pointer',
                                                width: '100%',
                                                appearance: 'none',
                                                WebkitAppearance: 'none',
                                                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23${selectedEnquiry.status === 'Completed' ? '137333' : selectedEnquiry.status === 'In Progress' ? '1a73e8' : 'b06000'}' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 12px center',
                                                backgroundSize: '14px',
                                                backgroundColor: selectedEnquiry.status === 'Completed' ? '#e6f4ea' : selectedEnquiry.status === 'In Progress' ? '#e8f0fe' : '#fef3c7',
                                                color: selectedEnquiry.status === 'Completed' ? '#137333' : selectedEnquiry.status === 'In Progress' ? '#1a73e8' : '#b06000',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Departure & Travel Dates */}
                            <div className="row g-3">
                                <div className="col-4">
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Departure City</div>
                                    <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', color: '#334155', fontWeight: '600' }}>
                                        <i className="fa-solid fa-plane-departure me-2 text-primary"></i>{selectedEnquiry.departure_city || 'N/A'}
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Start Date</div>
                                    <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', color: '#334155' }}>
                                        <i className="fa-regular fa-calendar me-2 text-primary"></i>{formatDate(selectedEnquiry.travel_start_date)}
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.35rem' }}>End Date</div>
                                    <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', color: '#334155' }}>
                                        <i className="fa-regular fa-calendar me-2 text-primary"></i>{formatDate(selectedEnquiry.travel_end_date)}
                                    </div>
                                </div>
                            </div>

                            {/* Passengers info */}
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Passenger Configuration</div>
                                <div className="row g-3">
                                    <div className="col-4">
                                        <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', color: '#334155' }}>
                                            <strong>Adults:</strong> {selectedEnquiry.no_of_adults || 1}
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', color: '#334155' }}>
                                            <strong>Children:</strong> {selectedEnquiry.no_of_children || 0}
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', color: '#334155' }}>
                                            <strong>Kids Ages:</strong> {selectedEnquiry.children_age || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submission Time */}
                            <div className="text-muted small d-flex justify-content-between mt-2">
                                <span>Submitted: {formatDateTime(selectedEnquiry.created_at)}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ background: '#f8fafc', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button 
                                onClick={() => handleDelete(selectedEnquiry.id)}
                                style={{ background: '#fdf2f2', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '8px', color: '#dc3545', fontWeight: '600', fontSize: '0.85rem' }}
                            >
                                <i className="fa-solid fa-trash-can me-2"></i>Delete Enquiry
                            </button>
                            <button 
                                onClick={() => setSelectedEnquiry(null)}
                                style={{ background: '#2563eb', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '8px', color: 'white', fontWeight: '600', fontSize: '0.85rem', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes modalSlideUp {
                            from { transform: translateY(20px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}
