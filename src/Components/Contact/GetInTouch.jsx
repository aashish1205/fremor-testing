import React from 'react'
import { Link } from 'react-router-dom'

function GetInTouch() {
    return (
        <div className="space">
            <div className="container">
                <div className="title-area text-center">
                    <span className="sub-title">Get In Touch</span>
                    <h2 className="sec-title">Our Contact Information</h2>
                </div>
                <div className="row gy-4 justify-content-center">
                    <div className="col-xl-4 col-lg-6">
                        <div className="about-contact-grid style2">
                            <div className="about-contact-icon">
                                <img src="/assets/img/icon/location-dot2.svg" alt="" />
                            </div>
                            <div className="about-contact-details">
                                <h6 className="box-title">Our Address</h6>
                                <p className="about-contact-details-text">
                                    Fremor Global Travel Pvt Ltd 
                                </p>
                                <p className="about-contact-details-text">11th floor, Urmi Estate Ganpatrao Kadam Marg, Lower Parel-west, Mumbai- 400013</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                        <div className="about-contact-grid">
                            <div className="about-contact-icon">
                                <img src="/assets/img/icon/call.svg" alt="" />
                            </div>
                            <div className="about-contact-details">
                                <h6 className="box-title">Phone Number</h6>
                                <p className="about-contact-details-text">
                                    <Link to="tel:01234567890">+91 9920499911</Link>
                                </p>
                                <p className="about-contact-details-text">
                                    <Link to="tel:01234567890">+91 8657004943</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                        <div className="about-contact-grid">
                            <div className="about-contact-icon">
                                <img src="/assets/img/icon/mail.svg" alt="" />
                            </div>
                            <div className="about-contact-details">
                                <h6 className="box-title">Email Address</h6>
                                <p className="about-contact-details-text">
                                    <Link to="mailto:connect@fremorglobal.com">connect@fremorglobal.com</Link>
                                </p>
                                <p className="about-contact-details-text">
                                    <Link to="mailto:askari.rizvi@fremorglobal.com">askari.rizvi@fremorglobal.com</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default GetInTouch
