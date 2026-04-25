import React, { useState, useEffect } from 'react';
import { 
    fetchTours, 
    createTour, 
    updateTour, 
    deleteTour, 
    uploadTourImage, 
    deleteTourImage, 
    getTourImageSrc 
} from '../../services/tourService';
import { useDataTable } from '../../hooks/useDataTable';
import AdminPagination from '../Admin/AdminPagination';
import '../Destination/AdminStyles.css';

function TourAdminPanel() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    
    // Complex Form states
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        price: '',
        rating: 4.8,
        primary_image: '',
        gallery_images: [],
        description_1: '',
        description_2: '',
        highlights_text: '',
        highlights_list: [''], // Array of strings
        basic_info_text: '',
        included_list: [''], // Array of strings
        excluded_list: [''], // Array of strings
        itinerary: [{ day: "Day 01", activities: [''] }] // Array of objects containing array of strings
    });
    
    const [primaryImageFile, setPrimaryImageFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);

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
    } = useDataTable(tours, ['title', 'price']);

    useEffect(() => {
        loadTours();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const loadTours = async () => {
        try {
            setLoading(true);
            const data = await fetchTours();
            setTours(data);
        } catch (err) {
            console.error('Failed to load tours', err);
            setError('Failed to load tours');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode = 'add', tour = null) => {
        setModalMode(mode);
        if (mode === 'edit' && tour) {
            setFormData({
                id: tour.id,
                title: tour.title || '',
                price: tour.price || '',
                rating: tour.rating || 4.8,
                primary_image: tour.primary_image || '',
                gallery_images: tour.gallery_images || [],
                description_1: tour.description_1 || '',
                description_2: tour.description_2 || '',
                highlights_text: tour.highlights_text || '',
                highlights_list: tour.highlights_list?.length ? tour.highlights_list : [''],
                basic_info_text: tour.basic_info_text || '',
                included_list: tour.included_list?.length ? tour.included_list : [''],
                excluded_list: tour.excluded_list?.length ? tour.excluded_list : [''],
                itinerary: tour.itinerary?.length ? tour.itinerary : [{ day: "Day 01", activities: [''] }]
            });
        } else {
            setFormData({
                id: null,
                title: '',
                price: '',
                rating: 4.8,
                primary_image: '',
                gallery_images: [],
                description_1: '',
                description_2: '',
                highlights_text: '',
                highlights_list: [''],
                basic_info_text: '',
                included_list: [''],
                excluded_list: [''],
                itinerary: [{ day: "Day 01", activities: [''] }]
            });
        }
        setPrimaryImageFile(null);
        setGalleryFiles([]);
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
            itinerary: [...prev.itinerary, { day: newDayName, activities: [''] }] 
        }));
    };

    const removeItineraryDay = (dayIndex) => {
        const newItinerary = [...formData.itinerary];
        newItinerary.splice(dayIndex, 1);
        if (newItinerary.length === 0) newItinerary.push({ day: "Day 01", activities: [''] });
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
            let finalImage = formData.primary_image;
            let currentGallery = [...formData.gallery_images];

            if (primaryImageFile) {
                finalImage = await uploadTourImage(primaryImageFile, 'tours');
                if (modalMode === 'edit' && formData.primary_image) {
                    await deleteTourImage(formData.primary_image);
                }
            }

            // Upload multiple pending gallery files consecutively
            if (galleryFiles.length > 0) {
                for (let file of galleryFiles) {
                    const uploadedUrl = await uploadTourImage(file, 'tours');
                    currentGallery.push(uploadedUrl);
                }
            }

            let numericPrice = parseFloat(formData.price.toString().replace(/[^0-9.]/g, ''));
            let numericRating = parseFloat(formData.rating) || 4.8;

            // Clean out empty strings from arrays
            const cleanArray = arr => arr.filter(item => item.trim() !== '');
            
            const cleanItinerary = formData.itinerary.map(day => ({
                day: day.day,
                activities: cleanArray(day.activities)
            })).filter(day => day.day.trim() !== '');

            const dataToSave = {
                title: formData.title,
                price: numericPrice || 0,
                rating: numericRating,
                primary_image: finalImage,
                gallery_images: currentGallery,
                description_1: formData.description_1,
                description_2: formData.description_2,
                highlights_text: formData.highlights_text,
                highlights_list: cleanArray(formData.highlights_list),
                basic_info_text: formData.basic_info_text,
                included_list: cleanArray(formData.included_list),
                excluded_list: cleanArray(formData.excluded_list),
                itinerary: cleanItinerary
            };

            if (modalMode === 'add') {
                await createTour(dataToSave);
                showToast('Tour created successfully!');
            } else {
                await updateTour(formData.id, dataToSave);
                showToast('Tour updated successfully!');
            }

            handleCloseModal();
            loadTours();
        } catch (err) {
            console.error('Submission failed', err);
            showToast('Failed to save tour.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, imageUrl) => {
        if (!window.confirm('Are you sure you want to delete this tour?')) return;
        
        try {
            await deleteTour(id);
            if (imageUrl) await deleteTourImage(imageUrl);
            showToast('Tour deleted successfully!');
            loadTours();
        } catch (err) {
            console.error('Delete failed', err);
            showToast('Failed to delete tour.', 'error');
        }
    };

    // Helper widget to render simple list input dynamically
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
                        placeholder="List item..."
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
                <h2 className="m-0">Manage Advanced Tours</h2>
                <div className="d-flex gap-3 align-items-center">
                    <div className="position-relative">
                        <i className="fa-solid fa-search position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                        <input 
                            type="text" 
                            placeholder="Search tours..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control ps-5"
                            style={{ minWidth: '250px', borderRadius: '8px' }}
                        />
                    </div>
                    <button className="th-btn m-0" onClick={() => handleOpenModal('add')}>
                        <i className="fa-solid fa-plus me-2"></i> Add Tour
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
                                <th>Tour Title</th>
                                <th>Price</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        {searchTerm ? 'No tours found matching your search.' : 'No tours found.'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map(tour => (
                                    <tr key={tour.id}>
                                        <td>
                                            <div className="admin-img-thumb truncate-img">
                                                <img src={getTourImageSrc(tour.primary_image)} alt={tour.title} />
                                            </div>
                                        </td>
                                        <td><strong>{tour.title}</strong></td>
                                        <td>₹{tour.price}</td>
                                        <td><i className="fa-solid fa-star text-warning me-1"></i>{tour.rating}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="btn-edit" onClick={() => handleOpenModal('edit', tour)}>
                                                    <i className="fa-solid fa-pen"></i> Edit
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(tour.id, tour.primary_image)}>
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
                            <h3>{modalMode === 'add' ? 'Add New Tour' : 'Edit Tour Data'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form px-4 pb-4">
                            
                            {/* BASIC INFO */}
                            <h5 className="mt-2 text-primary border-bottom pb-2">Basic Information</h5>
                            <div className="row mt-3">
                                <div className="col-md-6 mb-3">
                                    <label>Tour Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label>Price * (Numeric)</label>
                                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label>Rating</label>
                                    <input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleInputChange} className="form-control" />
                                </div>
                            </div>
                            
                            <div className="form-group mb-4">
                                <label>Cover Image</label>
                                <input type="file" accept="image/*" onChange={(e) => {
                                    if(e.target.files && e.target.files[0]) setPrimaryImageFile(e.target.files[0])
                                }} className="form-control" />
                                {formData.primary_image && !primaryImageFile && (
                                    <small className="text-muted d-block mt-1">Current: {formData.primary_image.substring(0, 40)}...</small>
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
                                                    <img src={getTourImageSrc(img)} alt="gallery" className="w-100 h-100 object-fit-cover rounded border" />
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

                            {/* HIGHLIGHTS */}
                            <h5 className="mt-5 text-primary border-bottom pb-2">Highlights</h5>
                            <div className="form-group mb-3 mt-3">
                                <label>Highlights Intro text</label>
                                <textarea name="highlights_text" value={formData.highlights_text} onChange={handleInputChange} className="form-control" rows="2"></textarea>
                            </div>
                            {renderListInput('Highlights Bullet Points', 'highlights_list')}

                            {/* INCLUSIONS / EXCLUSIONS */}
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

                            {/* ITINERARY */}
                            <h5 className="mt-5 text-primary border-bottom pb-2 mb-3">Tour Itinerary</h5>
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


                            <div className="admin-modal-footer sticky-bottom bg-white pt-3 border-top mt-4 p-3">
                                <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="th-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Comprehensive Tour'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TourAdminPanel;
