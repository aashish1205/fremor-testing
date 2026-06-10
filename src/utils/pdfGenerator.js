import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { getImageSrc } from '../services/destinationService';

// Preload image with CORS allowed to prevent canvas taint issues
const preloadImage = (src) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(src);
        img.onerror = () => resolve('/assets/img/tour/tour_3_1.jpg'); // Fallback if image fails
        img.src = src;
    });
};

const detectBaseCity = (dayObj, prevCity) => {
    const dayText = (dayObj.day || '').toLowerCase();
    const titleText = (dayObj.title || '').toLowerCase();
    const descText = (dayObj.description || '').toLowerCase();

    const knownCities = [
        'tokyo', 'kyoto', 'osaka', 
        'habarana', 'sigiriya', 'kandy', 'bentota', 'galle', 'colombo',
        'kuta', 'ubud', 'seminyak', 'nusa dua', 'sanur',
        'varanasi', 'prayagraj', 'ayodhya', 'lucknow',
        'phuket', 'krabi', 'bangkok', 'pattaya',
        'moscow', 'st. petersburg', 'saint petersburg',
        'thimphu', 'paro', 'punakha',
        'port blair', 'havelock', 'neil island', 'andaman'
    ];

    if (dayText.includes('→') || dayText.includes('->') || dayText.includes('to')) {
        const parts = dayText.split(/[→\->]|\bto\b/);
        const destinationPart = parts[parts.length - 1].trim();
        for (const city of knownCities) {
            if (destinationPart.includes(city)) {
                return city.charAt(0).toUpperCase() + city.slice(1);
            }
        }
    }

    const combined = `${titleText} ${descText}`;
    if (combined.includes('transfer to') || combined.includes('check-in at') || combined.includes('stay in') || combined.includes('hotel in')) {
        for (const city of knownCities) {
            if (combined.includes(city)) {
                return city.charAt(0).toUpperCase() + city.slice(1);
            }
        }
    }

    const searchString = `${dayText} ${titleText}`;
    for (const city of knownCities) {
        if (searchString.includes(city)) {
            if (city === 'galle' && searchString.includes('excursion') && prevCity === 'Bentota') {
                return 'Bentota';
            }
            if (city === 'sigiriya' && prevCity === 'Habarana') {
                return 'Habarana';
            }
            return city.charAt(0).toUpperCase() + city.slice(1);
        }
    }

    return prevCity || 'Main Stay';
};

const groupItinerary = (itineraryList) => {
    if (!itineraryList || itineraryList.length === 0) return [];
    
    const groups = [];
    let currentGroup = null;
    let prevCity = '';

    itineraryList.forEach((dayObj, index) => {
        const baseCity = detectBaseCity(dayObj, prevCity);
        prevCity = baseCity;

        if (!currentGroup || currentGroup.city !== baseCity) {
            if (currentGroup) {
                groups.push(currentGroup);
            }
            currentGroup = {
                city: baseCity,
                days: []
            };
        }
        currentGroup.days.push(dayObj);
    });

    if (currentGroup) {
        groups.push(currentGroup);
    }
    
    return groups;
};

const getSegmentsForDay = (dayObj) => {
    const title = dayObj.title || '';
    const desc = dayObj.description || '';
    let points = desc.split(/[\n•\r]/).map(p => p.trim()).filter(p => p.length > 0);
    
    if (points.length === 0) {
        points = [title];
    }

    if (points.length === 1) {
        let icon = 'fa-umbrella-beach';
        const txt = points[0].toLowerCase();
        if (txt.includes('arrival') || txt.includes('airport') || txt.includes('flight') || txt.includes('depart')) icon = 'fa-plane';
        else if (txt.includes('cruise') || txt.includes('boat') || txt.includes('island')) icon = 'fa-ship';
        else if (txt.includes('drive') || txt.includes('transfer') || txt.includes('car')) icon = 'fa-car';
        else if (txt.includes('hotel') || txt.includes('stay') || txt.includes('overnight') || txt.includes('resort')) icon = 'fa-hotel';
        else if (txt.includes('safari') || txt.includes('temple') || txt.includes('fort') || txt.includes('visit') || txt.includes('explore') || txt.includes('sightseeing')) icon = 'fa-binoculars';
        
        return [
            { type: 'FULL DAY', text: points[0], icon }
        ];
    }

    const morningPoints = [];
    const eveningPoints = [];

    points.forEach(p => {
        const lp = p.toLowerCase();
        if (lp.includes('morning') || lp.includes('arrival') || lp.includes('check-in') || lp.includes('breakfast') || lp.includes('meet &') || lp.includes('transfer to hotel')) {
            morningPoints.push(p);
        } else if (lp.includes('evening') || lp.includes('leisure') || lp.includes('relaxation') || lp.includes('dinner') || lp.includes('night') || lp.includes('rest')) {
            eveningPoints.push(p);
        } else {
            if (morningPoints.length <= eveningPoints.length) {
                morningPoints.push(p);
            } else {
                eveningPoints.push(p);
            }
        }
    });

    const segments = [];
    if (morningPoints.length > 0) {
        let icon = 'fa-cloud-sun-rain';
        const txt = morningPoints.join(' • ').toLowerCase();
        if (txt.includes('arrival') || txt.includes('airport') || txt.includes('flight')) icon = 'fa-plane';
        else if (txt.includes('transfer') || txt.includes('drive') || txt.includes('car')) icon = 'fa-car';
        else if (txt.includes('hotel') || txt.includes('stay') || txt.includes('resort')) icon = 'fa-hotel';
        
        segments.push({
            type: eveningPoints.length > 0 ? 'MORNING' : 'FULL DAY',
            text: morningPoints.join(' • '),
            icon
        });
    }

    if (eveningPoints.length > 0) {
        let icon = 'fa-moon';
        const txt = eveningPoints.join(' • ').toLowerCase();
        if (txt.includes('leisure') || txt.includes('relax') || txt.includes('free time')) icon = 'fa-umbrella-beach';
        else if (txt.includes('dinner') || txt.includes('food') || txt.includes('lunch')) icon = 'fa-utensils';
        
        segments.push({
            type: 'NOON TO EVENING',
            text: eveningPoints.join(' • '),
            icon
        });
    }

    return segments;
};

const getSegmentSVG = (text) => {
    const txt = text.toLowerCase();
    if (txt.includes('arrival') || txt.includes('airport') || txt.includes('flight') || txt.includes('depart')) {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d496e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>`;
    }
    if (txt.includes('hotel') || txt.includes('stay') || txt.includes('overnight') || txt.includes('check-in') || txt.includes('check-out') || txt.includes('resort')) {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d496e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`;
    }
    if (txt.includes('drive') || txt.includes('transfer') || txt.includes('ride') || txt.includes('journey') || txt.includes('car')) {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d496e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`;
    }
    if (txt.includes('safari') || txt.includes('temple') || txt.includes('fort') || txt.includes('visit') || txt.includes('explore') || txt.includes('sightseeing') || txt.includes('tour') || txt.includes('excursion') || txt.includes('beach')) {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d496e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    }
    if (txt.includes('leisure') || txt.includes('relax') || txt.includes('free time') || txt.includes('pool') || txt.includes('shopping')) {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d496e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`;
    }
    if (txt.includes('dinner') || txt.includes('lunch') || txt.includes('breakfast') || txt.includes('meals') || txt.includes('food')) {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d496e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`;
    }
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d496e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`;
};

const getTransitionIconName = (nextDayObj) => {
    if (!nextDayObj) return 'route';
    const nextCombined = `${nextDayObj.title || ''} ${nextDayObj.description || (nextDayObj.activities?.join('\n') || '')}`.toLowerCase();
    if (nextCombined.includes('flight') || nextCombined.includes('airport') || nextCombined.includes('arrival') || nextCombined.includes('depart')) {
        return 'plane';
    } else if (nextCombined.includes('transfer') || nextCombined.includes('drive') || nextCombined.includes('ride') || nextCombined.includes('train') || nextCombined.includes('car')) {
        return 'car';
    } else if (nextCombined.includes('check-in') || nextCombined.includes('stay') || nextCombined.includes('hotel') || nextCombined.includes('overnight')) {
        return 'hotel';
    } else if (nextCombined.includes('safari') || nextCombined.includes('visit') || nextCombined.includes('sightseeing') || nextCombined.includes('explore') || nextCombined.includes('tour') || nextCombined.includes('excursion') || nextCombined.includes('beach')) {
        return 'sightseeing';
    }
    return 'route';
};

const getTransitionSVG = (iconName) => {
    if (iconName === 'plane') {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>`;
    }
    if (iconName === 'car') {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`;
    }
    if (iconName === 'hotel') {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`;
    }
    if (iconName === 'sightseeing') {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    }
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
};

export const generatePackagePDF = async (destinationPost) => {
    if (!destinationPost) return null;

    const title = destinationPost.title || 'Travel Package';
    const rating = destinationPost.rating ? parseFloat(destinationPost.rating).toFixed(1) : '4.8';
    const ratingCount = destinationPost.rating_count || '24';
    const nights = parseInt(destinationPost.nights) || 0;
    const days = parseInt(destinationPost.days) || 0;
    const priceVal = parseFloat(destinationPost.price) || 0;
    
    const rawImageSrc = getImageSrc(destinationPost.image);
    const coverImageSrc = await preloadImage(rawImageSrc);
    
    const itinerary = Array.isArray(destinationPost.itinerary) ? destinationPost.itinerary : [];
    const included = Array.isArray(destinationPost.included_list) ? destinationPost.included_list : ['Inclusions not specified'];
    const excluded = Array.isArray(destinationPost.excluded_list) ? destinationPost.excluded_list : ['Exclusions not specified'];
    const highlightsList = Array.isArray(destinationPost.rich_highlights) ? destinationPost.rich_highlights : [];

    const inclusionsMap = {
        hotel: { label: "Hotel", icon: "fa-hotel", class: "inclusion-hotel" },
        meals: { label: "Meals", icon: "fa-utensils", class: "inclusion-meals" },
        sightseeing: { label: "Sightseeing", icon: "fa-binoculars", class: "inclusion-sightseeing" },
        transfers: { label: "Transfer", icon: "fa-car", class: "inclusion-transfers" },
        manager: { label: "Tour Manager", icon: "fa-user-tie", class: "inclusion-manager" },
        flights: { label: "Flights", icon: "fa-plane", class: "inclusion-flights" },
        trains: { label: "Trains", icon: "fa-train", class: "inclusion-trains" },
        cruises: { label: "Cruises", icon: "fa-ship", class: "inclusion-cruises" },
        activities: { label: "Activities", icon: "fa-person-hiking", class: "inclusion-activities" },
        visa: { label: "Visa", icon: "fa-passport", class: "inclusion-visa" },
        insurance: { label: "Insurance", icon: "fa-shield-halved", class: "inclusion-insurance" },
        highlights: { label: "Highlights", icon: "fa-star", class: "inclusion-highlights" }
    };

    const itineraryWithPreloadedImages = await Promise.all(
        itinerary.map(async (dayObj) => {
            const rawImg = getImageSrc(dayObj.image);
            const preloaded = dayObj.image ? await preloadImage(rawImg) : null;
            return {
                ...dayObj,
                preloadedImage: preloaded
            };
        })
    );

    const clockIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e31c25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
    const starIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#ffb800" stroke="#ffb800" stroke-width="2" style="vertical-align: middle;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    const routeIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d496e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
    const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const crossIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    const instaIcon = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block; margin-right: 3px;"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`;

    const renderCoverHTML = () => `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 20px;">
            <img src="/assets/img/logo/FremorLogo.png" style="height: 44px; object-fit: contain;" />
            <div style="text-align: right; font-size: 11px; color: #64748b; line-height: 1.45; font-weight: 500;">
                <strong style="color: #0f172a; font-size: 12.5px;">Fremor Global</strong><br/>
                Phone: +91 9920499911<br/>
                Email: info@fremorglobal.com<br/>
                Insta: @fremorglobal<br/>
                Web: www.fremorglobal.com
            </div>
        </div>
        <div style="width: 100%; height: 260px; border-radius: 12px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); position: relative; background: #e2e8f0;">
            <img src="${coverImageSrc}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; top: 15px; left: 15px; background: #0d496e; color: white; padding: 5px 14px; border-radius: 20px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                ${destinationPost.tour_type || 'Group Tour'}
            </div>
        </div>
        <div style="margin-bottom: 15px;">
            <h1 style="font-size: 26px; font-weight: 800; color: #0d496e; margin: 0 0 10px 0; line-height: 1.2; letter-spacing: -0.5px;">${title}</h1>
            <div style="display: flex; gap: 20px; font-size: 13px; color: #475569; font-weight: 600; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 5px;">${clockIcon}<span>${nights > 0 ? `${nights} Nights / ` : ''}${days > 0 ? `${days} Days` : destinationPost.duration || ''}</span></div>
                <div style="display: flex; align-items: center; gap: 5px;">${starIcon}<span>${rating} (${ratingCount} Reviews)</span></div>
            </div>
            <div style="background: #f8fafc; border-radius: 10px; padding: 14px 20px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="font-size: 10.5px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Starting Price</span>
                    <div style="font-size: 23px; font-weight: 800; color: #0f172a; margin-top: 2px;">₹ ${priceVal.toLocaleString('en-IN')} <span style="font-size: 13px; font-weight: 500; color: #64748b;">/ Person</span></div>
                </div>
                ${destinationPost.itinerary_route ? `<div style="text-align: right; max-width: 55%;"><span style="font-size: 10.5px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Route Path</span><div style="font-size: 12.5px; font-weight: 700; color: #0f172a; display: flex; align-items: center; justify-content: flex-end; gap: 4px; line-height: 1.3;">${routeIcon}<span>${destinationPost.itinerary_route}</span></div></div>` : ''}
            </div>
        </div>
    `;

    const renderHighlightsHTML = () => `
        <div style="margin-bottom: 10px;">
            <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 6px; text-transform: uppercase; letter-spacing: 0.8px;">Tour Highlights</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                ${highlightsList.slice(0, 4).map(hl => `<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; height: 95px; box-sizing: border-box; overflow: hidden;"><h4 style="font-size: 12.5px; font-weight: 700; color: #0d496e; margin: 0 0 3px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${hl.title}</h4><p style="font-size: 11px; color: #64748b; margin: 0; line-height: 1.4; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${hl.description}</p></div>`).join('')}
            </div>
        </div>
    `;

    const renderDayBlockHTML = (dayObj) => {
        const dayTitle = dayObj.title || (dayObj.activities?.[0] || 'Daily Plan');
        const dayDescription = dayObj.description || (dayObj.activities?.length > 1 ? dayObj.activities.slice(1).join('\n') : dayObj.activities?.join('\n') || 'Activities to be updated.');
        let inclusionsHtml = '';
        if (dayObj.inclusions && dayObj.inclusions.length > 0) {
            const colors = { hotel: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' }, meals: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' }, sightseeing: { bg: '#f5f3ff', border: '#ddd6fe', text: '#5b21b6' }, transfers: { bg: '#f0f9ff', border: '#e0f2fe', text: '#0369a1' }, manager: { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46' }, flights: { bg: '#ecfeff', border: '#cffafe', text: '#0891b2' }, trains: { bg: '#f9fafb', border: '#f3f4f6', text: '#374151' }, cruises: { bg: '#f0fdfa', border: '#ccfbf1', text: '#0f766e' }, activities: { bg: '#fff1f2', border: '#fecdd3', text: '#9f1239' }, visa: { bg: '#fdf2f8', border: '#fbcfe8', text: '#9d174d' }, insurance: { bg: '#ecfdf5', border: '#d1fae5', text: '#065f46' }, highlights: { bg: '#fefce8', border: '#fef08a', text: '#854d0e' } };
            const badges = dayObj.inclusions.map(incKey => {
                const meta = inclusionsMap[incKey];
                if (!meta) return '';
                const style = colors[incKey] || { bg: '#f3f4f6', border: '#e5e7eb', text: '#374151' };
                return `<div style="background: ${style.bg}; border: 1.2px solid ${style.border}; color: ${style.text}; font-size: 8.5px; font-weight: 700; padding: 2px 7px; border-radius: 10px; display: inline-flex; align-items: center; text-transform: uppercase; margin: 2px;">${meta.label}</div>`;
            }).join('');
            inclusionsHtml = `<div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;"><span style="font-size: 10px; font-weight: 700; color: #64748b;">Included:</span>${badges}</div>`;
        }
        return `<div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #ffffff; box-sizing: border-box;">
            <div style="display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 4px;">
                <span style="background: #0d496e; color: white; font-weight: 800; font-size: 11px; padding: 5px 12px; border-radius: 20px; flex-shrink: 0;">${dayObj.day}</span>
                <h4 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.3;">${dayTitle}</h4>
            </div>
            ${inclusionsHtml}
            <div style="display: flex; gap: 18px; align-items: flex-start; flex-wrap: wrap;">
                <div style="flex: 1; font-size: 11.5px; color: #475569; line-height: 1.55; white-space: pre-line;">${dayDescription}</div>
                ${dayObj.preloadedImage ? `<div style="width: 200px; height: 130px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; flex-shrink: 0;"><img src="${dayObj.preloadedImage}" style="width: 100%; height: 100%; object-fit: cover;" /></div>` : ''}
            </div>
        </div>`;
    };

    const renderTransitionConnectorHTML = (dayObj) => `<div style="display: flex; justify-content: center; align-items: center; position: relative; height: 38px; width: 100%;"><div style="position: absolute; width: 2.5px; height: 100%; border-left: 2.5px dashed #cbd5e1;"></div><div style="width: 24px; height: 24px; border-radius: 50%; background: #0d496e; color: #ffffff; display: flex; align-items: center; justify-content: center; z-index: 2; border: 3px solid #ffffff;">${getTransitionSVG(getTransitionIconName(dayObj))}</div></div>`;

    const renderInclusionsExclusionsHTML = () => `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; box-sizing: border-box;"><h3 style="font-size: 13px; font-weight: 800; color: #16a34a; margin: 0 0 10px 0;">${checkIcon} Inclusions</h3><ul style="list-style: none; padding: 0; margin: 0;">${included.slice(0, 10).map(item => `<li style="font-size: 11px; margin-bottom: 4px; display: flex; gap: 6px;">✓ <span>${item}</span></li>`).join('')}</ul></div>
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; box-sizing: border-box;"><h3 style="font-size: 13px; font-weight: 800; color: #dc2626; margin: 0 0 10px 0;">${crossIcon} Exclusions</h3><ul style="list-style: none; padding: 0; margin: 0;">${excluded.slice(0, 10).map(item => `<li style="font-size: 11px; margin-bottom: 4px; display: flex; gap: 6px;">✕ <span>${item}</span></li>`).join('')}</ul></div>
        </div>
    `;

    const splitTermsHTML = (html) => {
        if (!html) return [];
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const sections = [];
            let currentSection = null;
            
            doc.body.childNodes.forEach(node => {
                const isHeading = node.nodeType === 1 && (node.tagName === 'H4' || node.tagName === 'H3');
                if (isHeading) {
                    if (currentSection) {
                        sections.push(currentSection.innerHTML);
                    }
                    currentSection = document.createElement('div');
                    currentSection.appendChild(node.cloneNode(true));
                } else {
                    if (!currentSection) {
                        currentSection = document.createElement('div');
                    }
                    currentSection.appendChild(node.cloneNode(true));
                }
            });
            
            if (currentSection) {
                sections.push(currentSection.innerHTML);
            }
            return sections;
        } catch (e) {
            console.error("Failed to split terms HTML, returning full block", e);
            return [html];
        }
    };

    const defaultTerms = `
        <div>
            <h4 style="font-size: 11px; font-weight: 800; color: #0d496e; margin: 12px 0 6px 0; border-left: 3px solid #0d496e; padding-left: 8px; line-height: 1.2;">1. Booking & Reservation Policy</h4>
            <ul style="padding-left: 16px; margin: 0 0 10px 0; font-size: 9.5px; color: #475569;">
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Initial Booking Deposit:</strong> A non-refundable advance payment of <strong>30% of the total package cost</strong> is required at the time of booking to secure hotel and flight reservations.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Second Installment:</strong> An additional payment of <strong>50% of the total package cost</strong> must be cleared and settled exactly <strong>30 days prior to the departure date</strong>.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Final Balance Payment:</strong> The remaining <strong>20% balance payment</strong> must be received in full at least <strong>15 days before the travel date</strong>.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Late Payment Clause:</strong> Failure to complete payments within the specified timeframes may lead to automatic cancellation of holds, and any advance payments made shall be forfeited.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Rate Confirmations:</strong> Rates are subject to availability. Prices are only locked once the full deposit is received and a confirmation voucher is generated.</li>
            </ul>
            
            <h4 style="font-size: 11px; font-weight: 800; color: #0d496e; margin: 12px 0 6px 0; border-left: 3px solid #0d496e; padding-left: 8px; line-height: 1.2;">2. Cancellation & Refund Policy</h4>
            <ul style="padding-left: 16px; margin: 0 0 10px 0; font-size: 9.5px; color: #475569;">
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Written Cancellation:</strong> All cancellations must be requested in writing by the primary traveler and sent via registered email to our support desk.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Cancellation 45+ Days Before Departure:</strong> A cancellation fee equivalent to <strong>10% of the total package cost</strong> will be retained, and the remainder refunded.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Cancellation 30 to 44 Days Before Departure:</strong> A cancellation charge of <strong>25% of the total package cost</strong> will be levied.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Cancellation 15 to 29 Days Before Departure:</strong> A cancellation charge of <strong>50% of the total package cost</strong> will be levied.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Cancellation Less than 15 Days Before Departure:</strong> A cancellation charge of <strong>100% of the total package cost</strong> will be applied, and strictly no refund will be issued.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Third-Party Vendor Rules:</strong> Flight and peak-season bookings are bound by operator terms. Non-refundable airline tickets, visas, and permits cannot be refunded under any circumstances.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Refund Processing Time:</strong> Approved refund amounts will be credited back to the original payment source within <strong>7 to 14 working days</strong> after cancellation.</li>
            </ul>

            <h4 style="font-size: 11px; font-weight: 800; color: #0d496e; margin: 12px 0 6px 0; border-left: 3px solid #0d496e; padding-left: 8px; line-height: 1.2;">3. Amendment & Re-scheduling Policy</h4>
            <ul style="padding-left: 16px; margin: 0 0 10px 0; font-size: 9.5px; color: #475569;">
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Amendment Request:</strong> Any request for change of travel date, destination, hotel category, or passenger details is subject to availability and must be requested at least 30 days before departure.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Amendment Fee:</strong> A nominal administration charge of ₹ 2,500 per amendment request will apply, in addition to any actual price differences.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Transfer of Booking:</strong> Bookings are non-transferable once airline tickets have been issued or hotel room lists finalized.</li>
            </ul>
            
            <h4 style="font-size: 11px; font-weight: 800; color: #0d496e; margin: 12px 0 6px 0; border-left: 3px solid #0d496e; padding-left: 8px; line-height: 1.2;">4. Passports, Visas & Travel Documentation</h4>
            <ul style="padding-left: 16px; margin: 0 0 10px 0; font-size: 9.5px; color: #475569;">
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Passport Validity:</strong> All travelers must hold a passport valid for at least <strong>6 months</strong> from the scheduled date of return.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Visa Responsibility:</strong> While we assist in visa documentation, visa approval or rejection is solely at embassy discretion.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Travel Insurance:</strong> We highly recommend purchasing comprehensive travel insurance prior to departure.</li>
            </ul>

            <h4 style="font-size: 11px; font-weight: 800; color: #0d496e; margin: 12px 0 6px 0; border-left: 3px solid #0d496e; padding-left: 8px; line-height: 1.2;">5. General Travel Conditions & Disclaimers</h4>
            <ul style="padding-left: 16px; margin: 0 0 10px 0; font-size: 9.5px; color: #475569;">
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Flight Schedule Updates:</strong> Airline timings and routes are subject to change. Expenses incurred due to flight delays or missed connections are traveler responsibility.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Hotel Availability:</strong> If standard hotels are unavailable, equivalent accommodations of the same category and standard will be arranged.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Itinerary Adjustments:</strong> The company reserves the right to adjust itinerary details in response to weather, strikes, or local regulations.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Health & Fitness:</strong> Some tours require moderate activity. Travelers must declare any pre-existing health or mobility constraints.</li>
                <li style="margin-bottom: 4px; line-height: 1.45;"><strong>Baggage Responsibility:</strong> Travelers are responsible for their belongings. We hold no liability for lost or damaged baggage during transfers.</li>
            </ul>
        </div>
    `;

    const renderThankYouHTML = () => `
        <div style="background: linear-gradient(135deg, #0d496e 0%, #1e293b 100%); color: white; padding: 22px 20px; border-radius: 12px; text-align: center; margin-top: 15px; box-shadow: 0 4px 15px rgba(13,73,110,0.12); box-sizing: border-box;">
            <h3 style="font-size: 16px; font-weight: 800; margin: 0 0 6px 0; color: white;">Thank You for Choosing Fremor Global</h3>
            <p style="font-size: 11px; color: rgba(255,255,255,0.85); margin: 0 0 15px 0; line-height: 1.5; max-width: 520px; margin-left: auto; margin-right: auto;">
                We are dedicated to providing you with seamless travel planning, exceptional customer care, and memorable vacations. Have a safe and amazing journey!
            </p>
            <div style="display: flex; justify-content: center; gap: 15px; font-size: 10px; color: white; font-weight: 700; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 12px; flex-wrap: wrap; align-items: center;">
                <span>📞 Phone: +91 9920499911</span>
                <span>✉️ Email: info@fremorglobal.com</span>
                <span style="display: inline-flex; align-items: center; gap: 3px;">
                    ${instaIcon} Instagram: @fremorglobal
                </span>
                <span>🌐 Website: www.fremorglobal.com</span>
            </div>
        </div>
    `;

    const elementsQueue = [];
    elementsQueue.push({ html: renderCoverHTML() });
    if (highlightsList.length > 0) elementsQueue.push({ html: renderHighlightsHTML() });
    itineraryWithPreloadedImages.forEach((dayObj, idx) => {
        if (idx > 0) elementsQueue.push({ html: renderTransitionConnectorHTML(dayObj), isConnector: true });
        elementsQueue.push({ html: renderDayBlockHTML(dayObj) });
    });
    elementsQueue.push({ html: renderInclusionsExclusionsHTML() });
    
    // Split detailed terms & conditions and push them individually
    const termsHtml = destinationPost.terms_conditions || defaultTerms;
    const termsSections = splitTermsHTML(termsHtml);
    termsSections.forEach((sectionHtml, idx) => {
        elementsQueue.push({
            html: `
                <div style="${idx === 0 ? '' : 'border-top: 1.5px solid #e2e8f0; padding-top: 15px;'} margin-top: 10px; box-sizing: border-box;">
                    ${idx === 0 ? '<h4 style="font-size: 13px; font-weight: 800; color: #0d496e; margin: 0 0 10px 0; text-transform: uppercase;">TERMS & CONDITIONS</h4>' : ''}
                    <div class="detailed-terms-content" style="font-size: 9.5px; color: #475569; line-height: 1.4;">
                        ${sectionHtml}
                    </div>
                </div>
            `
        });
    });

    elementsQueue.push({ html: renderThankYouHTML() });

    const container = document.createElement('div');
    container.id = 'pdf-render-container';
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px';
    container.style.zIndex = '-9999';
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = "'Inter', sans-serif";
    container.style.color = '#1e293b';

    let containerHTML = `
        <style>
            .detailed-terms-content p { margin: 0 0 6px 0; font-size: 9.5px; line-height: 1.45; color: #475569; }
            .detailed-terms-content ul, .detailed-terms-content ol { margin: 0 0 10px 0; padding-left: 16px; font-size: 9.5px; color: #475569; }
            .detailed-terms-content li { margin-bottom: 4px; line-height: 1.45; }
            .detailed-terms-content h1, .detailed-terms-content h2, .detailed-terms-content h3, .detailed-terms-content h4, .detailed-terms-content h5, .detailed-terms-content h6 { font-size: 10.5px; font-weight: 700; color: #0f172a; margin: 12px 0 6px 0; }
        </style>
        <div class="pdf-continuous-content" style="width: 794px; padding: 45px; box-sizing: border-box; background: white; display: flex; flex-direction: column; gap: 20px;">
            ${elementsQueue.map((item, idx) => `<div class="pdf-item" data-index="${idx}" style="width: 100%; box-sizing: border-box;">${item.html}</div>`).join('')}
        </div>
    `;

    container.innerHTML = containerHTML;
    document.body.appendChild(container);

    const waitForImages = (element) => {
        const images = element.querySelectorAll('img');
        const promises = Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        });
        return Promise.all(promises);
    };

    try {
        await waitForImages(container);
        
        const itemElements = container.querySelectorAll('.pdf-item');
        const heights = Array.from(itemElements).map(el => el.getBoundingClientRect().height);

        // Distribute elements into pages based on measured heights
        const pages = [];
        let currentPage = { elements: [], totalHeight: 0 };

        for (let i = 0; i < elementsQueue.length; i++) {
            const item = elementsQueue[i];
            const itemHeight = heights[i];
            const gap = currentPage.elements.length > 0 ? 20 : 0;
            
            let estimatedHeight = itemHeight + gap;
            
            // Stay-together connector and next day
            if (item.isConnector && i < elementsQueue.length - 1) {
                const nextHeight = heights[i + 1];
                estimatedHeight = itemHeight + gap + nextHeight + 20;
            }

            const maxAvailableHeight = (pages.length === 0) ? 950 : 880;

            if (currentPage.totalHeight + estimatedHeight > maxAvailableHeight && currentPage.elements.length > 0) {
                pages.push(currentPage);
                currentPage = { elements: [], totalHeight: 0 };
            }

            currentPage.elements.push(item.html);
            currentPage.totalHeight += itemHeight + (currentPage.elements.length > 1 ? 20 : 0);
        }
        
        if (currentPage.elements.length > 0) {
            pages.push(currentPage);
        }

        const totalPages = pages.length;

        // Clear continuous content and rebuild pages in DOM
        container.innerHTML = `
            <style>
                .detailed-terms-content p { margin: 0 0 6px 0; font-size: 9.5px; line-height: 1.45; color: #475569; }
                .detailed-terms-content ul, .detailed-terms-content ol { margin: 0 0 10px 0; padding-left: 16px; font-size: 9.5px; color: #475569; }
                .detailed-terms-content li { margin-bottom: 4px; line-height: 1.45; }
                .detailed-terms-content h1, .detailed-terms-content h2, .detailed-terms-content h3, .detailed-terms-content h4, .detailed-terms-content h5, .detailed-terms-content h6 { font-size: 10.5px; font-weight: 700; color: #0f172a; margin: 12px 0 6px 0; }
            </style>
        `;

        pages.forEach((page, idx) => {
            const pageNum = idx + 1;
            const pageDiv = document.createElement('div');
            pageDiv.className = 'pdf-page';
            pageDiv.style.width = '794px';
            pageDiv.style.padding = '45px';
            pageDiv.style.boxSizing = 'border-box';
            pageDiv.style.background = 'white';
            pageDiv.style.display = 'flex';
            pageDiv.style.flexDirection = 'column';
            pageDiv.style.justifyContent = 'space-between';
            pageDiv.style.position = 'relative';

            // Check if this page contains a day card, and the next page also contains a day card
            const pageHasDayCard = page.elements.some(html => html.includes('flex-shrink: 0;">Day') || html.includes('flex-shrink: 0;">D'));
            const nextPageHasDayCard = (idx < pages.length - 1) && pages[idx + 1].elements.some(html => html.includes('flex-shrink: 0;">Day') || html.includes('flex-shrink: 0;">D'));
            const showContinuationLine = pageHasDayCard && nextPageHasDayCard;

            // Calculate if this page content overflows A4 height to set min-height or exact height
            const verticalPadding = 90; // 45px * 2
            const headerHeight = pageNum > 1 ? 65 : 0;
            const footerHeight = 64;
            const totalPageHeightEstimate = page.totalHeight + verticalPadding + headerHeight + footerHeight;

            if (totalPageHeightEstimate > 1122) {
                pageDiv.style.minHeight = '1122px';
            } else {
                pageDiv.style.height = '1122px';
            }

            let pageContent = `
                <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
                    <div>
                        ${pageNum > 1 ? `
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 20px; height: 35px; box-sizing: border-box;">
                            <span style="font-size: 11px; font-weight: 800; color: #0d496e; text-transform: uppercase; letter-spacing: 0.5px;">${title} - Detailed Itinerary</span>
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <span style="font-size: 10px; color: #64748b; font-weight: 600; display: inline-flex; align-items: center; gap: 3px;">
                                    ${instaIcon} fremorglobal
                                </span>
                                <img src="/assets/img/logo/FremorLogo.png" style="height: 32px; object-fit: contain;" />
                            </div>
                        </div>
                        ` : ''}

                        <div style="display: flex; flex-direction: column; gap: 20px; width: 100%;">
                            ${page.elements.join('')}
                        </div>
                    </div>

                    ${showContinuationLine ? `
                    <div style="flex-grow: 1; display: flex; justify-content: center; align-items: stretch; margin-top: 10px; margin-bottom: 10px; min-height: 40px; width: 100%;">
                        <div style="width: 2.5px; border-left: 2.5px dashed #cbd5e1;"></div>
                    </div>
                    ` : ''}
                </div>

                <div style="display: flex; justify-content: space-between; border-top: 1.5px solid #cbd5e1; padding-top: 12px; font-size: 10px; color: #64748b; font-weight: 600; height: 25px; box-sizing: border-box; width: 100%; margin-top: 15px;">
                    <span>© ${new Date().getFullYear()} Fremor Global. All rights reserved.</span>
                    <span style="display: inline-flex; align-items: center; gap: 3px; color: #64748b;">
                        ${instaIcon} fremorglobal
                    </span>
                    <span>Page ${pageNum} of ${totalPages}</span>
                </div>
            `;
            pageDiv.innerHTML = pageContent;
            container.appendChild(pageDiv);
        });

        // Wait for images inside new page layout to render completely
        await waitForImages(container);

        const pageElements = container.querySelectorAll('.pdf-page');
        const pdf = new jsPDF('p', 'mm', 'a4');
        let pdfPageIndex = 0;

        for (let i = 0; i < pageElements.length; i++) {
            const pageElement = pageElements[i];
            
            const canvas = await html2canvas(pageElement, {
                useCORS: true,
                scale: 2,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const originalHeight = canvas.height / 2;
            const pageHeightPx = 1122;

            if (originalHeight <= pageHeightPx + 5) {
                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                if (pdfPageIndex > 0) pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
                pdfPageIndex++;
            } else {
                let remainingHeight = originalHeight;
                let startY = 0;
                while (remainingHeight > 0) {
                    const sliceHeight = Math.min(pageHeightPx, remainingHeight);
                    
                    const sliceCanvas = document.createElement('canvas');
                    sliceCanvas.width = canvas.width;
                    sliceCanvas.height = sliceHeight * 2;
                    const ctx = sliceCanvas.getContext('2d');
                    ctx.drawImage(canvas, 0, startY * 2, canvas.width, sliceHeight * 2, 0, 0, canvas.width, sliceHeight * 2);
                    
                    const imgData = sliceCanvas.toDataURL('image/jpeg', 0.95);
                    if (pdfPageIndex > 0) pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, 0, 210, (sliceHeight * 297 / pageHeightPx));
                    pdfPageIndex++;
                    
                    startY += sliceHeight;
                    remainingHeight -= sliceHeight;
                }
            }
        }

        pdf.setProperties({
            title: `${title} - Fremor Global Tour Brochure`,
            subject: 'Tour Package Brochure',
            author: 'Fremor Global',
            creator: 'Fremor Global'
        });

        const blob = pdf.output('blob');
        return blob;

    } catch (error) {
        console.error('Failed to generate dynamic PDF:', error);
        throw error;
    } finally {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }
};
