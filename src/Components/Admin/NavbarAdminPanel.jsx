import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import '../Destination/AdminStyles.css';

const PREDEFINED_SCREENS = [
    { label: 'Custom / Manual URL', value: 'custom' },
    { label: 'Home Page (/)', value: '/' },
    { label: 'Explore All Tours (/destination)', value: '/destination' },
    { label: 'Outbound (Global) Tours (/destination/outbound)', value: '/destination/outbound' },
    { label: 'Europe (Outbound) (/destination/outbound/europe)', value: '/destination/outbound/europe' },
    { label: 'Africa (Outbound) (/destination/outbound/africa)', value: '/destination/outbound/africa' },
    { label: 'North America (Outbound) (/destination/outbound/north-america)', value: '/destination/outbound/north-america' },
    { label: 'South America (Outbound) (/destination/outbound/south-america)', value: '/destination/outbound/south-america' },
    { label: 'Australia (Outbound) (/destination/outbound/australia)', value: '/destination/outbound/australia' },
    { label: 'Inbound (India) Tours (/destination/inbound)', value: '/destination/inbound' },
    { label: 'Domestic Tours (/destination/domestic)', value: '/destination/domestic' },
    { label: 'Visa Page (/visa)', value: '/visa' },
    { label: 'Cruises Page (/cruise)', value: '/cruise' },
    { label: 'About Us / Our Story (/about)', value: '/about' },
    { label: 'FAQ Page (/faq)', value: '/faq' },
    { label: 'Support / Contact Us (/contact)', value: '/contact' },
    { label: 'Blog Page (/blog)', value: '/blog' }
];

export default function NavbarAdminPanel() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [formData, setFormData] = useState({
        id: null,
        label: '',
        url: '',
        parent_id: '',
        order_index: 0,
        is_mega: false,
        special_type: '',
        mega_group: ''
    });

    useEffect(() => {
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('navbar_items')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            setMenuItems(data || []);
        } catch (err) {
            console.error('Failed to fetch navbar items:', err);
            showToast('Error loading navbar items', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // Open modal to add a menu item
    const openAddModal = (parentId = '') => {
        setModalMode('add');
        
        // Find next order index for this group
        const siblings = menuItems.filter(i => (parentId ? i.parent_id === parentId : !i.parent_id));
        const nextOrder = siblings.length > 0 ? Math.max(...siblings.map(s => s.order_index || 0)) + 1 : 1;

        setFormData({
            id: null,
            label: '',
            url: '',
            parent_id: parentId,
            order_index: nextOrder,
            is_mega: false,
            special_type: '',
            mega_group: ''
        });
        setIsModalOpen(true);
    };

    // Open modal to edit an existing item
    const openEditModal = (item) => {
        setModalMode('edit');
        setFormData({
            id: item.id,
            label: item.label,
            url: item.url || '',
            parent_id: item.parent_id || '',
            order_index: item.order_index || 0,
            is_mega: item.is_mega || false,
            special_type: item.special_type || '',
            mega_group: item.mega_group || ''
        });
        setIsModalOpen(true);
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.label) {
            showToast('Label is required', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                label: formData.label,
                url: formData.url || null,
                parent_id: formData.parent_id || null,
                order_index: parseInt(formData.order_index) || 0,
                is_mega: formData.is_mega,
                special_type: formData.special_type || null,
                mega_group: formData.is_mega ? (formData.mega_group || null) : null
            };

            if (modalMode === 'add') {
                const { error } = await supabase
                    .from('navbar_items')
                    .insert([payload]);

                if (error) throw error;
                showToast('Navbar item created successfully');
            } else {
                const { error } = await supabase
                    .from('navbar_items')
                    .update(payload)
                    .eq('id', formData.id);

                if (error) throw error;
                showToast('Navbar item updated successfully');
            }

            setIsModalOpen(false);
            fetchMenuData();
        } catch (err) {
            console.error('Save error:', err);
            showToast('Failed to save navbar item', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete item
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this menu item? Any sub-menus or nested continent groups will also be deleted.')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('navbar_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            showToast('Navbar item deleted successfully');
            fetchMenuData();
        } catch (err) {
            console.error('Delete error:', err);
            showToast('Failed to delete item', 'error');
        }
    };

    // Swap order with siblings
    const handleMove = async (item, direction) => {
        const siblings = menuItems
            .filter(i => (item.parent_id ? i.parent_id === item.parent_id : !i.parent_id))
            .sort((a, b) => a.order_index - b.order_index);

        const currentIndex = siblings.findIndex(i => i.id === item.id);
        if (currentIndex === -1) return;

        let swapWithIndex = -1;
        if (direction === 'up' && currentIndex > 0) {
            swapWithIndex = currentIndex - 1;
        } else if (direction === 'down' && currentIndex < siblings.length - 1) {
            swapWithIndex = currentIndex + 1;
        }

        if (swapWithIndex !== -1) {
            const otherItem = siblings[swapWithIndex];
            
            try {
                // Swap order indices
                const { error: err1 } = await supabase
                    .from('navbar_items')
                    .update({ order_index: otherItem.order_index })
                    .eq('id', item.id);

                const { error: err2 } = await supabase
                    .from('navbar_items')
                    .update({ order_index: item.order_index })
                    .eq('id', otherItem.id);

                if (err1 || err2) throw new Error('Failed swapping order index');
                
                showToast('Menu order updated');
                fetchMenuData();
            } catch (err) {
                console.error(err);
                showToast('Failed to reorder item', 'error');
            }
        }
    };

    // Organize items hierarchically for rendering in admin panel (recursive for grandchildren)
    const buildAdminTree = () => {
        const getChildrenRecursive = (parentId) => {
            const list = menuItems.filter(item => item.parent_id === parentId);
            return list.sort((a, b) => a.order_index - b.order_index).map(item => ({
                ...item,
                children: getChildrenRecursive(item.id)
            }));
        };

        const topLevel = menuItems.filter(item => !item.parent_id);
        return topLevel.sort((a, b) => a.order_index - b.order_index).map(parent => ({
            ...parent,
            children: getChildrenRecursive(parent.id)
        }));
    };

    // Helper to filter potential parent items up to 2 levels deep
    const getPotentialParents = () => {
        return menuItems.filter(item => {
            if (item.id === formData.id) return false;
            // Level 1: Primary items
            if (!item.parent_id) return true;
            // Level 2: Child items
            const parent = menuItems.find(p => p.id === item.parent_id);
            if (parent && !parent.parent_id) return true;
            return false;
        });
    };

    const adminTree = buildAdminTree();
    const potentialParents = getPotentialParents();

    // Determine current redirect choice from URL field
    const isPredefined = PREDEFINED_SCREENS.some(s => s.value === formData.url && s.value !== 'custom');
    const redirectVal = isPredefined ? formData.url : 'custom';

    return (
        <div className="admin-panel-container">
            {toast.show && (
                <div className={`admin-toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}

            <div className="admin-panel-header">
                <h2>Navbar Management</h2>
                <div>
                    <button 
                        className="th-btn" 
                        onClick={() => openAddModal()}
                        style={{ height: '40px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px', background: '#0d496e', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        <i className="fa-solid fa-plus"></i> Add New Link
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="admin-loading">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : adminTree.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <i className="fa-regular fa-folder-open" style={{ fontSize: '48px', marginBottom: '15px', color: '#ccc' }}></i>
                    <p>No navbar menu items set up in the database. Fallback routes are currently showing on the frontend.</p>
                    <button 
                        className="th-btn style3" 
                        onClick={() => openAddModal()}
                        style={{ marginTop: '10px' }}
                    >
                        Create Your First Menu Link
                    </button>
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Menu Label</th>
                                <th>Navigation URL</th>
                                <th>Type / Group</th>
                                <th>Order</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminTree.map((parent, pIdx) => (
                                <React.Fragment key={parent.id}>
                                    {/* Level 1: Primary Menu Item */}
                                    <tr style={{ backgroundColor: '#f8fafc', fontWeight: '600' }}>
                                        <td>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0d496e' }}>
                                                <i className="fa-solid fa-bars" style={{ cursor: 'grab', color: '#94a3b8' }}></i>
                                                {parent.label}
                                                {parent.is_mega && <span style={{ fontSize: '10px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: '700' }}>Mega Menu</span>}
                                                {parent.special_type && <span style={{ fontSize: '10px', backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: '700' }}>{parent.special_type.replace('_', ' ')}</span>}
                                            </span>
                                        </td>
                                        <td><code style={{ fontSize: '12px' }}>{parent.url || '(none/hash)'}</code></td>
                                        <td>
                                            <span style={{ fontSize: '13px', color: '#475569' }}>Primary Item</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button 
                                                    disabled={pIdx === 0} 
                                                    onClick={() => handleMove(parent, 'up')}
                                                    style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: pIdx === 0 ? 'not-allowed' : 'pointer', opacity: pIdx === 0 ? 0.4 : 1 }}
                                                >
                                                    <i className="fa-solid fa-chevron-up" style={{ fontSize: '10px' }}></i>
                                                </button>
                                                <button 
                                                    disabled={pIdx === adminTree.length - 1} 
                                                    onClick={() => handleMove(parent, 'down')}
                                                    style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: pIdx === adminTree.length - 1 ? 'not-allowed' : 'pointer', opacity: pIdx === adminTree.length - 1 ? 0.4 : 1 }}
                                                >
                                                    <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i>
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="btn-edit" onClick={() => openEditModal(parent)} title="Edit Link">
                                                    <i className="fa-regular fa-pen-to-square"></i> Edit
                                                </button>
                                                <button className="btn-edit" style={{ backgroundColor: '#ecfdf5', color: '#059669' }} onClick={() => openAddModal(parent.id)} title="Add Sub-item">
                                                    <i className="fa-solid fa-plus"></i> Add Sub
                                                </button>
                                                <button className="btn-delete" onClick={() => handleDelete(parent.id)} title="Delete Link">
                                                    <i className="fa-regular fa-trash-can"></i> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Level 2: Sub-items */}
                                    {parent.children.map((child, cIdx) => (
                                        <React.Fragment key={child.id}>
                                            <tr style={{ backgroundColor: '#ffffff' }}>
                                                <td>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '25px', color: '#1e293b', fontWeight: '500' }}>
                                                        <i className="fa-solid fa-arrow-turn-up" style={{ transform: 'rotate(90deg)', color: '#cbd5e1', marginRight: '4px' }}></i>
                                                        {child.label}
                                                        {child.special_type && <span style={{ fontSize: '9px', backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 5px', borderRadius: '3px', textTransform: 'uppercase', fontWeight: '700' }}>{child.special_type.replace('_', ' ')}</span>}
                                                    </span>
                                                </td>
                                                <td><code style={{ fontSize: '12px' }}>{child.url || '(none/hash)'}</code></td>
                                                <td>
                                                    {child.mega_group ? (
                                                        <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontWeight: '500' }}>
                                                            Col: {child.mega_group}
                                                        </span>
                                                    ) : (
                                                        <span style={{ fontSize: '12px', color: '#64748b' }}>Standard Dropdown</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '5px', paddingLeft: '10px' }}>
                                                        <button 
                                                            disabled={cIdx === 0} 
                                                            onClick={() => handleMove(child, 'up')}
                                                            style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: cIdx === 0 ? 'not-allowed' : 'pointer', opacity: cIdx === 0 ? 0.4 : 1 }}
                                                        >
                                                            <i className="fa-solid fa-chevron-up" style={{ fontSize: '9px' }}></i>
                                                        </button>
                                                        <button 
                                                            disabled={cIdx === parent.children.length - 1} 
                                                            onClick={() => handleMove(child, 'down')}
                                                            style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: cIdx === parent.children.length - 1 ? 'not-allowed' : 'pointer', opacity: cIdx === parent.children.length - 1 ? 0.4 : 1 }}
                                                        >
                                                            <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px' }}></i>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="admin-actions">
                                                        <button className="btn-edit" onClick={() => openEditModal(child)}>
                                                            <i className="fa-regular fa-pen-to-square"></i> Edit
                                                        </button>
                                                        {/* Level 2 Add sub item button to allow grandchildren like continents */}
                                                        <button className="btn-edit" style={{ backgroundColor: '#ecfdf5', color: '#059669' }} onClick={() => openAddModal(child.id)} title="Add Sub-item">
                                                            <i className="fa-solid fa-plus"></i> Add Sub
                                                        </button>
                                                        <button className="btn-delete" onClick={() => handleDelete(child.id)}>
                                                            <i className="fa-regular fa-trash-can"></i> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Level 3: Grandchildren (e.g. continents under Outbound) */}
                                            {child.children && child.children.map((grandchild, gIdx) => (
                                                <tr key={grandchild.id} style={{ backgroundColor: '#fdfdfd' }}>
                                                    <td>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '50px', color: '#475569', fontSize: '13px' }}>
                                                            <i className="fa-solid fa-arrow-turn-up" style={{ transform: 'rotate(90deg)', color: '#cbd5e1', marginRight: '4px', opacity: 0.5 }}></i>
                                                            <i className="fa-solid fa-earth-americas" style={{ color: '#FFB114', fontSize: '11px' }}></i>
                                                            {grandchild.label}
                                                        </span>
                                                    </td>
                                                    <td><code style={{ fontSize: '11px' }}>{grandchild.url || '(none/hash)'}</code></td>
                                                    <td>
                                                        <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>Continent Column</span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '5px', paddingLeft: '20px' }}>
                                                            <button 
                                                                disabled={gIdx === 0} 
                                                                onClick={() => handleMove(grandchild, 'up')}
                                                                style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: gIdx === 0 ? 'not-allowed' : 'pointer', opacity: gIdx === 0 ? 0.4 : 1 }}
                                                            >
                                                                <i className="fa-solid fa-chevron-up" style={{ fontSize: '8px' }}></i>
                                                            </button>
                                                            <button 
                                                                disabled={gIdx === child.children.length - 1} 
                                                                onClick={() => handleMove(grandchild, 'down')}
                                                                style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: gIdx === child.children.length - 1 ? 'not-allowed' : 'pointer', opacity: gIdx === child.children.length - 1 ? 0.4 : 1 }}
                                                            >
                                                                <i className="fa-solid fa-chevron-down" style={{ fontSize: '8px' }}></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="admin-actions">
                                                            <button className="btn-edit" onClick={() => openEditModal(grandchild)} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                                                <i className="fa-regular fa-pen-to-square"></i> Edit
                                                            </button>
                                                            <button className="btn-delete" onClick={() => handleDelete(grandchild.id)} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                                                <i className="fa-regular fa-trash-can"></i> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '550px' }}>
                        <div className="admin-modal-header">
                            <h3>{modalMode === 'add' ? 'Add Navbar Link' : 'Edit Navbar Link'}</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label>Menu Item Name (Label) <span style={{ color: '#dc3545' }}>*</span></label>
                                    <input 
                                        type="text" 
                                        name="label" 
                                        value={formData.label} 
                                        onChange={handleInputChange} 
                                        className="form-control" 
                                        placeholder="e.g. Home, Cruises, Europe"
                                        required 
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div>
                                    <label>Predefined Redirect Screen Selector</label>
                                    <select 
                                        value={redirectVal} 
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val !== 'custom') {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    url: val
                                                }));
                                            }
                                        }} 
                                        className="form-control"
                                        style={{ width: '100%' }}
                                    >
                                        {PREDEFINED_SCREENS.map(scr => (
                                            <option key={scr.value} value={scr.value}>{scr.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>Navigation URL / Path</label>
                                    <input 
                                        type="text" 
                                        name="url" 
                                        value={formData.url} 
                                        onChange={handleInputChange} 
                                        className="form-control" 
                                        placeholder="e.g. /destination/outbound, /visa, or leave blank for dropdown placeholder"
                                        style={{ width: '100%' }}
                                        disabled={redirectVal !== 'custom'}
                                    />
                                    {redirectVal !== 'custom' && (
                                        <small style={{ color: '#0284c7', fontSize: '11px', display: 'block', marginTop: '4px', fontWeight: '500' }}>
                                            URL locked to predefined redirect screen path. Switch selector to "Custom / Manual URL" to edit manually.
                                        </small>
                                    )}
                                </div>

                                {/* Only show Parent selection if adding/editing child */}
                                {formData.parent_id && (
                                    <div>
                                        <label>Parent Navigation Group</label>
                                        <select 
                                            name="parent_id" 
                                            value={formData.parent_id} 
                                            onChange={handleInputChange} 
                                            className="form-control"
                                            style={{ width: '100%' }}
                                        >
                                            {potentialParents.map(p => {
                                                const hasParent = !!p.parent_id;
                                                const parentLabel = hasParent ? menuItems.find(parent => parent.id === p.parent_id)?.label : '';
                                                return (
                                                    <option key={p.id} value={p.id}>
                                                        {hasParent ? `  ↳ ${parentLabel} > ${p.label}` : p.label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                )}

                                <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '15px' }}>
                                    <label>Special Layout Types</label>
                                    <select 
                                        name="special_type" 
                                        value={formData.special_type} 
                                        onChange={handleInputChange} 
                                        className="form-control"
                                        style={{ width: '100%' }}
                                    >
                                        <option value="">Standard Link / Standard Dropdown</option>
                                        <option value="outbound_mega">Outbound (Global) Dropdown (5 Continents)</option>
                                        <option value="inbound_dropdown">Inbound (India) Single Link</option>
                                        <option value="domestic_dropdown">Domestic Single Link</option>
                                    </select>
                                    <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                                        Specifying Outbound (Global) Dropdown will render a vertical sub-menu showing its sub-items (continents) under Outbound. Inbound and Domestic render as clean single links without submenus.
                                    </small>
                                </div>

                                {/* Only show Mega Menu options if it is a top-level menu item and NOT a special type */}
                                {!formData.parent_id && !formData.special_type && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px dashed #e2e8f0', paddingTop: '15px' }}>
                                        <input 
                                            type="checkbox" 
                                            name="is_mega" 
                                            id="is_mega"
                                            checked={formData.is_mega} 
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="is_mega" style={{ margin: 0, cursor: 'pointer' }}>Render submenu as a Multi-Column Mega Dropdown</label>
                                    </div>
                                )}

                                {/* If child link of a Mega Menu, specify which column group it belongs to */}
                                {formData.parent_id && (
                                    <>
                                        {(() => {
                                            const parent = menuItems.find(i => i.id === formData.parent_id);
                                            if (parent && parent.is_mega) {
                                                return (
                                                    <div>
                                                        <label>Mega Menu Column Heading (mega_group)</label>
                                                        <input 
                                                            type="text" 
                                                            name="mega_group" 
                                                            value={formData.mega_group} 
                                                            onChange={handleInputChange} 
                                                            className="form-control" 
                                                            placeholder="e.g. Popular Countries, Regions, Services"
                                                            style={{ width: '100%' }}
                                                        />
                                                        <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                                                            Sub-links with the same Column Heading will be grouped under that column in the Mega Menu.
                                                        </small>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </>
                                )}

                                <div>
                                    <label>Order Index</label>
                                    <input 
                                        type="number" 
                                        name="order_index" 
                                        value={formData.order_index} 
                                        onChange={handleInputChange} 
                                        className="form-control" 
                                        style={{ width: '100%' }}
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button 
                                    type="button" 
                                    className="th-btn btn-delete" 
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ marginRight: '10px', background: '#f8fafc', color: '#64748b', border: '1px solid #cbd5e1' }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="th-btn" 
                                    disabled={isSubmitting}
                                    style={{ background: '#FFB114', color: '#0d496e', border: 'none', fontWeight: '700' }}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
