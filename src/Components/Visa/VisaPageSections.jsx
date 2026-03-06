import React, { useRef } from "react";
import "./VisaPageSections.css";

const mostVisited = [
  {
    name: "United Arab Emirates",
    flag: "https://flagcdn.com/w40/ae.png",
    visa: "E-VISA",
    date: "28 Feb",
    desc: "Quick & Easy Process",
    processed: "100k+ Visas Processed",
    price: "₹ 7,000",
    fee: "+ ₹1,399 service fees",
  },
  {
    name: "Thailand",
    flag: "https://flagcdn.com/w40/th.png",
    visa: "DAC",
    date: "24 Feb",
    desc: "Mandatory for Indians",
    processed: "20k+ DACs Processed",
    price: "₹ 0",
    fee: "+ ₹199 service fees",
  },
  {
    name: "Vietnam",
    flag: "https://flagcdn.com/w40/vn.png",
    visa: "E-VISA",
    date: "02 Mar",
    desc: "Quick & Easy Process",
    processed: "20k+ Visas Processed",
    price: "₹ 2,300",
    fee: "+ ₹899 service fees",
  },
  {
    name: "Indonesia",
    flag: "https://flagcdn.com/w40/id.png",
    visa: "EVOA",
    date: "24 Feb",
    desc: "Quick & Easy Process",
    processed: "15k+ Visas Processed",
    price: "₹ 2,800",
    fee: "+ ₹899 service fees",
  },
];

const europe = [
  {
    name: "France",
    flag: "https://flagcdn.com/w320/fr.png",
    date: "01 Mar",
  },
  {
    name: "Spain",
    flag: "https://flagcdn.com/w320/es.png",
    date: "01 Mar",
  },
  {
    name: "Finland",
    flag: "https://flagcdn.com/w320/fi.png",
    date: "05 Mar",
  },
  {
    name: "Germany",
    flag: "https://flagcdn.com/w320/de.png",
    date: "27 Feb",
  },
];
export default function VisaPageSections() {
  const sliderRef = useRef();

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
          {mostVisited.map((c, i) => (
            <div className="country-card" key={i}>
              <div className="card-top">
                <img src={c.flag} alt="" />
                <span className="visa-type">{c.visa}</span>
              </div>

              <h3>{c.name}</h3>

              <p className="visa-deadline">
                Get your visa by {c.date}
              </p>

              <p className="visa-sub">{c.desc}</p>
              <p className="visa-sub">{c.processed}</p>

              <div className="card-divider"></div>

              <div className="price-row">
                <span className="price">{c.price}</span>
                <span className="fee">per adult {c.fee}</span>
              </div>

              <div className="voucher">
                ₹ Get ₹250 MMT Tours & Attractions Voucher
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EUROPE */}
      <section className="visa-section">
        <h4>Visit Europe!</h4>

        <div className="europe-grid">
          {europe.map((c, i) => (
            <div className="europe-card" key={i}>
  <img src={c.flag} className="europe-flag" />

  <span className="sticker">STICKER VISA</span>

  <div className="europe-info">
    <h3>{c.name}</h3>
    <p>Know your appointment date by {c.date}</p>
    <button>Apply Now ›</button>
  </div>
</div>
          ))}
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="visa-section">
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
      </section>
    </div>
  );
}