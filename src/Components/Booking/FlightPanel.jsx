import { useState, useRef, useEffect } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import "./flightPanel.css";

const popularCities = [
  { city: "Mumbai", code: "BOM", airport: "Chhatrapati Shivaji International Airport", country: "India" },
  { city: "Delhi", code: "DEL", airport: "Indira Gandhi International Airport", country: "India" },
  { city: "Bengaluru", code: "BLR", airport: "Kempegowda International Airport", country: "India" },
  { city: "Hyderabad", code: "HYD", airport: "Rajiv Gandhi International Airport", country: "India" },
  { city: "Chennai", code: "MAA", airport: "Chennai International Airport", country: "India" },
  { city: "Kolkata", code: "CCU", airport: "Netaji Subhash Chandra Bose International", country: "India" },
  { city: "Pune", code: "PNQ", airport: "Pune International Airport", country: "India" },
  { city: "Goa", code: "GOI", airport: "Manohar International Airport", country: "India" },
  { city: "Jaipur", code: "JAI", airport: "Jaipur International Airport", country: "India" },
  { city: "Ahmedabad", code: "AMD", airport: "Sardar Vallabhbhai Patel International", country: "India" },
  { city: "Lucknow", code: "LKO", airport: "Chaudhary Charan Singh International", country: "India" },
  { city: "Chandigarh", code: "IXC", airport: "Chandigarh International Airport", country: "India" },
];

const intlCities = [
  { city: "Dubai", code: "DXB", airport: "Dubai International Airport", country: "UAE" },
  { city: "Singapore", code: "SIN", airport: "Changi Airport", country: "Singapore" },
  { city: "Bangkok", code: "BKK", airport: "Suvarnabhumi Airport", country: "Thailand" },
  { city: "London", code: "LHR", airport: "Heathrow Airport", country: "UK" },
  { city: "New York", code: "JFK", airport: "John F. Kennedy International", country: "USA" },
  { city: "Kuala Lumpur", code: "KUL", airport: "KL International Airport", country: "Malaysia" },
  { city: "Colombo", code: "CMB", airport: "Bandaranaike International", country: "Sri Lanka" },
  { city: "Mauritius", code: "MRU", airport: "Sir Seewoosagur Ramgoolam", country: "Mauritius" },
  { city: "Hong Kong", code: "HKG", airport: "Hong Kong International", country: "Hong Kong" },
];

const allCities = [...popularCities, ...intlCities];

export default function FlightPanel() {
  const [tripType, setTripType] = useState("oneway");
  const [fromCity, setFromCity] = useState("Mumbai");
  const [fromCode, setFromCode] = useState("BOM, Chhatrapati Shivaji International Airport India");
  const [toCity, setToCity] = useState("Delhi");
  const [toCode, setToCode] = useState("DEL, Indira Gandhi International Airport India");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Traveller state
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("Economy/Premium Economy");
  const [activeFare, setActiveFare] = useState("regular");

  // Active dropdown
  const [activeDropdown, setActiveDropdown] = useState(null); // "from" | "to" | "traveller" | null
  const [searchQuery, setSearchQuery] = useState("");

  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSwap = () => {
    const tempCity = fromCity;
    const tempCode = fromCode;
    setFromCity(toCity);
    setFromCode(toCode);
    setToCity(tempCity);
    setToCode(tempCode);
  };

  const selectCity = (type, item) => {
    const code = `${item.code}, ${item.airport} ${item.country}`;
    if (type === "from") {
      setFromCity(item.city);
      setFromCode(code);
    } else {
      setToCity(item.city);
      setToCode(code);
    }
    setActiveDropdown(null);
    setSearchQuery("");
  };

  const openDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
    setSearchQuery("");
  };

  const totalTravellers = adults + children + infants;

  const filtered = searchQuery
    ? allCities.filter(c =>
        c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const fares = [
    { id: "regular", label: "Regular" },
    { id: "student", label: "Student" },
    { id: "senior", label: "Senior Citizen" },
    { id: "armed", label: "Armed Forces" },
    { id: "doctor", label: "Doctor & Nurses" },
  ];

  // Format date display
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString("en", { month: "short" });
    const year = d.getFullYear().toString().slice(2);
    const weekday = d.toLocaleString("en", { weekday: "long" });
    return { day, month, year: `'${year}`, weekday };
  };

  const depFormatted = formatDate(departureDate);
  const retFormatted = formatDate(returnDate);

  const NumberRow = ({ label, sublabel, value, onChange, max = 9 }) => (
    <div className="tv-section">
      <div className="tv-header">
        <span className="tv-title">{label}</span>
        <span className="tv-sub">{sublabel}</span>
      </div>
      <div className="tv-numbers">
        {[...Array(max + 1)].map((_, i) => (
          <button
            key={i}
            className={`tv-num ${value === i ? "active" : ""}`}
            onClick={() => onChange(i)}
          >
            {i}
          </button>
        ))}
        <button className="tv-num" onClick={() => onChange(max + 1)}>&gt;{max}</button>
      </div>
    </div>
  );

  return (
    <div className="mmt-flight" ref={panelRef}>
      {/* Trip Type */}
      <div className="mmt-trip-row">
        {["oneway", "round", "multi"].map((type) => (
          <label key={type} className={`mmt-radio ${tripType === type ? "active" : ""}`}>
            <input type="radio" name="tripType" checked={tripType === type} onChange={() => setTripType(type)} />
            <span className="mmt-radio-dot"></span>
            {type === "oneway" ? "One Way" : type === "round" ? "Round Trip" : "Multi City"}
          </label>
        ))}
        <div className="mmt-intl-tag">Book International and Domestic Flights</div>
      </div>

      {/* Search Fields */}
      <div className="mmt-search-row">
        {/* FROM */}
        <div className={`mmt-field mmt-field-from ${activeDropdown === "from" ? "mmt-field-active" : ""}`}
          onClick={() => openDropdown("from")}>
          <span className="mmt-field-label">From</span>
          <div className="mmt-city-name">{fromCity}</div>
          <span className="mmt-airport-code">{fromCode}</span>

          {/* Swap - inside From, positioned at right edge */}
          <button className="mmt-swap" onClick={(e) => { e.stopPropagation(); handleSwap(); }}>
            <FaExchangeAlt />
          </button>

          {activeDropdown === "from" && (
            <div className="dd-overlay dd-left" onClick={(e) => e.stopPropagation()}>
              <div className="dd-search-bar">
                <input
                  className="dd-search-input"
                  placeholder="From"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              {filtered ? (
                filtered.length > 0 ? (
                  <div className="dd-results">
                    {filtered.map((c) => (
                      <div key={c.code} className="dd-result-item" onClick={() => selectCity("from", c)}>
                        <span className="dd-item-city">{c.city}</span>
                        <span className="dd-item-detail">{c.code}, {c.airport}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="dd-empty">No cities found</div>
                )
              ) : (
                <div className="dd-sections">
                  <div className="dd-sec-title">Popular Cities</div>
                  <div className="dd-pills">
                    {popularCities.map((c) => (
                      <button key={c.code} className="dd-pill" onClick={() => selectCity("from", c)}>{c.city}</button>
                    ))}
                  </div>
                  <div className="dd-sec-title">International</div>
                  <div className="dd-pills">
                    {intlCities.map((c) => (
                      <button key={c.code} className="dd-pill" onClick={() => selectCity("from", c)}>{c.city}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* TO */}
        <div className={`mmt-field mmt-field-to ${activeDropdown === "to" ? "mmt-field-active" : ""}`}
          onClick={() => openDropdown("to")}>
          <span className="mmt-field-label">To</span>
          <div className="mmt-city-name">{toCity}</div>
          <span className="mmt-airport-code">{toCode}</span>

          {activeDropdown === "to" && (
            <div className="dd-overlay dd-left" onClick={(e) => e.stopPropagation()}>
              <div className="dd-search-bar">
                <input
                  className="dd-search-input"
                  placeholder="To"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              {filtered ? (
                filtered.length > 0 ? (
                  <div className="dd-results">
                    {filtered.map((c) => (
                      <div key={c.code} className="dd-result-item" onClick={() => selectCity("to", c)}>
                        <span className="dd-item-city">{c.city}</span>
                        <span className="dd-item-detail">{c.code}, {c.airport}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="dd-empty">No cities found</div>
                )
              ) : (
                <div className="dd-sections">
                  <div className="dd-sec-title">Popular Cities</div>
                  <div className="dd-pills">
                    {popularCities.map((c) => (
                      <button key={c.code} className="dd-pill" onClick={() => selectCity("to", c)}>{c.city}</button>
                    ))}
                  </div>
                  <div className="dd-sec-title">International</div>
                  <div className="dd-pills">
                    {intlCities.map((c) => (
                      <button key={c.code} className="dd-pill" onClick={() => selectCity("to", c)}>{c.city}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* DEPARTURE */}
        <div className="mmt-field mmt-field-date">
          <span className="mmt-field-label">Departure</span>
          {depFormatted ? (
            <div className="mmt-date-display">
              <span className="mmt-date-day">{depFormatted.day}</span>
              <div className="mmt-date-meta">
                <span className="mmt-date-month">{depFormatted.month}{depFormatted.year}</span>
                <span className="mmt-date-weekday">{depFormatted.weekday}</span>
              </div>
            </div>
          ) : (
            <div className="mmt-date-placeholder">Select Date</div>
          )}
          <input
            type="date"
            className="mmt-date-hidden"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>

        {/* RETURN */}
        <div
          className={`mmt-field mmt-field-return ${tripType !== "round" ? "mmt-field-disabled" : ""}`}
          onClick={() => { if (tripType !== "round") setTripType("round"); }}
        >
          <span className="mmt-field-label">Return</span>
          {tripType === "round" ? (
            retFormatted ? (
              <div className="mmt-date-display">
                <span className="mmt-date-day">{retFormatted.day}</span>
                <div className="mmt-date-meta">
                  <span className="mmt-date-month">{retFormatted.month}{retFormatted.year}</span>
                  <span className="mmt-date-weekday">{retFormatted.weekday}</span>
                </div>
              </div>
            ) : (
              <div className="mmt-date-placeholder">Select Date</div>
            )
          ) : (
            <span className="mmt-add-return">Tap to add a return date for bigger discounts</span>
          )}
          {tripType === "round" && (
            <input
              type="date"
              className="mmt-date-hidden"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          )}
        </div>

        {/* TRAVELLERS & CLASS */}
        <div className={`mmt-field mmt-field-travellers ${activeDropdown === "traveller" ? "mmt-field-active" : ""}`}
          onClick={() => openDropdown("traveller")}>
          <span className="mmt-field-label">Travellers & Class</span>
          <div className="mmt-traveller-count">
            <span className="mmt-traveller-num">{totalTravellers}</span>
            <span className="mmt-traveller-text">Traveller{totalTravellers > 1 ? "s" : ""}</span>
          </div>
          <div className="mmt-class-text">{travelClass}</div>

          {activeDropdown === "traveller" && (
            <div className="dd-overlay dd-right dd-traveller" onClick={(e) => e.stopPropagation()}>
              <NumberRow label="ADULTS (12y +)" sublabel="on the day of travel" value={adults} onChange={(v) => setAdults(Math.max(1, v))} max={9} />
              <div className="tv-split-row">
                <NumberRow label="CHILDREN (2y - 12y)" sublabel="on the day of travel" value={children} onChange={setChildren} max={6} />
                <NumberRow label="INFANTS (below 2y)" sublabel="on the day of travel" value={infants} onChange={setInfants} max={6} />
              </div>
              <div className="tv-class-area">
                <div className="tv-class-label">CHOOSE TRAVEL CLASS</div>
                <div className="tv-class-list">
                  {["Economy/Premium Economy", "Premium Economy", "Business", "First Class"].map((cls) => (
                    <button key={cls} className={`tv-class-pill ${travelClass === cls ? "active" : ""}`}
                      onClick={() => setTravelClass(cls)}>
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
              <div className="tv-apply-wrap">
                <button className="tv-apply" onClick={() => setActiveDropdown(null)}>APPLY</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Special Fares */}
      <div className="mmt-fares-row">
        <span className="mmt-fares-title">SPECIAL FARES</span>
        <div className="mmt-fares-list">
          {fares.map((fare) => (
            <button key={fare.id} className={`mmt-fare-pill ${activeFare === fare.id ? "active" : ""}`}
              onClick={() => setActiveFare(fare.id)}>
              {fare.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <div className="mmt-search-btn-row">
        <button className="mmt-search-btn">SEARCH</button>
      </div>
    </div>
  );
}