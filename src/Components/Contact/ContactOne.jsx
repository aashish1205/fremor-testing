import React from 'react'
import { Link } from 'react-router-dom'
import NiceSelect from '../Header/NiceSelect';

function ContactOne() {
    const tourOptions = [
        { value: "Africa Adventure", label: "Africa Adventure" },
        { value: "Africa Wild", label: "Africa Wild" },
        { value: "Asia", label: "Asia" },
        { value: "Scandinavia", label: "Scandinavia" },
        { value: "Western Europe", label: "Western Europe" },
      ];
    return (
        <div
            className="contact-area3 bg-top-center  overflow-hidden"
            style={{ backgroundImage: "url(/assets/img/banners/contactusbanner.jpg)", backgroundRepeat: "no-repeat" }}
        >
            <div className="container">
                <div className="row gy-4 justify-content-between align-items-center">
                    <div className="col-lg-5">
                        <div className="pt-80 p-lg-0">
                            <div className="title-area pe-xl-5">
                                <span className="sub-title text-white">Get in touch</span>
                                <h2 className="sec-title text-white">Say hello to us</h2>
                                <p className="contact-text text-white">
                                    We’love to hear from you. Our friendly team is always here to chat
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="contact-form-area">
                            <form
                                action="mail.php"
                                method="POST"
                                className="contact-form2 ajax-contact"
                            >
                                <div className="row">
                                    <div className="form-group col-12">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            id="name3"
                                            placeholder="First Name"
                                        />
                                        <img src="/assets/img/icon/user.svg" alt="" />
                                    </div>
                                    <div className="form-group col-12">
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email3"
                                            id="email3"
                                            placeholder="Your Mail"
                                        />
                                        <img src="/assets/img/icon/mail.svg" alt="" />
                                    </div>
                                    <div className="form-group col-12">
                                        <NiceSelect
                                            options={tourOptions}
                                            placeholder="Select Tour Type"
                                            className="nice-select"
                                            classNamePrefix="react-select"
                                            isSearchable
                                        />
                                    </div>
                                    <div className="form-group col-12">
                                        <textarea
                                            name="message"
                                            id="message"
                                            cols={30}
                                            rows={3}
                                            className="form-control"
                                            placeholder="Your Message"
                                            defaultValue={""}
                                        />
                                        <img src="/assets/img/icon/chat.svg" alt="" />
                                    </div>
                                </div>
                                <p className="form-messages mb-0 mt-3" />
                            </form>
                            <div className="form-btn-wrapp">
                                <div className="form-btn">
                                    <button className="th-btn white-btn">
                                        Send Message <img src="/assets/img/icon/plane3.svg" alt="" />
                                    </button>
                                </div>
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
            </div>
        </div>

    )
}

export default ContactOne
