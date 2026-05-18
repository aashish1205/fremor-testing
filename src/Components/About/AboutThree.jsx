import React, { useState } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

Modal.setAppElement('#root'); // Ensure accessibility

function AboutThree() {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <div className="about-area position-relative overflow-hidden space" id="about-sec">
            <div className="container">
                <div className="row">
                    <div className="col-xl-7">
                        <div className="img-box2">
                            <div className="img1">
                                <img src="/assets/img/cruises/scuba.jpg" alt="About" />
                            </div>
                            <div className="img2">
                                <img src="/assets/img/cruises/maldivescruise.jpg" alt="About" />
                                <button className="play-btn" onClick={() => setModalIsOpen(true)}>
                                    <i className="fa-sharp fa-solid fa-play" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-5">
                        <div>
                            <div className="title-area mb-20">
                                <span className="sub-title style1">Welcome to Yacht</span>
                                <h2 className="sec-title mb-20">Our goal marine life experiences.</h2>
                            </div>
                            <p className="sec-text mb-30">
                                There are many variations of passages of available but the majority
                                have suffered alteration in some form, by injected hum randomised
                                words.
                            </p>
                            <div className="about-item-wrap">
                                {[
                                    { img: "about_1_1.svg", title: "Exclusive Trip" },
                                    { img: "about_1_2.svg", title: "Safety First Always" },
                                    { img: "about_1_3.svg", title: "Professional Guide" }
                                ].map((item, index) => (
                                    <div className="about-item style2" key={index}>
                                        <div className="about-item_img">
                                            <img src={`assets/img/icon/${item.img}`} alt="" />
                                        </div>
                                        <div className="about-item_centent">
                                            <h5 className="box-title">{item.title}</h5>
                                            <p className="about-item_text">
                                                There are many variations of passages of available but the majority.
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-35">
                                <Link to="/about" className="th-btn style3 th-icon">Learn More</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
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
    );
}

export default AboutThree;