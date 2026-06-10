import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function NotificationBell({ isAdmin }) {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [readIds, setReadIds] = useState(() => {
        try {
            const saved = localStorage.getItem('fremor_read_enquiries');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [triggerBounce, setTriggerBounce] = useState(false);

    // Save read IDs to localStorage when they change
    useEffect(() => {
        localStorage.setItem('fremor_read_enquiries', JSON.stringify(readIds));
    }, [readIds]);

    const formatEnquiry = (type, item) => {
        if (type === 'package') {
            return {
                id: item.id,
                type: 'package',
                name: item.full_name || 'Anonymous',
                target: item.destination_title || 'Custom Tour',
                created_at: item.created_at,
                status: item.status || 'Pending'
            };
        } else {
            return {
                id: item.id,
                type: 'visa',
                name: item.name || 'Anonymous',
                target: item.country || 'General Visa',
                created_at: item.created_at,
                status: item.status || 'Pending'
            };
        }
    };

    const fetchNotifications = async (silent = false) => {
        try {
            // Fetch pending package enquiries
            const { data: packageData, error: packageErr } = await supabase
                .from('package_enquiries')
                .select('id, full_name, destination_title, created_at, status')
                .or('status.eq.Pending,status.is.null')
                .order('created_at', { ascending: false });

            if (packageErr) throw packageErr;

            // Fetch pending visa enquiries
            const { data: visaData, error: visaErr } = await supabase
                .from('visa_enquiries')
                .select('id, name, country, created_at, status')
                .or('status.eq.Pending,status.is.null')
                .order('created_at', { ascending: false });

            if (visaErr) throw visaErr;

            const formattedPackages = (packageData || []).map(item => formatEnquiry('package', item));
            const formattedVisas = (visaData || []).map(item => formatEnquiry('visa', item));

            // Merge and sort by date descending
            const merged = [...formattedPackages, ...formattedVisas].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );

            setNotifications(prev => {
                // If silent and new items arrived, trigger animation
                if (silent && merged.length > prev.length) {
                    const hasNew = merged.some(m => !prev.some(p => p.id === m.id));
                    if (hasNew) {
                        setTriggerBounce(true);
                    }
                }
                return merged;
            });
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchNotifications();

        // Subscriptions to PostgreSQL changes for real-time
        const packageChannel = supabase
            .channel('realtime-package-enquiries')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'package_enquiries'
            }, (payload) => {
                handleRealtimeEvent('package', payload);
            })
            .subscribe();

        const visaChannel = supabase
            .channel('realtime-visa-enquiries')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'visa_enquiries'
            }, (payload) => {
                handleRealtimeEvent('visa', payload);
            })
            .subscribe();

        // 30s polling fallback in case websockets fail
        const pollInterval = setInterval(() => {
            fetchNotifications(true);
        }, 30000);

        // Click outside dropdown handler
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            supabase.removeChannel(packageChannel);
            supabase.removeChannel(visaChannel);
            clearInterval(pollInterval);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleRealtimeEvent = (type, payload) => {
        if (payload.eventType === 'INSERT') {
            const item = payload.new;
            if (item.status === 'Pending' || !item.status) {
                const newNotif = formatEnquiry(type, item);
                setNotifications(prev => {
                    if (prev.some(n => n.id === newNotif.id)) return prev;
                    setTriggerBounce(true);
                    return [newNotif, ...prev].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                });
            }
        } else if (payload.eventType === 'UPDATE') {
            const item = payload.new;
            if (item.status && item.status !== 'Pending') {
                // Enquiry status resolved, remove from notifications
                setNotifications(prev => prev.filter(n => n.id !== item.id));
            } else {
                const updatedNotif = formatEnquiry(type, item);
                setNotifications(prev => {
                    const filtered = prev.filter(n => n.id !== item.id);
                    return [updatedNotif, ...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                });
            }
        } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
        }
    };

    // Reset bounce animation trigger after it plays
    useEffect(() => {
        if (triggerBounce) {
            const timer = setTimeout(() => setTriggerBounce(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [triggerBounce]);

    // Unread check helper
    const isUnread = (notif) => !readIds.includes(notif.id);

    // Filter unread notifications
    const unreadCount = notifications.filter(isUnread).length;

    const handleMarkAllRead = () => {
        const allIds = notifications.map(n => n.id);
        setReadIds(prev => {
            const newRead = [...prev];
            allIds.forEach(id => {
                if (!newRead.includes(id)) {
                    newRead.push(id);
                }
            });
            return newRead;
        });
    };

    const handleItemClick = (notif) => {
        // Mark as read
        if (!readIds.includes(notif.id)) {
            setReadIds(prev => [...prev, notif.id]);
        }
        setIsOpen(false);

        // Redirect based on role and type
        const basePath = isAdmin ? '/admin' : '/team';
        if (notif.type === 'package') {
            navigate(`${basePath}/package-enquiries`);
        } else {
            navigate(`${basePath}/visa-enquiries`);
        }
    };

    const getRelativeTime = (dateString) => {
        if (!dateString) return 'Just now';
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays}d ago`;
    };

    return (
        <div className="notification-container" ref={dropdownRef}>
            <button 
                className={`notification-bell-btn ${isOpen ? 'active' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle notifications"
            >
                <i className={`fa-regular fa-bell bell-icon ${triggerBounce ? 'bounce' : ''}`}></i>
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h4>
                            Notifications
                            {unreadCount > 0 && (
                                <span className="unread-pill">{unreadCount} New</span>
                            )}
                        </h4>
                        {unreadCount > 0 && (
                            <button className="notification-mark-read" onClick={handleMarkAllRead}>
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="notification-empty">
                                <i className="fa-regular fa-bell-slash"></i>
                                <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem' }}>All Caught Up!</p>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                                    No pending package or visa enquiries.
                                </p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                    key={notif.id} 
                                    className={`notification-item ${isUnread(notif) ? 'unread' : ''}`}
                                    onClick={() => handleItemClick(notif)}
                                >
                                    <div className={`notification-icon-container ${notif.type}`}>
                                        {notif.type === 'package' ? (
                                            <i className="fa-solid fa-map-location-dot"></i>
                                        ) : (
                                            <i className="fa-solid fa-passport"></i>
                                        )}
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-title">
                                            <span>
                                                {notif.type === 'package' ? 'Tour Package Enquiry' : 'Visa Enquiry'}
                                            </span>
                                        </div>
                                        <div className="notification-desc">
                                            <strong>{notif.name}</strong> – {notif.target}
                                        </div>
                                        <div className="notification-time">
                                            <i className="fa-regular fa-clock"></i>
                                            {getRelativeTime(notif.created_at)}
                                        </div>
                                    </div>
                                    {isUnread(notif) && <div className="unread-dot"></div>}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="notification-footer">
                        <a 
                            href={isAdmin ? '/admin/package-enquiries' : '/team/package-enquiries'} 
                            className="notification-footer-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsOpen(false);
                                navigate(isAdmin ? '/admin/package-enquiries' : '/team/package-enquiries');
                            }}
                        >
                            Packages <i className="fa-solid fa-arrow-right ms-1"></i>
                        </a>
                        <a 
                            href={isAdmin ? '/admin/visa-enquiries' : '/team/visa-enquiries'} 
                            className="notification-footer-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsOpen(false);
                                navigate(isAdmin ? '/admin/visa-enquiries' : '/team/visa-enquiries');
                            }}
                        >
                            Visas <i className="fa-solid fa-arrow-right ms-1"></i>
                        </a>
                    </div>
                </div>
            )}

            <style>{`
                .notification-container {
                    position: relative;
                    display: inline-block;
                }
                .notification-bell-btn {
                    background: none;
                    border: none;
                    color: #64748b;
                    font-size: 1.25rem;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    outline: none;
                }
                .notification-bell-btn:hover {
                    color: #0f172a;
                    background-color: #f1f5f9;
                    transform: scale(1.05);
                }
                .notification-bell-btn.active {
                    color: #2563eb;
                    background-color: #eff6ff;
                }
                .notification-bell-btn .bell-icon.bounce {
                    animation: bellRing 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
                    transform-origin: top center;
                }
                .notification-badge {
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    background-color: #ef4444;
                    color: white;
                    font-size: 0.65rem;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-weight: 700;
                    line-height: 1;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
                    animation: badgePulse 1.5s infinite;
                }
                .notification-dropdown {
                    position: absolute;
                    top: calc(100% + 10px);
                    right: 0;
                    width: 360px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(226, 232, 240, 0.8);
                    border-radius: 16px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    z-index: 1000;
                    overflow: hidden;
                    animation: dropdownSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    transform-origin: top right;
                }
                .notification-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.25rem;
                    border-bottom: 1px solid #f1f5f9;
                }
                .notification-header h4 {
                    margin: 0;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #0f172a;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-family: 'Inter', sans-serif;
                }
                .notification-header .unread-pill {
                    background-color: #eff6ff;
                    color: #2563eb;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .notification-mark-read {
                    background: none;
                    border: none;
                    color: #2563eb;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 6px;
                    transition: all 0.2s;
                    font-family: 'Inter', sans-serif;
                }
                .notification-mark-read:hover {
                    background-color: #eff6ff;
                    color: #1d4ed8;
                }
                .notification-list {
                    max-height: 320px;
                    overflow-y: auto;
                }
                .notification-list::-webkit-scrollbar {
                    width: 6px;
                }
                .notification-list::-webkit-scrollbar-track {
                    background: transparent;
                }
                .notification-list::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                .notification-item {
                    display: flex;
                    gap: 12px;
                    padding: 0.85rem 1.25rem;
                    border-bottom: 1px solid #f8fafc;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                    font-family: 'Inter', sans-serif;
                    text-align: left;
                }
                .notification-item:hover {
                    background-color: #f8fafc;
                }
                .notification-item.unread {
                    background-color: rgba(239, 246, 255, 0.45);
                }
                .notification-item.unread:hover {
                    background-color: rgba(239, 246, 255, 0.75);
                }
                .notification-icon-container {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 1.1rem;
                }
                .notification-icon-container.package {
                    background-color: #eff6ff;
                    color: #2563eb;
                }
                .notification-icon-container.visa {
                    background-color: #fff7ed;
                    color: #ea580c;
                }
                .notification-content {
                    flex: 1;
                    min-width: 0;
                }
                .notification-title {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 2px;
                }
                .notification-desc {
                    font-size: 0.8rem;
                    color: #475569;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 4px;
                }
                .notification-time {
                    font-size: 0.72rem;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .unread-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #3b82f6;
                    position: absolute;
                    top: 50%;
                    right: 1.25rem;
                    transform: translateY(-50%);
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
                }
                .notification-empty {
                    padding: 2.5rem 1.5rem;
                    text-align: center;
                    color: #64748b;
                    font-family: 'Inter', sans-serif;
                }
                .notification-empty i {
                    font-size: 2rem;
                    color: #94a3b8;
                    margin-bottom: 0.75rem;
                    display: block;
                }
                .notification-footer {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    border-top: 1px solid #f1f5f9;
                    background-color: #f8fafc;
                    font-family: 'Inter', sans-serif;
                }
                .notification-footer-btn {
                    padding: 0.85rem 1rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #475569;
                    text-align: center;
                    text-decoration: none;
                    border-right: 1px solid #f1f5f9;
                    transition: all 0.2s;
                }
                .notification-footer-btn:last-child {
                    border-right: none;
                }
                .notification-footer-btn:hover {
                    background-color: #f1f5f9;
                    color: #2563eb;
                }
                
                @keyframes bellRing {
                    0% { transform: rotate(0); }
                    10% { transform: rotate(15deg); }
                    20% { transform: rotate(-10deg); }
                    30% { transform: rotate(8deg); }
                    40% { transform: rotate(-6deg); }
                    50% { transform: rotate(4deg); }
                    60% { transform: rotate(-2deg); }
                    70% { transform: rotate(0); }
                    100% { transform: rotate(0); }
                }
                @keyframes badgePulse {
                    0% { transform: scale(1); box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3); }
                    50% { transform: scale(1.15); box-shadow: 0 4px 8px rgba(239, 68, 68, 0.5); }
                    100% { transform: scale(1); box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3); }
                }
                @keyframes dropdownSlideIn {
                    from { opacity: 0; transform: scale(0.95) translateY(-10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}
