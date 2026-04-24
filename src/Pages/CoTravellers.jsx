import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import MyAccountHeader from '../Components/MyAccountHeader';
import MyAccountSidebar from '../Components/MyAccountSidebar';

/* ── Constants ── */
const GENDER_OPTIONS = ['Male', 'Female', 'Non-Binary', 'Prefer Not to Say'];
const NATIONALITY_OPTIONS = ['Indian', 'American', 'British', 'Canadian', 'Australian', 'Other'];
const RELATIONSHIP_OPTIONS = ['Spouse', 'Child', 'Sibling', 'GrandParent', 'Friend', 'Parent', 'Colleague', 'Relative', 'Parent In law', 'Other'];
const MEAL_OPTIONS = ['No Preference', 'Vegetarian', 'Vegan', 'Non-Vegetarian', 'Jain', 'Halal', 'Kosher'];
const BERTH_OPTIONS = ['No Preference', 'Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];
const COUNTRY_OPTIONS = ['India', 'USA', 'UK', 'Canada', 'Australia', 'UAE', 'Other'];
const AIRLINE_OPTIONS = ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'Emirates', 'Qatar Airways', 'Singapore Airlines', 'British Airways', 'Lufthansa', 'Other'];

/* ── Styles ── */
const inputStyle = {
    border: '1.5px solid #e0e0e0', borderRadius: '6px', padding: '14px 16px',
    fontSize: '13px', fontWeight: 600, color: '#555', background: '#fff',
    outline: 'none', width: '100%', letterSpacing: '0.3px',
};
const labelStyle = {
    fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '0.6px',
    textTransform: 'uppercase', marginBottom: '4px', display: 'block',
};
const sectionTitleStyle = { fontWeight: 700, fontSize: '18px', color: '#222', marginBottom: '20px' };

const EMPTY_FORM = {
    first_name: '', last_name: '', gender: '', date_of_birth: '', nationality: '',
    relationship: '', meal_preference: '', train_berth_preference: '',
    passport_no: '', passport_expiry: '', passport_issuing_country: '',
    mobile: '', email: '', airline: '', frequent_flyer_number: '',
};

/* ── Co-Traveller Card ── */
const TravellerCard = ({ traveller, onEdit, onDelete }) => (
    <div style={{
        border: '1px solid #eaeaea', borderRadius: '10px', padding: '20px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#fff', marginBottom: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
                width: '50px', height: '50px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '18px',
            }}>
                {(traveller.first_name?.[0] || '?').toUpperCase()}
            </div>
            <div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#222' }}>
                    {traveller.first_name} {traveller.last_name}
                </div>
                <div style={{ fontSize: '13px', color: '#888', marginTop: '3px' }}>
                    {[traveller.relationship, traveller.gender, traveller.nationality].filter(Boolean).join(' • ')}
                </div>
            </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => onEdit(traveller)} style={{
                padding: '8px 16px', borderRadius: '6px', border: '1.5px solid #e0e0e0',
                background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#555'
            }}>
                <i className="fa-regular fa-pen me-2" />Edit
            </button>
            <button onClick={() => onDelete(traveller.id)} style={{
                padding: '8px 14px', borderRadius: '6px', border: '1.5px solid #fde8e8',
                background: '#fff7f7', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#c53030'
            }}>
                <i className="fa-regular fa-trash-can" />
            </button>
        </div>
    </div>
);

/* ── Main Component ── */
const CoTravellers = () => {
    const [user, setUser] = useState(null);
    const [travellers, setTravellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }
            setUser(session.user);
            await fetchTravellers(session.user.id);
            setLoading(false);
        };
        init();
    }, []);

    const fetchTravellers = async (userId) => {
        const { data } = await supabase
            .from('co_travellers')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        setTravellers(data || []);
    };

    const handleField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleRelationship = (rel) => setForm(prev => ({ ...prev, relationship: prev.relationship === rel ? '' : rel }));

    const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); setMsg(''); };

    const openEdit = (traveller) => {
        setForm({
            ...traveller,
            date_of_birth: traveller.date_of_birth || '',
            passport_expiry: traveller.passport_expiry || '',
        });
        setEditingId(traveller.id);
        setShowForm(true);
        setMsg('');
    };

    const handleCancel = () => { setShowForm(false); setEditingId(null); setMsg(''); };

    const handleSave = async () => {
        if (!form.first_name.trim()) { setMsg('First name is required.'); return; }
        setSaving(true);
        setMsg('');

        const payload = {
            ...form,
            user_id: user.id,
            date_of_birth: form.date_of_birth || null,
            passport_expiry: form.passport_expiry || null,
        };

        let error;
        if (editingId) {
            ({ error } = await supabase.from('co_travellers').update(payload).eq('id', editingId));
        } else {
            ({ error } = await supabase.from('co_travellers').insert(payload));
        }

        setSaving(false);
        if (error) {
            setMsg('Failed to save. Please try again.');
        } else {
            setMsg(editingId ? 'Co-traveller updated!' : 'Co-traveller added!');
            await fetchTravellers(user.id);
            setTimeout(() => { setShowForm(false); setMsg(''); }, 1200);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this co-traveller?')) return;
        await supabase.from('co_travellers').delete().eq('id', id);
        setTravellers(prev => prev.filter(t => t.id !== id));
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f5f6' }}>
            <div style={{ padding: '2rem', background: '#fff', borderRadius: '10px' }}>
                <i className="fa-solid fa-spinner fa-spin me-2" />Loading...
            </div>
        </div>
    );

    return (
        <div style={{ background: '#f4f5f6', minHeight: '100vh', paddingBottom: '80px' }}>
            <MyAccountHeader title="My Account" user={user} avatarUrl="" onPhotoChange={() => {}} uploading={false} />

            <div className="container" style={{ marginTop: '30px' }}>
                <div className="row g-0" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

                    {/* Sidebar */}
                    <div className="col-md-3" style={{ borderRight: '1px solid #f0f0f0' }}>
                        <MyAccountSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9" style={{ padding: '32px 40px' }}>

                        {/* ── LIST VIEW ── */}
                        {!showForm && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                                    <h4 style={{ fontWeight: 700, fontSize: '22px', margin: 0 }}>Co-Travellers</h4>
                                    <button onClick={openAdd} className="th-btn" style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 700, borderRadius: '8px' }}>
                                        <i className="fa-solid fa-plus me-2" />Add New
                                    </button>
                                </div>

                                {travellers.length === 0 ? (
                                    <div style={{ padding: '60px 40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '12px', border: '1px dashed #ccc' }}>
                                        <i className="fa-regular fa-users" style={{ fontSize: '48px', color: '#ccc', display: 'block', marginBottom: '16px' }} />
                                        <h5 style={{ color: '#555', fontWeight: 600 }}>No Co-Travellers added yet</h5>
                                        <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>Add details of your co-travellers for faster bookings.</p>
                                        <button onClick={openAdd} className="th-btn" style={{ padding: '10px 24px', fontSize: '14px', borderRadius: '8px' }}>
                                            + Add New Co-Traveller
                                        </button>
                                    </div>
                                ) : (
                                    travellers.map(t => (
                                        <TravellerCard key={t.id} traveller={t} onEdit={openEdit} onDelete={handleDelete} />
                                    ))
                                )}
                            </>
                        )}

                        {/* ── ADD / EDIT FORM ── */}
                        {showForm && (
                            <>
                                {/* Form Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '20px', padding: 0 }}>
                                            <i className="fa-regular fa-arrow-left" />
                                        </button>
                                        <h4 style={{ fontWeight: 700, fontSize: '22px', margin: 0 }}>
                                            {editingId ? 'Edit Co-Traveller' : 'Add New Co-Traveller'}
                                        </h4>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={handleCancel} style={{ padding: '10px 22px', background: '#fff', border: '1.5px solid #ccc', borderRadius: '6px', fontWeight: 700, fontSize: '13px', color: '#555', cursor: 'pointer' }}>
                                            CANCEL
                                        </button>
                                        <button onClick={handleSave} disabled={saving} style={{ padding: '10px 22px', background: 'var(--theme-color, #e74c3c)', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '13px', color: '#fff', cursor: 'pointer' }}>
                                            {saving ? 'SAVING...' : 'SAVE'}
                                        </button>
                                    </div>
                                </div>

                                {/* Message */}
                                {msg && (
                                    <div style={{ background: msg.includes('Fail') ? '#fde8e8' : '#d1fae5', color: msg.includes('Fail') ? '#c53030' : '#065f46', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: 600 }}>
                                        <i className={`fa-solid ${msg.includes('Fail') ? 'fa-circle-xmark' : 'fa-circle-check'} me-2`} />{msg}
                                    </div>
                                )}

                                {/* Warning Banner */}
                                <div style={{ background: '#fff8ee', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                                    <div style={{ width: '42px', height: '42px', background: '#f59e0b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <i className="fa-solid fa-id-card" style={{ color: '#fff', fontSize: '18px' }} />
                                    </div>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#92400e', fontWeight: 500 }}>
                                        Please double check if your First and Last name, Gender & Date of Birth match your Govt. ID such as Aadhaar or Passport
                                    </p>
                                </div>

                                {/* ── General Information ── */}
                                <div style={{ marginBottom: '32px' }}>
                                    <div style={sectionTitleStyle}>General Information</div>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label style={labelStyle}>First & Middle Name</label>
                                            <input style={inputStyle} value={form.first_name} onChange={e => handleField('first_name', e.target.value)} placeholder="First & Middle Name" />
                                        </div>
                                        <div className="col-md-6">
                                            <label style={labelStyle}>Last Name</label>
                                            <input style={inputStyle} value={form.last_name} onChange={e => handleField('last_name', e.target.value)} placeholder="Last Name" />
                                        </div>

                                        <div className="col-md-4">
                                            <label style={labelStyle}>Gender</label>
                                            <select style={inputStyle} value={form.gender} onChange={e => handleField('gender', e.target.value)}>
                                                <option value="">Gender</option>
                                                {GENDER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label style={labelStyle}>Date of Birth</label>
                                            <input type="date" style={inputStyle} value={form.date_of_birth} onChange={e => handleField('date_of_birth', e.target.value)} />
                                        </div>
                                        <div className="col-md-4">
                                            <label style={labelStyle}>Nationality</label>
                                            <select style={inputStyle} value={form.nationality} onChange={e => handleField('nationality', e.target.value)}>
                                                <option value="">Nationality</option>
                                                {NATIONALITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>

                                        {/* Relationship Tags */}
                                        <div className="col-12">
                                            <div style={{ border: '1.5px solid #e0e0e0', borderRadius: '6px', padding: '14px 16px', background: '#fff' }}>
                                                <div style={labelStyle}>Relationship with Traveller</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                                    {RELATIONSHIP_OPTIONS.map(rel => (
                                                        <button
                                                            key={rel}
                                                            type="button"
                                                            onClick={() => handleRelationship(rel)}
                                                            style={{
                                                                padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                                                background: form.relationship === rel ? 'var(--theme-color, #e74c3c)' : '#f3f4f6',
                                                                color: form.relationship === rel ? '#fff' : '#555',
                                                                border: form.relationship === rel ? '1.5px solid var(--theme-color, #e74c3c)' : '1.5px solid #e0e0e0',
                                                                transition: 'all 0.2s',
                                                            }}
                                                        >
                                                            {rel}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#20c997', marginTop: '10px', fontStyle: 'italic' }}>
                                                    This helps to give us personalised travel recommendations when travelling
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label style={labelStyle}>Meal Preference</label>
                                            <select style={inputStyle} value={form.meal_preference} onChange={e => handleField('meal_preference', e.target.value)}>
                                                <option value="">Meal Preference</option>
                                                {MEAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label style={labelStyle}>Train Berth Preference</label>
                                            <select style={inputStyle} value={form.train_berth_preference} onChange={e => handleField('train_berth_preference', e.target.value)}>
                                                <option value="">Train Berth Preference</option>
                                                {BERTH_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0 28px' }} />

                                {/* ── Passport Details ── */}
                                <div style={{ marginBottom: '32px' }}>
                                    <div style={sectionTitleStyle}>Passport Details</div>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label style={labelStyle}>Passport No.</label>
                                            <input style={inputStyle} value={form.passport_no} onChange={e => handleField('passport_no', e.target.value)} placeholder="Passport No." />
                                        </div>
                                        <div className="col-md-6">
                                            <label style={labelStyle}>Expiry Date</label>
                                            <input type="date" style={inputStyle} value={form.passport_expiry} onChange={e => handleField('passport_expiry', e.target.value)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label style={labelStyle}>Issuing Country</label>
                                            <select style={inputStyle} value={form.passport_issuing_country} onChange={e => handleField('passport_issuing_country', e.target.value)}>
                                                <option value="">Issuing Country</option>
                                                {COUNTRY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0 28px' }} />

                                {/* ── Contact Information ── */}
                                <div style={{ marginBottom: '32px' }}>
                                    <div style={sectionTitleStyle}>Add contact information to receive booking details & other alerts</div>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label style={labelStyle}>Mobile Number</label>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1.5px solid #e0e0e0', borderRadius: '6px', padding: '0 12px', background: '#f8f9fa', flexShrink: 0, fontSize: '14px', fontWeight: 600, color: '#333' }}>
                                                    🇮🇳 +91 <i className="fa-solid fa-chevron-down ms-1" style={{ fontSize: '10px', color: '#888' }} />
                                                </div>
                                                <input type="tel" style={inputStyle} value={form.mobile} onChange={e => handleField('mobile', e.target.value)} placeholder="Mobile Number" maxLength={10} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label style={labelStyle}>Email ID</label>
                                            <input type="email" style={inputStyle} value={form.email} onChange={e => handleField('email', e.target.value)} placeholder="Email ID" />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0 28px' }} />

                                {/* ── Frequent Flyer Details ── */}
                                <div style={{ marginBottom: '32px' }}>
                                    <div style={sectionTitleStyle}>Frequent Flyer Details</div>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label style={labelStyle}>Airline</label>
                                            <select style={inputStyle} value={form.airline} onChange={e => handleField('airline', e.target.value)}>
                                                <option value="">Airline</option>
                                                {AIRLINE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label style={labelStyle}>Frequent Flyer Number</label>
                                            <input style={inputStyle} value={form.frequent_flyer_number} onChange={e => handleField('frequent_flyer_number', e.target.value)} placeholder="Frequent Flyer Number" />
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Save */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
                                    <button onClick={handleCancel} style={{ padding: '12px 28px', background: '#fff', border: '1.5px solid #ccc', borderRadius: '8px', fontWeight: 700, fontSize: '14px', color: '#555', cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                    <button onClick={handleSave} disabled={saving} className="th-btn" style={{ padding: '12px 36px', fontSize: '14px', fontWeight: 700, borderRadius: '8px' }}>
                                        {saving ? 'Saving...' : 'Save Co-Traveller'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoTravellers;
