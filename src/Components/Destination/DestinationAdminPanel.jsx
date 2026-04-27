import React, { useState, useEffect } from 'react';
import { 
    fetchDestinations, 
    createDestination, 
    updateDestination, 
    deleteDestination, 
    uploadImage, 
    deleteImage, 
    uploadBrochure,
    deleteBrochure,
    getImageSrc 
} from '../../services/destinationService';
import { useDataTable } from '../../hooks/useDataTable';
import AdminPagination from '../Admin/AdminPagination';
import './AdminStyles.css';

function DestinationAdminPanel() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    
    // Complex Form states for rich destinations
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        price: '',
        price_unit: 'Person',
        duration: '7 Days',
        location: '',
        rating: 4.8,
        image: '',
        gallery_images: [],
        description_1: '',
        description_2: '',
        highlights_text: '',
        highlights_list: [''], // Array of strings
        basic_info_text: '',
        included_list: [''], // Array of strings
        excluded_list: [''], // Array of strings
        itinerary: [{ day: "Day 01", activities: [''], image: '' }], // Array of objects
        brochure_url: '',
        category: 'Inbound',
        package_type: 'Standard'
    });
    
    const [primaryImageFile, setPrimaryImageFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [brochureFile, setBrochureFile] = useState(null);

    // Toast state
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
    } = useDataTable(destinations, ['title', 'location', 'price']);

    useEffect(() => {
        loadDestinations();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const loadDestinations = async () => {
        try {
            setLoading(true);
            const data = await fetchDestinations();
            setDestinations(data);
        } catch (err) {
            console.error('Failed to load destinations', err);
            setError('Failed to load destinations');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode = 'add', dest = null) => {
        setModalMode(mode);
        if (mode === 'edit' && dest) {
            setFormData({
                id: dest.id,
                title: dest.title || '',
                price: dest.price || '',
                price_unit: dest.price_unit || 'Person',
                duration: dest.duration || '7 Days',
                location: dest.location || '',
                rating: dest.rating || 4.8,
                image: dest.image || '',
                gallery_images: dest.gallery_images || [],
                description_1: dest.description_1 || '',
                description_2: dest.description_2 || '',
                highlights_text: dest.highlights_text || '',
                highlights_list: dest.highlights_list?.length ? dest.highlights_list : [''],
                basic_info_text: dest.basic_info_text || '',
                included_list: dest.included_list?.length ? dest.included_list : [''],
                excluded_list: dest.excluded_list?.length ? dest.excluded_list : [''],
                itinerary: dest.itinerary?.length ? dest.itinerary : [{ day: "Day 01", activities: [''], image: '' }],
                brochure_url: dest.brochure_url || '',
                category: dest.category || 'Inbound',
                package_type: dest.package_type || 'Standard'
            });
        } else {
            setFormData({
                id: null,
                title: '',
                price: '',
                price_unit: 'Person',
                duration: '7 Days',
                location: '',
                rating: 4.8,
                image: '',
                gallery_images: [],
                description_1: '',
                description_2: '',
                highlights_text: '',
                highlights_list: [''],
                basic_info_text: '',
                included_list: [''],
                excluded_list: [''],
                itinerary: [{ day: "Day 01", activities: [''], image: '' }],
                brochure_url: '',
                category: 'Inbound',
                package_type: 'Standard'
            });
        }
        setPrimaryImageFile(null);
        setGalleryFiles([]);
        setBrochureFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Generic Array Handlers
    const handleArrayItemChange = (listName, index, value) => {
        const newList = [...formData[listName]];
        newList[index] = value;
        setFormData(prev => ({ ...prev, [listName]: newList }));
    };

    const addArrayItem = (listName) => {
        setFormData(prev => ({ ...prev, [listName]: [...prev[listName], ''] }));
    };

    const removeArrayItem = (listName, index) => {
        const newList = [...formData[listName]];
        newList.splice(index, 1);
        if (newList.length === 0) newList.push('');
        setFormData(prev => ({ ...prev, [listName]: newList }));
    };

    // Itinerary Handlers
    const handleItineraryDayChange = (dayIndex, field, value) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[dayIndex][field] = value;
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const handleItineraryActivityChange = (dayIndex, actIndex, value) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[dayIndex].activities[actIndex] = value;
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const addItineraryDay = () => {
        const dayCount = formData.itinerary.length + 1;
        const newDayName = `Day ${dayCount.toString().padStart(2, '0')}`;
        setFormData(prev => ({ 
            ...prev, 
            itinerary: [...prev.itinerary, { day: newDayName, activities: [''], image: '' }]  
        }));
    };

    const removeItineraryDay = (dayIndex) => {
        const newItinerary = [...formData.itinerary];
        newItinerary.splice(dayIndex, 1);
        if (newItinerary.length === 0) newItinerary.push({ day: "Day 01", activities: [''], image: '' });
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const addItineraryActivity = (dayIndex) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[dayIndex].activities.push('');
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const removeItineraryActivity = (dayIndex, actIndex) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[dayIndex].activities.splice(actIndex, 1);
        if (newItinerary[dayIndex].activities.length === 0) newItinerary[dayIndex].activities.push('');
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const removeGalleryImage = (indexToRemove) => {
        const newGallery = formData.gallery_images.filter((_, index) => index !== indexToRemove);
        setFormData(prev => ({ ...prev, gallery_images: newGallery }));
    };

    const removePendingGalleryFile = (indexToRemove) => {
        setGalleryFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            let finalImage = formData.image;
            let currentGallery = [...formData.gallery_images];

            if (primaryImageFile) {
                finalImage = await uploadImage(primaryImageFile, 'destination');
                if (modalMode === 'edit' && formData.image) {
                    await deleteImage(formData.image);
                }
            }

            // Upload multiple pending gallery files consecutively
            if (galleryFiles.length > 0) {
                for (let file of galleryFiles) {
                    const uploadedUrl = await uploadImage(file, 'destination');
                    currentGallery.push(uploadedUrl);
                }
            }

            let numericPrice = parseFloat(formData.price.toString().replace(/[^0-9.]/g, ''));
            let numericRating = parseFloat(formData.rating) || 4.8;

            const cleanArray = arr => arr.filter(item => item.trim() !== '');
            const cleanItinerary = [];
            for (let day of formData.itinerary) {
                if (day.day.trim() !== '') {
                    let finalDayImage = day.image || '';
                    if (day.pendingImageFile) {
                        finalDayImage = await uploadImage(day.pendingImageFile, 'destination');
                    }
                    cleanItinerary.push({
                        day: day.day,
                        activities: cleanArray(day.activities),
                        image: finalDayImage
                    });
                }
            }

            const dataToSave = {
                title: formData.title,
                price: numericPrice || 0,
                price_unit: formData.price_unit,
                duration: formData.duration,
                location: formData.location,
                rating: numericRating,
                image: finalImage,
                gallery_images: currentGallery,
                description_1: formData.description_1,
                description_2: formData.description_2,
                highlights_text: formData.highlights_text,
                highlights_list: cleanArray(formData.highlights_list),
                basic_info_text: formData.basic_info_text,
                included_list: cleanArray(formData.included_list),
                excluded_list: cleanArray(formData.excluded_list),
                itinerary: cleanItinerary,
                brochure_url: formData.brochure_url,
                category: formData.category,
                package_type: formData.package_type
            };

            // Handle brochure file upload
            if (brochureFile) {
                const brochureUrl = await uploadBrochure(brochureFile);
                if (modalMode === 'edit' && formData.brochure_url) {
                    await deleteBrochure(formData.brochure_url);
                }
                dataToSave.brochure_url = brochureUrl;
            }

            if (modalMode === 'add') {
                await createDestination(dataToSave);
                showToast('Rich Destination created successfully!');
            } else {
                await updateDestination(formData.id, dataToSave);
                showToast('Rich Destination updated successfully!');
            }

            handleCloseModal();
            loadDestinations();
        } catch (err) {
            console.error('Submission failed', err);
            showToast('Failed to save destination.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, imageUrl) => {
        if (!window.confirm('Are you sure you want to delete this destination?')) return;
        try {
            await deleteDestination(id);
            if (imageUrl) await deleteImage(imageUrl);
            showToast('Destination deleted successfully!');
            loadDestinations();
        } catch (err) {
            console.error('Delete failed', err);
            showToast('Failed to delete destination.', 'error');
        }
    };

    // Helper widget
    const renderListInput = (label, listName) => (
        <div className="form-group mb-4">
            <label className="fw-bold d-block border-bottom pb-2 mb-3 mt-4 text-primary">{label}</label>
            {formData[listName].map((item, index) => (
                <div key={index} className="input-group mb-2">
                    <input 
                        type="text" 
                        value={item} 
                        onChange={(e) => handleArrayItemChange(listName, index, e.target.value)} 
                        className="form-control"
                        placeholder={`${label} item...`}
                    />
                    <button type="button" className="btn btn-outline-danger" onClick={() => removeArrayItem(listName, index)}>
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addArrayItem(listName)}>
                <i className="fa-solid fa-plus"></i> Add Item
            </button>
        </div>
    );

    return (
        <div className="admin-panel-container">
            {toast.show && (
                <div className={`admin-toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}

            <div className="admin-header d-flex justify-content-between align-items-center flex-wrap gap-3">
                <h2 className="m-0">Manage Dynamic Destinations</h2>
                <div className="d-flex gap-3 align-items-center">
                    <div className="position-relative">
                        <i className="fa-solid fa-search position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                        <input 
                            type="text" 
                            placeholder="Search destinations..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control ps-5"
                            style={{ minWidth: '250px', borderRadius: '8px' }}
                        />
                    </div>
                    <button className="th-btn m-0" onClick={() => handleOpenModal('add')}>
                        <i className="fa-solid fa-plus me-2"></i> Add Destination
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
                                <th>Thumbnail</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Location</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        {searchTerm ? 'No destinations found matching your search.' : 'No destinations found.'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map(dest => (
                                    <tr key={dest.id}>
                                        <td>
                                            <div className="admin-img-thumb truncate-img">
                                                <img src={getImageSrc(dest.image)} alt={dest.title} />
                                            </div>
                                        </td>
                                        <td><strong>{dest.title}</strong></td>
                                        <td>
                                            <span style={{ fontWeight: '600', color: dest.category === 'Outbound' ? '#0d6efd' : '#198754' }}>
                                                {dest.category || 'Inbound'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${dest.package_type === 'Luxury' ? 'bg-warning text-dark' : dest.package_type === 'Premium' ? 'bg-info text-dark' : 'bg-secondary'}`}>
                                                {dest.package_type || 'Standard'}
                                            </span>
                                        </td>
                                        <td>{dest.location || '-'}</td>
                                        <td>₹{dest.price}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="btn-edit" onClick={() => handleOpenModal('edit', dest)}>
                                                    <i className="fa-solid fa-pen"></i> Edit
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(dest.id, dest.image)}>
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
                            <h3>{modalMode === 'add' ? 'Add New Destination' : 'Edit Rich Destination Data'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form px-4 pb-4">
                            
                            <h5 className="mt-2 text-primary border-bottom pb-2">Basic Information</h5>
                            <div className="row mt-3">
                                <div className="col-md-6 mb-3">
                                    <label>Destination Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Location *</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Price * (Numeric)</label>
                                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Tour Category *</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="form-control" required>
                                        <option value="Inbound">Inbound (India)</option>
                                        <option value="Outbound">Outbound (International)</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Package Type *</label>
                                    <select name="package_type" value={formData.package_type} onChange={handleInputChange} className="form-control" required>
                                        <option value="Standard">Standard Package</option>
                                        <option value="Premium">Premium Package</option>
                                        <option value="Luxury">Luxury Package</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Price Unit *(Person/Package)</label>
                                    <input type="text" name="price_unit" value={formData.price_unit} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Duration * (e.g. 7 Days)</label>
                                    <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Rating</label>
                                    <input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleInputChange} className="form-control" />
                                </div>
                            </div>
                            
                            <div className="form-group mb-4">
                                <label>Cover Image</label>
                                <input type="file" accept="image/*" onChange={(e) => {
                                    if(e.target.files && e.target.files[0]) setPrimaryImageFile(e.target.files[0])
                                }} className="form-control" />
                                {formData.image && !primaryImageFile && (
                                    <small className="text-muted d-block mt-1">Current: {formData.image.substring(0, 40)}...</small>
                                )}
                            </div>

                            <div className="form-group mb-4 border rounded p-3 bg-light">
                                <label className="fw-bold">Swiper Gallery Images (Multiple)</label>
                                <input type="file" accept="image/*" multiple onChange={(e) => {
                                    if(e.target.files) setGalleryFiles(prev => [...prev, ...Array.from(e.target.files)])
                                }} className="form-control mb-3" />
                                
                                {formData.gallery_images && formData.gallery_images.length > 0 && (
                                    <div className="mb-2">
                                        <label className="small text-muted d-block">Existing Gallery (Click to remove)</label>
                                        <div className="d-flex flex-wrap gap-2 mt-1">
                                            {formData.gallery_images.map((img, i) => (
                                                <div key={i} className="position-relative" style={{ width: '60px', height: '60px' }}>
                                                    <img src={getImageSrc(img)} alt="gallery" className="w-100 h-100 object-fit-cover rounded border" />
                                                    <button type="button" onClick={() => removeGalleryImage(i)} className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0" style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}>&times;</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {galleryFiles.length > 0 && (
                                    <div className="mt-3">
                                        <label className="small text-primary d-block">Pending Uploads ({galleryFiles.length} files)</label>
                                        <div className="d-flex flex-wrap gap-2 mt-1">
                                            {galleryFiles.map((file, i) => (
                                                <div key={i} className="badge bg-secondary p-2 d-flex align-items-center">
                                                    <span className="me-2 text-truncate" style={{maxWidth: '100px'}}>{file.name}</span>
                                                    <button type="button" className="btn-close btn-close-white" style={{fontSize: '10px'}} onClick={() => removePendingGalleryFile(i)}></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="form-group mb-3">
                                <label>Main Description Paragraph 1</label>
                                <textarea name="description_1" value={formData.description_1} onChange={handleInputChange} className="form-control" rows="3"></textarea>
                            </div>
                            <div className="form-group mb-4">
                                <label>Main Description Paragraph 2</label>
                                <textarea name="description_2" value={formData.description_2} onChange={handleInputChange} className="form-control" rows="3"></textarea>
                            </div>

                            <h5 className="mt-5 text-primary border-bottom pb-2">Highlights</h5>
                            <div className="form-group mb-3 mt-3">
                                <label>Highlights Intro text</label>
                                <textarea name="highlights_text" value={formData.highlights_text} onChange={handleInputChange} className="form-control" rows="2"></textarea>
                            </div>
                            {renderListInput('Highlights Bullet Points', 'highlights_list')}

                            <h5 className="mt-5 text-primary border-bottom pb-2">Inclusions & Exclusions</h5>
                            <div className="form-group mb-3 mt-3">
                                <label>Basic Info Summary text</label>
                                <textarea name="basic_info_text" value={formData.basic_info_text} onChange={handleInputChange} className="form-control" rows="2"></textarea>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    {renderListInput('Included Items', 'included_list')}
                                </div>
                                <div className="col-md-6">
                                    {renderListInput('Excluded Items', 'excluded_list')}
                                </div>
                            </div>

                            <h5 className="mt-5 text-primary border-bottom pb-2 mb-3">Destination Itinerary</h5>
                            {formData.itinerary.map((dayObj, dayIndex) => (
                                <div key={dayIndex} className="card mb-3 shadow-sm border-0 bg-light p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <input 
                                            type="text" 
                                            value={dayObj.day} 
                                            onChange={(e) => handleItineraryDayChange(dayIndex, 'day', e.target.value)} 
                                            className="form-control w-50 fw-bold border-0 bg-white"
                                            placeholder="Day Title e.g., Day 01"
                                        />
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeItineraryDay(dayIndex)}>
                                            Remove Day
                                        </button>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-muted small">Day Image</label>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="form-control form-control-sm"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    const newItinerary = [...formData.itinerary];
                                                    newItinerary[dayIndex].pendingImageFile = file;
                                                    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
                                                }
                                            }}
                                        />
                                        {dayObj.pendingImageFile && <small className="text-primary d-block mt-1">Pending: {dayObj.pendingImageFile.name}</small>}
                                        {!dayObj.pendingImageFile && dayObj.image && <small className="text-muted d-block mt-1">Current: {dayObj.image.substring(0, 30)}...</small>}
                                    </div>
                                    <div className="ps-3 border-start border-3 border-primary mt-2">
                                        <label className="text-muted small mb-2">Day Activities / Timeline</label>
                                        {dayObj.activities.map((act, actIndex) => (
                                            <div key={actIndex} className="input-group mb-2 input-group-sm">
                                                <input 
                                                    type="text" 
                                                    value={act} 
                                                    onChange={(e) => handleItineraryActivityChange(dayIndex, actIndex, e.target.value)} 
                                                    className="form-control bg-white"
                                                    placeholder="Activity description..."
                                                />
                                                <button type="button" className="btn btn-outline-secondary" onClick={() => removeItineraryActivity(dayIndex, actIndex)}>
                                                    <i className="fa-solid fa-minus"></i>
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" className="btn btn-sm btn-link text-decoration-none p-0 mt-1" onClick={() => addItineraryActivity(dayIndex)}>
                                            + Add Activity
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="btn btn-primary d-block w-100 mb-4" onClick={addItineraryDay}>
                                <i className="fa-solid fa-plus me-1"></i> Add New Itinerary Day
                            </button>

                            <h5 className="mt-2 text-primary border-bottom pb-2">Package Brochure (PDF)</h5>
                            <div className="form-group mb-4 mt-3">
                                <label>Upload Brochure PDF</label>
                                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => {
                                    if(e.target.files && e.target.files[0]) setBrochureFile(e.target.files[0])
                                }} className="form-control" />
                                {formData.brochure_url && !brochureFile && (
                                    <div className="mt-2 d-flex align-items-center gap-2">
                                        <i className="fa-solid fa-file-pdf text-danger" style={{fontSize: '20px'}}></i>
                                        <small className="text-muted">Current brochure uploaded</small>
                                        <a href={formData.brochure_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary ms-2">
                                            <i className="fa-solid fa-eye me-1"></i>View
                                        </a>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setFormData(prev => ({...prev, brochure_url: ''}))}>
                                            <i className="fa-solid fa-times me-1"></i>Remove
                                        </button>
                                    </div>
                                )}
                                {brochureFile && (
                                    <div className="mt-2 d-flex align-items-center gap-2">
                                        <i className="fa-solid fa-file-pdf text-primary" style={{fontSize: '20px'}}></i>
                                        <small className="text-primary">New: {brochureFile.name}</small>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setBrochureFile(null)}>
                                            <i className="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="admin-modal-footer sticky-bottom bg-white pt-3 border-top mt-4 p-3">
                                <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="th-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Comprehensive Record'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DestinationAdminPanel;
