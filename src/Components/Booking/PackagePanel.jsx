import { useState, useRef, useEffect } from "react";
import { FaSearch, FaHeart, FaPassport, FaUsers, FaShip, FaClock } from "react-icons/fa";
import "./PackagePanel.css";

const subTabs = [
  { id: "search", label: "Search", icon: <FaSearch /> },
  { id: "honeymoon", label: "Honeymoon", icon: <FaHeart /> },
  { id: "visafree", label: "Visa Free Packages", icon: <FaPassport /> },
  { id: "group", label: "Group Tour Packages", icon: <FaUsers /> },
  { id: "cruise", label: "Cruise", icon: <FaShip /> },
  { id: "lastminute", label: "Last Minute Deals", icon: <FaClock /> },
];

const domesticDests = [
  "Goa", "Manali", "Jaipur", "Kerala", "Shimla",
  "Udaipur", "Rishikesh", "Andaman", "Darjeeling", "Ooty",
];

const intlDests = [
  "Bali", "Dubai", "Thailand", "Maldives", "Singapore",
  "Mauritius", "Sri Lanka", "Europe", "Vietnam", "Malaysia",
];

export default function PackagePanel() {
  const [activeSubTab, setActiveSubTab] = useState("search");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("Goa");
  const [departureDate, setDepartureDate] = useState("");
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Filter states
  const [filterDuration, setFilterDuration] = useState("3N - 5N");
  const [filterFlights, setFilterFlights] = useState("With Flights");
  const [filterBudget, setFilterBudget] = useState("₹40,000 - ₹50,000");

  const panelRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleString("en", { month: "short" }),
      year: `'${d.getFullYear().toString().slice(2)}`,
      weekday: d.toLocaleString("en", { weekday: "long" }),
    };
  };

  const dateFormatted = formatDate(departureDate);

  return (
    <div className="pkg-panel" ref={panelRef}>
      {/* Sub-Tabs */}
      <div className="pkg-subtabs">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            className={`pkg-subtab ${activeSubTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            <span className="pkg-subtab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Fields */}
      <div className="mmt-search-row">
        {/* FROM CITY */}
        <div className="mmt-field pkg-from">
          <span className="mmt-field-label">From City</span>
          <input
            className="mmt-city-name pkg-city-input"
            placeholder="Enter City"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
          />
          <span className="mmt-airport-code">India</span>
        </div>

        {/* TO CITY */}
        <div className={`mmt-field pkg-to ${activeDropdown === "dest" ? "mmt-field-active" : ""}`}
          onClick={() => setActiveDropdown(activeDropdown === "dest" ? null : "dest")}>
          <span className="mmt-field-label">To City/Country/Category</span>
          <div className="mmt-city-name">{toCity}</div>
          <span className="mmt-airport-code">India</span>

          {activeDropdown === "dest" && (
            <div className="dd-overlay dd-left dd-dest" onClick={(e) => e.stopPropagation()}>
              <div className="dd-sections">
                <div className="dd-sec-title">Popular in India</div>
                <div className="dd-pills">
                  {domesticDests.map((d) => (
                    <button key={d} className={`dd-pill ${toCity === d ? "dd-pill-active" : ""}`}
                      onClick={() => { setToCity(d); setActiveDropdown(null); }}>{d}</button>
                  ))}
                </div>
                <div className="dd-sec-title">International</div>
                <div className="dd-pills">
                  {intlDests.map((d) => (
                    <button key={d} className={`dd-pill ${toCity === d ? "dd-pill-active" : ""}`}
                      onClick={() => { setToCity(d); setActiveDropdown(null); }}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DEPARTURE DATE */}
        <div className="mmt-field mmt-field-date">
          <span className="mmt-field-label">Departure Date</span>
          {dateFormatted ? (
            <div className="mmt-date-display">
              <span className="mmt-date-day">{dateFormatted.day}</span>
              <div className="mmt-date-meta">
                <span className="mmt-date-month">{dateFormatted.month}{dateFormatted.year}</span>
                <span className="mmt-date-weekday">{dateFormatted.weekday}</span>
              </div>
            </div>
          ) : (
            <div className="mmt-date-placeholder">Select Date</div>
          )}
          <input type="date" className="mmt-date-hidden" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
        </div>

        {/* ROOMS & GUESTS */}
        <div className={`mmt-field pkg-rooms ${activeDropdown === "rooms" ? "mmt-field-active" : ""}`}
          onClick={() => setActiveDropdown(activeDropdown === "rooms" ? null : "rooms")}>
          <span className="mmt-field-label">Rooms & Guests</span>
          <div className="mmt-traveller-count">
            <span className="mmt-traveller-num">{rooms}</span>
            <span className="mmt-traveller-text">Room{rooms > 1 ? "s" : ""}, </span>
            <span className="mmt-traveller-num" style={{ marginLeft: 4 }}>{guests}</span>
            <span className="mmt-traveller-text">Guest{guests > 1 ? "s" : ""}</span>
          </div>

          {activeDropdown === "rooms" && (
            <div className="dd-overlay dd-right dd-rooms-popup" onClick={(e) => e.stopPropagation()}>
              <div className="pkg-counter-row">
                <span className="pkg-counter-label">Rooms</span>
                <div className="pkg-counter">
                  <button className="pkg-counter-btn" onClick={() => setRooms(Math.max(1, rooms - 1))}>−</button>
                  <span className="pkg-counter-val">{rooms}</span>
                  <button className="pkg-counter-btn" onClick={() => setRooms(rooms + 1)}>+</button>
                </div>
              </div>
              <div className="pkg-counter-row">
                <span className="pkg-counter-label">Guests</span>
                <div className="pkg-counter">
                  <button className="pkg-counter-btn" onClick={() => setGuests(Math.max(1, guests - 1))}>−</button>
                  <span className="pkg-counter-val">{guests}</span>
                  <button className="pkg-counter-btn" onClick={() => setGuests(guests + 1)}>+</button>
                </div>
              </div>
              <div className="tv-apply-wrap">
                <button className="tv-apply" onClick={() => setActiveDropdown(null)}>APPLY</button>
              </div>
            </div>
          )}
        </div>

        {/* FILTERS */}
        <div className={`mmt-field pkg-filters ${activeDropdown === "filters" ? "mmt-field-active" : ""}`}
          onClick={() => setActiveDropdown(activeDropdown === "filters" ? null : "filters")}>
          <span className="mmt-field-label">Filters</span>
          <div className="pkg-filter-placeholder">
            {filterDuration || filterFlights || filterBudget ? (
              <div className="pkg-selected-filters">
                <span className="pkg-f-text">Selected</span>
                <span className="pkg-f-count">3</span>
              </div>
            ) : (
              <>Select Filters<br />(Optional)</>
            )}
          </div>

          {activeDropdown === "filters" && (
            <div className="dd-overlay dd-right dd-filters-popup" onClick={(e) => e.stopPropagation()}>
              
              {/* Duration Section */}
              <div className="pkg-filter-section">
                <div className="pkg-filter-title">
                  Duration (in Nights) <span className="pkg-filter-sub">({filterDuration || 'Any'})</span>
                </div>
                {/* Visual slider placeholder */}
                <div className="pkg-slider-track">
                  <div className="pkg-slider-thumb left"></div>
                  <div className="pkg-slider-fill"></div>
                  <div className="pkg-slider-thumb right"></div>
                </div>
              </div>

              {/* Flights Section */}
              <div className="pkg-filter-section">
                <div className="pkg-filter-title">Flights</div>
                <div className="pkg-flight-pills">
                  <button 
                    className={`pkg-f-pill ${filterFlights === "With Flights" ? "active" : ""}`}
                    onClick={() => setFilterFlights("With Flights")}
                  >
                    With Flights <span className="pkg-f-num">(115)</span>
                  </button>
                  <button 
                    className={`pkg-f-pill ${filterFlights === "Without Flights" ? "active" : ""}`}
                    onClick={() => setFilterFlights("Without Flights")}
                  >
                    Without Flights <span className="pkg-f-num">(114)</span>
                  </button>
                </div>
              </div>

              {/* Budget Section */}
              <div className="pkg-filter-section border-0">
                <div className="pkg-filter-title">
                  Budget (per person) <span className="pkg-filter-sub">(₹21,000 - ₹1,00,000)</span>
                </div>
                {/* Visual slider placeholder */}
                <div className="pkg-slider-track">
                  <div className="pkg-slider-thumb left"></div>
                  <div className="pkg-slider-fill"></div>
                  <div className="pkg-slider-thumb right"></div>
                </div>
                
                <div className="pkg-budget-pills-row">
                  <div className="pkg-budget-pills-scroll">
                    {[
                      { l: "< ₹40,000", c: "41" },
                      { l: "₹40,000 - ₹50,000", c: "66" },
                      { l: "₹50,000 - ₹55,000", c: "38" }
                    ].map(b => (
                      <button 
                        key={b.l}
                        className={`pkg-f-pill ${filterBudget === b.l ? "active" : ""}`}
                        onClick={() => setFilterBudget(b.l)}
                      >
                        {b.l} <span className="pkg-f-num">({b.c})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="tv-apply-wrap pkg-filter-apply-wrap">
                <button className="tv-apply pkg-filter-apply" onClick={() => setActiveDropdown(null)}>APPLY</button>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Search Button */}
      <div className="mmt-search-btn-row">
        <button className="mmt-search-btn">SEARCH</button>
        <span className="pkg-label-right">Holiday Packages</span>
      </div>
    </div>
  );
}
