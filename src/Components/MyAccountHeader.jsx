import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const MyAccountHeader = ({ title, user, avatarUrl, onPhotoChange, uploading }) => {
    const fileInputRef = useRef(null);

    return (
        <div style={{
            position: 'relative',
            background: 'url(/assets/img/breadcumb/breadcumb-bg.jpg) no-repeat center center / cover',
            padding: '40px 0 20px',
            color: '#fff',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '14px', marginBottom: '40px' }}>
                    <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
                    <span style={{ margin: '0 10px', color: '#ddd' }}>›</span>
                    <span>{title}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

                        {/* Avatar Circle */}
                        <div
                            onClick={() => !uploading && fileInputRef.current?.click()}
                            title="Click to change photo"
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                border: '4px solid #fff',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                cursor: uploading ? 'wait' : 'pointer',
                                overflow: 'hidden',
                                position: 'relative',
                                flexShrink: 0,
                                background: avatarUrl ? 'transparent' : '#20c997',
                            }}
                        >
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Profile"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%', height: '100%',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: 600, fontSize: '12px'
                                }}>
                                    <i className="fa-solid fa-camera" style={{ fontSize: '22px', marginBottom: '4px' }} />
                                    Add Photo
                                </div>
                            )}

                            {/* Hover overlay */}
                            <div style={{
                                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '11px', fontWeight: 600, opacity: 0,
                                transition: 'opacity 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                onMouseLeave={e => e.currentTarget.style.opacity = 0}
                            >
                                {uploading ? (
                                    <><i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '20px' }} /><br />Uploading...</>
                                ) : (
                                    <><i className="fa-solid fa-camera" style={{ fontSize: '20px', marginBottom: '3px' }} /><br />Change Photo</>
                                )}
                            </div>
                        </div>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            style={{ display: 'none' }}
                            onChange={onPhotoChange}
                        />

                        <div>
                            <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '6px' }}>
                                {user?.user_metadata?.first_name
                                    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
                                    : user?.user_metadata?.full_name || 'Traveller'}
                            </div>
                            <div style={{ display: 'flex', gap: '20px', fontWeight: 500, fontSize: '14px', flexWrap: 'wrap' }}>
                                <span>
                                    <i className="fa-solid fa-phone me-2" style={{ color: '#aed6f1' }} />
                                    Add Mobile Number
                                </span>
                                <span>
                                    <i className="fa-solid fa-envelope me-2" style={{ color: '#aed6f1' }} />
                                    {user?.email || ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right side buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{
                            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
                            color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
                            padding: '9px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '13px',
                            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                        }}>
                            <span style={{ background: '#f1c40f', color: '#333', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>M</span>
                            myCash ₹ 0
                            <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', color: '#ccc' }} />
                        </button>
                        <button style={{
                            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
                            color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
                            padding: '9px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '13px',
                            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                        }}>
                            <i className="fa-solid fa-gift" style={{ color: '#3498db' }} />
                            Buy Gift Cards
                            <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', color: '#ccc' }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccountHeader;
