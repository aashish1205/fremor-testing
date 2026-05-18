import React, { useState } from "react";
import { Link } from "react-router-dom";

function DestinationTwo() {
    const destinations = [
        { name: "Thailand", image: "destination_2_1.jpg", listings: 28 },
        { name: "Belgium", image: "destination_2_2.jpg", listings: 15 },
        { name: "Island", image: "destination_2_3.jpg", listings: 22 },
        { name: "Maldives", image: "destination_2_4.jpg", listings: 25 },
    ];

    const [activeIndex, setActiveIndex] = useState(3); // Default active index (Maldives)

    return (
        <div
            className="bg-top-center position-relative space"
            id="destination-sec"
            style={{ backgroundImage: "url('/assets/img/bg/line-pattern2.png')", backgroundRepeat: "no-repeat" }}
        >
            <div className="container shape-mockup-wrap">
                <div className="title-area text-center">
                    <span className="sub-title">Top Destination</span>
                    <h2 className="sec-title">Our Featured Destination</h2>
                </div>
                <div className="row">
                    <div className="destination-list-area">
                        {destinations.map((item, index) => (
                            <div
                                key={index}
                                className={`destination-list-wrap ${index === activeIndex ? "active" : ""}`}
                                onClick={() => setActiveIndex(index)}
                            >
                                <div
                                    className="destination-list"
                                    style={{ backgroundImage: `url('/assets/img/destination/${item.image}')` }}
                                >
                                    <div className="destination-content">
                                        <h4 className="box-title">
                                            <Link to="/destination/1">{item.name}</Link>
                                        </h4>
                                        <span className="destination-subtitle">{item.listings} Listing</span>
                                    </div>
                                    <Link to="/contact" className="th-btn style2">
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="destination-btn text-center mt-60">
                    <Link to="/destination" className="th-btn style3 th-icon">
                        View All
                    </Link>
                </div>
                {/* Shape Mockups with Inline Styles */}
                <div 
                    className="shape-mockup movingX d-none d-xl-block"
                    style={{ top: "8%", left: "-15%" }}
                >
                    <img src="/assets/img/shape/shape_2_1.png" alt="shape" />
                </div>
                <div 
                    className="shape-mockup jump d-none d-xl-block"
                    style={{ top: "23%", right: "-14%" }}
                >
                    <img src="/assets/img/shape/shape_2_2.png" alt="shape" />
                </div>
                <div 
                    className="shape-mockup spin d-none d-xl-block"
                    style={{ bottom: "21%", left: "-14%" }}
                >
                    <img src="/assets/img/shape/shape_2_3.png" alt="shape" />
                </div>
                <div 
                    className="shape-mockup movingX d-none d-xl-block"
                    style={{ bottom: "12%", right: "-14%" }}
                >
                    <img src="/assets/img/shape/shape_2_4.png" alt="shape" />
                </div>
            </div>
        </div>
    );
}

export default DestinationTwo;
