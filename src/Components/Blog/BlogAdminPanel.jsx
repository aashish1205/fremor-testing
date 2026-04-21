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
        author: 'David Smith',
        category: 'Travel',
        main_image: '',
        image_gallery: [],
        places_to_visit: [{ title: 'Example Place', description: 'Description of the place.' }],
        activities: [{ title: 'Example Activity', description: 'Description of the activity.' }]
    });
    
    const [primaryImageFile, setPrimaryImageFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

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
                author: blog.author || 'David Smith',
                category: blog.category || 'Travel',
                main_image: blog.main_image || '',
                image_gallery: parseArraySafe(blog.image_gallery, []),
                places_to_visit: parseArraySafe(blog.places_to_visit, [{ title: "Place 1", description: "Desc..." }]),
                activities: parseArraySafe(blog.activities, [{ title: "Activity 1", description: "Desc..." }])
            });
        } else {
            setFormData({
                id: null,
                title: '',
                short_description: '',
                content: '',
                author: 'David Smith',
                category: 'Travel',
                main_image: '',
                image_gallery: [],
                places_to_visit: [{ title: '', description: '' }],
                activities: [{ title: '', description: '' }]
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
            let currentGallery = [...formData.image_gallery];

            if (primaryImageFile) {
                finalImage = await uploadBlogImage(primaryImageFile, 'blogs');
                if (modalMode === 'edit' && formData.main_image) {
                    await deleteBlogImage(formData.main_image);
                }
            }

            if (galleryFiles.length > 0) {
                for (let file of galleryFiles) {
                    const uploadedUrl = await uploadBlogImage(file, 'blogs');
                    currentGallery.push(uploadedUrl);
                }
            }

            const cleanArray = arr => arr.filter(item => item.title.trim() !== '' || item.description.trim() !== '');

            const dataToSave = {
                title: formData.title,
                short_description: formData.short_description,
                content: formData.content,
                author: formData.author,
                category: formData.category,
                main_image: finalImage,
                image_gallery: currentGallery,
                places_to_visit: cleanArray(formData.places_to_visit),
                activities: cleanArray(formData.activities)
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

    const handleDelete = async (id, imageUrl, galleryUrls) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        try {
            await deleteBlog(id);
            if (imageUrl) await deleteBlogImage(imageUrl);
            
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

            <div className="admin-header">
                <h2>Manage Blogs (Fremor Magazine)</h2>
                <button className="th-btn" onClick={() => handleOpenModal('add')}>
                    <i className="fa-solid fa-plus me-2"></i> Add Blog
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
                                <th>Category</th>
                                <th>Author</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No blogs found.</td>
                                </tr>
                            ) : (
                                blogs.map(blog => (
                                    <tr key={blog.id}>
                                        <td>
                                            <div className="admin-img-thumb truncate-img">
                                                <img src={getBlogImageSrc(blog.main_image)} alt={blog.title} />
                                            </div>
                                        </td>
                                        <td><strong>{blog.title}</strong></td>
                                        <td>{blog.category || '-'}</td>
                                        <td>{blog.author}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="btn-edit" onClick={() => handleOpenModal('edit', blog)}>
                                                    <i className="fa-solid fa-pen"></i> Edit
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(blog.id, blog.main_image, blog.image_gallery)}>
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
                                    <label>Author *</label>
                                    <input type="text" name="author" value={formData.author} onChange={handleInputChange} className="form-control" required />
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label>Short Description (For list view) *</label>
                                    <textarea name="short_description" value={formData.short_description} onChange={handleInputChange} className="form-control" rows="2" maxLength="350" required placeholder="A brief summary for the blog card..."></textarea>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label>Detailed Content (Main body) *</label>
                                    <textarea name="content" value={formData.content} onChange={handleInputChange} className="form-control" rows="8" required placeholder="Write the main blog content here..."></textarea>
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
