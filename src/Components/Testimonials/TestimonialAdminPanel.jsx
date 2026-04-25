import React, { useState, useEffect } from 'react';
import {
    fetchAllTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonialActive,
    uploadTestimonialImage,
    deleteTestimonialImage,
    getTestimonialImageSrc
} from '../../services/testimonialService';
import { useDataTable } from '../../hooks/useDataTable';
import AdminPagination from '../Admin/AdminPagination';
import '../Destination/AdminStyles.css';

function TestimonialAdminPanel() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        designation: '',
        text: '',
        rating: 5,
        image_url: '',
        display_order: 0,
        is_active: true
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // DataTable hook
    const { 
        searchTerm, 
        handleSearch, 
        currentPage, 
        setCurrentPage, 
        totalPages, 
        paginatedData,
        totalItems
    } = useDataTable(testimonials, ['name', 'designation', 'text']);

    useEffect(() => {
        loadTestimonials();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const loadTestimonials = async () => {
        try {
            setLoading(true);
            const data = await fetchAllTestimonials();
            setTestimonials(data);
        } catch (err) {
            console.error('Failed to load testimonials', err);
            setError('Failed to load testimonials');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode = 'add', item = null) => {
        setModalMode(mode);
        if (mode === 'edit' && item) {
            setFormData({
                id: item.id,
                name: item.name || '',
                designation: item.designation || '',
                text: item.text || '',
                rating: item.rating || 5,
                image_url: item.image_url || '',
                display_order: item.display_order || 0,
                is_active: item.is_active !== false
            });
        } else {
            setFormData({
                id: null,
                name: '',
                designation: '',
                text: '',
                rating: 5,
                image_url: '',
                display_order: testimonials.length,
                is_active: true
            });
        }
        setImageFile(null);
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

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
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            let finalImageUrl = formData.image_url;

            if (imageFile) {
                finalImageUrl = await uploadTestimonialImage(imageFile);
                // Delete old image if editing
                if (modalMode === 'edit' && formData.image_url) {
                    await deleteTestimonialImage(formData.image_url);
                }
            }

            const dataToSave = {
                name: formData.name,
                designation: formData.designation,
                text: formData.text,
                rating: parseInt(formData.rating) || 5,
                image_url: finalImageUrl,
                display_order: parseInt(formData.display_order) || 0,
                is_active: formData.is_active
            };

            if (modalMode === 'add') {
                await createTestimonial(dataToSave);
                showToast('Testimonial added successfully!');
            } else {
                await updateTestimonial(formData.id, dataToSave);
                showToast('Testimonial updated successfully!');
            }

            handleCloseModal();
            loadTestimonials();
        } catch (err) {
            console.error('Submission failed', err);
            showToast('Failed to save testimonial.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, imageUrl) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
        try {
            await deleteTestimonial(id);
            if (imageUrl) await deleteTestimonialImage(imageUrl);
            showToast('Testimonial deleted successfully!');
            loadTestimonials();
        } catch (err) {
            console.error('Delete failed', err);
            showToast('Failed to delete testimonial.', 'error');
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            await toggleTestimonialActive(id, !currentStatus);
            showToast(`Testimonial ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
            loadTestimonials();
        } catch (err) {
            console.error('Toggle failed', err);
            showToast('Failed to toggle testimonial status.', 'error');
        }
    };

    // Helper to render stars
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <i key={i} className="fa-solid fa-star" style={{ color: i < rating ? '#FFB114' : '#e2e8f0', fontSize: '0.8rem' }} />
        ));
    };

    return (
        <div className="admin-panel-container">
            {toast.show && (
                <div className={`admin-toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}

            <div className="admin-header d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                    <h2 className="m-0">Testimonials</h2>
                    <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.9rem' }}>
                        Manage client reviews displayed on the home page
                    </p>
                </div>
                <div className="d-flex gap-3 align-items-center">
                    <div className="position-relative">
                        <i className="fa-solid fa-search position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                        <input 
                            type="text" 
                            placeholder="Search reviews..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control ps-5"
                            style={{ minWidth: '250px', borderRadius: '8px' }}
                        />
                    </div>
                    <button className="th-btn m-0" onClick={() => handleOpenModal('add')}>
                        <i className="fa-solid fa-plus me-2"></i> Add Testimonial
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="admin-loading">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : error ? (
                <div className="admin-error">{error}</div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>Profile</th>
                                <th>Name / Designation</th>
                                <th>Review</th>
                                <th style={{ width: '100px' }}>Rating</th>
                                <th style={{ width: '80px' }}>Order</th>
                                <th style={{ width: '80px' }}>Status</th>
                                <th style={{ width: '180px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        {searchTerm ? 'No testimonials found matching your search.' : 'No testimonials found. Click "Add Testimonial" to get started.'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="admin-img-thumb" style={{ borderRadius: '50%' }}>
                                                <img src={getTestimonialImageSrc(item.image_url)} alt={item.name} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                                            </div>
                                        </td>
                                        <td>
                                            <strong>{item.name}</strong>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.designation}</div>
                                        </td>
                                        <td>
                                            <div style={{
                                                maxWidth: '250px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                fontSize: '0.85rem',
                                                color: '#475569'
                                            }}>
                                                {item.text}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                {renderStars(item.rating)}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                background: '#f1f5f9',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontWeight: '600',
                                                fontSize: '0.85rem'
                                            }}>
                                                {item.display_order}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleToggleActive(item.id, item.is_active)}
                                                style={{
                                                    background: item.is_active ? '#dcfce7' : '#fee2e2',
                                                    color: item.is_active ? '#16a34a' : '#dc2626',
                                                    border: 'none',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontWeight: '600',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {item.is_active ? 'Active' : 'Hidden'}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="btn-edit" onClick={() => handleOpenModal('edit', item)}>
                                                    <i className="fa-solid fa-pen"></i> Edit
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(item.id, item.image_url)}>
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

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="admin-modal-header sticky-top bg-white z-1">
                            <h3>{modalMode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form px-4 pb-4">

                            {/* Image Upload */}
                            <div className="form-group mb-4 mt-3">
                                <label className="fw-bold mb-2">Profile Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="form-control"
                                />
                                {/* Preview */}
                                {(imagePreview || formData.image_url) && (
                                    <div style={{
                                        marginTop: '12px',
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        border: '2px solid #e2e8f0',
                                    }}>
                                        <img
                                            src={imagePreview || getTestimonialImageSrc(formData.image_url)}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                                <small className="text-muted d-block mt-1">Recommended size: 150x150 pixels (Square)</small>
                            </div>

                            <div className="row">
                                {/* Name */}
                                <div className="col-md-6 form-group mb-3">
                                    <label className="fw-bold mb-2">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="e.g. Maria Doe"
                                        required
                                    />
                                </div>
                                {/* Designation */}
                                <div className="col-md-6 form-group mb-3">
                                    <label className="fw-bold mb-2">Designation / Subtitle</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="e.g. Traveller"
                                    />
                                </div>
                            </div>

                            {/* Review Text */}
                            <div className="form-group mb-3">
                                <label className="fw-bold mb-2">Review Text *</label>
                                <textarea
                                    name="text"
                                    value={formData.text}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    rows="4"
                                    placeholder="Write the testimonial text here..."
                                    required
                                />
                            </div>

                            <div className="row">
                                {/* Rating */}
                                <div className="col-md-4 form-group mb-3">
                                    <label className="fw-bold mb-2">Rating (1-5) *</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        min="1"
                                        max="5"
                                        required
                                    />
                                </div>

                                {/* Display Order */}
                                <div className="col-md-4 form-group mb-3">
                                    <label className="fw-bold mb-2">Display Order</label>
                                    <input
                                        type="number"
                                        name="display_order"
                                        value={formData.display_order}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        min="0"
                                    />
                                </div>

                                {/* Active Toggle */}
                                <div className="col-md-4 form-group mb-3 d-flex align-items-end pb-2">
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleInputChange}
                                            id="activeSwitch"
                                            style={{ width: '3rem', height: '1.5rem' }}
                                        />
                                        <label className="form-check-label ms-2 fw-bold" htmlFor="activeSwitch">
                                            {formData.is_active ? 'Active' : 'Hidden'}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-modal-footer sticky-bottom bg-white pt-3 border-top mt-4 p-3">
                                <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="th-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : (modalMode === 'add' ? 'Add Testimonial' : 'Update Testimonial')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TestimonialAdminPanel;
