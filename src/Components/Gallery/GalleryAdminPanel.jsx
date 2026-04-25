import React, { useState, useEffect } from 'react';
import {
    fetchAllGalleryImages,
    createGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    toggleGalleryImageActive,
    uploadGalleryFile,
    deleteGalleryFile,
    getGalleryImageSrc
} from '../../services/instagramGalleryService';
import { useDataTable } from '../../hooks/useDataTable';
import AdminPagination from '../Admin/AdminPagination';
import '../Destination/AdminStyles.css';

function GalleryAdminPanel() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');

    const [formData, setFormData] = useState({
        id: null,
        image_url: '',
        instagram_link: '',
        caption: '',
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
    } = useDataTable(images, ['caption']);

    useEffect(() => {
        loadImages();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const loadImages = async () => {
        try {
            setLoading(true);
            const data = await fetchAllGalleryImages();
            setImages(data);
        } catch (err) {
            console.error('Failed to load gallery images', err);
            setError('Failed to load gallery images');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode = 'add', image = null) => {
        setModalMode(mode);
        if (mode === 'edit' && image) {
            setFormData({
                id: image.id,
                image_url: image.image_url || '',
                instagram_link: image.instagram_link || '',
                caption: image.caption || '',
                display_order: image.display_order || 0,
                is_active: image.is_active !== false
            });
        } else {
            setFormData({
                id: null,
                image_url: '',
                instagram_link: '',
                caption: '',
                display_order: images.length,
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
                finalImageUrl = await uploadGalleryFile(imageFile);
                // Delete old image if editing
                if (modalMode === 'edit' && formData.image_url) {
                    await deleteGalleryFile(formData.image_url);
                }
            }

            const dataToSave = {
                image_url: finalImageUrl,
                instagram_link: formData.instagram_link,
                caption: formData.caption,
                display_order: parseInt(formData.display_order) || 0,
                is_active: formData.is_active
            };

            if (modalMode === 'add') {
                await createGalleryImage(dataToSave);
                showToast('Gallery image added successfully!');
            } else {
                await updateGalleryImage(formData.id, dataToSave);
                showToast('Gallery image updated successfully!');
            }

            handleCloseModal();
            loadImages();
        } catch (err) {
            console.error('Submission failed', err);
            showToast('Failed to save gallery image.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, imageUrl) => {
        if (!window.confirm('Are you sure you want to delete this gallery image?')) return;
        try {
            await deleteGalleryImage(id);
            if (imageUrl) await deleteGalleryFile(imageUrl);
            showToast('Gallery image deleted successfully!');
            loadImages();
        } catch (err) {
            console.error('Delete failed', err);
            showToast('Failed to delete gallery image.', 'error');
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            await toggleGalleryImageActive(id, !currentStatus);
            showToast(`Image ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
            loadImages();
        } catch (err) {
            console.error('Toggle failed', err);
            showToast('Failed to toggle image status.', 'error');
        }
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
                    <h2 className="m-0">Instagram Gallery</h2>
                    <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.9rem' }}>
                        Manage gallery images displayed on the About page
                    </p>
                </div>
                <div className="d-flex gap-3 align-items-center">
                    <div className="position-relative">
                        <i className="fa-solid fa-search position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                        <input 
                            type="text" 
                            placeholder="Search caption..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control ps-5"
                            style={{ minWidth: '250px', borderRadius: '8px' }}
                        />
                    </div>
                    <button className="th-btn m-0" onClick={() => handleOpenModal('add')}>
                        <i className="fa-solid fa-plus me-2"></i> Add Image
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
                                <th style={{ width: '80px' }}>Preview</th>
                                <th>Caption</th>
                                <th>Instagram Link</th>
                                <th style={{ width: '80px' }}>Order</th>
                                <th style={{ width: '80px' }}>Status</th>
                                <th style={{ width: '180px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        {searchTerm ? 'No gallery images found matching your search.' : 'No gallery images found. Click "Add Image" to get started.'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map(img => (
                                    <tr key={img.id}>
                                        <td>
                                            <div className="admin-img-thumb truncate-img">
                                                <img src={getGalleryImageSrc(img.image_url)} alt={img.caption || 'Gallery'} />
                                            </div>
                                        </td>
                                        <td><strong>{img.caption || '—'}</strong></td>
                                        <td>
                                            {img.instagram_link ? (
                                                <a href={img.instagram_link} target="_blank" rel="noopener noreferrer" style={{ color: '#E1306C', textDecoration: 'none', fontSize: '0.85rem' }}>
                                                    <i className="fab fa-instagram me-1"></i> View Post
                                                </a>
                                            ) : (
                                                <span style={{ color: '#94a3b8' }}>—</span>
                                            )}
                                        </td>
                                        <td>
                                            <span style={{
                                                background: '#f1f5f9',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontWeight: '600',
                                                fontSize: '0.85rem'
                                            }}>
                                                {img.display_order}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleToggleActive(img.id, img.is_active)}
                                                style={{
                                                    background: img.is_active ? '#dcfce7' : '#fee2e2',
                                                    color: img.is_active ? '#16a34a' : '#dc2626',
                                                    border: 'none',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontWeight: '600',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {img.is_active ? 'Active' : 'Hidden'}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="btn-edit" onClick={() => handleOpenModal('edit', img)}>
                                                    <i className="fa-solid fa-pen"></i> Edit
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(img.id, img.image_url)}>
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
                    <div className="admin-modal" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="admin-modal-header sticky-top bg-white z-1">
                            <h3>{modalMode === 'add' ? 'Add Gallery Image' : 'Edit Gallery Image'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form px-4 pb-4">

                            {/* Image Upload */}
                            <div className="form-group mb-4 mt-3">
                                <label className="fw-bold mb-2">Gallery Image *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="form-control"
                                    required={modalMode === 'add' && !formData.image_url}
                                />
                                {/* Preview */}
                                {(imagePreview || formData.image_url) && (
                                    <div style={{
                                        marginTop: '12px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: '1px solid #e2e8f0',
                                        maxWidth: '200px'
                                    }}>
                                        <img
                                            src={imagePreview || getGalleryImageSrc(formData.image_url)}
                                            alt="Preview"
                                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Caption */}
                            <div className="form-group mb-3">
                                <label className="fw-bold mb-2">Caption</label>
                                <input
                                    type="text"
                                    name="caption"
                                    value={formData.caption}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="e.g. Sunset in Bali 🌅"
                                />
                            </div>

                            {/* Instagram Link */}
                            <div className="form-group mb-3">
                                <label className="fw-bold mb-2">Instagram Post Link</label>
                                <input
                                    type="url"
                                    name="instagram_link"
                                    value={formData.instagram_link}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="https://www.instagram.com/p/..."
                                />
                                <small className="text-muted">Link to the original Instagram post (optional)</small>
                            </div>

                            {/* Display Order */}
                            <div className="row">
                                <div className="col-md-6 form-group mb-3">
                                    <label className="fw-bold mb-2">Display Order</label>
                                    <input
                                        type="number"
                                        name="display_order"
                                        value={formData.display_order}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        min="0"
                                    />
                                    <small className="text-muted">Lower numbers appear first</small>
                                </div>
                                <div className="col-md-6 form-group mb-3 d-flex align-items-end pb-2">
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
                                            {formData.is_active ? 'Active (Visible)' : 'Hidden'}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-modal-footer sticky-bottom bg-white pt-3 border-top mt-4 p-3">
                                <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="th-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : (modalMode === 'add' ? 'Add Image' : 'Update Image')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GalleryAdminPanel;
