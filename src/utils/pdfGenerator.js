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

export const generatePackagePDF = async (destinationPost) => {
    if (!destinationPost) return null;

    // 1. Resolve values and fallbacks
    const title = destinationPost.title || 'Travel Package';
    const rating = destinationPost.rating ? parseFloat(destinationPost.rating).toFixed(1) : '4.8';
    const ratingCount = destinationPost.rating_count || '24';
    const nights = parseInt(destinationPost.nights) || 0;
    const days = parseInt(destinationPost.days) || 0;
    const priceVal = parseFloat(destinationPost.price) || 0;
    
    // Resolve cover image and preload
    const rawImageSrc = getImageSrc(destinationPost.image);
    const coverImageSrc = await preloadImage(rawImageSrc);
    
    const itinerary = Array.isArray(destinationPost.itinerary) ? destinationPost.itinerary : [];
    const included = Array.isArray(destinationPost.included_list) ? destinationPost.included_list : ['Inclusions not specified'];
    const excluded = Array.isArray(destinationPost.excluded_list) ? destinationPost.excluded_list : ['Exclusions not specified'];
    const highlightsList = Array.isArray(destinationPost.rich_highlights) ? destinationPost.rich_highlights : [];

    // Preload all itinerary day images
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

    // 2. Define SVG Icons for clean rendering on canvas
    const clockIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e31c25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
    const starIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#ffb800" stroke="#ffb800" stroke-width="2" style="vertical-align: middle;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    const routeIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d496e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
    const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const crossIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    // 3. Create Offscreen Container
    const container = document.createElement('div');
    container.id = 'pdf-render-container';
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 width in px at 96 DPI
    container.style.zIndex = '-9999';
    container.style.backgroundColor = '#f8fafc';
    container.style.fontFamily = "'Inter', sans-serif";
    container.style.color = '#1e293b';

    // Calculate dynamic pages
    // Page 1: Cover/Details/Highlights
    // Page 2 to Page (2 + itineraryPagesCount - 1): Itinerary Days (2 days per page)
    // Page (2 + itineraryPagesCount): Policies, Inclusions/Exclusions, Thank You
    const itineraryPagesCount = Math.ceil(itinerary.length / 2);
    const totalPages = 1 + itineraryPagesCount + 1;

    // Helper to render itinerary day block in HTML template
    const renderDayBlock = (dayObj) => {
        if (!dayObj) return '';
        
        // Extract title and description fallbacks
        const dayTitle = dayObj.title || (dayObj.activities?.[0] || 'Daily Plan');
        const dayDescription = dayObj.description || (dayObj.activities?.length > 1 ? dayObj.activities.slice(1).join('\n') : dayObj.activities?.join('\n') || 'Activities to be updated.');
        
        return `
            <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.01); display: flex; flex-direction: column; gap: 12px; width: 100%; box-sizing: border-box;">
                <div style="display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
                    <span style="background: #0d496e; color: white; font-weight: 800; font-size: 11px; padding: 5px 12px; border-radius: 20px; box-shadow: 0 2px 4px rgba(13,73,110,0.15);">
                        ${dayObj.day}
                    </span>
                    <h4 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.3;">
                        ${dayTitle}
                    </h4>
                </div>
                
                <div style="display: flex; gap: 18px; align-items: flex-start;">
                    <!-- Left: Description -->
                    <div style="flex: 1; font-size: 11.5px; color: #475569; line-height: 1.55; font-weight: 500; text-align: justify; white-space: pre-line;">
                        ${dayDescription}
                    </div>
                    
                    <!-- Right: Day Image -->
                    ${dayObj.preloadedImage ? `
                    <div style="width: 200px; height: 130px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.04); background: #f1f5f9; flex-shrink: 0;">
                        <img src="${dayObj.preloadedImage}" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    };

    const getTransitionIconName = (nextDayObj) => {
        if (!nextDayObj) return 'fa-route';
        const nextCombined = `${nextDayObj.title || ''} ${nextDayObj.description || ''}`.toLowerCase();
        if (nextCombined.includes('flight') || nextCombined.includes('airport') || nextCombined.includes('arrival') || nextCombined.includes('depart')) {
            return 'fa-plane';
        } else if (nextCombined.includes('transfer') || nextCombined.includes('drive') || nextCombined.includes('ride') || nextCombined.includes('train') || nextCombined.includes('car')) {
            return 'fa-car-side';
        } else if (nextCombined.includes('check-in') || nextCombined.includes('stay') || nextCombined.includes('hotel') || nextCombined.includes('overnight')) {
            return 'fa-hotel';
        } else if (nextCombined.includes('safari') || nextCombined.includes('visit') || nextCombined.includes('sightseeing') || nextCombined.includes('explore') || nextCombined.includes('tour') || nextCombined.includes('excursion') || nextCombined.includes('beach')) {
            return 'fa-binoculars';
        }
        return 'fa-route';
    };

    const getTransitionSVG = (iconName) => {
        if (iconName === 'fa-plane') {
            return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>`;
        }
        if (iconName === 'fa-hotel') {
            return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`;
        }
        if (iconName === 'fa-car-side') {
            return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`;
        }
        if (iconName === 'fa-binoculars') {
            return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        }
        // fa-route
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`;
    };

    const renderTransitionConnector = (nextDayObj) => {
        const iconName = getTransitionIconName(nextDayObj);
        const svgString = getTransitionSVG(iconName);
        return `
            <div style="display: flex; justify-content: center; align-items: center; position: relative; height: 38px; width: 100%; margin: 2px 0;">
                <div style="position: absolute; top: 0; bottom: 0; left: 50%; width: 2.5px; border-left: 2.5px dashed #cbd5e1; transform: translateX(-50%); z-index: 1;"></div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px; border-radius: 50%; background: #0d496e; color: #ffffff; display: flex; align-items: center; justify-content: center; z-index: 2; border: 3px solid #ffffff; box-shadow: 0 1.5px 3px rgba(0,0,0,0.1); font-size: 9px;">
                    ${svgString}
                </div>
            </div>
        `;
    };

    // Build Itinerary Pages HTML dynamically
    let itineraryPagesHTML = '';
    for (let i = 0; i < itineraryWithPreloadedImages.length; i += 2) {
        const day1Index = i;
        const day2Index = i + 1;
        const day1 = itineraryWithPreloadedImages[day1Index];
        const day2 = day2Index < itineraryWithPreloadedImages.length ? itineraryWithPreloadedImages[day2Index] : null;
        
        const pageNum = 2 + Math.floor(i / 2);
        
        const showTopConnector = day1Index > 0;
        
        let itineraryContentHTML = '';
        
        if (showTopConnector) {
            itineraryContentHTML += renderTransitionConnector(day1);
        }
        
        itineraryContentHTML += renderDayBlock(day1);
        
        if (day2) {
            itineraryContentHTML += renderTransitionConnector(day2);
            itineraryContentHTML += renderDayBlock(day2);
        }

        itineraryPagesHTML += `
            <div class="pdf-page" style="width: 794px; height: 1122px; padding: 45px; box-sizing: border-box; background: white; display: flex; flex-direction: column; justify-content: space-between; border-bottom: 2px solid #e2e8f0; position: relative;">
                <div>
                    <!-- Sub header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 25px;">
                        <span style="font-size: 11px; font-weight: 800; color: #0d496e; text-transform: uppercase; letter-spacing: 0.5px;">${title} - Detailed Itinerary</span>
                        <img src="/assets/img/logo/FremorLogo.png" style="height: 30px; object-fit: contain;" />
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 24px;">
                        ${itineraryContentHTML}
                    </div>
                </div>

                <!-- Page Footer -->
                <div style="display: flex; justify-content: space-between; border-top: 1.5px solid #f1f5f9; padding-top: 15px; font-size: 10.5px; color: #94a3b8; font-weight: 600;">
                    <span>© ${new Date().getFullYear()} Fremor Global. All rights reserved.</span>
                    <span>Page ${pageNum} of ${totalPages}</span>
                </div>
            </div>
        `;
    }

    // Combine Cover + Itinerary Pages + Policies/Thank You Page
    container.innerHTML = `
        <!-- PAGE 1: Overview & Highlights -->
        <div class="pdf-page" style="width: 794px; height: 1122px; padding: 45px; box-sizing: border-box; background: white; display: flex; flex-direction: column; justify-content: space-between; border-bottom: 2px solid #e2e8f0; position: relative;">
            <div>
                <!-- Brand Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 20px;">
                    <img src="/assets/img/logo/FremorLogo.png" style="height: 44px; object-fit: contain;" />
                    <div style="text-align: right; font-size: 11px; color: #64748b; line-height: 1.45; font-weight: 500;">
                        <strong style="color: #0f172a; font-size: 12.5px;">Fremor Global</strong><br/>
                        Phone: +91 9920499911<br/>
                        Email: info@fremorglobal.com<br/>
                        Web: www.fremorglobal.com
                    </div>
                </div>

                <!-- Main Thumbnail Cover Image - Reduced Height to Prevent Cut-off -->
                <div style="width: 100%; height: 260px; border-radius: 12px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); position: relative; background: #e2e8f0;">
                    <img src="${coverImageSrc}" style="width: 100%; height: 100%; object-fit: cover;" />
                    <div style="position: absolute; top: 15px; left: 15px; background: #0d496e; color: white; padding: 5px 14px; border-radius: 20px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${destinationPost.tour_type || 'Group Tour'}
                    </div>
                </div>

                <!-- Package Meta & Prices -->
                <div style="margin-bottom: 22px;">
                    <h1 style="font-size: 26px; font-weight: 800; color: #0d496e; margin: 0 0 10px 0; line-height: 1.2; letter-spacing: -0.5px;">
                        ${title}
                    </h1>
                    
                    <div style="display: flex; gap: 20px; font-size: 13px; color: #475569; font-weight: 600; margin-bottom: 15px;">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            ${clockIcon}
                            <span>${nights > 0 ? `${nights} Nights / ` : ''}${days > 0 ? `${days} Days` : destinationPost.duration || ''}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            ${starIcon}
                            <span>${rating} (${ratingCount} Reviews)</span>
                        </div>
                    </div>

                    <!-- Price Card and Route Details -->
                    <div style="background: #f8fafc; border-radius: 10px; padding: 14px 20px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">
                        <div>
                            <span style="font-size: 10.5px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Starting Price</span>
                            <div style="font-size: 23px; font-weight: 800; color: #0f172a; margin-top: 2px;">
                                ₹ ${priceVal.toLocaleString('en-IN')} <span style="font-size: 13px; font-weight: 500; color: #64748b;">/ Person</span>
                            </div>
                        </div>
                        ${destinationPost.itinerary_route ? `
                        <div style="text-align: right; max-width: 55%;">
                            <span style="font-size: 10.5px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Route Path</span>
                            <div style="font-size: 12.5px; font-weight: 700; color: #0f172a; display: flex; align-items: center; justify-content: flex-end; gap: 4px; line-height: 1.3;">
                                ${routeIcon}
                                <span>${destinationPost.itinerary_route}</span>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Highlights Section - Structured to Fit Perfectly on Page 1 -->
                ${highlightsList.length > 0 ? `
                <div>
                    <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 6px; text-transform: uppercase; letter-spacing: 0.8px;">
                        Tour Highlights
                    </h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        ${highlightsList.slice(0, 4).map(hl => `
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.01); height: 95px; box-sizing: border-box; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-start;">
                                <h4 style="font-size: 12.5px; font-weight: 700; color: #0d496e; margin: 0 0 3px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${hl.title}</h4>
                                <p style="font-size: 11px; color: #64748b; margin: 0; line-height: 1.4; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-align: justify;">${hl.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            
            <!-- Page Footer -->
            <div style="display: flex; justify-content: space-between; border-top: 1.5px solid #f1f5f9; padding-top: 15px; font-size: 10.5px; color: #94a3b8; font-weight: 600;">
                <span>© ${new Date().getFullYear()} Fremor Global. All rights reserved.</span>
                <span>Page 1 of ${totalPages}</span>
            </div>
        </div>

        <!-- DYNAMIC ITINERARY PAGES (Page 2 to Page N-1) -->
        ${itineraryPagesHTML}

        <!-- PAGE N: Inclusions, Exclusions, Policies & Thank You -->
        <div class="pdf-page" style="width: 794px; height: 1122px; padding: 45px; box-sizing: border-box; background: white; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
            <div>
                <!-- Sub header -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 22px;">
                    <span style="font-size: 11px; font-weight: 800; color: #0d496e; text-transform: uppercase; letter-spacing: 0.5px;">${title} Brochure</span>
                    <img src="/assets/img/logo/FremorLogo.png" style="height: 32px; object-fit: contain;" />
                </div>

                <!-- Inclusions & Exclusions Columns -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                    <!-- Inclusions -->
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px 20px; box-sizing: border-box;">
                        <h3 style="font-size: 13.5px; font-weight: 800; color: #16a34a; margin: 0 0 10px 0; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${checkIcon} Package Inclusions
                        </h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${included.slice(0, 8).map(item => `
                                <li style="font-size: 11px; color: #334155; margin-bottom: 6px; display: flex; align-items: flex-start; gap: 8px; line-height: 1.4; font-weight: 500;">
                                    <span style="color: #16a34a; font-weight: bold; font-size: 11.5px; margin-top: 1px;">✓</span>
                                    <span>${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <!-- Exclusions -->
                    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px 20px; box-sizing: border-box;">
                        <h3 style="font-size: 13.5px; font-weight: 800; color: #dc2626; margin: 0 0 10px 0; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${crossIcon} Package Exclusions
                        </h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${excluded.slice(0, 8).map(item => `
                                <li style="font-size: 11px; color: #334155; margin-bottom: 6px; display: flex; align-items: flex-start; gap: 8px; line-height: 1.4; font-weight: 500;">
                                    <span style="color: #dc2626; font-weight: bold; font-size: 11.5px; margin-top: 1px;">✕</span>
                                    <span>${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <!-- Policies (Booking & Cancellation) -->
                <div style="margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4 style="font-size: 12.5px; font-weight: 800; color: #0d496e; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px;">Booking Policy</h4>
                        <ul style="font-size: 10.5px; color: #475569; padding-left: 15px; margin: 0; line-height: 1.5; font-weight: 500;">
                            <li style="margin-bottom: 4px;">30% of the total package cost is required as advance to reserve booking.</li>
                            <li style="margin-bottom: 4px;">50% of the package cost must be settled 30 days before departure.</li>
                            <li>The remaining 20% balance must be paid 15 days prior to the travel date.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="font-size: 12.5px; font-weight: 800; color: #dc2626; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px;">Cancellation Policy</h4>
                        <ul style="font-size: 10.5px; color: #475569; padding-left: 15px; margin: 0; line-height: 1.5; font-weight: 500;">
                            <li style="margin-bottom: 4px;">Cancellation 45+ days before travel: 10% booking fee will be retained.</li>
                            <li style="margin-bottom: 4px;">Cancellation 30 to 44 days before travel: 25% of package cost charged.</li>
                            <li style="margin-bottom: 4px;">Cancellation 15 to 29 days before travel: 50% of package cost charged.</li>
                            <li>Cancellation less than 15 days: 100% of package cost (No Refund).</li>
                        </ul>
                    </div>
                </div>

                <!-- Thank You Card & Call to Action -->
                <div style="background: linear-gradient(135deg, #0d496e 0%, #1e293b 100%); color: white; padding: 24px 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(13,73,110,0.12);">
                    <h3 style="font-size: 17px; font-weight: 800; margin: 0 0 6px 0; color: white; letter-spacing: -0.2px;">Thank You for Choosing Fremor Global</h3>
                    <p style="font-size: 11.5px; color: rgba(255,255,255,0.85); margin: 0 0 15px 0; line-height: 1.55; max-width: 520px; margin-left: auto; margin-right: auto; font-weight: 500;">
                        We are dedicated to providing you with seamless travel planning, exceptional customer care, and memorable vacations. Have a safe and amazing journey!
                    </p>
                    <div style="display: flex; justify-content: center; gap: 20px; font-size: 11px; color: white; font-weight: 700; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 14px;">
                        <span>📞 Phone: +91 9920499911</span>
                        <span>✉️ Email: info@fremorglobal.com</span>
                        <span>🌐 Website: www.fremorglobal.com</span>
                    </div>
                </div>
            </div>

            <!-- Page Footer -->
            <div style="display: flex; justify-content: space-between; border-top: 1.5px solid #f1f5f9; padding-top: 15px; font-size: 10.5px; color: #94a3b8; font-weight: 600;">
                <span>© ${new Date().getFullYear()} Fremor Global. All rights reserved.</span>
                <span>Page ${totalPages} of ${totalPages}</span>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    try {
        const pages = container.querySelectorAll('.pdf-page');
        const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size: 210mm x 297mm

        for (let i = 0; i < pages.length; i++) {
            const pageElement = pages[i];
            
            // Render canvas at 2x scale for print-quality crispness
            const canvas = await html2canvas(pageElement, {
                useCORS: true,
                scale: 2,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            
            if (i > 0) {
                pdf.addPage();
            }
            
            // Add page canvas to pdf filling A4 dimensions exactly
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        }

        // Set metadata properties so the browser's PDF viewer defaults to a clean filename on download
        pdf.setProperties({
            title: `${title} - Fremor Global Tour Brochure`,
            subject: 'Tour Package Brochure',
            author: 'Fremor Global',
            creator: 'Fremor Global'
        });

        // Output PDF as a blob
        const blob = pdf.output('blob');
        return blob;

    } catch (error) {
        console.error('Failed to generate dynamic PDF:', error);
        throw error;
    } finally {
        // Clean up: Remove temporary container from DOM
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }
};
