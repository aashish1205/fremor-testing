import React, { useState, useEffect } from 'react';
import { 
    fetchCruises, 
    createCruise, 
    updateCruise, 
    deleteCruise, 
    uploadCruiseImage, 
    deleteCruiseImage, 
    uploadCruiseBrochure,
    deleteCruiseBrochure,
    getCruiseImageSrc 
} from '../../services/cruiseService';
import '../Destination/AdminStyles.css';

function CruiseAdminPanel() {
    const [cruises, setCruises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    
    // Form states
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        description: '',
        length: '50 m',
        capacity: '08',
        type: 'Catamaran',
        price_per_day: '',
        rating: 5.0,
        main_image: '',
        image_gallery: [],
        brochure_url: '',
        itinerary_ports: [{ day: "Day 1", port: "MUMBAI", arrival: "-", departure: "17:00" }],
        costs_list: [{ title: "Interior Standard – 02 Adults Twin sharing", fare: "INR 90532/-per cabin" }],
        important_notes: ['Cost per cabin including Port Charges, Fuel Surcharge, GST & Gratuity.']
    });
    
    const [primaryImageFile, setPrimaryImageFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [brochureFile, setBrochureFile] = useState(null);

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        loadCruises();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const loadCruises = async () => {
        try {
            setLoading(true);
            const data = await fetchCruises();
            setCruises(data);
        } catch (err) {
            console.error('Failed to load cruises', err);
            setError('Failed to load cruises');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode = 'add', cruise = null) => {
        setModalMode(mode);

        const parseArraySafe = (data, defaultReturn) => {
            if (!data) return defaultReturn;
            if (Array.isArray(data)) return data.length ? data : defaultReturn;
            if (typeof data === 'string') {
                try { 
                    const parsed = JSON.parse(data); 
                    return Array.isArray(parsed) && parsed.length ? parsed : defaultReturn;
                } catch(e) { return defaultReturn; }
            }
            return defaultReturn;
        };

        if (mode === 'edit' && cruise) {
            setFormData({
                id: cruise.id,
                title: cruise.title || '',
                description: cruise.description || '',
                length: cruise.length || '50 m',
                capacity: cruise.capacity || '08',
                type: cruise.type || 'Catamaran',
                price_per_day: cruise.price_per_day || '',
                rating: cruise.rating || 5.0,
                main_image: cruise.main_image || '',
                image_gallery: parseArraySafe(cruise.image_gallery, []),
                brochure_url: cruise.brochure_url || '',
                itinerary_ports: parseArraySafe(cruise.itinerary_ports, [{ day: "Day 1", port: "MUMBAI", arrival: "-", departure: "17:00" }]),
                costs_list: parseArraySafe(cruise.costs_list, [{ title: "Interior Standard", fare: "INR 90000" }]),
                important_notes: parseArraySafe(cruise.important_notes, ['Note 1'])
            });
        } else {
            setFormData({
                id: null,
                title: '',
                description: '',
                length: '50 m',
                capacity: '08',
                type: 'Catamaran',
                price_per_day: '',
                rating: 5.0,
                main_image: '',
                image_gallery: [],
                brochure_url: '',
                itinerary_ports: [{ day: "Day 1", port: "MUMBAI", arrival: "-", departure: "17:00" }],
                costs_list: [{ title: "Interior Standard – 02 Adults Twin sharing", fare: "INR 90532/-per cabin" }],
                important_notes: ['Cost per cabin including Port Charges, Fuel Surcharge, GST & Gratuity.']
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
    const handleItineraryChange = (index, field, value) => {
        const newItinerary = [...formData.itinerary_ports];
        newItinerary[index][field] = value;
        setFormData(prev => ({ ...prev, itinerary_ports: newItinerary }));
    };

    const addItineraryRow = () => {
        const nextDay = `Day ${formData.itinerary_ports.length + 1}`;
        setFormData(prev => ({ ...prev, itinerary_ports: [...prev.itinerary_ports, { day: nextDay, port: "", arrival: "-", departure: "-" }] }));
    };

    const removeItineraryRow = (index) => {
        const newItinerary = [...formData.itinerary_ports];
        newItinerary.splice(index, 1);
        if (newItinerary.length === 0) newItinerary.push({ day: "Day 1", port: "", arrival: "-", departure: "-" });
        setFormData(prev => ({ ...prev, itinerary_ports: newItinerary }));
    };

    // Cost Tier Handlers
    const handleCostChange = (index, field, value) => {
        const newCosts = [...formData.costs_list];
        newCosts[index][field] = value;
        setFormData(prev => ({ ...prev, costs_list: newCosts }));
    };

    const addCostRow = () => {
        setFormData(prev => ({ ...prev, costs_list: [...prev.costs_list, { title: "", fare: "" }] }));
    };

    const removeCostRow = (index) => {
        const newCosts = [...formData.costs_list];
        newCosts.splice(index, 1);
        if (newCosts.length === 0) newCosts.push({ title: "", fare: "" });
        setFormData(prev => ({ ...prev, costs_list: newCosts }));
    };

    const removeGalleryImage = (indexToRemove) => {
        const newGallery = formData.image_gallery.filter((_, index) => index !== indexToRemove);
        setFormData(prev => ({ ...prev, image_gallery: newGallery }));
    };

    const removePendingGalleryFile = (indexToRemove) => {
        setGalleryFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            let finalImage = formData.main_image;
            let currentGallery = [...formData.image_gallery];

            if (primaryImageFile) {
                finalImage = await uploadCruiseImage(primaryImageFile, 'cruises');
                if (modalMode === 'edit' && formData.main_image) {
                    await deleteCruiseImage(formData.main_image);
                }
            }

            // Upload multiple pending gallery files consecutively
            if (galleryFiles.length > 0) {
                for (let file of galleryFiles) {
                    const uploadedUrl = await uploadCruiseImage(file, 'cruises');
                    currentGallery.push(uploadedUrl);
                }
            }

            let numericPrice = parseFloat(formData.price_per_day.toString().replace(/[^0-9.]/g, ''));
            let numericRating = parseFloat(formData.rating) || 5.0;
            const cleanArray = arr => arr.filter(item => typeof item === 'string' ? item.trim() !== '' : true);

            const dataToSave = {
                title: formData.title,
                description: formData.description,
                length: formData.length,
                capacity: formData.capacity,
                type: formData.type,
                price_per_day: numericPrice || 0,
                rating: numericRating,
                main_image: finalImage,
                image_gallery: currentGallery,
                brochure_url: formData.brochure_url,
                itinerary_ports: formData.itinerary_ports,
                costs_list: formData.costs_list,
                important_notes: cleanArray(formData.important_notes)
            };

            // Handle brochure file upload
            if (brochureFile) {
                const brochureUrl = await uploadCruiseBrochure(brochureFile);
                if (modalMode === 'edit' && formData.brochure_url) {
                    await deleteCruiseBrochure(formData.brochure_url);
                }
                dataToSave.brochure_url = brochureUrl;
            }

            if (modalMode === 'add') {
                await createCruise(dataToSave);
                showToast('Cruise created successfully!');
            } else {
                await updateCruise(formData.id, dataToSave);
                showToast('Cruise updated successfully!');
            }

            handleCloseModal();
            loadCruises();
        } catch (err) {
            console.error('Submission failed', err);
            showToast('Failed to save cruise.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, imageUrl) => {
        if (!window.confirm('Are you sure you want to delete this cruise?')) return;
        try {
            await deleteCruise(id);
            if (imageUrl) await deleteCruiseImage(imageUrl);
            showToast('Cruise deleted successfully!');
            loadCruises();
        } catch (err) {
            console.error('Delete failed', err);
            showToast('Failed to delete cruise.', 'error');
        }
    };

    const renderListInput = (label, listName) => (
        <div className="form-group mb-4 border rounded p-3 bg-light">
            <label className="fw-bold d-block pb-2 mb-2 text-primary">{label}</label>
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
            <button type="button" className="btn btn-sm btn-outline-primary mt-2" onClick={() => addArrayItem(listName)}>
                <i className="fa-solid fa-plus mt-1"></i> Add Note
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

            <div className="admin-header">
                <h2>Manage Cruises</h2>
                <button className="th-btn" onClick={() => handleOpenModal('add')}>
                    <i className="fa-solid fa-plus me-2"></i> Add Cruise
                </button>
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
                                <th>Type</th>
                                <th>Starting Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cruises.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No cruises found.</td>
                                </tr>
                            ) : (
                                cruises.map(cruise => (
                                    <tr key={cruise.id}>
                                        <td>
                                            <div className="admin-img-thumb truncate-img">
                                                <img src={getCruiseImageSrc(cruise.main_image)} alt={cruise.title} />
                                            </div>
                                        </td>
                                        <td><strong>{cruise.title}</strong></td>
                                        <td>{cruise.type || '-'}</td>
                                        <td>₹{cruise.price_per_day}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="btn-edit" onClick={() => handleOpenModal('edit', cruise)}>
                                                    <i className="fa-solid fa-pen"></i> Edit
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(cruise.id, cruise.main_image)}>
                                                    <i className="fa-solid fa-trash"></i> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="admin-modal-header sticky-top bg-white z-1">
                            <h3>{modalMode === 'add' ? 'Add New Cruise' : 'Edit Cruise Data'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form px-4 pb-4">
                            
                            <h5 className="mt-2 text-primary border-bottom pb-2">Basic Information</h5>
                            <div className="row mt-3">
                                <div className="col-md-6 mb-3">
                                    <label>Cruise Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Type *</label>
                                    <input type="text" name="type" value={formData.type} onChange={handleInputChange} className="form-control" required placeholder="e.g. Catamaran" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Starting Price * (Numeric)</label>
                                    <input type="number" step="0.01" name="price_per_day" value={formData.price_per_day} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Length</label>
                                    <input type="text" name="length" value={formData.length} onChange={handleInputChange} className="form-control" placeholder="e.g. 50 m" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Capacity</label>
                                    <input type="text" name="capacity" value={formData.capacity} onChange={handleInputChange} className="form-control" placeholder="e.g. 08 Guests" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Rating</label>
                                    <input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control" rows="3"></textarea>
                                </div>
                            </div>
                            
                            <div className="form-group mb-4">
                                <label>Main Image</label>
                                <input type="file" accept="image/*" onChange={(e) => {
                                    if(e.target.files && e.target.files[0]) setPrimaryImageFile(e.target.files[0])
                                }} className="form-control" />
                                {formData.main_image && !primaryImageFile && (
                                    <small className="text-muted d-block mt-1">Current: {formData.main_image.substring(0, 40)}...</small>
                                )}
                            </div>

                            <div className="form-group mb-4 border rounded p-3 bg-light">
                                <label className="fw-bold">Gallery Images (Multiple)</label>
                                <input type="file" accept="image/*" multiple onChange={(e) => {
                                    if(e.target.files) setGalleryFiles(prev => [...prev, ...Array.from(e.target.files)])
                                }} className="form-control mb-3" />
                                
                                {formData.image_gallery && formData.image_gallery.length > 0 && (
                                    <div className="mb-2">
                                        <label className="small text-muted d-block">Existing Gallery (Click to remove)</label>
                                        <div className="d-flex flex-wrap gap-2 mt-1">
                                            {formData.image_gallery.map((img, i) => (
                                                <div key={i} className="position-relative" style={{ width: '60px', height: '60px' }}>
                                                    <img src={getCruiseImageSrc(img)} alt="gallery" className="w-100 h-100 object-fit-cover rounded border" />
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

                            <h5 className="mt-4 text-primary border-bottom pb-2">Cruise Itinerary</h5>
                            <div className="border rounded p-3 bg-light mb-4">
                                {formData.itinerary_ports.map((row, index) => (
                                    <div key={index} className="row g-2 mb-2 align-items-center">
                                        <div className="col-2">
                                            <input type="text" className="form-control form-control-sm" placeholder="Day 1" value={row.day} onChange={e => handleItineraryChange(index, 'day', e.target.value)} />
                                        </div>
                                        <div className="col-4">
                                            <input type="text" className="form-control form-control-sm" placeholder="Port e.g., MUMBAI" value={row.port} onChange={e => handleItineraryChange(index, 'port', e.target.value)} />
                                        </div>
                                        <div className="col-2">
                                            <input type="text" className="form-control form-control-sm" placeholder="Arrival e.g., 12:00" value={row.arrival} onChange={e => handleItineraryChange(index, 'arrival', e.target.value)} />
                                        </div>
                                        <div className="col-3">
                                            <input type="text" className="form-control form-control-sm" placeholder="Departure e.g., 20:00" value={row.departure} onChange={e => handleItineraryChange(index, 'departure', e.target.value)} />
                                        </div>
                                        <div className="col-1 text-end">
                                            <button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => removeItineraryRow(index)}>
                                                <i className="fa-solid fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-sm btn-outline-primary mt-2" onClick={addItineraryRow}>
                                    <i className="fa-solid fa-plus mt-1"></i> Add Itinerary Row
                                </button>
                            </div>

                            <h5 className="mt-4 text-primary border-bottom pb-2">Total Costs Breakdown</h5>
                            <div className="border rounded p-3 bg-light mb-4">
                                {formData.costs_list.map((row, index) => (
                                    <div key={index} className="row g-2 mb-2 align-items-center">
                                        <div className="col-7">
                                            <input type="text" className="form-control form-control-sm" placeholder="e.g. Interior Standard – 02 Adults" value={row.title} onChange={e => handleCostChange(index, 'title', e.target.value)} />
                                        </div>
                                        <div className="col-4">
                                            <input type="text" className="form-control form-control-sm" placeholder="e.g. INR 90532/-per cabin" value={row.fare} onChange={e => handleCostChange(index, 'fare', e.target.value)} />
                                        </div>
                                        <div className="col-1 text-end">
                                            <button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => removeCostRow(index)}>
                                                <i className="fa-solid fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-sm btn-outline-primary mt-2" onClick={addCostRow}>
                                    <i className="fa-solid fa-plus mt-1"></i> Add Cost Row
                                </button>
                            </div>

                            <h5 className="mt-4 text-primary border-bottom pb-2">Important Notes</h5>
                            {renderListInput('Important Notes (Bullet Points)', 'important_notes')}

                            <h5 className="mt-4 text-primary border-bottom pb-2">Package Brochure (PDF)</h5>
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
                                    {isSubmitting ? 'Saving...' : 'Save Cruise'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CruiseAdminPanel;
