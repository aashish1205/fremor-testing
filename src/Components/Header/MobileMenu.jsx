import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

function MobileMenu({ isOpen, onClose, onLoginClick }) {
    const [menuItems, setMenuItems] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState({});

    // Auth state
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("");
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Toggle submenu
    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    // Fetch navigation data & auth
    useEffect(() => {
        const fetchNavData = async () => {
            try {
                setLoading(true);
                const { data: menuData, error: menuErr } = await supabase
                    .from('navbar_items')
                    .select('*')
                    .order('order_index', { ascending: true });

                const { data: destData, error: destErr } = await supabase
                    .from('destinations')
                    .select('id, title, category, continent')
                    .order('title', { ascending: true });

                if (!menuErr) setMenuItems(menuData || []);
                if (!destErr) setPackages(destData || []);
            } catch (err) {
                console.error('Failed to load mobile navigation data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNavData();
    }, []);

    // Fetch user and listen for changes
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                extractName(session.user);
            }
        };
        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user);
                extractName(session.user);
            } else {
                setUser(null);
                setUserName("");
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const extractName = (userObj) => {
        const metadata = userObj.user_metadata || {};
        if (metadata.full_name) {
            setUserName(metadata.full_name);
        } else if (metadata.first_name) {
            setUserName(`${metadata.first_name} ${metadata.last_name || ''}`.trim());
        } else {
            setUserName("User");
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        setIsLoggingOut(true);
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsLoggingOut(false);
            onClose();
        }
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        onClose();
        if (onLoginClick) {
            onLoginClick();
        }
    };

    // Packages filtering
    const getOutboundPackages = (continentName) => {
        return packages.filter(p => 
            p.category === 'Outbound' && 
            p.continent && 
            p.continent.toLowerCase() === continentName.toLowerCase()
        );
    };

    const getInboundPackages = () => {
        return packages.filter(p => p.category === 'Inbound');
    };

    const getDomesticPackages = () => {
        return packages.filter(p => p.category === 'Domestic');
    };

    // Tree builder (recursive to support multi-level hierarchies)
    const buildMenuTree = () => {
        if (menuItems.length === 0) return [];
        
        const getChildren = (parentId) => {
            const list = menuItems.filter(item => item.parent_id === parentId);
            return list
                .sort((a, b) => a.order_index - b.order_index)
                .map(item => ({
                    ...item,
                    children: getChildren(item.id)
                }));
        };

        const topLevel = menuItems.filter(item => !item.parent_id);
        return topLevel
            .sort((a, b) => a.order_index - b.order_index)
            .map(parent => ({
                ...parent,
                children: getChildren(parent.id)
            }));
    };

    // Fallback menu tree if database is empty/failed
    const fallbackTree = [
        {
            id: 'fb-home',
            label: 'Home',
            url: '/',
            children: []
        },
        {
            id: 'fb-explore',
            label: 'Explore Tours',
            url: '/destination',
            children: [
                { 
                    id: 'fb-outbound', 
                    label: 'Outbound (Global)', 
                    url: '/destination/outbound', 
                    special_type: 'outbound_mega',
                    children: [
                        { id: 'fb-cont-europe', label: 'Europe', url: '/destination/outbound/europe' },
                        { id: 'fb-cont-africa', label: 'Africa', url: '/destination/outbound/africa' },
                        { id: 'fb-cont-na', label: 'North America', url: '/destination/outbound/north-america' },
                        { id: 'fb-cont-sa', label: 'South America', url: '/destination/outbound/south-america' },
                        { id: 'fb-cont-aus', label: 'Australia', url: '/destination/outbound/australia' }
                    ]
                },
                { id: 'fb-inbound', label: 'Inbound (India)', url: '/destination/inbound', special_type: 'inbound_dropdown', children: [] },
                { id: 'fb-domestic', label: 'Domestic', url: '/destination/domestic', special_type: 'domestic_dropdown', children: [] }
            ]
        },
        {
            id: 'fb-visa',
            label: 'Visa',
            url: '/visa',
            children: []
        },
        {
            id: 'fb-cruise',
            label: 'Cruises',
            url: '/cruise',
            children: []
        },
        {
            id: 'fb-about',
            label: 'About Us',
            url: '/about',
            children: [
                { id: 'fb-story', label: 'Our Story', url: '/about' },
                { id: 'fb-faq', label: 'FAQ', url: '/faq' },
                { id: 'fb-support', label: 'Support', url: '/contact' }
            ]
        }
    ];

    const dbTree = buildMenuTree();
    const tree = dbTree.length > 0 ? dbTree : fallbackTree;

    // Render mobile list item recursively
    const renderMobileItem = (item) => {
        // Special Type 1: Outbound Mega (Continents Dropdown)
        if (item.special_type === 'outbound_mega') {
            const isExpanded = expandedMenus[item.id];
            const defaultContinents = [
                { id: 'fb-cont-europe', label: 'Europe', url: '/destination/outbound/europe' },
                { id: 'fb-cont-africa', label: 'Africa', url: '/destination/outbound/africa' },
                { id: 'fb-cont-na', label: 'North America', url: '/destination/outbound/north-america' },
                { id: 'fb-cont-sa', label: 'South America', url: '/destination/outbound/south-america' },
                { id: 'fb-cont-aus', label: 'Australia', url: '/destination/outbound/australia' }
            ];
            const childrenToRender = item.children && item.children.length > 0 ? item.children : defaultContinents;
            
            return (
                <li key={item.id} className={`menu-item-has-children th-item-has-children ${isExpanded ? 'th-active' : ''}`}>
                    <Link to="#" onClick={(e) => { e.preventDefault(); toggleMenu(item.id); }}>{item.label}</Link>
                    <ul className="th-submenu" style={{
                        maxHeight: isExpanded ? '500px' : '0px',
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease-in-out',
                        paddingLeft: '15px'
                    }}>
                        {childrenToRender.map(child => (
                            <li key={child.id}>
                                <Link to={child.url} onClick={onClose}>
                                    <i className="fa-solid fa-earth-americas me-2" style={{ fontSize: '11px', color: '#FFB114' }}></i>
                                    {child.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>
            );
        }

        // Special Type 2: Inbound Dropdown (Direct Link)
        if (item.special_type === 'inbound_dropdown') {
            return (
                <li key={item.id}>
                    <Link to={item.url || '/destination/inbound'} onClick={onClose}>{item.label}</Link>
                </li>
            );
        }

        // Special Type 3: Domestic Dropdown (Direct Link)
        if (item.special_type === 'domestic_dropdown') {
            return (
                <li key={item.id}>
                    <Link to={item.url || '/destination/domestic'} onClick={onClose}>{item.label}</Link>
                </li>
            );
        }

        // Case 4: Standard Dropdowns or Mega Columns
        if (item.children && item.children.length > 0) {
            const isExpanded = expandedMenus[item.id];
            return (
                <li key={item.id} className={`menu-item-has-children th-item-has-children ${isExpanded ? 'th-active' : ''}`}>
                    <Link to="#" onClick={(e) => { e.preventDefault(); toggleMenu(item.id); }}>{item.label}</Link>
                    <ul className="th-submenu" style={{
                        maxHeight: isExpanded ? '1000px' : '0px',
                        overflow: 'hidden',
                        transition: 'max-height 0.35s ease-in-out',
                        paddingLeft: '15px'
                    }}>
                        {item.children.map(child => {
                            const hasSub = (child.children && child.children.length > 0) ||
                                           child.special_type === 'outbound_mega' ||
                                           child.special_type === 'inbound_dropdown' ||
                                           child.special_type === 'domestic_dropdown';
                            if (hasSub) {
                                return renderMobileItem(child);
                            }
                            return (
                                <li key={child.id}>
                                    <Link to={child.url} onClick={onClose}>{child.label}</Link>
                                </li>
                            );
                        })}
                    </ul>
                </li>
            );
        }

        // Case 5: Simple Link
        return (
            <li key={item.id}>
                <Link to={item.url || '#'} onClick={onClose}>{item.label}</Link>
            </li>
        );
    };

    return (
        <>
            {isLoggingOut && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    zIndex: 999999,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "fadeIn 0.3s ease"
                }}>
                    <div style={{
                        width: "55px",
                        height: "55px",
                        border: "4px solid rgba(231, 76, 60, 0.15)",
                        borderTop: "4px solid var(--theme-color, #e74c3c)",
                        borderRadius: "50%",
                        animation: "spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                        boxShadow: "0 10px 30px rgba(231, 76, 60, 0.15)",
                        marginBottom: "20px"
                    }} />
                    <h4 style={{
                        fontFamily: "var(--title-font, sans-serif)",
                        fontWeight: 700,
                        color: "#1b1b1b",
                        fontSize: "18px",
                        letterSpacing: "0.5px",
                        margin: 0,
                        textAlign: "center"
                    }}>
                        Signing Out...
                    </h4>
                    <p style={{
                        fontSize: "13px",
                        color: "#777",
                        marginTop: "6px",
                        marginBottom: 0
                    }}>
                        Securing your session
                    </p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
            <div className={`th-menu-wrapper onepage-nav ${isOpen ? "th-body-visible" : ""}`}
                style={{ visibility: isOpen ? "visible" : "hidden" }}>

                <div className="th-menu-area text-center" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
                    <button 
                        className="th-menu-toggle" 
                        onClick={onClose} 
                        aria-label="Close"
                        style={{ 
                            right: '15px', 
                            top: '15px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            lineHeight: 'normal' 
                        }}
                    >
                        <i className="far fa-times" />
                    </button>

                    <div className="mobile-logo">
                        <Link to="/" onClick={onClose}>
                            <img src="/assets/img/logo/FremorLogoblack.png" alt="Fremor" style={{ width: "140px", height: "auto", maxWidth: "140px" }}/>
                        </Link>
                    </div>

                    <div className="th-mobile-menu">
                        <ul>
                            {tree.map(item => renderMobileItem(item))}

                            {/* Dynamic Auth/Account Links */}
                            {user ? (
                                <li className={`menu-item-has-children th-item-has-children ${expandedMenus['account'] ? "th-active" : ""}`}>
                                    <Link to="#" onClick={(e) => { e.preventDefault(); toggleMenu('account'); }}>Hi, {userName}</Link>
                                    <ul
                                        className="th-submenu"
                                        style={{
                                            maxHeight: expandedMenus['account'] ? '200px' : '0px',
                                            overflow: "hidden",
                                            transition: "max-height 0.3s ease-in-out",
                                            paddingLeft: '15px'
                                        }}
                                    >
                                        <li><Link to="/my-account" onClick={onClose}>My Profile</Link></li>
                                        <li>
                                            <Link to="#" onClick={handleLogout} style={{ color: "#c53030" }}>
                                                Logout
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            ) : (
                                <li>
                                    <Link to="#" onClick={handleLoginClick}>
                                        Login / Create Account
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Contact and Social details at the bottom of the Mobile Menu */}
                    <div style={{ marginTop: '40px', padding: '0 20px', borderTop: '1px solid #eee', paddingTop: '30px', textAlign: 'left' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px', color: '#111' }}>Get In Touch</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '14px', color: '#666' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <i className="fa-sharp fa-regular fa-location-dot" style={{ color: 'var(--theme-color)', width: '16px', marginTop: '4px' }} />
                                <span>11th floor, Urmi Estate Ganpatrao Kadam Marg, Lower Parel-west, Mumbai- 400013</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fa-regular fa-clock" style={{ color: 'var(--theme-color)', width: '16px' }} />
                                <span>Monday to Saturday: 8.00 am - 7.00 pm</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fa-regular fa-phone" style={{ color: 'var(--theme-color)', width: '16px' }} />
                                <Link to="tel:+919920499911" style={{ color: 'inherit', textDecoration: 'none' }}>+91 9920499911</Link>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fa-regular fa-envelope" style={{ color: 'var(--theme-color)', width: '16px' }} />
                                <Link to="mailto:connect@fremorglobal.com" style={{ color: 'inherit', textDecoration: 'none' }}>connect@fremorglobal.com</Link>
                            </div>
                        </div>
                        
                        {/* Social links */}
                        <div className="th-social" style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
                            <a href="https://www.facebook.com/people/Fremor-global/61562522722104/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ddd', color: '#555', textDecoration: 'none' }}>
                                <i className="fab fa-facebook-f" />
                            </a>
                            <a href="https://in.linkedin.com/company/fremor-global" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ddd', color: '#555', textDecoration: 'none' }}>
                                <i className="fab fa-linkedin-in" />
                            </a>
                            <a href="https://www.instagram.com/fremorglobal/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ddd', color: '#555', textDecoration: 'none' }}>
                                <i className="fab fa-instagram" />
                            </a>
                            <a href="https://www.whatsapp.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ddd', color: '#555', textDecoration: 'none' }}>
                                <i className="fab fa-whatsapp" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MobileMenu;
