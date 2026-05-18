import React from 'react'
import { Link } from 'react-router-dom';

function ResortCard(props) {
    const { resortID, resortImage, resortTitle, resortPrice } = props;
    return (
        <div className="row gx-60 gy-30 mb-60 align-items-center">
            <div className="col-lg-6">
                <div className="resort-image global-img">
                    <img src={`/assets/img/normal/${resortImage}`} alt="" />
                </div>
            </div>
            <div className="col-lg-6">
                <div className="resort-content">
                    <h3 className="box-title">
                        <Link to={`/resort/${resortID}`}>{resortTitle ? resortTitle : 'Ocean View Resort'}</Link>
                    </h3>
                    <div className="resort-rating">
                        <div
                            className="star-rating"
                            role="img"
                            aria-label="Rated 5.00 out of 5"
                        >
                            <span style={{ width: "100%" }}>
                                Rated
                                <strong className="rating">5.00</strong> out of 5 based on{" "}
                                <span className="rating">4.8</span>(4.8 Rating)
                            </span>
                        </div>
                        <Link to="#" className="woocommerce-review-link">
                            (<span className="count">4.8</span>
                            Rating)
                        </Link>
                    </div>
                    <h4 className="resort-price">
                        <span className="currency">From {resortPrice ? resortPrice : '$350.00'}</span>/per Night
                    </h4>
                    <p className="resort-text">
                        Focused on providing a serene, relaxing environment with natural
                        landscapes and coastal aesthetics.
                    </p>
                    <div className="resort-list">
                        <ul>
                            <li>
                                <span className="title">Capacity:</span>6 Person
                            </li>
                            <li>
                                <span className="title">Size:</span>45 m2
                            </li>
                            <li>
                                <span className="title">Bed:</span>Large Bed
                            </li>
                            <li>
                                <span className="title">Service:</span>Free Breakfast,Free
                                Water,Free Wifi
                            </li>
                        </ul>
                    </div>
                    <div className="resort-btn mt-40">
                        <Link to="/contact" className="th-btn style4 th-icon">
                            Book Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResortCard
