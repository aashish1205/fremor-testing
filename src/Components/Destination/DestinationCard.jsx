import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageSrc } from '../../services/destinationService';
import EnquirePopupForm from '../Forms/EnquirePopupForm';

function DestinationCard(props) {
    const [isEnquireOpen, setIsEnquireOpen] = useState(false);
    const { destinationID, destinationImage, destinationTitle, destinationPrice, destinationDuration, destinationPriceUnit, destinationNights, destinationDays } = props;
    return (
        <>
            <div className="tour-box th-ani">
                <div className="tour-box_img global-img">
                    <Link to={`/destination/${destinationID}`}>
                        <img src={getImageSrc(destinationImage)} alt={destinationTitle || 'Destination'} />
                    </Link>
                </div>
                <div className="tour-content">
                    <h3 className="box-title">
                        <Link to={`/destination/${destinationID}`}>{destinationTitle ? destinationTitle : 'Dubai'}</Link>
                    </h3>
                    <div className="tour-rating">
                        <div
                            className="star-rating"
                            role="img"
                            aria-label="Rated 5.00 out of 5"
                        >
                            <span style={{ width: "100%" }}>
                                Rated
                                <strong className="rating">5.00</strong> out of 5
                                based on <span className="rating">4.8</span>(4.8
                                Rating)
                            </span>
                        </div>
                        <Link
                            to={`/destination/${destinationID}`}
                            className="woocommerce-review-link"
                        >
                            (<span className="count">4.8</span>
                            Rating)
                        </Link>
                    </div>
                    <h4 className="tour-box_price">
                        <span className="text-muted d-block" style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px', color: '#687176' }}>Starting from</span>
                        <span className="currency">{destinationPrice ? destinationPrice : '₹980.00'}</span>/{destinationPriceUnit ? destinationPriceUnit : 'Person'}
                    </h4>
                    <div className="tour-action" style={{ gap: '15px', flexWrap: 'wrap' }}>
                        {(destinationNights > 0 || destinationDays > 0) ? (
                            <span className="tour-duration" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#f0f9ff', border: '1px solid #e0f2fe' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0369a1', fontWeight: '700', fontSize: '13px' }}>
                                    <i className="fa-solid fa-moon" style={{ fontSize: '12px' }}></i> {destinationNights} N
                                </span>
                                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#cbd5e1' }}></span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#b45309', fontWeight: '700', fontSize: '13px' }}>
                                    <i className="fa-solid fa-sun" style={{ fontSize: '12px' }}></i> {destinationDays} D
                                </span>
                            </span>
                        ) : (
                            <span>
                                <i className="fa-light fa-clock" />{destinationDuration ? destinationDuration : '7 Days'}
                            </span>
                        )}
                        <button onClick={() => setIsEnquireOpen(true)} className="th-btn style4 th-icon border-0">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
            <EnquirePopupForm 
                isOpen={isEnquireOpen} 
                onClose={() => setIsEnquireOpen(false)} 
                destinationTitle={destinationTitle || 'Dubai'} 
            />
        </>
    )
}

export default DestinationCard
