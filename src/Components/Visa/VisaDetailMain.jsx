import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import "./VisaDetail.css";

// ─── OUR OWN EMAIL SERVER ─────────────────────────────────────────────────────
// Vite proxies /api → http://localhost:5000 automatically (see vite.config.js)
// So no CORS issues and no ERR_CONNECTION_REFUSED even if ports change.
const API_URL = "/api/enquiry";
// ─────────────────────────────────────────────────────────────────────────────

const countryVisaData = {
  "United Arab Emirates": {
    code: "ae",
    landmark: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=350&fit=crop",
    visaType: "E-VISA",
    price: "₹ 6,950",
    serviceFee: "₹ 1,399",
    processing: "5 Working Days",
    visaDeadline: "01 Apr",
    visasProcessed: "150k+",
    documents: [
      "First and last page of the passport",
      "Photo with white background",
      "Onward and Return Flight Ticket",
      "Accommodation Voucher (if staying at a hotel)",
      "Host's Tenancy Contract and Emirates ID (if staying with friends/family)",
    ],
    importantInfo: [
      {
        title: "Stay with Family or Friends",
        desc: "Applicants must provide a copy of the host's tenancy contract and Emirates ID as proof of accommodation. In case the host owns the property, a copy of the Title Deed is required.",
      },
      {
        title: "Minors Travel Consent",
        desc: "It is recommended that minors must be accompanied by their parents or a legal guardian. It is mandatory for minors to travel with the parent with whom his/her visa application has been processed.",
      },
    ],
    faqs: {
      "Important Information": [
        { q: "What is OK to Board?", a: "OK to Board is required by certain airlines if your passport issuing country is Bangladesh, China or Pakistan. You need to apply for OK to Board around 72 hours before your flight boarding time." },
        { q: "Is the OK to Board fee included in the visa application fee?", a: "This fee is not included in the visa application fee. Fremor can help with this service at an additional cost." },
        { q: "Which destinations can I visit with the UAE visa?", a: "The UAE visa grants entry to all 7 emirates: Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Fujairah, and Ras Al Khaimah." },
      ],
      "Processing Time": [
        { q: "How long does it take to get a UAE visa?", a: "The processing time for a UAE visa is typically 3-5 working days from the date of submission of all required documents." },
        { q: "Can I get an urgent visa?", a: "Yes, express processing is available at an additional cost with a turnaround of 24-48 hours." },
      ],
      "Re-application": [
        { q: "What if my visa gets rejected?", a: "In case of a rejection, you can re-apply after addressing the reasons for rejection. Our team will guide you through the process." },
        { q: "Is there a fee for re-application?", a: "Yes, a fresh application fee will be applicable for re-application." },
      ],
      "Visa Extension": [
        { q: "Can I extend my UAE visa?", a: "Yes, UAE visa can be extended for an additional 30 days. You need to apply for an extension before your current visa expires." },
      ],
    },
  },
};

const defaultVisaData = {
  visaType: "VISA REQUIRED",
  price: "₹ 4,500",
  serviceFee: "₹ 999",
  processing: "5-7 Working Days",
  visaDeadline: "15 Apr",
  visasProcessed: "10k+",
  documents: [
    "Valid Passport (minimum 6 months validity)",
    "Passport-size photograph with white background",
    "Confirmed return flight tickets",
    "Hotel booking confirmation",
    "Bank statement (last 3 months)",
    "Travel insurance",
  ],
  importantInfo: [
    {
      title: "Passport Validity",
      desc: "Your passport must be valid for at least 6 months from the date of travel and must have at least 2 blank pages for visa stamping.",
    },
    {
      title: "Financial Proof",
      desc: "You may need to provide bank statements for the last 3-6 months showing sufficient funds to cover your trip expenses.",
    },
  ],
  faqs: {
    "Important Information": [
      { q: "What documents do I need for a visa?", a: "You typically need a valid passport, photographs, flight bookings, hotel reservations, bank statements, and travel insurance." },
      { q: "How long does processing take?", a: "Standard processing takes 5-7 working days. Express processing may be available at additional cost." },
    ],
    "Processing Time": [
      { q: "What is the standard processing time?", a: "Standard processing takes 5-7 working days from the date all documents are submitted." },
    ],
    "Re-application": [
      { q: "What if my visa is rejected?", a: "You can re-apply after addressing the reasons for rejection. A fresh application fee will apply." },
    ],
    "Visa Extension": [
      { q: "Can I extend my visa?", a: "Extension policies vary by country. Contact our support team for specific information." },
    ],
  },
};

const landmarkImages = {
  "United Arab Emirates": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=350&fit=crop",
  Thailand: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=350&fit=crop",
  Singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=350&fit=crop",
  France: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=350&fit=crop",
  Japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=350&fit=crop",
  Australia: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&h=350&fit=crop",
  "United Kingdom": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=350&fit=crop",
  "United States": "https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=600&h=350&fit=crop",
  Canada: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&h=350&fit=crop",
  Italy: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&h=350&fit=crop",
  Germany: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=350&fit=crop",
  Spain: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600&h=350&fit=crop",
  Turkey: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=350&fit=crop",
  Vietnam: "https://images.unsplash.com/photo-1557750255-c76072a7aee1?w=600&h=350&fit=crop",
  Indonesia: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=350&fit=crop",
  Malaysia: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=350&fit=crop",
};

const defaultLandmark = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=350&fit=crop";

export default function VisaDetailMain() {
  const [searchParams] = useSearchParams();
  const countryName = searchParams.get("country") || "United Arab Emirates";
  const flagUrl = searchParams.get("flag") || "https://flagcdn.com/w40/ae.png";
  const depParam = searchParams.get("departure");
  const retParam = searchParams.get("return");

  const [departureDate, setDepartureDate] = useState(depParam ? new Date(depParam) : null);
  const [returnDate, setReturnDate] = useState(retParam ? new Date(retParam) : null);
  const [activeFaqTab, setActiveFaqTab] = useState("Important Information");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showReadMore, setShowReadMore] = useState(false);

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: "", email: "", phone: "", travelDate: "", travellers: "1", message: "",
  });
  const [enquiryStatus, setEnquiryStatus] = useState("idle"); // idle | sending | success | error

  const handleEnquiryChange = (e) => {
    setEnquiryForm({ ...enquiryForm, [e.target.name]: e.target.value });
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryStatus("sending");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryType: "Visa",
          name:       enquiryForm.name,
          email:      enquiryForm.email,
          phone:      enquiryForm.phone,
          country:    countryName,
          travelDate: enquiryForm.travelDate,
          travellers: enquiryForm.travellers,
          message:    enquiryForm.message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEnquiryStatus("success");
        setEnquiryForm({ name: "", email: "", phone: "", travelDate: "", travellers: "1", message: "" });
        setTimeout(() => setEnquiryStatus("idle"), 6000);
      } else {
        setEnquiryStatus("error");
        setTimeout(() => setEnquiryStatus("idle"), 4000);
      }
    } catch {
      setEnquiryStatus("error");
      setTimeout(() => setEnquiryStatus("idle"), 4000);
    }
  };

  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarSelectingField, setCalendarSelectingField] = useState("departure");
  const [calendarBaseMonth, setCalendarBaseMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });
  const calendarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visaData = countryVisaData[countryName] || {
    ...defaultVisaData,
    landmark: landmarkImages[countryName] || defaultLandmark,
  };
  const landmark = visaData.landmark || landmarkImages[countryName] || defaultLandmark;

  // Calendar helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 0).getDay();
  const getNextMonth = (year, month) => (month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 });
  const getPrevMonth = (year, month) => (month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 });
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["S","M","T","W","T","F","S"];

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };
  const isInRange = (date) => {
    if (!departureDate || !returnDate) return false;
    return date > departureDate && date < returnDate;
  };
  const isBeforeToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = useCallback(
    (day, month, year) => {
      const clicked = new Date(year, month, day);
      if (isBeforeToday(clicked)) return;
      if (calendarSelectingField === "departure") {
        setDepartureDate(clicked);
        if (returnDate && clicked >= returnDate) setReturnDate(null);
        setCalendarSelectingField("return");
      } else {
        if (departureDate && clicked <= departureDate) {
          setDepartureDate(clicked);
          setReturnDate(null);
          setCalendarSelectingField("return");
        } else {
          setReturnDate(clicked);
          setShowCalendar(false);
          setCalendarSelectingField("departure");
        }
      }
    },
    [calendarSelectingField, departureDate, returnDate]
  );

  const handlePrevMonth = () => {
    const prev = getPrevMonth(calendarBaseMonth.year, calendarBaseMonth.month);
    const now = new Date();
    if (prev.year > now.getFullYear() || (prev.year === now.getFullYear() && prev.month >= now.getMonth())) {
      setCalendarBaseMonth(prev);
    }
  };
  const handleNextMonth = () => setCalendarBaseMonth(getNextMonth(calendarBaseMonth.year, calendarBaseMonth.month));

  const openCalendar = (field) => {
    setCalendarSelectingField(field);
    setShowCalendar(true);
  };

  const formatDisplayDate = (date) => {
    if (!date) return "Select Date";
    return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };
  const formatShortDate = (date) => {
    if (!date) return "";
    return `${String(date.getDate()).padStart(2,"0")}/${String(date.getMonth()+1).padStart(2,"0")}/${date.getFullYear()}`;
  };

  const renderMonthGrid = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const rows = [];
    let cells = [];
    const prevMonthInfo = getPrevMonth(year, month);
    const prevDays = getDaysInMonth(prevMonthInfo.year, prevMonthInfo.month);
    for (let i = firstDay; i > 0; i--) {
      cells.push(<td key={`prev-${i}`} className="vd-cal-day vd-cal-day-other">{prevDays - i + 1}</td>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const thisDate = new Date(year, month, d);
      const isDisabled = isBeforeToday(thisDate);
      const isStart = isSameDay(thisDate, departureDate);
      const isEnd = isSameDay(thisDate, returnDate);
      const inRange = isInRange(thisDate);
      let cls = "vd-cal-day";
      if (isDisabled) cls += " vd-cal-day-disabled";
      if (isStart) cls += " vd-cal-day-start";
      if (isEnd) cls += " vd-cal-day-end";
      if (inRange) cls += " vd-cal-day-range";
      if (isStart || isEnd) cls += " vd-cal-day-selected";
      cells.push(
        <td key={`d-${d}`} className={cls} onClick={() => !isDisabled && handleDateClick(d, month, year)}>
          <span>{d}</span>
        </td>
      );
      if ((firstDay + d) % 7 === 0 || d === daysInMonth) {
        if (d === daysInMonth) {
          const rem = 7 - cells.length % 7;
          if (rem < 7) for (let i = 1; i <= rem; i++) cells.push(<td key={`next-${i}`} className="vd-cal-day vd-cal-day-other">{i}</td>);
        }
        rows.push(<tr key={`row-${rows.length}`}>{cells}</tr>);
        cells = [];
      }
    }
    return rows;
  };

  const secondMonth = getNextMonth(calendarBaseMonth.year, calendarBaseMonth.month);
  const faqTabs = Object.keys(visaData.faqs);
  const faqTabIcons = { "Important Information": "⚠️", "Processing Time": "⏱️", "Re-application": "🔄", "Visa Extension": "📋" };

  return (
    <div className="vd-wrapper">

      {/* ── STICKY TOP BAR ── */}
      <div className="vd-topbar" ref={calendarRef}>
        <div className="vd-topbar-inner">

          <div className="vd-topbar-field">
            <span className="vd-topbar-label">DESTINATION</span>
            <span className="vd-topbar-value">{countryName}</span>
          </div>

          <div className="vd-topbar-divider" />

          <div className="vd-topbar-field vd-topbar-clickable" onClick={() => openCalendar("departure")}>
            <span className="vd-topbar-label">DEPARTURE</span>
            <span className="vd-topbar-value">{formatDisplayDate(departureDate)}</span>
          </div>

          <div className="vd-topbar-divider" />

          <div className="vd-topbar-field vd-topbar-clickable" onClick={() => openCalendar("return")}>
            <span className="vd-topbar-label">RETURN</span>
            <span className="vd-topbar-value">{formatDisplayDate(returnDate)}</span>
          </div>

          <button className="vd-topbar-search">SEARCH</button>
        </div>

        {showCalendar && (
          <div className="vd-cal-overlay">
            <div className="vd-cal-popup">
              <div className="vd-cal-header">
                <div className="vd-cal-header-labels">
                  <span className={`vd-cal-header-label ${calendarSelectingField === "departure" ? "active" : ""}`} onClick={() => setCalendarSelectingField("departure")}>
                    Departure Date
                  </span>
                  <span className="vd-cal-header-sep">–</span>
                  <span className={`vd-cal-header-label ${calendarSelectingField === "return" ? "active" : ""}`} onClick={() => setCalendarSelectingField("return")}>
                    Return Date
                  </span>
                </div>
                {departureDate && <div className="vd-cal-duration-info">You can opt for a visa with a duration of up to 60 days</div>}
              </div>

              <div className="vd-cal-months">
                <div className="vd-cal-month">
                  <div className="vd-cal-month-header">
                    <button className="vd-cal-nav-btn" onClick={handlePrevMonth}>←</button>
                    <span className="vd-cal-month-title">{monthNames[calendarBaseMonth.month]} {calendarBaseMonth.year}</span>
                  </div>
                  <table className="vd-cal-table">
                    <thead><tr>{dayNames.map((d,i) => <th key={i}>{d}</th>)}</tr></thead>
                    <tbody>{renderMonthGrid(calendarBaseMonth.year, calendarBaseMonth.month)}</tbody>
                  </table>
                </div>
                <div className="vd-cal-month">
                  <div className="vd-cal-month-header">
                    <span className="vd-cal-month-title">{monthNames[secondMonth.month]} {secondMonth.year}</span>
                    <button className="vd-cal-nav-btn" onClick={handleNextMonth}>→</button>
                  </div>
                  <table className="vd-cal-table">
                    <thead><tr>{dayNames.map((d,i) => <th key={i}>{d}</th>)}</tr></thead>
                    <tbody>{renderMonthGrid(secondMonth.year, secondMonth.month)}</tbody>
                  </table>
                </div>
              </div>

              {departureDate && returnDate && (
                <div className="vd-cal-footer">
                  <span className="vd-cal-selected-range">{formatShortDate(departureDate)} — {formatShortDate(returnDate)}</span>
                  <button className="vd-cal-apply-btn" onClick={() => setShowCalendar(false)}>Apply</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="vd-content">
        <div className="vd-main">

          {/* HERO */}
          <div className="vd-hero">
            <div className="vd-hero-top">
              <img src={flagUrl} alt={countryName} className="vd-hero-flag" />
              <div className="vd-hero-text">
                <h1 className="vd-hero-country">{countryName}</h1>
                <p className="vd-hero-sub">Apply today and get visa by {visaData.visaDeadline}</p>
              </div>
            </div>
            <div className="vd-hero-img-wrap">
              <img src={landmark} alt={countryName} className="vd-hero-img" />
            </div>
          </div>

          {/* VISA PROCESS */}
          <div className="vd-section">
            <div className="vd-section-header">
              <h2>Visa Process</h2>
              <span className="vd-visa-type-badge">{visaData.visaType} ⓘ</span>
            </div>
            <p className="vd-process-sub">For Tourists</p>

            <div className="vd-steps">
              <div className="vd-step">
                <div className="vd-step-icon">
                  <span className="vd-step-num">📝</span>
                  <div className="vd-step-line" />
                </div>
                <div className="vd-step-content">
                  <h4>Start your Visa Application</h4>
                  <p>Fill your travel details</p>
                  <div className="vd-docs-box">
                    <h5>Documents to Upload</h5>
                    <ul>
                      {visaData.documents.map((doc, i) => (
                        <li key={i}>
                          <span className="vd-doc-icon">📄</span>
                          <span className="vd-doc-text">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="vd-step">
                <div className="vd-step-icon">
                  <span className="vd-step-num">💳</span>
                  <div className="vd-step-line" />
                </div>
                <div className="vd-step-content">
                  <h4>Pay Online</h4>
                  <p>You can also upload your documents after booking. Our visa consultant will review them and reach out if required.</p>
                </div>
              </div>

              <div className="vd-step">
                <div className="vd-step-icon">
                  <span className="vd-step-num">🏛️</span>
                  <div className="vd-step-line" />
                </div>
                <div className="vd-step-content">
                  <h4>Application Submission to Immigration</h4>
                  <p>Applications with travel dates beyond 30 days are submitted closer to the travel date, as per the immigration norms.</p>
                </div>
              </div>

              <div className="vd-step">
                <div className="vd-step-icon">
                  <span className="vd-step-num">✅</span>
                </div>
                <div className="vd-step-content">
                  <h4>Get Visa Decision in {visaData.processing}</h4>
                  <p>Track your visa status & receive your e-Visa on email.</p>
                </div>
              </div>
            </div>
          </div>

          {/* IMPORTANT INFORMATION */}
          <div className="vd-section">
            <h2>Important Information</h2>
            <div className="vd-info-list">
              {visaData.importantInfo.slice(0, showReadMore ? undefined : 2).map((info, i) => (
                <div key={i} className="vd-info-item">
                  <h4 className="vd-info-title">{info.title}</h4>
                  <p>{info.desc}</p>
                </div>
              ))}
            </div>
            {visaData.importantInfo.length > 2 && (
              <button className="vd-read-more" onClick={() => setShowReadMore(!showReadMore)}>
                {showReadMore ? "Show Less" : "Read More"}
              </button>
            )}
          </div>

          {/* FAQ */}
          <div className="vd-section">
            <h2>Frequently Asked Questions</h2>
            <div className="vd-faq-tabs">
              {faqTabs.map((tab) => (
                <button
                  key={tab}
                  className={`vd-faq-tab ${activeFaqTab === tab ? "active" : ""}`}
                  onClick={() => { setActiveFaqTab(tab); setExpandedFaq(null); }}
                >
                  <span className="vd-faq-tab-icon">{faqTabIcons[tab] || "📌"}</span>
                  {tab}
                </button>
              ))}
            </div>
            <div className="vd-faq-list">
              {(visaData.faqs[activeFaqTab] || []).map((faq, i) => (
                <div key={i} className={`vd-faq-item ${expandedFaq === i ? "expanded" : ""}`}>
                  <button className="vd-faq-question" onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}>
                    <span>{i + 1}. {faq.q}</span>
                    <span className="vd-faq-arrow">{expandedFaq === i ? "▲" : "▼"}</span>
                  </button>
                  {expandedFaq === i && (
                    <div className="vd-faq-answer"><p>{faq.a}</p></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="vd-sidebar">

          {/* ENQUIRY FORM */}
          <div className="vd-enquiry-card">
            <div className="vd-enquiry-header">
              <span className="vd-enquiry-icon">✉️</span>
              <div>
                <h3>Quick Enquiry</h3>
                <p>Get a callback from our visa experts</p>
              </div>
            </div>

            {enquiryStatus === "success" ? (
              <div className="vd-enquiry-success">
                <span className="vd-success-icon">🎉</span>
                <h4>Enquiry Submitted!</h4>
                <p>We've received your enquiry and will contact you within 24 hours.</p>
              </div>
            ) : (
              <form className="vd-enquiry-form" onSubmit={handleEnquirySubmit}>

                {enquiryStatus === "error" && (
                  <div className="vd-enquiry-error">
                    ⚠️ Something went wrong. Please try again or call us directly.
                  </div>
                )}

                <div className="vd-form-group">
                  <label className="vd-form-label">Full Name *</label>
                  <input type="text" name="name" className="vd-form-input" placeholder="Enter your name" value={enquiryForm.name} onChange={handleEnquiryChange} required />
                </div>

                <div className="vd-form-group">
                  <label className="vd-form-label">Email Address *</label>
                  <input type="email" name="email" className="vd-form-input" placeholder="you@example.com" value={enquiryForm.email} onChange={handleEnquiryChange} required />
                </div>

                <div className="vd-form-group">
                  <label className="vd-form-label">Phone Number *</label>
                  <input type="tel" name="phone" className="vd-form-input" placeholder="+91 98765 43210" value={enquiryForm.phone} onChange={handleEnquiryChange} required />
                </div>

                <div className="vd-form-row">
                  <div className="vd-form-group">
                    <label className="vd-form-label">Travel Date</label>
                    <input type="date" name="travelDate" className="vd-form-input" value={enquiryForm.travelDate} onChange={handleEnquiryChange} />
                  </div>
                  <div className="vd-form-group">
                    <label className="vd-form-label">Travellers</label>
                    <select name="travellers" className="vd-form-input" value={enquiryForm.travellers} onChange={handleEnquiryChange}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n}>{n} Adult{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="vd-form-group">
                  <label className="vd-form-label">Message (Optional)</label>
                  <textarea name="message" className="vd-form-input vd-form-textarea" placeholder={`I'm interested in a ${countryName} visa...`} value={enquiryForm.message} onChange={handleEnquiryChange} rows={3} />
                </div>

                <button type="submit" className="vd-enquiry-submit" disabled={enquiryStatus === "sending"}>
                  {enquiryStatus === "sending" ? "⏳ Sending..." : "📩 Send Enquiry"}
                </button>
                <p className="vd-enquiry-note">🔒 Your data is safe &amp; secure with us</p>
              </form>
            )}
          </div>

          {/* NEED HELP */}
          <div className="vd-sidebar-help">
            <div className="vd-help-icon">🎧</div>
            <div>
              <h4>Need Help?</h4>
              <p>Our visa experts are available 24/7</p>
              <a href="tel:+911234567890" className="vd-help-phone">📞 +91 1234 567 890</a>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
