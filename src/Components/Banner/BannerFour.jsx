import React from 'react'
import { Link } from 'react-router-dom'

function BannerFour() {

    return (
        <div
            className="th-hero-wrapper bg-bottom-center hero-4"
            style={{
                backgroundImage: "url(/assets/img/cruises/78.jpeg)",
                backgroundRepeat: "no-repeat",
            }}
            
        >
            <div className="container shape-mockup-wrap">
                <div className="hero-style4 text-center">
                    <span className="sub-title style1">Welcome to Our</span>
                    <h1 className="hero-title">Elite Yacht Hire Services in Florida</h1>
                    <div className="btn-group">
                        <Link to="/tour" className="th-btn th-icon">
                            Explore Tours
                        </Link>
                        <Link to="/service" className="th-btn style3 th-icon">
                            Our Services
                        </Link>
                    </div>
                </div>
                <div className="shape-mockup shape1"
                    style={{
                        top: "30%",
                        left: "-9%",
                    }}
                >
                    <img src="/assets/img/shape/shape_1.png" alt="shape" />
                </div>
                <div className="shape-mockup shape2"
                    style={{
                        top: "50%",
                        left: "-10%",
                    }}
                >
                    <img src="/assets/img/shape/shape_2.png" alt="shape" />
                </div>
                <div className="shape-mockup shape3"
                    style={{
                        top: "44%",
                        left: "-16%",
                    }}
                >
                    <img src="/assets/img/shape/shape_3.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup spin d-none d-lg-block"
                    style={{
                        top: "30%",
                        right: "-16%",
                    }}
                >
                    <img src="/assets/img/shape/shape_10.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup d-none d-xl-block"
                    style={{
                        bottom: "-12%",
                        right: "-20%",
                    }}
                >
                    <img src="/assets/img/shape/shape_11.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup spin d-none d-lg-block"
                    style={{
                        bottom: "10%",
                        right: "10%",
                    }}
                >
                    <img src="/assets/img/shape/shape_12.png" alt="shape" />
                </div>
            </div>
        </div>

    )
}

export default BannerFour
