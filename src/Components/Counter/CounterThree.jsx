import React from "react";
import CountUp from "react-countup";

function CounterThree() {
    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
                paddingTop: "80px",
                paddingBottom: "80px",
            }}
        >
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 0,
                }}
            >
                <source src="https://botchursnmplaerazpsb.supabase.co/storage/v1/object/public/Videos/cordelia.webm" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,30,60,0.38) 100%)",
                    zIndex: 1,
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    width: "100%",
                    maxWidth: "1320px",
                    margin: "0 auto",
                    padding: "0 24px",
                    boxSizing: "border-box",
                }}
            >
                <div className="row align-items-center gy-4">
                    {/* Left – Text */}
                    <div className="col-12 col-xl-5 col-xxl-6">
                        <div style={{ paddingRight: "0" }}>
                            <div className="title-area mb-3">
                                <span
                                    className="sub-title text-white"
                                    style={{
                                        display: "inline-block",
                                        letterSpacing: "1px",
                                        fontSize: "14px",
                                        textTransform: "uppercase",
                                        marginBottom: "10px",
                                        opacity: 0.85,
                                    }}
                                >
                                    Get in touch
                                </span>
                                <h2
                                    className="sec-title text-white"
                                    style={{ marginBottom: "16px", lineHeight: "1.25" }}
                                >
                                    Warm greetings, everyone!
                                </h2>
                                <p className="text-white" style={{ opacity: 0.88, maxWidth: "480px", lineHeight: "1.75" }}>
                                    We would love to hear from you! Our friendly and dedicated team is
                                    always available to chat and assist with any questions or concerns
                                    you may have. Feel free to reach out to us anytime.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right – Counter Cards */}
                    <div className="col-12 col-xl-7 col-xxl-6">
                        <div className="row gy-4 gx-3">
                            {[
                                { end: 12, suffix: "", label: "Years Experience", desc: "Over a decade of crafting unforgettable cruise journeys worldwide." },
                                { end: 97, suffix: "%", label: "Retention Rate", desc: "Guests who sail with us keep coming back for more adventures." },
                                { end: 8, suffix: "k", label: "Tour Completed", desc: "Thousands of successful voyages across exotic destinations." },
                                { end: 19, suffix: "k", label: "Happy Travellers", desc: "A growing family of satisfied explorers from around the globe." },
                            ].map((item, idx) => (
                                <div key={idx} className="col-6 col-sm-6 col-md-6">
                                    <div
                                        className="counter-card style2"
                                        style={{
                                            background: "rgba(255,255,255,0.08)",
                                            border: "1px solid rgba(255,255,255,0.18)",
                                            backdropFilter: "blur(10px)",
                                            WebkitBackdropFilter: "blur(10px)",
                                            borderRadius: "16px",
                                            padding: "28px 20px",
                                            textAlign: "center",
                                            transition: "transform 0.3s ease, background 0.3s ease",
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = "translateY(-4px)";
                                            e.currentTarget.style.background = "rgba(255,255,255,0.14)";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                        }}
                                    >
                                        <div className="counter-shape"><span /></div>
                                        <div className="media-body">
                                            <h3
                                                className="box-number"
                                                style={{
                                                    fontSize: "clamp(28px, 4vw, 48px)",
                                                    fontWeight: 700,
                                                    color: "#fff",
                                                    marginBottom: "6px",
                                                }}
                                            >
                                                <CountUp end={item.end} duration={2} />
                                                {item.suffix}
                                            </h3>
                                            <h6
                                                className="counter-title"
                                                style={{
                                                    fontSize: "clamp(12px, 1.5vw, 15px)",
                                                    color: "rgba(255,255,255,0.92)",
                                                    fontWeight: 600,
                                                    margin: 0,
                                                    marginBottom: "8px",
                                                }}
                                            >
                                                {item.label}
                                            </h6>
                                            <p
                                                style={{
                                                    fontSize: "clamp(11px, 1.2vw, 13px)",
                                                    color: "rgba(255,255,255,0.65)",
                                                    lineHeight: "1.5",
                                                    margin: 0,
                                                }}
                                            >
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CounterThree;
