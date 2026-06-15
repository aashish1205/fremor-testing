import React, { useState, useEffect } from 'react';
import { 
    fetchBlogs, 
    createBlog, 
    updateBlog, 
    deleteBlog, 
    uploadBlogImage, 
    deleteBlogImage, 
    getBlogImageSrc 
} from '../../services/blogService';
import { useDataTable } from '../../hooks/useDataTable';
import { useAdminSearch } from '../AdminSearchContext';
import AdminPagination from '../Admin/AdminPagination';
import '../Destination/AdminStyles.css';

function BlogAdminPanel() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        short_description: '',
        content: '',
        author: '',
        category: 'Travel',
        main_image: '',
        image_gallery: [],
        places_to_visit: [{ title: 'Example Place', description: 'Description of the place.' }],
        activities: [{ title: 'Example Activity', description: 'Description of the activity.' }],
        best_time: '',
        duration: '',
        budget: '',
        visa_info: '',
        tips: [''],
        highlights: [''],
        hidden_facts: [''],
        cities_info: [{ title: 'Example City', description: 'Description of the city.' }],
        story_title: '',
        story_content: '',
        story_image: '',
        is_popular_story: false
    });
    
    const [primaryImageFile, setPrimaryImageFile] = useState(null);
    const [storyImageFile, setStoryImageFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);

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
    } = useDataTable(blogs, ['title', 'category', 'author'], 10, globalSearchTerm, setGlobalSearchTerm);

    useEffect(() => {
        loadBlogs();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const loadBlogs = async () => {
        try {
            setLoading(true);
            const data = await fetchBlogs();
            setBlogs(data);
        } catch (err) {
            console.error('Failed to load blogs', err);
            setError('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode = 'add', blog = null) => {
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

        if (mode === 'edit' && blog) {
            setFormData({
                id: blog.id,
                title: blog.title || '',
                short_description: blog.short_description || '',
                content: blog.content || '',
                author: blog.author || '',
                category: blog.category || 'Travel',
                main_image: blog.main_image || '',
                image_gallery: parseArraySafe(blog.image_gallery, []),
                places_to_visit: parseArraySafe(blog.places_to_visit, [{ title: "Place 1", description: "Desc..." }]),
                activities: parseArraySafe(blog.activities, [{ title: "Activity 1", description: "Desc..." }]),
                best_time: blog.best_time || '',
                duration: blog.duration || '',
                budget: blog.budget || '',
                visa_info: blog.visa_info || '',
                tips: parseArraySafe(blog.tips, ['']),
                highlights: parseArraySafe(blog.highlights, ['']),
                hidden_facts: parseArraySafe(blog.hidden_facts, ['']),
                cities_info: parseArraySafe(blog.cities_info, [{ title: '', description: '' }]),
                story_title: blog.story_title || '',
                story_content: blog.story_content || '',
                story_image: blog.story_image || '',
                is_popular_story: blog.is_popular_story || false
            });
        } else {
            setFormData({
                id: null,
                title: '',
                short_description: '',
                content: '',
                author: '',
                category: 'Travel',
                main_image: '',
                image_gallery: [],
                places_to_visit: [{ title: '', description: '' }],
                activities: [{ title: '', description: '' }],
                best_time: '',
                duration: '',
                budget: '',
                visa_info: '',
                tips: [''],
                highlights: [''],
                hidden_facts: [''],
                cities_info: [{ title: '', description: '' }],
                story_title: '',
                story_content: '',
                story_image: '',
                is_popular_story: false
            });
        }
        setPrimaryImageFile(null);
        setStoryImageFile(null);
        setGalleryFiles([]);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTipChange = (index, value) => {
        const newTips = [...formData.tips];
        newTips[index] = value;
        setFormData(prev => ({ ...prev, tips: newTips }));
    };

    const addTip = () => {
        setFormData(prev => ({ ...prev, tips: [...prev.tips, ''] }));
    };

    const removeTip = (index) => {
        const newTips = formData.tips.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, tips: newTips.length ? newTips : [''] }));
    };

    const handleHighlightChange = (index, value) => {
        const newHighlights = [...formData.highlights];
        newHighlights[index] = value;
        setFormData(prev => ({ ...prev, highlights: newHighlights }));
    };

    const addHighlight = () => {
        setFormData(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));
    };

    const removeHighlight = (index) => {
        const newHighlights = formData.highlights.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, highlights: newHighlights.length ? newHighlights : [''] }));
    };

    const handleHiddenFactChange = (index, value) => {
        const newFacts = [...formData.hidden_facts];
        newFacts[index] = value;
        setFormData(prev => ({ ...prev, hidden_facts: newFacts }));
    };

    const addHiddenFact = () => {
        setFormData(prev => ({ ...prev, hidden_facts: [...prev.hidden_facts, ''] }));
    };

    const removeHiddenFact = (index) => {
        const newFacts = formData.hidden_facts.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, hidden_facts: newFacts.length ? newFacts : [''] }));
    };

    const handleStructuredArrayChange = (listName, index, field, value) => {
        const newList = [...formData[listName]];
        newList[index][field] = value;
        setFormData(prev => ({ ...prev, [listName]: newList }));
    };

    const addStructuredItem = (listName) => {
        setFormData(prev => ({ ...prev, [listName]: [...prev[listName], { title: '', description: '' }] }));
    };

    const removeStructuredItem = (listName, index) => {
        const newList = [...formData[listName]];
        newList.splice(index, 1);
        if (newList.length === 0) newList.push({ title: '', description: '' });
        setFormData(prev => ({ ...prev, [listName]: newList }));
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
            let finalStoryImage = formData.story_image;
            let currentGallery = [...formData.image_gallery];

            if (primaryImageFile) {
                finalImage = await uploadBlogImage(primaryImageFile, 'blogs');
                if (modalMode === 'edit' && formData.main_image) {
                    await deleteBlogImage(formData.main_image);
                }
            }

            if (storyImageFile) {
                finalStoryImage = await uploadBlogImage(storyImageFile, 'blogs');
                if (modalMode === 'edit' && formData.story_image) {
                    await deleteBlogImage(formData.story_image);
                }
            }

            if (galleryFiles.length > 0) {
                for (let file of galleryFiles) {
                    const uploadedUrl = await uploadBlogImage(file, 'blogs');
                    currentGallery.push(uploadedUrl);
                }
            }

            const cleanArray = arr => arr.filter(item => item.title.trim() !== '' || item.description.trim() !== '');
            const cleanStrings = arr => arr.filter(str => str.trim() !== '');

            const dataToSave = {
                title: formData.title,
                short_description: formData.short_description,
                content: formData.content,
                author: formData.author,
                category: formData.category,
                main_image: finalImage,
                image_gallery: currentGallery,
                places_to_visit: cleanArray(formData.places_to_visit),
                activities: cleanArray(formData.activities),
                best_time: formData.best_time,
                duration: formData.duration,
                budget: formData.budget,
                visa_info: formData.visa_info,
                tips: cleanStrings(formData.tips),
                highlights: cleanStrings(formData.highlights),
                hidden_facts: cleanStrings(formData.hidden_facts),
                cities_info: cleanArray(formData.cities_info),
                story_title: formData.story_title,
                story_content: formData.story_content,
                story_image: finalStoryImage,
                is_popular_story: formData.is_popular_story || false
            };

            if (modalMode === 'add') {
                await createBlog(dataToSave);
                showToast('Blog created successfully!');
            } else {
                await updateBlog(formData.id, dataToSave);
                showToast('Blog updated successfully!');
            }

            handleCloseModal();
            loadBlogs();
        } catch (err) {
            console.error('Submission failed', err);
            showToast('Failed to save blog.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, imageUrl, galleryUrls, storyImageUrl) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        try {
            await deleteBlog(id);
            if (imageUrl) await deleteBlogImage(imageUrl);
            if (storyImageUrl) await deleteBlogImage(storyImageUrl);
            
            if (Array.isArray(galleryUrls)) {
                for (let url of galleryUrls) {
                    await deleteBlogImage(url);
                }
            }
            showToast('Blog deleted successfully!');
            loadBlogs();
        } catch (err) {
            console.error('Delete failed', err);
            showToast('Failed to delete blog.', 'error');
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
                <h2 className="m-0">Manage Blogs (Fremor Magazine)</h2>
                <div className="d-flex gap-3 align-items-center">
                    <div className="position-relative">
                        <i className="fa-solid fa-search position-absolute" style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                        <input 
                            type="text" 
                            placeholder="Search blogs..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control ps-5"
                            style={{ minWidth: '250px', borderRadius: '8px' }}
                        />
                    </div>
                    <button className="th-btn m-0" onClick={() => handleOpenModal('add')}>
                        <i className="fa-solid fa-plus me-2"></i> Add Blog
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
                                <th>Author</th>
                                <th>Popular?</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        {searchTerm ? 'No blogs found matching your search.' : 'No blogs found.'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map(blog => (
                                    <tr key={blog.id}>
                                        <td>
                                            <div className="admin-img-thumb truncate-img">
                                                <img src={getBlogImageSrc(blog.main_image)} alt={blog.title} />
                                            </div>
                                        </td>
                                        <td><strong>{blog.title}</strong></td>
                                        <td>{blog.category || '-'}</td>
                                        <td>{blog.author || '-'}</td>
                                        <td>
                                            {blog.is_popular_story ? (
                                                <span className="badge bg-success" style={{ fontSize: '12px', padding: '5px 10px' }}>Popular</span>
                                            ) : (
                                                <span className="badge bg-secondary" style={{ fontSize: '12px', padding: '5px 10px' }}>No</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="btn-edit" onClick={() => handleOpenModal('edit', blog)}>
                                                    <i className="fa-solid fa-pen"></i> Edit
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(blog.id, blog.main_image, blog.image_gallery, blog.story_image)}>
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
                    <div className="admin-modal" style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="admin-modal-header sticky-top bg-white z-1">
                            <h3>{modalMode === 'add' ? 'Add New Blog' : 'Edit Blog'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form px-4 pb-4">
                            
                            <h5 className="mt-2 text-primary border-bottom pb-2">Basic Details</h5>
                            <div className="row mt-3">
                                <div className="col-md-12 mb-3">
                                    <label>Blog Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Category *</label>
                                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="form-control" required placeholder="e.g. Travel, City Tour" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Author</label>
                                    <input type="text" name="author" value={formData.author} onChange={handleInputChange} className="form-control" placeholder="Optional (e.g. David Smith)" />
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label>Short Description (For list view) *</label>
                                    <textarea name="short_description" value={formData.short_description} onChange={handleInputChange} className="form-control" rows="2" maxLength="350" required placeholder="A brief summary for the blog card..."></textarea>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label>Detailed Content (Main body) *</label>
                                    <textarea name="content" value={formData.content} onChange={handleInputChange} className="form-control" rows="8" required placeholder="Write the main blog content here..."></textarea>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <div className="form-check form-switch mt-2 d-flex align-items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            className="form-check-input" 
                                            id="is_popular_story" 
                                            name="is_popular_story" 
                                            checked={formData.is_popular_story || false} 
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_popular_story: e.target.checked }))} 
                                            style={{ cursor: 'pointer', width: '40px', height: '20px' }}
                                        />
                                        <label className="form-check-label fw-semibold text-dark" htmlFor="is_popular_story" style={{ cursor: 'pointer', fontSize: '14px' }}>
                                            Mark as Popular Fremor Story (Featured in Blog Details Sidebar)
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <h5 className="mt-4 text-primary border-bottom pb-2">Travel Guide Details (Optional)</h5>
                            <div className="row mt-3">
                                <div className="col-md-6 mb-3">
                                    <label>Best Time to Visit</label>
                                    <input type="text" name="best_time" value={formData.best_time} onChange={handleInputChange} className="form-control" placeholder="e.g. October to March" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Ideal Trip Duration</label>
                                    <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="form-control" placeholder="e.g. 6 Days / 5 Nights" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Estimated Budget</label>
                                    <input type="text" name="budget" value={formData.budget} onChange={handleInputChange} className="form-control" placeholder="e.g. ₹30,000 - ₹45,000 per person" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Visa Status</label>
                                    <input type="text" name="visa_info" value={formData.visa_info} onChange={handleInputChange} className="form-control" placeholder="e.g. E-Visa / Visa on Arrival" />
                                </div>
                            </div>
                            
                            <h5 className="mt-4 text-primary border-bottom pb-2">Media</h5>
                            <div className="row">
                                <div className="col-md-12 form-group mb-4">
                                    <label>Main Blog Thumbnail Image *</label>
                                    <input type="file" accept="image/*" onChange={(e) => {
                                        if(e.target.files && e.target.files[0]) setPrimaryImageFile(e.target.files[0])
                                    }} className="form-control" required={modalMode === 'add' && !formData.main_image} />
                                    {formData.main_image && !primaryImageFile && (
                                        <div className="mt-2 text-muted small d-flex align-items-center gap-2">
                                            <i className="fa-solid fa-image text-primary"></i> Current Image Provided
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-12 form-group mb-4 border rounded p-3 bg-light">
                                    <label className="fw-bold">Blog Gallery Images (Optional)</label>
                                    <input type="file" accept="image/*" multiple onChange={(e) => {
                                        if(e.target.files) setGalleryFiles(prev => [...prev, ...Array.from(e.target.files)])
                                    }} className="form-control mb-3" />
                                    
                                    {formData.image_gallery && formData.image_gallery.length > 0 && (
                                        <div className="mb-2">
                                            <label className="small text-muted d-block">Existing Gallery (Click to remove)</label>
                                            <div className="d-flex flex-wrap gap-2 mt-1">
                                                {formData.image_gallery.map((img, i) => (
                                                    <div key={i} className="position-relative" style={{ width: '60px', height: '60px' }}>
                                                        <img src={getBlogImageSrc(img)} alt="gallery" className="w-100 h-100 object-fit-cover rounded border" />
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
                            </div>

                            <h5 className="mt-4 text-primary border-bottom pb-2">Places to Visit</h5>
                            <div className="border rounded p-3 bg-light mb-4">
                                {formData.places_to_visit.map((row, index) => (
                                    <div key={index} className="row g-2 mb-3 align-items-start">
                                        <div className="col-11">
                                            <input type="text" className="form-control mb-2 fw-bold" placeholder="Place Title (e.g., Mount Everest Base Camp)" value={row.title} onChange={e => handleStructuredArrayChange('places_to_visit', index, 'title', e.target.value)} />
                                            <textarea className="form-control" rows="2" placeholder="Description of this place..." value={row.description} onChange={e => handleStructuredArrayChange('places_to_visit', index, 'description', e.target.value)} />
                                        </div>
                                        <div className="col-1 text-end">
                                            <button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => removeStructuredItem('places_to_visit', index)}>
                                                <i className="fa-solid fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addStructuredItem('places_to_visit')}>
                                    <i className="fa-solid fa-plus mt-1"></i> Add Place
                                </button>
                            </div>

                            <h5 className="mt-4 text-primary border-bottom pb-2">Activities to Perform</h5>
                            <div className="border rounded p-3 bg-light mb-4">
                                {formData.activities.map((row, index) => (
                                    <div key={index} className="row g-2 mb-3 align-items-start">
                                        <div className="col-11">
                                            <input type="text" className="form-control mb-2 fw-bold" placeholder="Activity Title (e.g., Scuba Diving in Blue Lagoon)" value={row.title} onChange={e => handleStructuredArrayChange('activities', index, 'title', e.target.value)} />
                                            <textarea className="form-control" rows="2" placeholder="Description of this activity..." value={row.description} onChange={e => handleStructuredArrayChange('activities', index, 'description', e.target.value)} />
                                        </div>
                                        <div className="col-1 text-end">
                                            <button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => removeStructuredItem('activities', index)}>
                                                <i className="fa-solid fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addStructuredItem('activities')}>
                                    <i className="fa-solid fa-plus mt-1"></i> Add Activity
                                </button>
                            </div>

                            <h5 className="mt-4 text-primary border-bottom pb-2">Essential Travel Tips</h5>
                            <div className="border rounded p-3 bg-light mb-4">
                                {formData.tips.map((tip, index) => (
                                    <div key={index} className="d-flex gap-2 mb-2 align-items-center">
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Enter travel tip/advice (e.g. Carry local cash, respect culture...)" 
                                            value={tip} 
                                            onChange={e => handleTipChange(index, e.target.value)} 
                                        />
                                        <button type="button" className="btn btn-sm btn-outline-danger" style={{minWidth: '38px', height: '38px'}} onClick={() => removeTip(index)}>
                                            <i className="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={addTip}>
                                    <i className="fa-solid fa-plus mt-1"></i> Add Tip
                                </button>
                            </div>

                             <h5 className="mt-4 text-primary border-bottom pb-2">Key Highlights</h5>
                             <div className="border rounded p-3 bg-light mb-4">
                                 {formData.highlights.map((highlight, index) => (
                                     <div key={index} className="d-flex gap-2 mb-2 align-items-center">
                                         <input 
                                             type="text" 
                                             className="form-control" 
                                             placeholder="Enter highlight (e.g. Pristine beaches, Vibrant nightlife...)" 
                                             value={highlight} 
                                             onChange={e => handleHighlightChange(index, e.target.value)} 
                                         />
                                         <button type="button" className="btn btn-sm btn-outline-danger" style={{minWidth: '38px', height: '38px'}} onClick={() => removeHighlight(index)}>
                                             <i className="fa-solid fa-times"></i>
                                         </button>
                                     </div>
                                 ))}
                                 <button type="button" className="btn btn-sm btn-outline-primary" onClick={addHighlight}>
                                     <i className="fa-solid fa-plus mt-1"></i> Add Highlight
                                 </button>
                             </div>

                             <h5 className="mt-4 text-primary border-bottom pb-2">Cities Info</h5>
                             <div className="border rounded p-3 bg-light mb-4">
                                 {formData.cities_info.map((row, index) => (
                                     <div key={index} className="row g-2 mb-3 align-items-start">
                                         <div className="col-11">
                                             <input type="text" className="form-control mb-2 fw-bold" placeholder="City Name (e.g. Sydney)" value={row.title} onChange={e => handleStructuredArrayChange('cities_info', index, 'title', e.target.value)} />
                                             <textarea className="form-control" rows="2" placeholder="Information/Overview of this city..." value={row.description} onChange={e => handleStructuredArrayChange('cities_info', index, 'description', e.target.value)} />
                                         </div>
                                         <div className="col-1 text-end">
                                             <button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => removeStructuredItem('cities_info', index)}>
                                                 <i className="fa-solid fa-times"></i>
                                             </button>
                                         </div>
                                     </div>
                                 ))}
                                 <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addStructuredItem('cities_info')}>
                                     <i className="fa-solid fa-plus mt-1"></i> Add City Info
                                 </button>
                             </div>

                             <h5 className="mt-4 text-primary border-bottom pb-2">Hidden Facts</h5>
                             <div className="border rounded p-3 bg-light mb-4">
                                 {formData.hidden_facts.map((fact, index) => (
                                     <div key={index} className="d-flex gap-2 mb-2 align-items-center">
                                         <input 
                                             type="text" 
                                             className="form-control" 
                                             placeholder="Enter interesting/hidden fact about this country..." 
                                             value={fact} 
                                             onChange={e => handleHiddenFactChange(index, e.target.value)} 
                                         />
                                         <button type="button" className="btn btn-sm btn-outline-danger" style={{minWidth: '38px', height: '38px'}} onClick={() => removeHiddenFact(index)}>
                                             <i className="fa-solid fa-times"></i>
                                         </button>
                                     </div>
                                 ))}
                                 <button type="button" className="btn btn-sm btn-outline-primary" onClick={addHiddenFact}>
                                     <i className="fa-solid fa-plus mt-1"></i> Add Hidden Fact
                                 </button>
                             </div>

                             <h5 className="mt-4 text-primary border-bottom pb-2">Traveler's Story (Story Writing Section)</h5>
                             <div className="border rounded p-3 bg-light mb-4">
                                 <div className="row">
                                     <div className="col-md-12 mb-3">
                                         <label className="fw-semibold small">Story Title</label>
                                         <input type="text" name="story_title" value={formData.story_title} onChange={handleInputChange} className="form-control" placeholder="e.g. My Magical Week in Switzerland" />
                                     </div>
                                     <div className="col-md-12 mb-3">
                                         <label className="fw-semibold small">Story Content</label>
                                         <textarea name="story_content" value={formData.story_content} onChange={handleInputChange} className="form-control" rows="5" placeholder="Write the personal traveler story/narrative here..."></textarea>
                                     </div>
                                     <div className="col-md-12 mb-3">
                                         <label className="fw-semibold small">Story Cover/Accent Image</label>
                                         <input type="file" accept="image/*" onChange={(e) => {
                                             if(e.target.files && e.target.files[0]) setStoryImageFile(e.target.files[0])
                                         }} className="form-control" />
                                         {formData.story_image && !storyImageFile && (
                                             <div className="mt-2 text-muted small d-flex align-items-center gap-2">
                                                 <i className="fa-solid fa-image text-primary"></i> Current Story Image
                                                 <img src={getBlogImageSrc(formData.story_image)} alt="story" className="d-block mt-1 object-fit-cover rounded border" style={{ width: '80px', height: '50px' }} />
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             </div>

                            <div className="admin-modal-footer sticky-bottom bg-white pt-3 border-top mt-4 p-3">
                                <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="th-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Blog Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BlogAdminPanel;
