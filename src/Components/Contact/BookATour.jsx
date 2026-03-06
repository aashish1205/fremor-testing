import React, { useState } from 'react';

import NiceSelect from '../Header/NiceSelect';
import Modal from 'react-modal';
Modal.setAppElement('#root');
function BookATour() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const countryOptions = [
        { value: "country", label: "Select Tour Type" },
        { value: "Africa Adventure", label: "Africa Adventure" },
        { value: "Africa Wild", label: "Africa Wild" },
        { value: "Asia", label: "Asia" },
    ];
    return (
        <div
            className="space-extra2-top space-extra2-bottom"
            style={{ background: "url(https://img.freepik.com/premium-photo/maldives-paradise-island-tropical-aerial-landscape-seascape-with-jetty-water-bungalows-villas_663265-10208.jpg?w=2000)", backgroundRepeat: "repeat", backgroundSize: "cover" }}
        >
            <div className="container">
                <div className="row flex-row-reverse justify-content-center align-items-center">
                    <div className="col-lg-6">
                        <div className="video-box1">
                            <button className="play-btn style2 popup-video" onClick={() => setModalIsOpen(true)}>
                                <i className="fa-sharp fa-solid fa-play" />
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div>
                            <form
                                
                                className="contact-form style2 ajax-contact"
                            >
                                <h3 className="sec-title mb-30 text-capitalize">Book a tour</h3>

                                <div className="row">
                                    <div className="col-12 form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            id="name3"
                                            placeholder="First Name"
                                            required
                                        />
                                        <img src="assets/img/icon/user.svg" alt="" />
                                    </div>
                                    <div className="col-12 form-group">
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email3"
                                            id="email3"
                                            placeholder="Your Mail"
                                            required
                                        />
                                        <img src="assets/img/icon/mail.svg" alt="" />
                                    </div>
                                    <div className="form-group col-12">
                                        <NiceSelect options={countryOptions} defaultValue="Select Tour Type" />

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
                                            Send message
                                            <img src="assets/img/icon/plane.svg" alt="" />
                                        </button>
                                    </div>
                                </div>
                                <p className="form-messages mb-0 mt-3" />

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Video Popup"
                className="video-modal"
                overlayClassName="video-modal-overlay"
            >
                <button className="close-btn" onClick={() => setModalIsOpen(false)}>&times;</button>
                <iframe
                    width="100%"
                    height="400px"
                    src="https://www.youtube.com/embed/cQfIUPw72Dk"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </Modal>
        </div>
    )
}

export default BookATour
