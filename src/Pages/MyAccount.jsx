import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import MyAccountHeader from '../Components/MyAccountHeader';
import MyAccountSidebar from '../Components/MyAccountSidebar';

const GENDER_OPTIONS = ['Male', 'Female', 'Non-Binary', 'Prefer Not to Say'];
const NATIONALITY_OPTIONS = ['Indian', 'American', 'British', 'Canadian', 'Australian', 'Other'];
const MARITAL_OPTIONS = ['Single', 'Married', 'Divorced', 'Widowed'];
const COUNTRY_OPTIONS = ['India', 'USA', 'UK', 'Canada', 'Australia', 'UAE', 'Other'];

const inputStyle = {
    border: '1.5px solid #e0e0e0',
    borderRadius: '6px',
    padding: '14px 16px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#555',
    background: '#fff',
    outline: 'none',
    width: '100%',
    letterSpacing: '0.3px',
    transition: 'border-color 0.2s',
};

const labelStyle = {
    fontSize: '11px',
    fontWeight: 700,
    color: '#888',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    marginBottom: '4px',
    display: 'block',
};

const sectionTitleStyle = {
    fontWeight: 700,
    fontSize: '18px',
    color: '#222',
    marginBottom: '6px',
};

const sectionSubStyle = {
    fontSize: '13px',
    color: '#888',
    marginBottom: '20px',
};

const MyAccount = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        gender: '',
        date_of_birth: '',
        nationality: '',
        marital_status: '',
        anniversary: '',
        city_of_residence: '',
        state: '',
        passport_no: '',
        passport_expiry: '',
        passport_issuing_country: '',
        pan_card_number: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { setLoading(false); return; }
            setUser(session.user);

            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (data) {
                setProfile(prev => ({
                    ...prev,
                    ...data,
                    email: session.user.email,
                    date_of_birth: data.date_of_birth || '',
                    anniversary: data.anniversary || '',
                    passport_expiry: data.passport_expiry || '',
                }));
                if (data.avatar_url) setAvatarUrl(data.avatar_url);
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setSaveMsg('Image must be less than 5MB.');
            return;
        }

        setUploading(true);
        setSaveMsg('');

        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/avatar.${fileExt}`;

        // Upload to Supabase Storage bucket: profile-images
        const { error: uploadError } = await supabase.storage
            .from('profile-images')
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            setSaveMsg('Photo upload failed. Please try again.');
            setUploading(false);
            return;
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
            .from('profile-images')
            .getPublicUrl(filePath);

        const publicUrl = urlData?.publicUrl;

        // Save URL to user_profiles
        const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id);

        if (updateError) {
            setSaveMsg('Photo saved but profile update failed.');
        } else {
            setAvatarUrl(publicUrl + '?t=' + Date.now()); // cache-bust
            setSaveMsg('Profile photo updated successfully!');
            setTimeout(() => setSaveMsg(''), 3000);
        }

        setUploading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveMsg('');
        const { error } = await supabase
            .from('user_profiles')
            .update({
                first_name: profile.first_name,
                last_name: profile.last_name,
                phone: profile.phone,
                gender: profile.gender,
                date_of_birth: profile.date_of_birth || null,
                nationality: profile.nationality,
                marital_status: profile.marital_status,
                anniversary: profile.anniversary || null,
                city_of_residence: profile.city_of_residence,
                state: profile.state,
                passport_no: profile.passport_no,
                passport_expiry: profile.passport_expiry || null,
                passport_issuing_country: profile.passport_issuing_country,
                pan_card_number: profile.pan_card_number,
            })
            .eq('id', user.id);

        setSaving(false);
        if (error) {
            setSaveMsg('Error saving. Please try again.');
        } else {
            setSaveMsg('Profile saved successfully!');
            setTimeout(() => setSaveMsg(''), 3000);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f5f6' }}>
                <div style={{ padding: '2rem', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <i className="fa-solid fa-spinner fa-spin me-2" />Loading profile...
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#f4f5f6', minHeight: '100vh', paddingBottom: '80px' }}>
            <MyAccountHeader
                title="My Account"
                user={user}
                avatarUrl={avatarUrl}
                onPhotoChange={handlePhotoChange}
                uploading={uploading}
            />

            <div className="container" style={{ marginTop: '30px' }}>
                <div className="row g-0" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                    
                    {/* Sidebar */}
                    <div className="col-md-3" style={{ borderRight: '1px solid #f0f0f0' }}>
                        <MyAccountSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9" style={{ padding: '32px 40px' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h4 style={{ fontWeight: 700, fontSize: '22px', margin: 0 }}>My Profile</h4>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{
                                    padding: '10px 24px', background: '#fff', border: '1.5px solid #ccc',
                                    borderRadius: '6px', fontWeight: 700, fontSize: '13px', letterSpacing: '0.5px',
                                    color: '#555', cursor: 'pointer', transition: 'all 0.2s',
                                }}
                            >
                                {saving ? 'SAVING...' : 'SAVE'}
                            </button>
                        </div>

                        {saveMsg && (
                            <div style={{
                                background: saveMsg.includes('Error') ? '#fde8e8' : '#d1fae5',
                                color: saveMsg.includes('Error') ? '#c53030' : '#065f46',
                                padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: 600
                            }}>
                                <i className={`fa-solid ${saveMsg.includes('Error') ? 'fa-circle-xmark' : 'fa-circle-check'} me-2`} />
                                {saveMsg}
                            </div>
                        )}

                        {/* Gender Banner */}
                        <div style={{
                            background: '#f0f8ff', border: '1px solid #d0e8fb', borderRadius: '10px',
                            padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            marginBottom: '28px'
                        }}>
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #a8edea, #fed6e3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-person-half-dress" style={{ fontSize: '22px', color: '#555' }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#333' }}>Let us personalize your travel!</div>
                                    <div style={{ fontSize: '13px', color: '#888' }}>Tell us your gender to help us plan better trips for you!</div>
                                </div>
                            </div>
                            <button
                                onClick={() => document.getElementById('gender-select').focus()}
                                style={{ background: 'none', border: 'none', color: '#0077cc', fontWeight: 700, cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}
                            >
                                Add Gender
                            </button>
                        </div>

                        {/* ── General Information ── */}
                        <div style={{ marginBottom: '36px' }}>
                            <div style={sectionTitleStyle}>General Information</div>
                            <div style={sectionSubStyle}></div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label style={labelStyle}>First & Middle Name</label>
                                    <input
                                        style={inputStyle}
                                        value={profile.first_name}
                                        onChange={e => handleChange('first_name', e.target.value)}
                                        placeholder="First & Middle Name"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label style={labelStyle}>Last Name</label>
                                    <input
                                        style={inputStyle}
                                        value={profile.last_name}
                                        onChange={e => handleChange('last_name', e.target.value)}
                                        placeholder="Last Name"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label style={labelStyle}>Gender</label>
                                    <select
                                        id="gender-select"
                                        style={inputStyle}
                                        value={profile.gender}
                                        onChange={e => handleChange('gender', e.target.value)}
                                    >
                                        <option value="">Gender</option>
                                        {GENDER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label style={labelStyle}>Date of Birth</label>
                                    <input
                                        type="date"
                                        style={inputStyle}
                                        value={profile.date_of_birth}
                                        onChange={e => handleChange('date_of_birth', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label style={labelStyle}>Nationality</label>
                                    <select
                                        style={inputStyle}
                                        value={profile.nationality}
                                        onChange={e => handleChange('nationality', e.target.value)}
                                    >
                                        <option value="">Nationality</option>
                                        {NATIONALITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label style={labelStyle}>Marital Status</label>
                                    <select
                                        style={inputStyle}
                                        value={profile.marital_status}
                                        onChange={e => handleChange('marital_status', e.target.value)}
                                    >
                                        <option value="">Marital Status</option>
                                        {MARITAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label style={labelStyle}>Anniversary</label>
                                    <input
                                        type="date"
                                        style={inputStyle}
                                        value={profile.anniversary}
                                        onChange={e => handleChange('anniversary', e.target.value)}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label style={labelStyle}>City of Residence</label>
                                    <input
                                        style={inputStyle}
                                        value={profile.city_of_residence}
                                        onChange={e => handleChange('city_of_residence', e.target.value)}
                                        placeholder="City of Residence"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label style={labelStyle}>State</label>
                                    <input
                                        style={inputStyle}
                                        value={profile.state}
                                        onChange={e => handleChange('state', e.target.value)}
                                        placeholder="State"
                                    />
                                    <div style={{ fontSize: '11px', color: '#e74c3c', marginTop: '4px' }}>
                                        Required for GST purpose on your tax invoice
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0 32px' }} />

                        {/* ── Contact Details ── */}
                        <div style={{ marginBottom: '36px' }}>
                            <div style={sectionTitleStyle}>Contact Details</div>
                            <div style={sectionSubStyle}>Add contact information to receive booking details & other alerts</div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label style={labelStyle}>Mobile Number</label>
                                    <input
                                        type="tel"
                                        style={{ ...inputStyle, color: '#0077cc', fontWeight: 700 }}
                                        value={profile.phone}
                                        onChange={e => handleChange('phone', e.target.value)}
                                        placeholder="ADD MOBILE NUMBER"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label style={labelStyle}>Email ID</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="email"
                                            style={{ ...inputStyle, paddingRight: '40px' }}
                                            value={profile.email}
                                            readOnly
                                        />
                                        <i className="fa-solid fa-circle-check" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#20c997', fontSize: '16px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0 32px' }} />

                        {/* ── Documents Details ── */}
                        <div style={{ marginBottom: '36px' }}>
                            <div style={sectionTitleStyle}>Documents Details</div>
                            <div style={sectionSubStyle}></div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label style={labelStyle}>Passport No.</label>
                                    <input
                                        style={inputStyle}
                                        value={profile.passport_no}
                                        onChange={e => handleChange('passport_no', e.target.value)}
                                        placeholder="Passport No."
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label style={labelStyle}>Expiry Date</label>
                                    <input
                                        type="date"
                                        style={inputStyle}
                                        value={profile.passport_expiry}
                                        onChange={e => handleChange('passport_expiry', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label style={labelStyle}>Issuing Country</label>
                                    <select
                                        style={inputStyle}
                                        value={profile.passport_issuing_country}
                                        onChange={e => handleChange('passport_issuing_country', e.target.value)}
                                    >
                                        <option value="">Issuing Country</option>
                                        {COUNTRY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label style={labelStyle}>PAN Card Number</label>
                                    <input
                                        style={inputStyle}
                                        value={profile.pan_card_number}
                                        onChange={e => handleChange('pan_card_number', e.target.value.toUpperCase())}
                                        placeholder="PAN Card Number"
                                        maxLength={10}
                                    />
                                </div>
                                <div className="col-12">
                                    <div style={{ fontSize: '12px', color: '#e74c3c', fontWeight: 600 }}>
                                        <span style={{ fontWeight: 800 }}>NOTE: </span>
                                        Your PAN No. will only be used for international bookings as per RBI Guidelines.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0 32px' }} />

                        {/* ── Auto-Add Travel Insurance ── */}
                        <div style={{ marginBottom: '36px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <div style={sectionTitleStyle}>Auto-Add Travel Insurance/Trip Secure</div>
                                <i className="fa-solid fa-circle-info" style={{ color: '#0077cc', fontSize: '16px' }} />
                            </div>
                            <div style={sectionSubStyle}>
                                Set your default choice for travel insurance/trip secure to be added automatically on your future flights and hotel bookings.
                            </div>

                            <div style={{ border: '1px solid #eaeaea', borderRadius: '8px', overflow: 'hidden' }}>
                                {[
                                    { context: 'On booking a Domestic Hotel:', label: 'Add Trip Secure (Hotels)' },
                                    { context: 'On booking a Domestic Flight:', label: 'Add Trip Secure (Flights)' },
                                    { context: 'On booking an International Hotel:', label: 'Add International Travel & Medical Insurance (Hotels)' },
                                    { context: 'On booking an International Flight:', label: 'Add International Travel & Medical Insurance (Flights)' },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '16px 20px', borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none',
                                        background: '#fff'
                                    }}>
                                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '13px', color: '#888', minWidth: '220px' }}>{item.context}</span>
                                            <span style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>{item.label}</span>
                                        </div>
                                        <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0 32px' }} />

                        {/* ── Frequent Flyer ── */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={sectionTitleStyle}>Frequent Flyer Details</div>
                            <button style={{
                                background: 'none', border: 'none', color: '#0077cc', fontWeight: 700, cursor: 'pointer',
                                padding: '8px 0', fontSize: '14px', marginTop: '8px'
                            }}>
                                + Add
                            </button>
                        </div>

                        {/* Bottom Save Button */}
                        <div style={{ textAlign: 'right', marginTop: '20px' }}>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="th-btn"
                                style={{ padding: '13px 40px', fontSize: '15px', fontWeight: 700, borderRadius: '8px' }}
                            >
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
