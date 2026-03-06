import React, { useState } from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";

function CounterThree() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        // Handle form submission logic
    };

    return (
        <div
            className="bg-top-center space-top overflow-hidden"
            style={{ backgroundImage: "url(/assets/img/cruises/288.jpeg)", backgroundRepeat: "no-repeat" }}
        >
            <div className="container">
                <div className="row">
                    <div className="col-xl-5 col-xxl-6">
                        <div className="pe-xxl-5 me-xxl-5">
                            <div className="title-area">
                                <span className="sub-title text-white">Get in touch</span>
                                <h2 className="sec-title text-white">Warm greetings, everyone!</h2>
                                <p className="text-white">
                                    We would love to hear from you! Our friendly and dedicated team is
                                    always available to chat and assist with any questions or concerns
                                    you may have. Feel free to reach out to us anytime.
                                </p>
                            </div>
                            <div className="contact-form-area2">
                                <form className="contact-form2" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="form-group col-12">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="First Name"
                                                required
                                            />
                                            <img src="/assets/img/icon/user.svg" alt="User Icon" />
                                        </div>
                                        <div className="form-group col-12">
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Your Mail"
                                                required
                                            />
                                            <img src="/assets/img/icon/mail.svg" alt="Mail Icon" />
                                        </div>
                                        <div className="form-group col-12">
                                            <select
                                                name="subject"
                                                className="form-select"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="" disabled>
                                                    Select Tour Type
                                                </option>
                                                <option value="Africa Adventure">Africa Adventure</option>
                                                <option value="Africa Wild">Africa Wild</option>
                                                <option value="Asia">Asia</option>
                                                <option value="Scandinavia">Scandinavia</option>
                                                <option value="Western Europe">Western Europe</option>
                                            </select>
                                        </div>
                                        <div className="form-group col-12">
                                            <textarea
                                                name="message"
                                                cols={30}
                                                rows={3}
                                                className="form-control"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Your Message"
                                                required
                                            />
                                            <img src="/assets/img/icon/chat.svg" alt="Chat Icon" />
                                        </div>
                                    </div>
                                    <p className="form-messages mb-0 mt-3" />
                                </form>
                                <div className="form-btn-wrapp">
                                    <button type="submit" className="th-btn white-btn">
                                        Send Message <img src="/assets/img/icon/plane3.svg" alt="" />
                                    </button>
                                    <div className="contact-info">
                                        <p className="contact-info_link">
                                            <Link to="tel:+0123456789">+012 345 6789</Link>
                                        </p>
                                        <div className="contact-info_icon">
                                            <Link to="tel:+0123456789">
                                                <img src="/assets/img/icon/call.svg" alt="" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-7 col-xxl-6">
                        <div className="row gy-50">
                            <div className="col-md-6 col-xl-6 counter-card_wrapp">
                                <div className="counter-card style2">
                                    <div className="counter-shape">
                                        <span />
                                    </div>
                                    <div className="media-body">
                                        <h3 className="box-number">
                                            <CountUp end={12} duration={2} />{" "}
                                        </h3>
                                        <h6 className="counter-title">Years Experience</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-6 counter-card_wrapp">
                                <div className="counter-card style2">
                                    <div className="counter-shape">
                                        <span />
                                    </div>
                                    <div className="media-body">
                                        <h3 className="box-number">
                                            <CountUp end={97} duration={2} />%{" "}
                                        </h3>
                                        <h6 className="counter-title">Retention Rate</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-6 counter-card_wrapp">
                                <div className="counter-card style2">
                                    <div className="counter-shape">
                                        <span />
                                    </div>
                                    <div className="media-body">
                                        <h3 className="box-number">
                                            <CountUp end={8} duration={2} />k{" "}
                                        </h3>
                                        <h6 className="counter-title">Tour Completed</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-6 counter-card_wrapp">
                                <div className="counter-card style2">
                                    <div className="counter-shape">
                                        <span />
                                    </div>
                                    <div className="media-body">
                                        <h3 className="box-number">
                                            <CountUp end={19} duration={2} />k{" "}
                                        </h3>
                                        <h6 className="counter-title">Happy Travellers</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CounterThree;
