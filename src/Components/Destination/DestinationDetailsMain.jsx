import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchDestinationById, getImageSrc } from '../../services/destinationService';
import EnquirePopupForm from '../Forms/EnquirePopupForm';
import { supabase } from '../../supabaseClient';
import { generatePackagePDF } from '../../utils/pdfGenerator';
import { checkIfWishlisted, addToWishlist, removeFromWishlist } from '../../services/wishlistService';

const loadLeaflet = () => {
    return new Promise((resolve) => {
        if (window.L) {
            resolve(window.L);
            return;
        }

        // Add Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Add Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = () => {
            resolve(window.L);
        };
        document.body.appendChild(script);
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

function DestinationDetailsMain() {
    const { id } = useParams();
    const [destinationPost, setDestinationPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEnquireOpen, setIsEnquireOpen] = useState(false);
    
    // Active Inclusion State
    const [activeInclusion, setActiveInclusion] = useState(null);
    const inclusionsBarRef = useRef(null);
    const [arrowLeft, setArrowLeft] = useState('10%');
    
    // Wishlist and Share state
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showShareTooltip, setShowShareTooltip] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const checkInitialStatus = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user && id && isMounted) {
                    const status = await checkIfWishlisted(session.user.id, id);
                    if (isMounted) setIsWishlisted(status);
                }
            } catch (err) {
                console.error('Error fetching initial wishlist state:', err);
            }
        };
        checkInitialStatus();
        return () => { isMounted = false; };
    }, [id]);

    const toggleWishlist = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                window.dispatchEvent(new Event('open-login-modal'));
                return;
            }

            const userId = session.user.id;
            if (isWishlisted) {
                await removeFromWishlist(userId, id);
                setIsWishlisted(false);
            } else {
                await addToWishlist(userId, id);
                setIsWishlisted(true);
            }
        } catch (err) {
            console.error('Error toggling wishlist:', err);
        }
    };

    const handleShare = (e) => {
        if (e) e.preventDefault();
        navigator.clipboard.writeText(window.location.href);
        setShowShareTooltip(true);
        setTimeout(() => {
            setShowShareTooltip(false);
        }, 2500);
    };

    const handleDownloadPDF = async (e) => {
        if (e) e.preventDefault();
        if (!destinationPost) return;
        
        // 1. Open blank tab immediately to bypass popup blockers
        const newTab = window.open('', '_blank');
        if (newTab) {
            newTab.document.write(`
                <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:#0d496e;background-color:#f8fafc;">
                    <div style="text-align:center;padding:30px;border-radius:12px;background:white;box-shadow:0 4px 15px rgba(0,0,0,0.05);border:1px solid #e2e8f0;max-width:400px;">
                        <img src="/assets/img/logo/FremorLogo.png" style="height:40px;margin-bottom:20px;object-fit:contain;" />
                        <h3 style="margin:0 0 10px 0;">Generating Tour Brochure...</h3>
                        <p style="color:#64748b;font-size:14px;margin:0;line-height:1.5;">Please wait while we render and compile your custom package details.</p>
                    </div>
                </div>
            `);
        }

        try {
            setGeneratingPDF(true);
            const blob = await generatePackagePDF(destinationPost);
            const blobUrl = URL.createObjectURL(blob);
            
            if (newTab) {
                newTab.location.href = blobUrl;
            } else {
                window.open(blobUrl, '_blank');
            }
        } catch (err) {
            console.error("Failed to generate/download PDF:", err);
            if (newTab) newTab.close();
            alert("An error occurred while generating the PDF. Please try again.");
        } finally {
            setGeneratingPDF(false);
        }
    };
    
    // Tab State
    const [activeTab, setActiveTab] = useState("itinerary"); // 'itinerary', 'details', 'calculator', 'terms'
    const [hasStickyNav, setHasStickyNav] = useState(false);
    
    // Accordion State for Days
    const [expandedDays, setExpandedDays] = useState({ 0: true }); // Day 1 expanded by default
    
    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Interactive Pricing Calculator States
    const [calcCategory, setCalcCategory] = useState("standard"); // 'standard', 'premium', 'luxury'
    const [calcAdults, setCalcAdults] = useState(2);
    const [calcChildren, setCalcChildren] = useState(0);

    // Integrated Enquiry Form states
    const [enquiryData, setEnquiryData] = useState({
        fullName: '',
        emailAddress: '',
        contactNumber: '',
        cityOfResidence: '',
        departureCity: '',
        travelStartDate: '',
        travelEndDate: '',
        childrenAge: ''
    });
    const [enquiryStatus, setEnquiryStatus] = useState('idle'); // idle, sending, success, error

    const handleEnquiryChange = (e) => {
        const { name, value } = e.target;
        setEnquiryData(prev => ({ ...prev, [name]: value }));
    };

    const handleEnquirySubmit = async (e) => {
        e.preventDefault();
        setEnquiryStatus('sending');

        try {
            // 1. Send data to Supabase
            const { error: dbError } = await supabase
                .from('package_enquiries')
                .insert([{
                    destination_title: destinationPost ? destinationPost.title : 'Tour Package',
                    full_name: enquiryData.fullName,
                    email_address: enquiryData.emailAddress,
                    contact_number: enquiryData.contactNumber,
                    city_of_residence: enquiryData.cityOfResidence,
                    departure_city: enquiryData.departureCity,
                    travel_start_date: enquiryData.travelStartDate || null,
                    travel_end_date: enquiryData.travelEndDate || null,
                    no_of_adults: parseInt(calcAdults) || 1,
                    no_of_children: parseInt(calcChildren) || 0,
                    children_age: enquiryData.childrenAge,
                    package_tier: calcCategory
                }]);

            if (dbError) {
                console.error("Supabase Error:", dbError);
            }

            // 2. Send Email through existing API route
            let emailMessage = `
Personal Details:
Name: ${enquiryData.fullName}
Email: ${enquiryData.emailAddress}
Contact: ${enquiryData.contactNumber}
City: ${enquiryData.cityOfResidence}

Travel Details:
Destination: ${destinationPost ? destinationPost.title : 'Tour Package'}
Departure: ${enquiryData.departureCity}
Travel Dates: ${enquiryData.travelStartDate} to ${enquiryData.travelEndDate}

Passenger Details:
Package Tier: ${calcCategory}
Adults: ${calcAdults}, Children: ${calcChildren} (Ages: ${enquiryData.childrenAge})
            `;

            await fetch('/api/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enquiryType: 'Tour Package',
                    name: enquiryData.fullName,
                    email: enquiryData.emailAddress,
                    phone: enquiryData.contactNumber,
                    country: destinationPost ? destinationPost.title : 'Tour Package',
                    travelDate: enquiryData.travelStartDate,
                    travellers: calcAdults,
                    message: emailMessage
                })
            });

            setEnquiryStatus('success');
            setEnquiryData({
                fullName: '',
                emailAddress: '',
                contactNumber: '',
                cityOfResidence: '',
                departureCity: '',
                travelStartDate: '',
                travelEndDate: '',
                childrenAge: ''
            });
            setTimeout(() => {
                setEnquiryStatus('idle');
            }, 5000);

        } catch (err) {
            console.error(err);
            setEnquiryStatus('error');
            setTimeout(() => setEnquiryStatus('idle'), 4000);
        }
    };

    useEffect(() => {
        const loadDestination = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchDestinationById(id);
                setDestinationPost(data);
                
                // Initialize pricing calculator category from package type
                if (data && data.package_type) {
                    setCalcCategory(data.package_type.toLowerCase());
                }
            } catch (err) {
                console.error('Error fetching destination:', err);
                setError('Destination details not found!');
            } finally {
                setLoading(false);
            }
        };

        if (id) loadDestination();
    }, [id]);

    useEffect(() => {
        if (destinationPost) {
            const inclusionsData = {
                hotel: true,
                meals: true,
                sightseeing: true,
                transfers: true,
                manager: true,
                flights: false,
                highlights: true,
                trains: false,
                cruises: false,
                activities: false,
                visa: false,
                insurance: false,
                ...(destinationPost.inclusions || {})
            };
            const keys = ['hotel', 'meals', 'sightseeing', 'transfers', 'manager', 'flights', 'trains', 'cruises', 'activities', 'visa', 'insurance', 'highlights'];
            const firstEnabled = keys.find(key => !!inclusionsData[key]);
            if (firstEnabled) {
                setActiveInclusion(firstEnabled);
            }
        }
    }, [destinationPost]);

    useEffect(() => {
        const handleScroll = () => {
            // HeaderOne sets isSticky when window.scrollY > 500
            setHasStickyNav(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const updateArrowPosition = () => {
            if (!inclusionsBarRef.current || !activeInclusion) return;
            const activeEl = inclusionsBarRef.current.querySelector('.active-inclusion-item');
            if (activeEl) {
                const containerRect = inclusionsBarRef.current.getBoundingClientRect();
                const activeRect = activeEl.getBoundingClientRect();
                const leftOffset = (activeRect.left - containerRect.left) + (activeRect.width / 2) - 7;
                setArrowLeft(`${leftOffset}px`);
            }
        };

        updateArrowPosition();
        const timer = setTimeout(updateArrowPosition, 50);

        window.addEventListener('resize', updateArrowPosition);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateArrowPosition);
        };
    }, [activeInclusion, destinationPost]);

    // Filter map locations (safety check for null objects or missing properties)
    const mapLocations = destinationPost && Array.isArray(destinationPost.itinerary) 
        ? destinationPost.itinerary.filter(day => {
            if (!day || typeof day !== 'object') return false;
            const lat = parseFloat(day.latitude);
            const lng = parseFloat(day.longitude);
            return !isNaN(lat) && !isNaN(lng);
        })
        : [];

    useEffect(() => {
        if (mapLocations.length === 0) return;

        let mapInstance = null;
        let isMounted = true;

        loadLeaflet().then((L) => {
            if (!isMounted) return;

            const container = document.getElementById('package-map');
            if (!container) return;

            // Safe guard: clear inner HTML and reset Leaflet ID if map container was already initialized
            if (container._leaflet_id) {
                container._leaflet_id = null;
                container.innerHTML = '';
            }

            // Initialize map
            mapInstance = L.map('package-map', {
                scrollWheelZoom: false,
                attributionControl: false
            });

            // Set up premium tiles (CARTO Voyager)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
            }).addTo(mapInstance);

            const markers = [];
            const latlngs = [];

            mapLocations.forEach((day, index) => {
                const lat = parseFloat(day.latitude);
                const lng = parseFloat(day.longitude);
                if (isNaN(lat) || isNaN(lng)) return;

                const latlng = [lat, lng];
                latlngs.push(latlng);

                // Custom DivIcon styled as a red location pin with day number
                const pinIcon = L.divIcon({
                    html: `<div class="custom-map-pin">
                             <i class="fa-solid fa-location-dot" style="color: #ef4444; font-size: 26px; text-shadow: 0 2px 4px rgba(0,0,0,0.35);"></i>
                             <span class="pin-day-badge">${index + 1}</span>
                           </div>`,
                    className: 'custom-div-icon',
                    iconSize: [30, 42],
                    iconAnchor: [15, 36],
                    popupAnchor: [0, -32]
                });

                // Add marker
                const marker = L.marker(latlng, { icon: pinIcon }).addTo(mapInstance);
                marker.bindPopup(`
                    <div style="font-family: inherit; font-size: 13px;">
                        <span style="font-weight: 800; color: #3b82f6; text-transform: uppercase; font-size: 10px; display: block; margin-bottom: 2px;">${day.day || `Day ${index + 1}`}</span>
                        <b>${day.location_name || 'Visited Location'}</b>
                        ${day.title ? `<div style="color: #64748b; margin-top: 3px; font-size: 11.5px;">${day.title}</div>` : ''}
                    </div>
                `);

                markers.push(marker);
            });

            // Connect markers sequentially with a path (polyline)
            if (latlngs.length > 1) {
                L.polyline(latlngs, {
                    color: '#3b82f6',
                    weight: 3,
                    opacity: 0.8,
                    dashArray: '6, 8',
                    lineCap: 'round',
                    lineJoin: 'round'
                }).addTo(mapInstance);
            }

            // Zoom map to fit all path coordinates
            if (markers.length > 0) {
                const group = new L.featureGroup(markers);
                mapInstance.fitBounds(group.getBounds().pad(0.2));
            }
        });

        // Cleanup function to remove leaflet map when component updates or unmounts
        return () => {
            isMounted = false;
            if (mapInstance) {
                mapInstance.remove();
            }
        };
    }, [destinationPost, mapLocations.length]);

    if (loading) return <div className="text-center py-5"><h3>Loading destination details...</h3></div>;
    if (error || !destinationPost) return <div className="text-center py-5"><h3>{error || 'Destination not found'}</h3></div>;

    // Build Gallery Images list
    let galleryList = [];
    if (destinationPost.image) {
        galleryList.push(getImageSrc(destinationPost.image));
    }
    if (destinationPost.gallery_images && Array.isArray(destinationPost.gallery_images)) {
        destinationPost.gallery_images.forEach(img => {
            if (img) galleryList.push(getImageSrc(img));
        });
    }

    const fallbackList = [
        "/assets/img/destination/destination_details_1.jpg",
        "/assets/img/destination/destination_details_2.jpg",
        "/assets/img/destination/destination_details_3.jpg",
        "/assets/img/destination/destination_details_1.jpg",
        "/assets/img/destination/destination_details_2.jpg"
    ];

    while (galleryList.length < 5) {
        galleryList.push(fallbackList[galleryList.length % fallbackList.length]);
    }

    const getInclusionColor = (key) => {
        const colors = {
            hotel: '#ec4899',
            meals: '#f97316',
            sightseeing: '#8b5cf6',
            transfers: '#eab308',
            manager: '#d946ef',
            flights: '#06b6d4',
            trains: '#10b981',
            cruises: '#0ea5e9',
            activities: '#14b8a6',
            visa: '#4f46e5',
            insurance: '#059669',
            highlights: '#b45309'
        };
        return colors[key] || '#475569';
    };

    const renderInclusionDetails = (content) => {
        if (!content || content.trim() === '') {
            return <p className="text-muted m-0" style={{ fontSize: '13.5px' }}>No specific details provided for this inclusion.</p>;
        }

        const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const isTable = lines.some(line => line.includes('|'));

        if (isTable) {
            return (
                <div className="table-responsive">
                    <table className="table table-borderless align-middle m-0" style={{ fontSize: '14px' }}>
                        <tbody>
                            {lines.map((line, idx) => {
                                const cells = line.split('|').map(cell => cell.trim());
                                return (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        {cells.map((cell, cellIdx) => {
                                            const isStars = cell.includes('★');
                                            return (
                                                <td 
                                                    key={cellIdx} 
                                                    className={`py-2 px-1 ${cellIdx === 0 ? 'fw-bold text-dark' : 'text-secondary'}`}
                                                    style={isStars ? { color: '#ffb800', fontWeight: 'bold' } : {}}
                                                >
                                                    {cell}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <ul className="list-unstyled m-0" style={{ fontSize: '13.5px', lineHeight: '1.7', color: '#475569' }}>
                {lines.map((line, idx) => (
                    <li key={idx} className="mb-2 d-flex align-items-start gap-2">
                        <i className="fa-solid fa-circle-check text-success mt-1" style={{ fontSize: '11px' }}></i>
                        <span>{line.replace(/^[-\*\+]\s*/, '')}</span>
                    </li>
                ))}
            </ul>
        );
    };

    const itinerary = Array.isArray(destinationPost.itinerary) ? destinationPost.itinerary : [];
    const included = destinationPost.included_list?.length > 0 ? destinationPost.included_list : ["N/A"];
    const excluded = destinationPost.excluded_list?.length > 0 ? destinationPost.excluded_list : ["N/A"];

    // Inclusions Toggles Map
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

    const inclusionsData = {
        hotel: true,
        meals: true,
        sightseeing: true,
        transfers: true,
        manager: true,
        flights: false,
        trains: false,
        cruises: false,
        activities: false,
        visa: false,
        insurance: false,
        highlights: true,
        ...(destinationPost.inclusions || {})
    };

    const activeInclusionsKeys = Object.keys(inclusionsMap).filter(key => !!inclusionsData[key]);

    // Toggle Accordion Days
    const toggleDay = (index) => {
        setExpandedDays(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Lightbox handlers
    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const prevPhoto = () => {
        setLightboxIndex(prev => (prev === 0 ? galleryList.length - 1 : prev - 1));
    };

    const nextPhoto = () => {
        setLightboxIndex(prev => (prev === galleryList.length - 1 ? 0 : prev + 1));
    };

    // Pricing Calculator calculations
    const getNumericPrice = (p) => {
        if (p === null || p === undefined) return 0;
        if (typeof p === 'number') return p;
        const cleaned = p.toString().replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 0;
    };

    const priceVal = getNumericPrice(destinationPost.price);
    const origPriceVal = getNumericPrice(destinationPost.original_price);

    const getBasePrice = () => {
        if (!destinationPost.price) return 980;
        const cleaned = destinationPost.price.toString().replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 980;
    };

    const basePriceNum = getBasePrice();
    const getMultiplier = () => {
        if (calcCategory === "premium") return 1.25;
        if (calcCategory === "luxury") return 1.5;
        return 1.0; // standard
    };

    const multiplier = getMultiplier();
    const singleAdultPrice = Math.round(basePriceNum * multiplier);
    const singleChildPrice = Math.round(singleAdultPrice * 0.7);

    const totalAdultsCost = calcAdults * singleAdultPrice;
    const totalChildrenCost = calcChildren * singleChildPrice;
    const totalCost = totalAdultsCost + totalChildrenCost;

    const defaultTerms = `
        <div style="margin-top: 15px;">
            <h4 class="text-dark fw-bold mb-3" style="font-size: 18px; border-left: 4px solid #0d496e; padding-left: 12px; line-height: 1.2;">1. Booking & Reservation Policy</h4>
            <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 25px;">
                <li class="mb-2"><strong>Initial Booking Deposit:</strong> A non-refundable advance payment of <strong>30% of the total package cost</strong> is required at the time of booking to secure and confirm reservations for hotels, flights, and sightseeing slots.</li>
                <li class="mb-2"><strong>Second Installment:</strong> An additional payment of <strong>50% of the total package cost</strong> must be cleared and settled exactly <strong>30 days prior to the scheduled departure date</strong>.</li>
                <li class="mb-2"><strong>Final Balance Payment:</strong> The remaining <strong>20% balance payment</strong> must be received in full at least <strong>15 days before the departure/travel date</strong>.</li>
                <li class="mb-2"><strong>Late Payment Clause:</strong> Failure to complete payments within the specified timeframes may lead to automatic cancellation of booking reservation holds, and any advance payments made shall be forfeited.</li>
                <li class="mb-2"><strong>Rate Confirmations:</strong> Rates are subject to dynamic changes based on availability. Prices are only locked once the full deposit is received and a confirmation voucher is generated.</li>
            </ul>
            
            <h4 class="text-dark fw-bold mb-3" style="font-size: 18px; border-left: 4px solid #0d496e; padding-left: 12px; line-height: 1.2;">2. Cancellation & Refund Policy</h4>
            <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 25px;">
                <li class="mb-2"><strong>Written Cancellation:</strong> All cancellations must be requested in writing by the primary traveler and sent via registered email to our support desk. Verbal or message-based cancellations will not be processed.</li>
                <li class="mb-2"><strong>Cancellation 45 Days or More Before Departure:</strong> A cancellation fee equivalent to <strong>10% of the total package cost</strong> (or the non-refundable booking deposit fee) will be retained, and the remainder refunded.</li>
                <li class="mb-2"><strong>Cancellation 30 to 44 Days Before Departure:</strong> A cancellation charge of <strong>25% of the total package cost</strong> will be levied.</li>
                <li class="mb-2"><strong>Cancellation 15 to 29 Days Before Departure:</strong> A cancellation charge of <strong>50% of the total package cost</strong> will be levied.</li>
                <li class="mb-2"><strong>Cancellation Less than 15 Days Before Departure:</strong> A cancellation charge of <strong>100% of the total package cost</strong> will be applied, and strictly no refund will be issued.</li>
                <li class="mb-2"><strong>Third-Party Vendor Rules:</strong> Flights, cruises, rail tickets, and peak-season hotel bookings are bound by the respective operator's terms. Non-refundable airline tickets, visa charges, and entry permits cannot be refunded under any circumstances.</li>
                <li class="mb-2"><strong>Refund Processing Time:</strong> Approved refund amounts will be credited back to the original payment source within <strong>7 to 14 working days</strong> after cancellation confirmation.</li>
            </ul>

            <h4 class="text-dark fw-bold mb-3" style="font-size: 18px; border-left: 4px solid #0d496e; padding-left: 12px; line-height: 1.2;">3. Amendment & Re-scheduling Policy</h4>
            <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 25px;">
                <li class="mb-2"><strong>Amendment Request:</strong> Any request for change of travel date, destination, hotel category, or passenger details is subject to availability and must be requested at least 30 days before departure.</li>
                <li class="mb-2"><strong>Amendment Fee:</strong> A nominal administration charge of ₹ 2,500 per amendment request will apply, in addition to any actual price differences (such as airline fare hikes, hotel price changes, etc.).</li>
                <li class="mb-2"><strong>Transfer of Booking:</strong> Bookings are non-transferable to other individuals once airline tickets have been issued or hotel room lists finalized.</li>
            </ul>
            
            <h4 class="text-dark fw-bold mb-3" style="font-size: 18px; border-left: 4px solid #0d496e; padding-left: 12px; line-height: 1.2;">4. Passports, Visas & Travel Documentation</h4>
            <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 25px;">
                <li class="mb-2"><strong>Passport Validity:</strong> All travelers must hold a passport valid for at least <strong>6 months</strong> from the scheduled date of return.</li>
                <li class="mb-2"><strong>Visa Responsibility:</strong> While we assist in visa documentation and application submissions, approval or rejection of visas is solely at the discretion of the respective embassy or consulate. We are not liable for any financial losses arising from visa delays or rejections.</li>
                <li class="mb-2"><strong>Travel Insurance:</strong> We highly recommend purchasing comprehensive travel insurance covering trip cancellation, medical emergencies, baggage loss, and flight delays prior to your departure.</li>
            </ul>

            <h4 class="text-dark fw-bold mb-3" style="font-size: 18px; border-left: 4px solid #0d496e; padding-left: 12px; line-height: 1.2;">5. General Travel Conditions & Disclaimers</h4>
            <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 10px;">
                <li class="mb-2"><strong>Flight Schedule Updates:</strong> Airline timings, routes, and schedules are subject to sudden change. Any additional expenses incurred due to flight delays, cancellations, or missed connections are the sole responsibility of the traveler.</li>
                <li class="mb-2"><strong>Hotel Availability:</strong> Specific hotels mentioned in the itinerary are subject to availability at the time of final booking. If not available, an equivalent accommodation of the same star category and standard will be arranged.</li>
                <li class="mb-2"><strong>Itinerary Adjustments:</strong> The company reserves the right to rearrange or adjust itinerary details and visit order in response to weather conditions, strikes, traffic blocks, or local government regulations.</li>
                <li class="mb-2"><strong>Health & Fitness:</strong> Some tours may require moderate physical activity. Travelers must declare any pre-existing health conditions or mobility constraints prior to booking.</li>
                <li class="mb-2"><strong>Baggage Responsibility:</strong> Travelers are responsible for their personal belongings. We hold no liability for lost, damaged, or misplaced baggage during transfers or flights.</li>
            </ul>
        </div>
    `;

    return (
        <>
        <section className="space-top space-bottom bg-light">
            <div className="container">
                {/* 1. TITLE & META INFO */}
                <div className="mb-4">
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                            {destinationPost.title}
                        </h1>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            background: '#ffffff', 
                            padding: '4px 12px', 
                            borderRadius: '20px', 
                            border: '1px solid #e2e8f0', 
                            fontSize: '14px', 
                            fontWeight: '700', 
                            color: '#1e293b',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                        }}>
                            <span style={{ color: '#ffb800' }}>★</span>
                            <span>{destinationPost.rating ? parseFloat(destinationPost.rating).toFixed(1) : '4.8'}</span>
                            {destinationPost.rating_count > 0 && (
                                <span style={{ color: '#64748b', fontWeight: '500', fontSize: '12px' }}>
                                    ({destinationPost.rating_count})
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="d-flex flex-wrap gap-4 mt-3" style={{ fontSize: '15px', color: '#475569', fontWeight: '600' }}>
                        <div className="d-flex align-items-center gap-2">
                            <i className="fa-regular fa-clock text-danger" style={{ fontSize: '17px' }}></i>
                            <span>
                                {destinationPost.nights > 0 ? `${destinationPost.nights} Nights ` : ''}
                                {destinationPost.days > 0 ? `${destinationPost.days} Days` : destinationPost.duration}
                            </span>
                        </div>
                        {destinationPost.itinerary_route && (
                            <div className="d-flex align-items-center gap-2">
                                <i className="fa-solid fa-location-dot text-primary" style={{ fontSize: '17px' }}></i>
                                <span>{destinationPost.itinerary_route}</span>
                            </div>
                        )}
                        {destinationPost.accommodation_type && (
                            <div className="d-flex align-items-center gap-2">
                                <i className="fa-solid fa-hotel text-warning" style={{ fontSize: '15px' }}></i>
                                <span>{destinationPost.accommodation_type} Accommodation</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-xxl-9 col-lg-8">
                        {/* 2. IMAGE GRID GALLERY */}
                        <div className="details-gallery-grid">
                    {/* Large image on left */}
                    <div className="details-gallery-main" onClick={() => openLightbox(0)}>
                        <div className="main-image-badge">
                            <i className="fa-solid fa-users"></i>
                            <span>{destinationPost.tour_type || 'Group Tour'}</span>
                        </div>
                        <img src={galleryList[0]} alt={destinationPost.title} />
                    </div>

                    {/* 4 Thumbnails on right */}
                    <div className="details-gallery-thumbs">
                        <div className="details-gallery-thumb" onClick={() => openLightbox(1)}>
                            <img src={galleryList[1]} alt="" />
                        </div>
                        <div className="details-gallery-thumb" onClick={() => openLightbox(2)}>
                            <img src={galleryList[2]} alt="" />
                        </div>
                        <div className="details-gallery-thumb" onClick={() => openLightbox(3)}>
                            <img src={galleryList[3]} alt="" />
                        </div>
                        <div className="details-gallery-thumb see-all-photos-wrapper" onClick={() => openLightbox(4)}>
                            <img src={galleryList[4]} alt="" />
                            <div className="see-all-overlay">
                                <span>See All Photos</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. INCLUSIONS BAR */}
                <div ref={inclusionsBarRef} className="details-inclusions-bar">
                    {activeInclusionsKeys.map((key) => {
                        const meta = inclusionsMap[key];
                        return (
                            <div 
                                key={key} 
                                className={`details-inclusion-item ${activeInclusion === key ? 'active-inclusion-item' : ''}`}
                                title={`${meta.label} details available`}
                                onClick={() => setActiveInclusion(key)}
                            >
                                <div className={`details-inclusion-circle ${meta.class}`}>
                                    <i className={`fa-solid ${meta.icon}`}></i>
                                </div>
                                <span className="details-inclusion-label">{meta.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* 3b. ACTIVE INCLUSION DETAILS CONTAINER */}
                {activeInclusion && (
                    <div className="inclusion-detail-container">
                        <div 
                            className="inclusion-detail-arrow" 
                            style={{ left: arrowLeft }}
                        ></div>
                        <div className="inclusion-detail-title">
                            <i className={`fa-solid ${inclusionsMap[activeInclusion].icon}`} style={{ color: getInclusionColor(activeInclusion) }}></i>
                            <span className="text-capitalize">{inclusionsMap[activeInclusion].label} Details</span>
                        </div>
                        <div className="inclusion-detail-body">
                            {renderInclusionDetails(destinationPost.inclusions_details?.[activeInclusion])}
                        </div>
                    </div>
                )}

                {/* 4. TABS & MAIN LAYOUT */}
                        {/* Tab Headers */}
                        <div className={`details-tabs-header ${hasStickyNav ? 'has-sticky-nav' : ''}`}>
                            <button 
                                className={`details-tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
                                onClick={() => setActiveTab('itinerary')}
                            >
                                <i className="fa-regular fa-calendar-days"></i>
                                Itinerary
                            </button>
                            <button 
                                className={`details-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                                onClick={() => setActiveTab('details')}
                            >
                                <i className="fa-regular fa-circle-info"></i>
                                Package Details
                            </button>
                            <button 
                                className={`details-tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
                                onClick={() => setActiveTab('calculator')}
                            >
                                <i className="fa-regular fa-envelope"></i>
                                Enquire Now
                            </button>
                            <button 
                                className={`details-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
                                onClick={() => setActiveTab('terms')}
                            >
                                <i className="fa-regular fa-file-lines"></i>
                                Terms & Conditions
                            </button>
                        </div>

                        {/* Tab Content Box */}
                        <div className="bg-white rounded-3 p-4 shadow-sm border border-light" style={{ minHeight: '300px' }}>
                            
                            {/* ITINERARY TAB */}
                            {activeTab === 'itinerary' && (
                                <div>
                                    <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
                                        Itinerary Schedule
                                    </h3>
                                    {itinerary.length > 0 ? (
                                        <div className="itinerary-accordion-container" style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                                            {itinerary.map((dayObj, index) => {
                                                const isExpanded = !!expandedDays[index];
                                                const dayTitle = dayObj.title || (dayObj.activities?.[0] || 'Daily Plan');
                                                const dayDescription = dayObj.description || (dayObj.activities?.length > 1 ? dayObj.activities.slice(1).join('\n') : dayObj.activities?.join('\n') || '');
                                                
                                                // Icon for the next day transition
                                                let transitionIcon = 'fa-route';
                                                if (index < itinerary.length - 1) {
                                                    const nextDay = itinerary[index + 1];
                                                    const nextCombined = `${nextDay.title || ''} ${nextDay.description || ''}`.toLowerCase();
                                                    if (nextCombined.includes('flight') || nextCombined.includes('airport') || nextCombined.includes('arrival') || nextCombined.includes('depart')) {
                                                        transitionIcon = 'fa-plane';
                                                    } else if (nextCombined.includes('transfer') || nextCombined.includes('drive') || nextCombined.includes('ride') || nextCombined.includes('train') || nextCombined.includes('car')) {
                                                        transitionIcon = 'fa-car-side';
                                                    } else if (nextCombined.includes('check-in') || nextCombined.includes('stay') || nextCombined.includes('hotel') || nextCombined.includes('overnight')) {
                                                        transitionIcon = 'fa-hotel';
                                                    } else if (nextCombined.includes('safari') || nextCombined.includes('visit') || nextCombined.includes('sightseeing') || nextCombined.includes('explore') || nextCombined.includes('tour') || nextCombined.includes('excursion') || nextCombined.includes('beach')) {
                                                        transitionIcon = 'fa-binoculars';
                                                    }
                                                }

                                                return (
                                                    <React.Fragment key={index}>
                                                        <div className={`itinerary-day-card ${isExpanded ? 'expanded' : ''}`}>
                                                            <button 
                                                                className="itinerary-day-header"
                                                                onClick={() => toggleDay(index)}
                                                            >
                                                                <div className="itinerary-day-header-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                        <span className="itinerary-day-badge">{dayObj.day}</span>
                                                                        <h4 className="itinerary-day-title">{dayTitle}</h4>
                                                                    </div>
                                                                    {dayObj.inclusions && dayObj.inclusions.length > 0 && (
                                                                        <div className="daily-inclusions-inline-container" style={{ paddingLeft: '75px' }}>
                                                                            {dayObj.inclusions.map(incKey => {
                                                                                const meta = inclusionsMap[incKey];
                                                                                if (!meta) return null;
                                                                                return (
                                                                                    <div 
                                                                                        key={incKey} 
                                                                                        className={`daily-inclusion-mini-icon ${meta.class}`}
                                                                                        title={meta.label}
                                                                                    >
                                                                                        <i className={`fa-solid ${meta.icon}`}></i>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="itinerary-day-toggle-icon">
                                                                    <i className={`fa-solid ${isExpanded ? 'fa-minus' : 'fa-plus'}`}></i>
                                                                </div>
                                                            </button>
                                                            
                                                            {isExpanded && (
                                                                <div className="itinerary-day-content">
                                                                    {dayObj.image && (
                                                                        <div className="itinerary-day-img-wrapper">
                                                                            <img src={getImageSrc(dayObj.image)} alt={dayObj.day} />
                                                                        </div>
                                                                    )}
                                                                    <div className="itinerary-day-desc" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                                        {dayObj.inclusions && dayObj.inclusions.length > 0 && (
                                                                            <div className="daily-inclusions-wrapper">
                                                                                <span className="daily-inclusions-title">Included Today:</span>
                                                                                <div className="daily-inclusions-list">
                                                                                    {dayObj.inclusions.map(incKey => {
                                                                                        const meta = inclusionsMap[incKey];
                                                                                        if (!meta) return null;
                                                                                        return (
                                                                                            <div key={incKey} className="daily-inclusion-badge">
                                                                                                <span className={`daily-inclusion-badge-circle ${meta.class}`}>
                                                                                                    <i className={`fa-solid ${meta.icon}`}></i>
                                                                                                </span>
                                                                                                <span>{meta.label}</span>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                                                                            {dayDescription}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Transition connector line between days */}
                                                        {index < itinerary.length - 1 && (
                                                            <div className="itinerary-group-connector" style={{ margin: '4px 0', height: '50px' }}>
                                                                <div className="connector-curve-line" style={{ borderLeft: '3.5px dashed #cbd5e1' }}></div>
                                                                <div className="connector-transfer-badge" title="Next Day Route" style={{ border: '3.5px solid #ffffff' }}>
                                                                    <i className={`fa-solid ${transitionIcon}`}></i>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-muted">Itinerary schedule will be updated shortly.</p>
                                    )}
                                </div>
                            )}

                            {/* PACKAGE DETAILS TAB */}
                            {activeTab === 'details' && (
                                <div>
                                    {/* About This Package Description */}
                                    {(destinationPost.description_1 || destinationPost.description_2) && (
                                        <div className="mb-4">
                                            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '15px', color: '#0f172a' }}>
                                                About This Package
                                            </h3>
                                            {destinationPost.description_1 && (
                                                <p className="text-muted" style={{ fontSize: '15px', lineHeight: '1.7', marginBottom: '15px', whiteSpace: 'pre-line' }}>
                                                    {destinationPost.description_1}
                                                </p>
                                            )}
                                            {destinationPost.description_2 && (
                                                <p className="text-muted" style={{ fontSize: '15px', lineHeight: '1.7', marginBottom: '20px', whiteSpace: 'pre-line' }}>
                                                    {destinationPost.description_2}
                                                </p>
                                            )}
                                            <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '24px 0' }}></div>
                                        </div>
                                    )}

                                    {/* Locations Visited */}
                                    {(destinationPost.location || destinationPost.itinerary_route) && (
                                        <div className="mb-4">
                                            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '15px', color: '#0f172a' }}>
                                                Locations We Are Visiting
                                            </h3>
                                            <div className="p-3 bg-light rounded-3 d-flex flex-wrap align-items-center gap-3 border border-light mb-4">
                                                <div className="d-flex align-items-center gap-2">
                                                    <i className="fa-solid fa-map-pin text-danger" style={{ fontSize: '18px' }}></i>
                                                    <span style={{ fontWeight: '700', color: '#1e293b' }}>Primary Location:</span>
                                                    <span style={{ color: '#475569' }}>{destinationPost.location || "Multiple Locations"}</span>
                                                </div>
                                                {destinationPost.itinerary_route && (
                                                    <>
                                                        <div className="d-none d-md-block" style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1' }}></div>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <i className="fa-solid fa-route text-primary" style={{ fontSize: '18px' }}></i>
                                                            <span style={{ fontWeight: '700', color: '#1e293b' }}>Route:</span>
                                                            <span style={{ color: '#475569' }}>
                                                                {destinationPost.itinerary_route}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '24px 0' }}></div>
                                        </div>
                                    )}

                                    {/* Highlights */}
                                    {destinationPost.rich_highlights && destinationPost.rich_highlights.length > 0 && destinationPost.rich_highlights.some(hl => hl.title || hl.description) && (
                                        <div className="mb-4">
                                            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '15px', color: '#0f172a' }}>
                                                Package Highlights
                                            </h3>
                                            <div className="row g-3">
                                                {destinationPost.rich_highlights.map((hl, hlIdx) => (
                                                    <div key={hlIdx} className="col-md-6">
                                                        <div className="p-3 bg-light rounded-3 h-100 border border-light d-flex gap-3 align-items-start">
                                                            <div className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm" style={{ width: '36px', height: '36px', minWidth: '36px', border: '1px solid #e2e8f0' }}>
                                                                <i className="fa-solid fa-star text-warning" style={{ fontSize: '16px' }}></i>
                                                            </div>
                                                            <div>
                                                                {hl.title && <h5 className="mb-1" style={{ fontSize: '15.5px', fontWeight: '700', color: '#1e293b' }}>{hl.title}</h5>}
                                                                {hl.description && <p className="text-muted m-0" style={{ fontSize: '13.5px', lineHeight: '1.6' }}>{hl.description}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '24px 0' }}></div>
                                        </div>
                                    )}

                                    <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
                                        Package Inclusions & Exclusions
                                    </h3>
                                    
                                    <div className="row g-4 mb-4">
                                        <div className="col-md-6">
                                            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px' }}>
                                                <h4 className="text-success mb-3 fw-bold" style={{ fontSize: '17px' }}>
                                                    <i className="fa-solid fa-circle-check me-2"></i> Inclusions
                                                </h4>
                                                <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
                                                    {included.map((item, i) => (
                                                        <li key={i} className="mb-2 d-flex align-items-start gap-2" style={{ fontSize: '14.5px', color: '#1e293b' }}>
                                                            <i className="fa-solid fa-check text-success mt-1" style={{ fontSize: '13px' }}></i>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px' }}>
                                                <h4 className="text-danger mb-3 fw-bold" style={{ fontSize: '17px' }}>
                                                    <i className="fa-solid fa-circle-xmark me-2"></i> Exclusions
                                                </h4>
                                                <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
                                                    {excluded.map((item, i) => (
                                                        <li key={i} className="mb-2 d-flex align-items-start gap-2" style={{ fontSize: '14.5px', color: '#1e293b' }}>
                                                            <i className="fa-solid fa-xmark text-danger mt-1" style={{ fontSize: '13px' }}></i>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {destinationPost.basic_info_text && (
                                        <div className="mb-4">
                                            <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>
                                                Basic Information
                                            </h4>
                                            <p className="text-muted" style={{ fontSize: '14.5px', lineHeight: '1.6' }}>
                                                {destinationPost.basic_info_text}
                                            </p>
                                        </div>
                                    )}

                                    {/* Download Brochure */}
                                    <div style={{ 
                                        background: 'linear-gradient(135deg, #0d496e 0%, #1e293b 100%)', 
                                        color: 'white', 
                                        padding: '24px', 
                                        borderRadius: '12px',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '15px'
                                    }}>
                                        <div>
                                            <h4 className="text-white m-0 mb-1" style={{ fontSize: '18px', fontWeight: '700' }}>
                                                Need complete package schedule offline?
                                            </h4>
                                            <p className="m-0 text-white-50" style={{ fontSize: '13.5px' }}>
                                                Download the dynamic PDF brochure with pricing details and itineraries.
                                            </p>
                                        </div>
                                        <button 
                                            onClick={handleDownloadPDF}
                                            disabled={generatingPDF}
                                            className="btn btn-theme-submit px-4 py-2 fw-bold text-white rounded-3 shadow"
                                            style={{ fontSize: '14px', border: 'none', cursor: generatingPDF ? 'wait' : 'pointer' }}
                                        >
                                            <i className="fa-solid fa-download me-2"></i> {generatingPDF ? "Generating..." : "Download Brochure"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* CALCULATE PRICE / ENQUIRE NOW TAB */}
                            {activeTab === 'calculator' && (
                                <div>
                                    <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
                                        Send Enquiry
                                    </h3>
                                    
                                    <div className="inline-enquiry-form-card">
                                        {enquiryStatus === 'success' ? (
                                            <div className="alert alert-success text-center py-4">
                                                <h5 className="text-success"><i className="fa-solid fa-circle-check"></i> Enquiry Submitted!</h5>
                                                <p className="m-0" style={{ fontSize: '13.5px' }}>
                                                    Thank you for enquiring about {destinationPost.title}. Our travel experts will get in touch with you shortly!
                                                </p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleEnquirySubmit}>
                                                {enquiryStatus === 'error' && (
                                                    <div className="alert alert-danger py-2" style={{ fontSize: '13px' }}>
                                                        Something went wrong. Please try again.
                                                    </div>
                                                )}

                                                {/* Section 1: Package Tier & Live Calculator */}
                                                <h5 className="text-secondary border-bottom pb-2 mb-3">
                                                    <i className="fa-solid fa-calculator me-2"></i>1. Select Package & Price Estimate
                                                </h5>
                                                
                                                <div className="compact-calculator-box">
                                                    <div className="compact-calculator-grid">
                                                        <div className="compact-calculator-field">
                                                            <label>Package Tier</label>
                                                            <select 
                                                                className="form-select"
                                                                value={calcCategory} 
                                                                onChange={(e) => setCalcCategory(e.target.value)}
                                                            >
                                                                <option value="standard">Standard Package</option>
                                                                <option value="premium">Premium Package (+25%)</option>
                                                                <option value="luxury">Luxury Package (+50%)</option>
                                                            </select>
                                                        </div>
                                                        
                                                        <div className="compact-calculator-field">
                                                            <label>No. of Adults</label>
                                                            <input 
                                                                type="number" 
                                                                className="form-control"
                                                                min="1" 
                                                                value={calcAdults} 
                                                                onChange={(e) => setCalcAdults(Math.max(1, parseInt(e.target.value) || 1))}
                                                            />
                                                        </div>
                                                        
                                                        <div className="compact-calculator-field">
                                                            <label>No. of Children (Ages 2-12)</label>
                                                            <input 
                                                                type="number" 
                                                                className="form-control"
                                                                min="0" 
                                                                value={calcChildren} 
                                                                onChange={(e) => setCalcChildren(Math.max(0, parseInt(e.target.value) || 0))}
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="compact-calculator-summary">
                                                        <div className="compact-summary-row">
                                                            <span>Price per Adult:</span>
                                                            <strong>₹ {singleAdultPrice.toLocaleString('en-IN')}</strong>
                                                        </div>
                                                        {calcChildren > 0 && (
                                                            <div className="compact-summary-row">
                                                                <span>Price per Child (70%):</span>
                                                                <strong>₹ {singleChildPrice.toLocaleString('en-IN')}</strong>
                                                            </div>
                                                        )}
                                                        <div className="compact-summary-row">
                                                            <span>Adults Cost ({calcAdults}):</span>
                                                            <span>₹ {totalAdultsCost.toLocaleString('en-IN')}</span>
                                                        </div>
                                                        {calcChildren > 0 && (
                                                            <div className="compact-summary-row">
                                                                <span>Children Cost ({calcChildren}):</span>
                                                                <span>₹ {totalChildrenCost.toLocaleString('en-IN')}</span>
                                                            </div>
                                                        )}
                                                        <div className="compact-summary-row total-row">
                                                            <span>Estimated Total:</span>
                                                            <span className="price-val">₹ {totalCost.toLocaleString('en-IN')}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Section 2: Personal Details */}
                                                <h5 className="text-secondary border-bottom pb-2 mb-3">
                                                    <i className="fa-solid fa-user me-2"></i>2. Personal Details
                                                </h5>
                                                <div className="row g-2 mb-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Full Name *</label>
                                                        <input 
                                                            type="text" 
                                                            name="fullName" 
                                                            value={enquiryData.fullName} 
                                                            onChange={handleEnquiryChange} 
                                                            className="form-control" 
                                                            placeholder="Your full name"
                                                            required 
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Email Address *</label>
                                                        <input 
                                                            type="email" 
                                                            name="emailAddress" 
                                                            value={enquiryData.emailAddress} 
                                                            onChange={handleEnquiryChange} 
                                                            className="form-control" 
                                                            placeholder="Email for quote details"
                                                            required 
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Contact Number *</label>
                                                        <input 
                                                            type="tel" 
                                                            name="contactNumber" 
                                                            value={enquiryData.contactNumber} 
                                                            onChange={handleEnquiryChange} 
                                                            className="form-control" 
                                                            placeholder="Phone number"
                                                            required 
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">City of Residence</label>
                                                        <input 
                                                            type="text" 
                                                            name="cityOfResidence" 
                                                            value={enquiryData.cityOfResidence} 
                                                            onChange={handleEnquiryChange} 
                                                            className="form-control" 
                                                            placeholder="Your current city"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Section 3: Travel Details */}
                                                <h5 className="text-secondary border-bottom pb-2 mb-3">
                                                    <i className="fa-solid fa-plane me-2"></i>3. Travel Details
                                                </h5>
                                                <div className="row g-2 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Departure City</label>
                                                        <input 
                                                            type="text" 
                                                            name="departureCity" 
                                                            value={enquiryData.departureCity} 
                                                            onChange={handleEnquiryChange} 
                                                            className="form-control" 
                                                            placeholder="Leaving from"
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Travel Start Date *</label>
                                                        <input 
                                                            type="date" 
                                                            name="travelStartDate" 
                                                            value={enquiryData.travelStartDate} 
                                                            onChange={handleEnquiryChange} 
                                                            className="form-control" 
                                                            required 
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Travel End Date</label>
                                                        <input 
                                                            type="date" 
                                                            name="travelEndDate" 
                                                            value={enquiryData.travelEndDate} 
                                                            onChange={handleEnquiryChange} 
                                                            className="form-control" 
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Children Age(s) (if any)</label>
                                                        <input 
                                                            type="text" 
                                                            name="childrenAge" 
                                                            value={enquiryData.childrenAge} 
                                                            onChange={handleEnquiryChange} 
                                                            className="form-control" 
                                                            placeholder="e.g. 5, 8" 
                                                        />
                                                    </div>
                                                </div>

                                                <div className="d-grid">
                                                    <button 
                                                        type="submit" 
                                                        className="btn btn-theme-submit btn-lg fw-bold shadow-lg"
                                                        style={{ borderRadius: '8px', border: 'none' }}
                                                        disabled={enquiryStatus === 'sending'}
                                                    >
                                                        {enquiryStatus === 'sending' ? (
                                                            <span><i className="fa-solid fa-spinner fa-spin me-2"></i>Submitting...</span>
                                                        ) : (
                                                            <span><i className="fa-solid fa-paper-plane me-2"></i>Enquire Now</span>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TERMS & CONDITIONS TAB */}
                            {activeTab === 'terms' && (
                                <div>
                                    <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
                                        Terms of Service & Policies
                                    </h3>
                                    
                                    <div 
                                        className="terms-content-area"
                                        style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.7' }}
                                        dangerouslySetInnerHTML={{ __html: destinationPost.terms_conditions || defaultTerms }}
                                    ></div>
                                </div>
                            )}

                        </div>
                    </div>
                    
                    <div className="col-xxl-3 col-lg-4">
                        {/* Sidebar: Booking Card */}
                        <div className={`details-booking-card ${hasStickyNav ? 'has-sticky-nav' : ''}`}>
                            <div className="price-section">
                                {origPriceVal > priceVal && (
                                    <span className="orig-price">₹ {origPriceVal.toLocaleString('en-IN')}</span>
                                )}
                                <span className="sell-price">₹ {priceVal.toLocaleString('en-IN')}</span>
                                <span className="price-label">Starting price per adult</span>
                            </div>
                            
                            <div className="divider-line"></div>
                            
                            <button 
                                className="btn-book-now"
                                onClick={() => setIsEnquireOpen(true)}
                            >
                                Enquire Now
                            </button>
                            
                            <button 
                                className="btn-wishlist"
                                onClick={toggleWishlist}
                            >
                                <i className={isWishlisted ? "fa-solid fa-heart active" : "fa-regular fa-heart"}></i>
                                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                            </button>
                            
                            <div className="divider-line"></div>
                            
                            <div className="actions-footer" style={{ position: 'relative' }}>
                                <button 
                                    onClick={handleDownloadPDF}
                                    disabled={generatingPDF}
                                    className="action-link border-0 bg-transparent"
                                    style={{ cursor: generatingPDF ? 'wait' : 'pointer' }}
                                >
                                    <i className="fa-solid fa-file-pdf"></i> {generatingPDF ? "Generating PDF..." : "Download PDF"}
                                </button>
                                
                                <button 
                                    className="action-link"
                                    onClick={handleShare}
                                >
                                    <i className="fa-solid fa-share-nodes"></i> Share
                                </button>

                                {showShareTooltip && (
                                    <div className="share-tooltip">Link copied!</div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar: Route Map Card */}
                        {mapLocations.length > 0 && (
                            <div className="details-map-card animate__animated animate__fadeIn">
                                <h4 className="card-title">
                                    <i className="fa-solid fa-map-location-dot"></i> Route Path
                                </h4>
                                <div id="package-map" className="details-map-container"></div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </section>

        {/* LIGHTBOX SLIDER MODAL */}
        {lightboxOpen && (
            <div className="details-lightbox-overlay" onClick={() => setLightboxOpen(false)}>
                <div className="details-lightbox-content" onClick={(e) => e.stopPropagation()}>
                    <button className="details-lightbox-close" onClick={() => setLightboxOpen(false)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    
                    <button className="details-lightbox-nav nav-prev" onClick={prevPhoto}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    
                    <img 
                        src={galleryList[lightboxIndex]} 
                        alt={`Gallery ${lightboxIndex + 1}`} 
                        className="details-lightbox-img"
                    />
                    
                    <button className="details-lightbox-nav nav-next" onClick={nextPhoto}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        )}

        {/* ENQUIRE POPUP FORM (uses counts key to force remount on counts adjustments) */}
        <EnquirePopupForm 
            key={`${calcAdults}-${calcChildren}`}
            isOpen={isEnquireOpen} 
            onClose={() => setIsEnquireOpen(false)} 
            destinationTitle={destinationPost.title} 
            initialAdults={calcAdults.toString()}
            initialChildren={calcChildren.toString()}
            packageTier={calcCategory}
        />
        </>
    );
}

export default DestinationDetailsMain;
