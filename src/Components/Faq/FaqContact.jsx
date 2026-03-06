import React from 'react'

function FaqContact() {
    return (
        <div
            className="bg-top-center space overflow-hidden"
            style={{background: "url(/assets/img/bg/tour_bg_3.jpg)", backgroundRepeat: "no-repeat", position: "relative", zIndex: "1"}}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-11">
                        <div className="">
                            <div className="title-area text-center mb-30">
                                <span className="sub-title style1">Meet with Our Guide</span>
                                <h2 className="sec-title">Do You Have Any&nbsp;More Questions?</h2>
                            </div>
                            <form
                                action="mail.php"
                                method="POST"
                                className="contact-form ajax-contact"
                            >
                                <h3 className="sec-title mb-30">Book a tour</h3>
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            id="name3"
                                            placeholder="First Name"
                                        />
                                        <img src="assets/img/icon/user.svg" alt="" />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email3"
                                            id="email3"
                                            placeholder="Your Mail"
                                        />
                                        <img src="assets/img/icon/mail.svg" alt="" />
                                    </div>
                                    <div className="form-group col-12">
                                        <select
                                            name="subject"
                                            id="subject"
                                            className="form-select nice-select"
                                        >
                                            <option
                                                value="Select Tour Destination"
                                                
                                                disabled=""
                                            >
                                                Select Tour Destination
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
                                            id="message"
                                            cols={30}
                                            rows={3}
                                            className="form-control"
                                            placeholder="Your Message"
                                            defaultValue={""}
                                        />
                                        <img src="assets/img/icon/chat.svg" alt="" />
                                    </div>
                                    <div className="form-btn col-12 mt-24">
                                        <button type="submit" className="th-btn style3">
                                            Send message <img src="assets/img/icon/plane.svg" alt="" />
                                        </button>
                                    </div>
                                </div>
                                <p className="form-messages mb-0 mt-3" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default FaqContact
