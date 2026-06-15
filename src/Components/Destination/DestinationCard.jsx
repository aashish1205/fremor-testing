import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageSrc } from '../../services/destinationService';
import { supabase } from '../../supabaseClient';
import { checkIfWishlisted, addToWishlist, removeFromWishlist } from '../../services/wishlistService';

function DestinationCard(props) {
    const { 
        destinationID, 
        destinationImage, 
        destinationTitle, 
        destinationPrice, 
        destinationNights, 
        destinationDays,
        rating,
        ratingCount,
        originalPrice,
        isRecommended,
        badgeText,
        loyaltyPoints,
        inclusions,
        location,
        itinerarySummary,
        accommodationType
    } = props;

    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const checkInitialStatus = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user && isMounted) {
                    const status = await checkIfWishlisted(session.user.id, destinationID);
                    if (isMounted) setIsWishlisted(status);
                }
            } catch (err) {
                console.error('Error fetching initial wishlist state:', err);
            }
        };
        checkInitialStatus();
        return () => { isMounted = false; };
    }, [destinationID]);

    // Helpers to process prices safely
    const getNumericPrice = (p) => {
        if (p === null || p === undefined) return 0;
        if (typeof p === 'number') return p;
        const cleaned = p.toString().replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 0;
    };

    const priceVal = getNumericPrice(destinationPrice);
    const origPriceVal = getNumericPrice(originalPrice);

    // Calculate discount percent dynamically
    let discountText = '';
    if (origPriceVal > priceVal) {
        const pct = Math.round(((origPriceVal - priceVal) / origPriceVal) * 100);
        if (pct > 0) {
            discountText = `${pct}% OFF`;
        }
    }

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                window.dispatchEvent(new Event('open-login-modal'));
                return;
            }

            const userId = session.user.id;
            if (isWishlisted) {
                await removeFromWishlist(userId, destinationID);
                setIsWishlisted(false);
            } else {
                await addToWishlist(userId, destinationID);
                setIsWishlisted(true);
            }
        } catch (err) {
            console.error('Error toggling wishlist:', err);
        }
    };

    // Default inclusions fallbacks
    const defaultInclusions = {
        hotel: true,
        sightseeing: true,
        meals: true,
        manager: true,
        flights: false,
        transfers: false,
        trains: false,
        cruises: false,
        activities: false,
        visa: false,
        insurance: false,
        ...(inclusions || {})
    };

    // Format display string for rating count
    const formatRatingCount = (count) => {
        if (!count) return '0';
        const num = parseInt(count);
        if (isNaN(num)) return count;
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return num.toString();
    };

    return (
        <div className="modern-package-card">
            {/* Card Background Image */}
            <div 
                className="card-bg-image" 
                style={{ backgroundImage: `url(${getImageSrc(destinationImage)})` }}
            ></div>

            {/* Top Bar (Rating & Wishlist) - Normal View */}
            <div className="card-top-bar">
                <div className="card-rating">
                    <span className="star-icon">★</span>
                    <span>{rating ? parseFloat(rating).toFixed(1) : '4.8'}</span>
                    {ratingCount > 0 && (
                        <span className="rating-count">({formatRatingCount(ratingCount)})</span>
                    )}
                </div>
                <button 
                    className="wishlist-btn" 
                    onClick={toggleWishlist}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <i className={isWishlisted ? "fa-solid fa-heart active" : "fa-regular fa-heart"}></i>
                </button>
            </div>

            {/* Bottom info container (normal state) */}
            <div className="card-bottom-info">
                <div className="badge-row">
                    {isRecommended && (
                        <span className="badge-recommended">{badgeText || 'Recommended'}</span>
                    )}
                    {(destinationNights > 0 || destinationDays > 0) && (
                        <span className="badge-duration">
                            {destinationNights > 0 ? `${destinationNights}N` : ''}
                            {destinationNights > 0 && destinationDays > 0 ? '/' : ''}
                            {destinationDays > 0 ? `${destinationDays}D` : ''}
                        </span>
                    )}
                    {accommodationType && (
                        <span className="badge-hotel-type">
                            <i className="fa-solid fa-hotel me-1"></i> {accommodationType}
                        </span>
                    )}
                </div>
                
                <h3 className="card-title">
                    <Link to={`/destination/${destinationID}`}>{destinationTitle || 'Andaman Package'}</Link>
                </h3>
                
                <div className="price-row">
                    {origPriceVal > 0 && (
                        <span className="original-price">₹ {origPriceVal.toLocaleString('en-IN')}</span>
                    )}
                    <span className="selling-price">
                        ₹ {priceVal > 0 ? priceVal.toLocaleString('en-IN') : '980'}
                    </span>
                    {discountText && (
                        <span className="discount-badge">{discountText}</span>
                    )}
                </div>

                <div className="itinerary-text">
                    {itinerarySummary || (location ? location : (destinationTitle || ''))}
                </div>

                <div className="card-bottom-line"></div>
            </div>

            {/* Hover overlay view */}
            <div className="card-hover-overlay">
                <div className="hover-top-bar">
                    {loyaltyPoints > 0 ? (
                        <div className="loyalty-badge">
                            <span className="gift-icon">
                                <i className="fa-solid fa-gift"></i>
                            </span>
                            <span className="loyalty-text">Earn {loyaltyPoints} Loyal Points</span>
                        </div>
                    ) : (
                        <div></div>
                    )}
                    
                    <div className="hover-rating-area">
                        <div className="card-rating">
                            <span className="star-icon">★</span>
                            <span>{rating ? parseFloat(rating).toFixed(1) : '4.8'}</span>
                            {ratingCount > 0 && (
                                <span className="rating-count">({formatRatingCount(ratingCount)})</span>
                            )}
                        </div>
                        <button 
                            className="wishlist-btn" 
                            onClick={toggleWishlist}
                            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                            <i className={isWishlisted ? "fa-solid fa-heart active" : "fa-regular fa-heart"}></i>
                        </button>
                    </div>
                </div>

                <div className="hover-divider"></div>

                {/* Inclusion icons */}
                <div className="inclusions-row">
                    {defaultInclusions.hotel && (
                        <div className="inclusion-item">
                            <div className="inclusion-icon">
                                <i className="fa-solid fa-hotel"></i>
                            </div>
                            <span className="inclusion-label">Hotel</span>
                        </div>
                    )}
                    {defaultInclusions.sightseeing && (
                        <div className="inclusion-item">
                            <div className="inclusion-icon">
                                <i className="fa-solid fa-binoculars"></i>
                            </div>
                            <span className="inclusion-label">Sightseeing</span>
                        </div>
                    )}
                    {defaultInclusions.meals && (
                        <div className="inclusion-item">
                            <div className="inclusion-icon">
                                <i className="fa-solid fa-utensils"></i>
                            </div>
                            <span className="inclusion-label">Meals</span>
                        </div>
                    )}
                    {defaultInclusions.manager && (
                        <div className="inclusion-item">
                            <div className="inclusion-icon">
                                <i className="fa-solid fa-user-tie"></i>
                            </div>
                            <span className="inclusion-label">Tour Manager</span>
                        </div>
                    )}
                    {defaultInclusions.flights && (
                        <div className="inclusion-item">
                            <div className="inclusion-icon">
                                <i className="fa-solid fa-plane"></i>
                            </div>
                            <span className="inclusion-label">Flights</span>
                        </div>
                    )}
                    {defaultInclusions.transfers && (
                        <div className="inclusion-item">
                            <div className="inclusion-icon">
                                <i className="fa-solid fa-car"></i>
                            </div>
                            <span className="inclusion-label">Transfers</span>
                        </div>
                    )}
                    {defaultInclusions.trains && (
                        <div className="inclusion-item">
                            <div className="inclusion-icon">
                                <i className="fa-solid fa-train"></i>
                            </div>
                            <span className="inclusion-label">Trains</span>
                        </div>
                    )}
                    {defaultInclusions.cruises && (
                        <div className="inclusion-item">
                            <div className="inclusion-icon">
                                <i className="fa-solid fa-ship"></i>
                            </div>
                            <span className="inclusion-label">Cruises</span>
                        </div>
                    )}
                    {defaultInclusions.activities && (
                        <div className="inclusion-item">
                            <div className="inclusion-icon">
                                <i className="fa-solid fa-person-hiking"></i>
                            </div>
                            <span className="inclusion-label">Activities</span>
                        </div>
                    )}
                    {defaultInclusions.visa && (
                        <div className="inclusion-item">
                            <div className="inclusion-icon">
                                <i className="fa-solid fa-passport"></i>
                            </div>
                            <span className="inclusion-label">Visa</span>
                        </div>
                    )}
                    {defaultInclusions.insurance && (
                        <div className="inclusion-item">
                            <div className="inclusion-icon">
                                <i className="fa-solid fa-shield-halved"></i>
                            </div>
                            <span className="inclusion-label">Insurance</span>
                        </div>
                    )}
                </div>

                <div className="hover-divider"></div>

                {/* Itinerary details */}
                <div className="hover-itinerary-section">
                    <h4 className="hover-itinerary-title">itineraries</h4>
                    <p className="hover-itinerary-destinations">{location || destinationTitle}</p>
                </div>

                {/* Action CTA */}
                <div className="hover-actions">
                    <Link to={`/destination/${destinationID}`} className="btn-view-details">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default DestinationCard;
