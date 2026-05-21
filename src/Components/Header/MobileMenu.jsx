import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

function MobileMenu({ isOpen, onClose, onLoginClick }) {
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRefs = useRef({});

    // Auth state
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("");

    // Toggle dropdown menu
    const toggleMenu = (index) => {
        setActiveMenu(activeMenu === index ? null : index);
    };

    // Apply height animation when activeMenu changes
    useEffect(() => {
        Object.keys(menuRefs.current).forEach((key) => {
            const submenu = menuRefs.current[key];
            if (submenu) {
                submenu.style.height = activeMenu == key ? `${submenu.scrollHeight}px` : "0px";
            }
        });
    }, [activeMenu]);

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
        await supabase.auth.signOut();
        onClose();
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        onClose();
        if (onLoginClick) {
            onLoginClick();
        }
    };

    return (
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
                        {/* Home */}
                        <li>
                            <Link to="/" onClick={onClose}>Home</Link>
                        </li>

                        {/* Explore Tours */}
                        <li className={`menu-item-has-children th-item-has-children ${activeMenu === 2 ? "th-active" : ""}`}>
                            <Link to="#" onClick={() => toggleMenu(2)}>Explore Tours</Link>
                            <ul
                                ref={(el) => (menuRefs.current[2] = el)}
                                className="th-submenu"
                                style={{ height: "0px", overflow: "hidden", transition: "height 0.3s ease-in-out" }}
                            >
                                <li><Link to="/destination" onClick={onClose}>All Tours</Link></li>
                                <li><Link to="/destination/inbound" onClick={onClose}>Inbound (India)</Link></li>
                                <li><Link to="/destination/outbound" onClick={onClose}>Outbound (International)</Link></li>
                            </ul>
                        </li>

                        {/* Visa */}
                        <li>
                            <Link to="/visa" onClick={onClose}>Visa</Link>
                        </li>

                        {/* Cruises */}
                        <li>
                            <Link to="/cruise" onClick={onClose}>Cruises</Link>
                        </li>

                        {/* About Us */}
                        <li>
                            <Link to="/about" onClick={onClose}>About Us</Link>
                        </li>

                        {/* Magzine */}
                        <li>
                            <Link to="/blog" onClick={onClose}>Magzine</Link>
                        </li>

                        {/* FAQ */}
                        <li>
                            <Link to="/faq" onClick={onClose}>FAQ</Link>
                        </li>

                        {/* Support */}
                        <li>
                            <Link to="/contact" onClick={onClose}>Support</Link>
                        </li>

                        {/* Account Section */}
                        {user ? (
                            <li className={`menu-item-has-children th-item-has-children ${activeMenu === 9 ? "th-active" : ""}`}>
                                <Link to="#" onClick={() => toggleMenu(9)}>Hi, {userName}</Link>
                                <ul
                                    ref={(el) => (menuRefs.current[9] = el)}
                                    className="th-submenu"
                                    style={{ height: "0px", overflow: "hidden", transition: "height 0.3s ease-in-out" }}
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
    );
}

export default MobileMenu;
