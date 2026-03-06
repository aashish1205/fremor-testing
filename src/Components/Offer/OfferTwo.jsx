import React from 'react'
import { Link } from 'react-router-dom'

function OfferTwo() {
    return (
        <section
            className="position-relative overflow-hidden space-bottom"
            id="destination-sec"
        >
            <div className="container">
                <div className="title-area text-center">
                    <span className="sub-title">Services We Offer</span>
                    <h2 className="sec-title">Our Amazing services</h2>
                </div>
                <div className="row gy-4 gx-4">
                    <div className="col-xl-3 col-lg-4 col-md-6">
                        <div className="destination-item th-ani">
                            <div className="destination-item_img global-img">
                                <img src="/assets/img/about/photoshoot.jpg" alt="" />
                            </div>
                            <div className="destination-content">
                                <h3 className="box-title">
                                    <Link to="/service/1">Photo Shoot</Link>
                                </h3>
                                <p className="destination-text">20 Listing</p>
                                <Link to="/contact" className="th-btn style4 th-icon">
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6">
                        <div className="destination-item th-ani">
                            <div className="destination-item_img global-img">
                                <img src="/assets/img/about/tourguide.jpg" alt="" />
                            </div>
                            <div className="destination-content">
                                <h3 className="box-title">
                                    <Link to="/service/1">Tour Guide</Link>
                                </h3>
                                <p className="destination-text">22 Listing</p>
                                <Link to="/contact" className="th-btn style4 th-icon">
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6">
                        <div className="destination-item th-ani">
                            <div className="destination-item_img global-img">
                                <img src="/assets/img/about/cozyevent.jpg" alt="" />
                            </div>
                            <div className="destination-content">
                                <h3 className="box-title">
                                    <Link to="/service/1">Cozy Event</Link>
                                </h3>
                                <p className="destination-text">23 Listing</p>
                                <Link to="/contact" className="th-btn style4 th-icon">
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6">
                        <div className="destination-item th-ani">
                            <div className="destination-item_img global-img">
                                <img src="/assets/img/about/rest.jpg" alt="" />
                            </div>
                            <div className="destination-content">
                                <h3 className="box-title">
                                    <Link to="/service/1">Interesting Rest</Link>
                                </h3>
                                <p className="destination-text">24 Listing</p>
                                <Link to="/contact" className="th-btn style4 th-icon">
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6">
                        <div className="destination-item th-ani">
                            <div className="destination-item_img global-img">
                                <img src="/assets/img/about/kayaking.jpg" alt="" />
                            </div>
                            <div className="destination-content">
                                <h3 className="box-title">
                                    <Link to="/service/1">Kayaking</Link>
                                </h3>
                                <p className="destination-text">25 Listing</p>
                                <Link to="/contact" className="th-btn style4 th-icon">
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6">
                        <div className="destination-item th-ani">
                            <div className="destination-item_img global-img">
                                <img src="/assets/img/about/safeflight.jpg" alt="" />
                            </div>
                            <div className="destination-content">
                                <h3 className="box-title">
                                    <Link to="/service/1">Safe Flight</Link>
                                </h3>
                                <p className="destination-text">26 Listing</p>
                                <Link to="/contact" className="th-btn style4 th-icon">
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6">
                        <div className="destination-item th-ani">
                            <div className="destination-item_img global-img">
                                <img src="/assets/img/about/entertainment.jpg" alt="" />
                            </div>
                            <div className="destination-content">
                                <h3 className="box-title">
                                    <Link to="/service/1">Entertainment</Link>
                                </h3>
                                <p className="destination-text">27 Listing</p>
                                <Link to="/contact" className="th-btn style4 th-icon">
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4 col-md-6">
                        <div className="destination-item th-ani">
                            <div className="destination-item_img global-img">
                                <img src="/assets/img/about/food.jpg" alt="" />
                            </div>
                            <div className="destination-content">
                                <h3 className="box-title">
                                    <Link to="/service/1">Delicisious Food</Link>
                                </h3>
                                <p className="destination-text">28 Listing</p>
                                <Link to="/contact" className="th-btn style4 th-icon">
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default OfferTwo
