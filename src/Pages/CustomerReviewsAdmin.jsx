import React, { useState, useEffect } from 'react';
import { 
    fetchCustomerVideoReviews, 
    addCustomerVideoReview, 
    updateCustomerVideoReview, 
    deleteCustomerVideoReview, 
    toggleCustomerVideoReviewActive, 
    uploadCustomerVideo 
} from '../services/customerReviewVideoService';
import { useDataTable } from '../hooks/useDataTable';
import { useAdminSearch } from '../Components/AdminSearchContext';
import AdminPagination from '../Components/Admin/AdminPagination';
import '../Components/Destination/AdminStyles.css';

const CustomerReviewsAdmin = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        id: null,
        customer_name: '',
        trip_tag: '',
        review_text: '',
        is_active: true
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [existingVideoUrl, setExistingVideoUrl] = useState(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [error, setError] = useState(null);

    const { globalSearchTerm, setGlobalSearchTerm } = useAdminSearch();

    // useDataTable hook
    const { 
        searchTerm, 
        handleSearch, 
        currentPage, 
        setCurrentPage, 
        totalPages, 
        paginatedData,
        totalItems
    } = useDataTable(reviews, ['customer_name', 'trip_tag', 'review_text'], 10, globalSearchTerm, setGlobalSearchTerm);

    useEffect(() => {
        loadData();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchCustomerVideoReviews(true, true); // forceRefresh = true, isAdmin = true
            setReviews(data || []);
        } catch (err) {
            console.error('Failed to load video reviews:', err);
            showToast('Failed to fetch video reviews.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('video/')) {
                setError('Please select a valid video file.');
                setSelectedFile(null);
                setVideoPreviewUrl(null);
                return;
            }
            setSelectedFile(file);
            setError(null);
            
            // Create preview URL
            const url = URL.createObjectURL(file);
            setVideoPreviewUrl(url);
        }
    };

    const handleOpenModal = (mode = 'add', item = null) => {
        setModalMode(mode);
        setError(null);
        setSelectedFile(null);
        setVideoPreviewUrl(null);

        if (mode === 'edit' && item) {
            setFormData({
                id: item.id,
                customer_name: item.customer_name || '',
                trip_tag: item.trip_tag || '',
                review_text: item.review_text || '',
                is_active: item.is_active !== false
            });
            setExistingVideoUrl(item.video_url);
        } else {
            setFormData({
                id: null,
                customer_name: '',
                trip_tag: '',
                review_text: '',
                is_active: true
            });
            setExistingVideoUrl(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Clean up object URLs to prevent memory leaks
        if (videoPreviewUrl) {
            URL.revokeObjectURL(videoPreviewUrl);
        }
    };

    const handleOpenViewModal = (item) => {
        setSelectedReview(item);
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedReview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.customer_name || !formData.trip_tag) {
            setError('Please fill required fields.');
            return;
        }

        if (modalMode === 'add' && !selectedFile) {
            setError('Please select a video file.');
            return;
        }

        try {
            setIsSubmitting(true);
            let finalVideoUrl = existingVideoUrl;

            // 1. Upload video if a new one is selected
            if (selectedFile) {
                const uploadResult = await uploadCustomerVideo(selectedFile);
                if (!uploadResult.success) {
                    throw new Error(uploadResult.error || 'Failed to upload video');
                }
                finalVideoUrl = uploadResult.url;
            }

            // 2. Add or Update database
            const reviewData = {
                customer_name: formData.customer_name,
                trip_tag: formData.trip_tag,
                review_text: formData.review_text,
                video_url: finalVideoUrl,
                is_active: formData.is_active
            };

            if (modalMode === 'edit') {
                const updateResult = await updateCustomerVideoReview(formData.id, reviewData);
                if (!updateResult.success) throw new Error(updateResult.error || 'Failed to update review record');
                showToast('Video review updated successfully!');
            } else {
                const addResult = await addCustomerVideoReview(reviewData);
                if (!addResult.success) throw new Error(addResult.error || 'Failed to add review record');
                showToast('Video review added successfully!');
            }

            handleCloseModal();
            loadData();
        } catch (err) {
            setError(err.message || 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, videoUrl) => {
        if (!window.confirm('Are you sure you want to delete this video review?')) return;

        try {
            const result = await deleteCustomerVideoReview(id, videoUrl);
            if (result.success) {
                showToast('Review deleted successfully!');
                loadData();
            } else {
                showToast(result.error || 'Failed to delete review', 'error');
            }
        } catch (err) {
            console.error('Delete error:', err);
            showToast('An error occurred while deleting.', 'error');
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            const result = await toggleCustomerVideoReviewActive(id, !currentStatus);
            if (result.success) {
                showToast(`Review ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
                loadData();
            } else {
                showToast(result.error || 'Failed to toggle status.', 'error');
            }
        } catch (err) {
            console.error('Toggle status error:', err);
            showToast('Failed to toggle status.', 'error');
        }
    };

    return (
        <div className="admin-panel-container">
            {toast.show && (
                <div className={`admin-toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}

            <div className="admin-panel-header d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                    <h2 className="m-0">Customer Video Reviews</h2>
                    <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.9rem' }}>
                        Manage customer story reels shown in "Stories of Our Travellers"
                    </p>
                </div>
                <div className="d-flex gap-3 align-items-center">
                    <div className="position-relative">
                        <i className="fa-solid fa-search position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                        <input 
                            type="text" 
                            placeholder="Search video reviews..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control ps-5"
                            style={{ minWidth: '250px', borderRadius: '8px' }}
                        />
                    </div>
                    <button className="th-btn m-0" onClick={() => handleOpenModal('add')}>
                        <i className="fa-solid fa-plus me-2"></i> Add Video Review
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="admin-loading">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table align-middle">
                        <thead>
                            <tr>
                                <th style={{ width: '100px' }}>Video</th>
                                <th style={{ width: '180px' }}>Customer Name</th>
                                <th style={{ width: '150px' }}>Trip Tag</th>
                                <th>Review Text</th>
                                <th style={{ width: '100px' }}>Status</th>
                                <th style={{ width: '220px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        {searchTerm ? 'No video reviews match your search query.' : 'No customer video reviews found. Click "Add Video Review" to start.'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div 
                                                onClick={() => handleOpenViewModal(item)}
                                                style={{ 
                                                    width: '60px', 
                                                    height: '80px', 
                                                    borderRadius: '6px', 
                                                    overflow: 'hidden', 
                                                    background: '#000',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    border: '1px solid #e2e8f0'
                                                }}
                                            >
                                                <video 
                                                    src={item.video_url} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    muted
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'rgba(0,0,0,0.3)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '14px'
                                                }}>
                                                    <i className="fa-solid fa-play"></i>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <strong>{item.customer_name}</strong>
                                        </td>
                                        <td>
                                            <span className="badge bg-secondary" style={{ fontSize: '11px', fontWeight: '600' }}>
                                                {item.trip_tag}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{
                                                maxWidth: '350px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                fontSize: '0.85rem',
                                                color: '#475569'
                                            }}>
                                                {item.review_text || <span className="text-muted italic">No review text</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleActive(item.id, item.is_active)}
                                                style={{
                                                    background: item.is_active !== false ? '#dcfce7' : '#fee2e2',
                                                    color: item.is_active !== false ? '#16a34a' : '#dc2626',
                                                    border: 'none',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontWeight: '600',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    minWidth: '75px'
                                                }}
                                            >
                                                {item.is_active !== false ? 'Active' : 'Hidden'}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="admin-actions justify-content-end">
                                                <button className="btn-edit" onClick={() => handleOpenViewModal(item)} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                                                    <i className="fa-solid fa-eye"></i> View
                                                </button>
                                                <button className="btn-edit" onClick={() => handleOpenModal('edit', item)}>
                                                    <i className="fa-solid fa-pen"></i> Edit
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(item.id, item.video_url)}>
                                                    <i className="fa-solid fa-trash"></i> Delete
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

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="admin-modal-header sticky-top bg-white z-1">
                            <h3>{modalMode === 'add' ? 'Add Video Review' : 'Edit Video Review'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form px-4 pb-4">
                            {error && (
                                <div className="alert alert-danger py-2 mb-3" role="alert">
                                    {error}
                                </div>
                            )}

                            {/* Video File Upload */}
                            <div className="form-group mb-4 mt-3">
                                <label className="fw-bold mb-2">Video File {modalMode === 'edit' && <span className="text-muted fw-normal">(Optional, leaves current if empty)</span>}</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="form-control"
                                    required={modalMode === 'add'}
                                />
                                <small className="text-muted d-block mt-1">Recommended size: Vertical Aspect Ratio (9:16), MP4 format</small>

                                {/* Video Preview */}
                                {(videoPreviewUrl || (modalMode === 'edit' && existingVideoUrl)) && (
                                    <div style={{
                                        marginTop: '15px',
                                        width: '120px',
                                        height: '180px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: '2px solid #e2e8f0',
                                        background: '#000',
                                        position: 'relative'
                                    }}>
                                        <video
                                            src={videoPreviewUrl || existingVideoUrl}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            muted
                                            controls
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="row">
                                {/* Customer Name */}
                                <div className="col-md-6 form-group mb-3">
                                    <label className="fw-bold mb-2">Customer Name *</label>
                                    <input
                                        type="text"
                                        name="customer_name"
                                        value={formData.customer_name}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="e.g. Aishwarya"
                                        required
                                    />
                                </div>
                                {/* Trip Tag */}
                                <div className="col-md-6 form-group mb-3">
                                    <label className="fw-bold mb-2">Trip Tag *</label>
                                    <input
                                        type="text"
                                        name="trip_tag"
                                        value={formData.trip_tag}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="e.g. Bali Holiday"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Review Text */}
                            <div className="form-group mb-3">
                                <label className="fw-bold mb-2">Review / Story Text</label>
                                <textarea
                                    name="review_text"
                                    value={formData.review_text}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    rows="4"
                                    placeholder="Enter the customer's story or review text..."
                                />
                            </div>

                            {/* Status Switch */}
                            <div className="form-group mb-3">
                                <div className="form-check form-switch mt-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                        id="videoActiveSwitch"
                                        style={{ width: '3rem', height: '1.5rem' }}
                                    />
                                    <label className="form-check-label ms-2 fw-bold" htmlFor="videoActiveSwitch">
                                        {formData.is_active ? 'Active (Visible on Homepage)' : 'Hidden (Draft/Inactive)'}
                                    </label>
                                </div>
                            </div>

                            <div className="admin-modal-footer sticky-bottom bg-white pt-3 border-top mt-4 p-3">
                                <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="th-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : (modalMode === 'add' ? 'Upload Video Review' : 'Update Video Review')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View / Play Modal */}
            {isViewModalOpen && selectedReview && (
                <div className="admin-modal-overlay" onClick={handleCloseViewModal}>
                    <div 
                        className="admin-modal" 
                        onClick={e => e.stopPropagation()}
                        style={{ 
                            maxWidth: '900px', 
                            background: '#1e293b', 
                            color: 'white', 
                            borderRadius: '16px',
                            border: '1px solid #334155'
                        }}
                    >
                        <div className="admin-modal-header" style={{ borderBottom: '1px solid #334155', background: '#0f172a' }}>
                            <h3 style={{ color: 'white', margin: 0 }}>Review Details: {selectedReview.customer_name}</h3>
                            <button className="close-btn" onClick={handleCloseViewModal} style={{ color: '#94a3b8' }}>&times;</button>
                        </div>
                        <div className="p-4">
                            <div className="row align-items-center">
                                {/* Video Column */}
                                <div className="col-md-5 mb-4 mb-md-0 d-flex justify-content-center">
                                    <div style={{
                                        width: '100%',
                                        maxWidth: '260px',
                                        aspectRatio: '9/16',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        background: '#000',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                        position: 'relative'
                                    }}>
                                        <video 
                                            src={selectedReview.video_url} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            controls
                                            autoPlay
                                        />
                                    </div>
                                </div>
                                {/* Info Column */}
                                <div className="col-md-7">
                                    <div style={{ background: '#0f172a', padding: '24px', borderRadius: '12px', height: '100%' }}>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h4 className="m-0" style={{ color: '#38bdf8', fontWeight: '700' }}>{selectedReview.customer_name}</h4>
                                                <span className="badge bg-primary mt-2" style={{ fontSize: '12px', padding: '6px 12px' }}>
                                                    <i className="fa-solid fa-tag me-1"></i> {selectedReview.trip_tag}
                                                </span>
                                            </div>
                                            <span style={{
                                                background: selectedReview.is_active !== false ? '#065f46' : '#991b1b',
                                                color: selectedReview.is_active !== false ? '#34d399' : '#f87171',
                                                padding: '6px 16px',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }}>
                                                {selectedReview.is_active !== false ? 'ACTIVE ON HOMEPAGE' : 'HIDDEN'}
                                            </span>
                                        </div>
                                        <hr style={{ borderColor: '#334155' }} />
                                        <h6 style={{ color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Written Review / Story</h6>
                                        <p style={{ 
                                            fontSize: '14px', 
                                            lineHeight: '1.6', 
                                            color: '#cbd5e1', 
                                            whiteSpace: 'pre-line',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            margin: 0
                                        }}>
                                            {selectedReview.review_text || <span className="text-muted italic">No written review text provided.</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerReviewsAdmin;
