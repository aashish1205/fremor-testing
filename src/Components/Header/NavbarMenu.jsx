import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function NavbarMenu({ split }) {
    const location = useLocation();
    const [menuItems, setMenuItems] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    const isActive = (path) => location.pathname === path;
    const isParentActive = (paths) => paths.some(path => location.pathname.startsWith(path));

    useEffect(() => {
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        try {
            setLoading(true);
            
            // 1. Fetch Navbar config
            const { data: menuData, error: menuErr } = await supabase
                .from('navbar_items')
                .select('*')
                .order('order_index', { ascending: true });

            // 2. Fetch Packages (destinations)
            const { data: destData, error: destErr } = await supabase
                .from('destinations')
                .select('id, title, category, continent')
                .order('title', { ascending: true });

            if (menuErr) {
                console.warn('Navbar items fetch failed, using fallback static menu:', menuErr);
            } else {
                setMenuItems(menuData || []);
            }

            if (destErr) {
                console.warn('Destinations fetch failed for dynamic navbar links:', destErr);
            } else {
                setPackages(destData || []);
            }

        } catch (err) {
            console.error('Failed to load navigation data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter packages by category and continent
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

    // Tree builder helper (recursive to support multi-level hierarchies)
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

    // Apply splitting if split prop is set
    let itemsToRender = tree;
    if (split === 'left') {
        itemsToRender = tree.slice(0, Math.ceil(tree.length / 2));
    } else if (split === 'right') {
        itemsToRender = tree.slice(Math.ceil(tree.length / 2));
    }

    // RENDER: Render a single top-level item
    const renderMenuItem = (item) => {
        // Special Type Case 1: Outbound Mega Menu (Continents Dropdown)
        if (item.special_type === 'outbound_mega') {
            const defaultContinents = [
                { id: 'fb-cont-europe', label: 'Europe', url: '/destination/outbound/europe' },
                { id: 'fb-cont-africa', label: 'Africa', url: '/destination/outbound/africa' },
                { id: 'fb-cont-na', label: 'North America', url: '/destination/outbound/north-america' },
                { id: 'fb-cont-sa', label: 'South America', url: '/destination/outbound/south-america' },
                { id: 'fb-cont-aus', label: 'Australia', url: '/destination/outbound/australia' }
            ];
            const childrenToRender = item.children && item.children.length > 0 ? item.children : defaultContinents;
            
            return (
                <li key={item.id} className="menu-item-has-children">
                    <Link to={item.url || '/destination/outbound'}>
                        {item.label}
                    </Link>
                    <ul className="sub-menu">
                        {childrenToRender.map(child => (
                            <li key={child.id}>
                                <Link to={child.url}>{child.label}</Link>
                            </li>
                        ))}
                    </ul>
                </li>
            );
        }

        // Special Type Case 2: Inbound Dropdown Menu (Direct Link)
        if (item.special_type === 'inbound_dropdown') {
            return (
                <li key={item.id}>
                    <Link className={isActive(item.url || '/destination/inbound') ? 'active' : ''} to={item.url || '/destination/inbound'}>
                        {item.label}
                    </Link>
                </li>
            );
        }

        // Special Type Case 3: Domestic Dropdown Menu (Direct Link)
        if (item.special_type === 'domestic_dropdown') {
            return (
                <li key={item.id}>
                    <Link className={isActive(item.url || '/destination/domestic') ? 'active' : ''} to={item.url || '/destination/domestic'}>
                        {item.label}
                    </Link>
                </li>
            );
        }

        // Case 4: Mega Dropdown (Grouped manually in DB)
        if (item.is_mega && item.children && item.children.length > 0) {
            // Group children by mega_group
            const groups = {};
            item.children.forEach(child => {
                const groupName = child.mega_group || 'More Links';
                if (!groups[groupName]) groups[groupName] = [];
                groups[groupName].push(child);
            });

            return (
                <li key={item.id} className="menu-item-has-children mega-menu-wrap">
                    <Link to={item.url || '#'}>
                        {item.label}
                    </Link>
                    <ul className="mega-menu" style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${Math.max(Object.keys(groups).length, 1)}, 1fr)`,
                        gap: '24px',
                        padding: '30px 40px',
                        width: '100%',
                        maxWidth: '1200px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                        borderRadius: '12px',
                        boxSizing: 'border-box',
                        left: '50% !important',
                        transform: 'translateX(-50%)',
                        border: '1px solid #f1f5f9'
                    }}>
                        {Object.entries(groups).map(([groupName, groupLinks]) => (
                            <li key={groupName} style={{ listStyle: 'none' }}>
                                <div style={{
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    borderBottom: '2px solid var(--yellow-color)',
                                    paddingBottom: '8px',
                                    marginBottom: '15px',
                                    color: '#0d496e'
                                }}>
                                    {groupName}
                                </div>
                                <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {groupLinks.map(child => (
                                        <li key={child.id} style={{ padding: 0 }}>
                                            <Link 
                                                to={child.url}
                                                style={{ 
                                                    padding: '2px 0', 
                                                    fontSize: '13.5px', 
                                                    color: '#475569', 
                                                    textTransform: 'capitalize', 
                                                    display: 'block', 
                                                    transition: 'color 0.2s',
                                                    fontWeight: '500'
                                                }}
                                                onMouseOver={(e) => e.target.style.color = 'var(--yellow-color)'}
                                                onMouseOut={(e) => e.target.style.color = '#475569'}
                                            >
                                                {child.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </li>
            );
        }

        // Case 5: Standard Dropdown Group (updated to support nesting)
        if (item.children && item.children.length > 0) {
            return (
                <li key={item.id} className="menu-item-has-children">
                    <Link to={item.url || '#'}>
                        {item.label}
                    </Link>
                    <ul className="sub-menu">
                        {item.children.map(child => {
                            const hasSubmenu = (child.children && child.children.length > 0) || 
                                             child.special_type === 'outbound_mega' || 
                                             child.special_type === 'inbound_dropdown' || 
                                             child.special_type === 'domestic_dropdown';
                            if (hasSubmenu) {
                                return renderMenuItem(child);
                            }
                            return (
                                <li key={child.id}>
                                    <Link to={child.url}>{child.label}</Link>
                                </li>
                            );
                        })}
                    </ul>
                </li>
            );
        }

        // Case 6: Simple Link
        return (
            <li key={item.id}>
                <Link className={isActive(item.url) ? 'active' : ''} to={item.url || '#'}>
                    {item.label}
                </Link>
            </li>
        );
    };

    return (
        <>
            <style>{`
                /* Rounded corners for standard dropdown sub-menus */
                .main-menu ul.sub-menu {
                    border-radius: 12px !important;
                    border: 1px solid #f1f5f9 !important;
                    border-bottom: none !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
                }
                /* Color of the icon in standard dropdown sub-menus */
                .main-menu ul.sub-menu li a:before {
                    color: var(--theme-color) !important;
                }
            `}</style>
            <ul>
                {itemsToRender.map(item => renderMenuItem(item))}
            </ul>
        </>
    );
}
