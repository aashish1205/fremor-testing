import React, { useState, useEffect } from 'react';
import { 
    fetchVisas, 
    createVisa, 
    updateVisa, 
    deleteVisa, 
    uploadImage, 
    deleteImage, 
    getImageSrc 
} from '../../services/visaService';
import { useDataTable } from '../../hooks/useDataTable';
import { useAdminSearch } from '../AdminSearchContext';
import AdminPagination from '../Admin/AdminPagination';
import '../Destination/AdminStyles.css';

function VisaAdminPanel() {
    const [visas, setVisas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    
    // Form states
    const [formData, setFormData] = useState({
        id: null,
        country_name: '',
        country_code: '',
        flag_url: '',
        visa_type: 'E-VISA',
        price: '',
        service_fee: '',
        processing_time_text: '',
        processing_days_max: '',
        processing_type: 'working_days',
        visas_processed: '10k+',
        landmark_image: '',
        documents: [''],
        important_info: [{ title: '', desc: '' }],
        faqs: [{ category: 'Important Information', q: '', a: '' }],
        is_featured: false
    });
    
    const [primaryImageFile, setPrimaryImageFile] = useState(null);

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const { globalSearchTerm, setGlobalSearchTerm } = useAdminSearch();

    // DataTable hook
    const { 
        searchTerm, 
        handleSearch, 
        currentPage, 
        setCurrentPage, 
        totalPages, 
        paginatedData,
        totalItems
    } = useDataTable(visas, ['country_name', 'visa_type', 'processing_time_text'], 10, globalSearchTerm, setGlobalSearchTerm);

    useEffect(() => {
        loadVisas();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const loadVisas = async () => {
        try {
            setLoading(true);
            const data = await fetchVisas();
            setVisas(data);
        } catch (err) {
            console.error('Failed to load visas', err);
            setError('Failed to load visas');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode = 'add', visa = null) => {
        setModalMode(mode);
        if (mode === 'edit' && visa) {
            // Normalize FAQs to array of objects with category
            let formattedFaqs = [];
            if (Array.isArray(visa.faqs)) {
                formattedFaqs = visa.faqs;
            } else if (visa.faqs && typeof visa.faqs === 'object') {
                // Handle legacy object of arrays format
                Object.keys(visa.faqs).forEach(cat => {
                    if (Array.isArray(visa.faqs[cat])) {
                        visa.faqs[cat].forEach(item => {
                            formattedFaqs.push({
                                category: cat,
                                q: item.q || '',
                                a: item.a || ''
                            });
                        });
                    }
                });
            }
            if (formattedFaqs.length === 0) {
                formattedFaqs = [{ category: 'Important Information', q: '', a: '' }];
            }

            setFormData({
                id: visa.id,
                country_name: visa.country_name || '',
                country_code: visa.country_code || '',
                flag_url: visa.flag_url || '',
                visa_type: visa.visa_type || 'E-VISA',
                price: visa.price || 0,
                service_fee: visa.service_fee || 0,
                processing_time_text: visa.processing_time_text || '',
                processing_days_max: visa.processing_days_max || 0,
                processing_type: visa.processing_type || 'working_days',
                visas_processed: visa.visas_processed || '10k+',
                landmark_image: visa.landmark_image || '',
                documents: visa.documents?.length ? visa.documents : [''],
                important_info: visa.important_info?.length ? visa.important_info : [{ title: '', desc: '' }],
                faqs: formattedFaqs,
                is_featured: visa.is_featured || false
            });
        } else {
            setFormData({
                id: null,
                country_name: '',
                country_code: '',
                flag_url: '',
                visa_type: 'E-VISA',
                price: '',
                service_fee: '',
                processing_time_text: '',
                processing_days_max: '',
                processing_type: 'working_days',
                visas_processed: '10k+',
                landmark_image: '',
                documents: [''],
                important_info: [{ title: '', desc: '' }],
                faqs: [{ category: 'Important Information', q: '', a: '' }],
                is_featured: false
            });
        }
        setPrimaryImageFile(null);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            let finalImage = formData.landmark_image;

            if (primaryImageFile) {
                finalImage = await uploadImage(primaryImageFile, 'visa');
                if (modalMode === 'edit' && formData.landmark_image) {
                    await deleteImage(formData.landmark_image);
                }
            }

            let numericPrice = parseFloat(formData.price.toString().replace(/[^0-9.]/g, ''));
            let numericServiceFee = parseFloat(formData.service_fee.toString().replace(/[^0-9.]/g, ''));
            let numericDaysMax = parseInt(formData.processing_days_max) || 0;

            // Auto assign flag URL if empty and code is provided
            let flagUrl = formData.flag_url;
            if (!flagUrl && formData.country_code) {
                flagUrl = `https://flagcdn.com/w40/${formData.country_code.toLowerCase().trim()}.png`;
            }

            const dataToSave = {
                country_name: formData.country_name.trim(),
                country_code: formData.country_code.toLowerCase().trim(),
                flag_url: flagUrl.trim(),
                visa_type: formData.visa_type,
                price: numericPrice || 0,
                service_fee: numericServiceFee || 0,
                processing_time_text: formData.processing_time_text.trim(),
                processing_days_max: numericDaysMax,
                processing_type: formData.processing_type,
                visas_processed: formData.visas_processed,
                landmark_image: finalImage,
                is_featured: formData.is_featured
            };

            if (modalMode === 'add') {
                await createVisa(dataToSave);
                showToast('Visa country record created successfully!');
            } else {
                await updateVisa(formData.id, dataToSave);
                showToast('Visa country record updated successfully!');
            }

            handleCloseModal();
            loadVisas();
        } catch (err) {
            console.error('Submission failed', err);
            showToast('Failed to save visa record.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, imageUrl) => {
        if (!window.confirm('Are you sure you want to delete this visa country record?')) return;
        try {
            await deleteVisa(id);
            if (imageUrl) await deleteImage(imageUrl);
            showToast('Visa country record deleted successfully!');
            loadVisas();
        } catch (err) {
            console.error('Delete failed', err);
            showToast('Failed to delete visa record.', 'error');
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
                <h2 className="m-0">Manage Visas & Date Algorithms</h2>
                <div className="d-flex gap-3 align-items-center">
                    <div className="position-relative">
                        <i className="fa-solid fa-search position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                        <input 
                            type="text" 
                            placeholder="Search visas..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control ps-5"
                            style={{ minWidth: '250px', borderRadius: '8px' }}
                        />
                    </div>
                    <button className="th-btn m-0" onClick={() => handleOpenModal('add')}>
                        <i className="fa-solid fa-plus me-2"></i> Add Country Visa
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
                                <th>Flag</th>
                                <th>Country Name</th>
                                <th>Visa Type</th>
                                <th>Processing Time</th>
                                <th>Algorithm Limit</th>
                                <th>Price (Base + Service)</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-muted">
                                        {searchTerm ? 'No visas found matching your search.' : 'No visa records found.'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map(v => (
                                    <tr key={v.id}>
                                        <td>
                                            <img src={v.flag_url} alt="" style={{ width: '32px', height: 'auto', border: '1px solid #ddd', borderRadius: '3px' }} />
                                        </td>
                                        <td><strong>{v.country_name}</strong></td>
                                        <td>
                                            <span className="badge bg-secondary">{v.visa_type}</span>
                                        </td>
                                        <td>{v.processing_time_text}</td>
                                        <td>
                                            <span style={{ fontWeight: '500' }}>
                                                {v.processing_type === 'interview' ? 'Interview Wait Time' : `${v.processing_days_max} ${v.processing_type.replace('_', ' ')}`}
                                            </span>
                                        </td>
                                        <td>₹{v.price} + ₹{v.service_fee}</td>
                                        <td>
                                            {v.is_featured ? (
                                                <span className="badge bg-success">Featured / Most Visited</span>
                                            ) : (
                                                <span className="badge bg-light text-dark">Standard</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="btn-edit" onClick={() => handleOpenModal('edit', v)}>
                                                    <i className="fa-solid fa-pen"></i> Edit
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(v.id, v.landmark_image)}>
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

            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="admin-modal-header sticky-top bg-white z-1">
                            <h3>{modalMode === 'add' ? 'Add New Visa Country Record' : 'Edit Visa Country Record'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form px-4 pb-4">
                            
                            <h5 className="mt-2 text-primary border-bottom pb-2">Basic Visa Information</h5>
                            <div className="row mt-3">
                                <div className="col-md-6 mb-3">
                                    <label>Country Name *</label>
                                    <input type="text" name="country_name" value={formData.country_name} onChange={handleInputChange} className="form-control" required placeholder="e.g. Singapore" />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label>Country Code (2 char) *</label>
                                    <input type="text" name="country_code" value={formData.country_code} onChange={handleInputChange} className="form-control" required placeholder="e.g. sg" maxLength={5} />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label>Visa Type *</label>
                                    <input type="text" name="visa_type" value={formData.visa_type} onChange={handleInputChange} className="form-control" required placeholder="e.g. E-VISA" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Base Price * (INR)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Service Fee * (INR)</label>
                                    <input type="number" name="service_fee" value={formData.service_fee} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Processing Time Text *</label>
                                    <input type="text" name="processing_time_text" value={formData.processing_time_text} onChange={handleInputChange} className="form-control" required placeholder="e.g. 7 to 10 working days(approx)" />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label>Algorithm Limit (Days) *</label>
                                    <input type="number" name="processing_days_max" value={formData.processing_days_max} onChange={handleInputChange} className="form-control" required min={0} placeholder="e.g. 10" />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label>Algorithm Type *</label>
                                    <select name="processing_type" value={formData.processing_type} onChange={handleInputChange} className="form-control" required>
                                        <option value="working_days">Working Days (Skip Sat/Sun)</option>
                                        <option value="calendar_days">Calendar Days</option>
                                        <option value="interview">Interview Based (No calculation)</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Flag Image URL (Optional)</label>
                                    <input type="text" name="flag_url" value={formData.flag_url} onChange={handleInputChange} className="form-control" placeholder="https://flagcdn.com/w40/sg.png" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Visas Processed text</label>
                                    <input type="text" name="visas_processed" value={formData.visas_processed} onChange={handleInputChange} className="form-control" placeholder="e.g. 25k+ Visas Processed" />
                                </div>
                                <div className="col-md-6 mb-3 d-flex align-items-center">
                                    <div className="form-check mt-4">
                                        <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} className="form-check-input" id="is_featured" />
                                        <label className="form-check-label ms-2" htmlFor="is_featured">Show in "Most-Visited" Slider</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group mb-4 mt-2">
                                <label>Cover Landmark Image (Background)</label>
                                <input type="file" accept="image/*" onChange={(e) => {
                                    if(e.target.files && e.target.files[0]) setPrimaryImageFile(e.target.files[0])
                                }} className="form-control" />
                                {formData.landmark_image && !primaryImageFile && (
                                    <small className="text-muted d-block mt-1">Current: {formData.landmark_image.substring(0, 45)}...</small>
                                )}
                            </div>

                            <div className="admin-modal-footer sticky-bottom bg-white pt-3 border-top mt-4 p-3">
                                <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="th-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Visa details'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VisaAdminPanel;
