import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFeaturedVisas, calculateVisaDeadline } from "../../services/visaService";
import "./VisaPageSections.css";

export default function VisaPageSections() {
  const [mostVisited, setMostVisited] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedVisas()
      .then((data) => {
        setMostVisited(data);
      })
      .catch((err) => {
        console.error("Failed to load featured visas:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const goToDetail = (name, flag) => {
    const params = new URLSearchParams({ country: name, flag });
    navigate(`/visa/detail?${params.toString()}`);
  };

  const scroll = (dir) => {
    const cardWidth = 280;
    sliderRef.current.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="visa-page">

      {/* MOST VISITED */}
      <section className="visa-section">
        <div className="section-header">
          <h4>Most-visited Countries</h4>

          <div className="slider-nav">
            <button onClick={() => scroll("left")}>‹</button>
            <button onClick={() => scroll("right")}>›</button>
          </div>
        </div>

        <div className="country-slider" ref={sliderRef}>
          {loading ? (
            <div className="text-center w-100 py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : mostVisited.length === 0 ? (
            <div className="text-center w-100 py-5 text-muted">
              No featured visas found.
            </div>
          ) : (
            mostVisited.map((c, i) => (
              <div className="country-card" key={i} onClick={() => goToDetail(c.country_name, c.flag_url)} style={{ cursor: 'pointer' }}>
                <div className="card-top">
                  <img src={c.flag_url} alt="" />
                  <span className="visa-type">{c.visa_type}</span>
                </div>

                <h3>{c.country_name}</h3>

                <p className="visa-deadline">
                  Get your visa by {calculateVisaDeadline(c.processing_days_max, c.processing_type)}
                </p>

                <p className="visa-sub">{c.processing_time_text}</p>
                <p className="visa-sub">{c.visas_processed} Visas Processed</p>

                <div className="card-divider"></div>

                <div className="price-row">
                  <span className="price">₹{c.price}</span>
                  <span className="fee">per adult + ₹{c.service_fee} service fees</span>
                </div>

                <div className="voucher">
                  ₹ Get ₹250 Fremor Global Tours & Attractions Voucher
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* EUROPE */}
      {/*<section className="visa-section">
        <h4>Visit Europe!</h4>

        <div className="europe-grid">
          {europe.map((c, i) => (
            <div className="europe-card" key={i}>
              <img src={c.flag} className="europe-flag" />

              <span className="sticker">STICKER VISA</span>

              <div className="europe-info">
                <h3>{c.name}</h3>
                <p>Know your appointment date by {c.date}</p>
                <button onClick={(e) => { e.stopPropagation(); goToDetail(c.name, c.flag); }}>Apply Now ›</button>
              </div>
            </div>
          ))}
        </div>
      </section>*/}

      {/* ANNOUNCEMENTS */}
      {/*<section className="visa-section">
        <h4>Visa Announcements</h4>

        <div className="announcement-card">
          <img src="https://flagcdn.com/w40/ae.png" alt="" />

          <div>
            <h5>United Arab Emirates</h5>
            <p>
              UAE National Day holidays for the Immigration Department are
              expected to begin soon and may cause longer visa processing time.
            </p>
          </div>

          <span className="holiday-tag">HOLIDAY</span>
        </div>
      </section>*/}
    </div>
  );
}