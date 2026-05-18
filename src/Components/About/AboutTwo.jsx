import React from 'react'
import { Link } from 'react-router-dom'

function AboutTwo() {
    return (
        <div
            className="about-area position-relative overflow-hidden space"
            id="about-sec"
        >
            <div className="container shape-mockup-wrap">
                <div className="row">
                    <div className="col-xl-7">
                        <div className="img-box3">
                            <div className="img1">
                                <img src="/assets/img/normal/about_3_1.jpg" alt="About" />
                            </div>
                            <div className="img2">
                                <img src="/assets/img/normal/about_3_2.jpg" alt="About" />
                            </div>
                            <div className="img3 movingX">
                                <img src="/assets/img/normal/about_3_3.jpg" alt="About" />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-5">
                        <div className="ps-xl-4">
                            <div className="title-area mb-20 pe-xxl-5 me-xxl-5">
                                <span className="sub-title style1 ">Let’s Go Together</span>
                                <h2 className="sec-title mb-20 pe-xl-5 me-xl-5 heading">
                                    Plan Your Trip With us
                                </h2>
                            </div>
                            <p className="sec-text mb-30">
                                There are many variations of passages of available but the majority
                                have suffered alteration in some form, by injected hum randomised
                                words.
                            </p>
                            <div className="about-item-wrap">
                                <div className="about-item style2">
                                    <div className="about-item_img">
                                        <img src="/assets/img/icon/about_1_1.svg" alt="" />
                                    </div>
                                    <div className="about-item_centent">
                                        <h5 className="box-title">Exclusive Trip</h5>
                                        <p className="about-item_text">
                                            There are many variations of passages of available but the
                                            majority.
                                        </p>
                                    </div>
                                </div>
                                <div className="about-item style2">
                                    <div className="about-item_img">
                                        <img src="/assets/img/icon/about_1_2.svg" alt="" />
                                    </div>
                                    <div className="about-item_centent">
                                        <h5 className="box-title">Safety First Always</h5>
                                        <p className="about-item_text">
                                            There are many variations of passages of available but the
                                            majority.
                                        </p>
                                    </div>
                                </div>
                                <div className="about-item style2">
                                    <div className="about-item_img">
                                        <img src="/assets/img/icon/about_1_3.svg" alt="" />
                                    </div>
                                    <div className="about-item_centent">
                                        <h5 className="box-title">Professional Guide</h5>
                                        <p className="about-item_text">
                                            There are many variations of passages of available but the
                                            majority.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-35">
                                <Link to="/about" className="th-btn style3 th-icon">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="shape-mockup movingX d-none d-xxl-block"
                    style={{
                        top: "0%",
                        left: "-20%",
                    }}
                >
                    <img src="/assets/img/shape/shape_2_1.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup jump d-none d-xxl-block"
                    style={{
                        top: "20%",
                        right: "-15%",
                    }}
                >
                    <img src="/assets/img/shape/shape_2_2.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup spin d-none d-xxl-block"
                    style={{
                        bottom: "18%",
                        left: "-17%",
                    }}
                >
                    <img src="/assets/img/shape/shape_2_3.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup movixgX d-none d-xxl-block"
                    style={{
                        bottom: "10%",
                        right: "-18%",
                    }}
                >
                    <img src="/assets/img/shape/shape_2_4.png" alt="shape" />
                </div>
            </div>
            <div
                className="shape-mockup movingCar d-none d-xxl-block"
                style={{
                    bottom: "0%",
                    right: "-2%",
                }}
            >
                <img src="/assets/img/shape/car_1.png" alt="shape" />
            </div>
            <div
                className="shape-mockup d-none d-xxl-block"
                style={{
                    bottom: "0%",
                    right: "0%",
                }}
            >
                <img src="/assets/img/shape/tree_1.png" alt="shape" />
            </div>
        </div>

    )
}

export default AboutTwo
