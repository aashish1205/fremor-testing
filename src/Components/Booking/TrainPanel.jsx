import { useState, useRef, useEffect } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import "./TrainPanel.css";

const trainStations = [
  { city: "New Delhi", code: "NDLS", station: "New Delhi Railway Station" },
  { city: "Mumbai", code: "CSMT", station: "Chhatrapati Shivaji Maharaj Terminus" },
  { city: "Mumbai Central", code: "BCT", station: "Mumbai Central" },
  { city: "Kanpur", code: "CNB", station: "Kanpur Central" },
  { city: "Lucknow", code: "LKO", station: "Lucknow Charbagh" },
  { city: "Chennai", code: "MAS", station: "Chennai Central" },
  { city: "Kolkata", code: "HWH", station: "Howrah Junction" },
  { city: "Bengaluru", code: "SBC", station: "Bengaluru City Junction" },
  { city: "Hyderabad", code: "SC", station: "Secunderabad Junction" },
  { city: "Pune", code: "PUNE", station: "Pune Junction" },
  { city: "Ahmedabad", code: "ADI", station: "Ahmedabad Junction" },
  { city: "Jaipur", code: "JP", station: "Jaipur Junction" },
  { city: "Varanasi", code: "BSB", station: "Varanasi Junction" },
  { city: "Patna", code: "PNBE", station: "Patna Junction" },
  { city: "Bhopal", code: "BPL", station: "Bhopal Junction" },
];

export default function TrainPanel() {
  const [trainOption, setTrainOption] = useState("book");
  const [from, setFrom] = useState("New Delhi");
  const [fromCode, setFromCode] = useState("NDLS, New Delhi Railway Station");
  const [to, setTo] = useState("Kanpur");
  const [toCode, setToCode] = useState("CNB, Kanpur Central");
  const [date, setDate] = useState("");
  const [trainClass, setTrainClass] = useState("All");

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const swapStations = () => {
    const tc = from, tcc = fromCode;
    setFrom(to); setFromCode(toCode);
    setTo(tc); setToCode(tcc);
  };

  const selectStation = (type, s) => {
    const code = `${s.code}, ${s.station}`;
    if (type === "from") { setFrom(s.city); setFromCode(code); }
    else { setTo(s.city); setToCode(code); }
    setActiveDropdown(null);
    setSearchQuery("");
  };

  const filtered = searchQuery
    ? trainStations.filter(s =>
        s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

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

  const dateFormatted = formatDate(date);

  const StationDropdown = ({ type }) => (
    <div className="dd-overlay dd-left" onClick={(e) => e.stopPropagation()}>
      <div className="dd-search-bar">
        <input
          className="dd-search-input"
          placeholder={type === "from" ? "From Station" : "To Station"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
      </div>
      {filtered ? (
        filtered.length > 0 ? (
          <div className="dd-results">
            {filtered.map((s) => (
              <div key={s.code} className="dd-result-item" onClick={() => selectStation(type, s)}>
                <span className="dd-item-city">{s.city}</span>
                <span className="dd-item-detail">{s.code}, {s.station}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="dd-empty">No stations found</div>
        )
      ) : (
        <div className="dd-sections">
          <div className="dd-sec-title">Popular Stations</div>
          <div className="dd-pills">
            {trainStations.map((s) => (
              <button key={s.code} className="dd-pill" onClick={() => selectStation(type, s)}>{s.city}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mmt-train" ref={panelRef}>
      {/* Train Options Row */}
      <div className="mmt-trip-row">
        <label className={`mmt-radio ${trainOption === "book" ? "active" : ""}`}>
          <input type="radio" name="trainOpt" checked={trainOption === "book"} onChange={() => setTrainOption("book")} />
          <span className="mmt-radio-dot"></span>
          Book Train Tickets
        </label>
        <label className={`mmt-radio ${trainOption === "pnr" ? "active" : ""}`}>
          <input type="radio" name="trainOpt" checked={trainOption === "pnr"} onChange={() => setTrainOption("pnr")} />
          <span className="mmt-radio-dot"></span>
          Check PNR Status
        </label>
        <label className={`mmt-radio ${trainOption === "live" ? "active" : ""}`}>
          <input type="radio" name="trainOpt" checked={trainOption === "live"} onChange={() => setTrainOption("live")} />
          <span className="mmt-radio-dot"></span>
          Live Train Status
        </label>
        <div className="mmt-intl-tag">Train Ticket Booking<br /><span style={{ fontSize: "10px" }}>IRCTC Authorized e-ticketing</span></div>
      </div>

      {/* PNR Status panel */}
      {trainOption === "pnr" && (
        <div className="train-pnr-panel">
          <div className="pnr-input-wrap">
            <label className="mmt-field-label">Enter PNR Number</label>
            <input className="pnr-input" placeholder="Enter 10-digit PNR number" />
          </div>
          <div className="mmt-search-btn-row">
            <button className="mmt-search-btn">CHECK STATUS</button>
          </div>
        </div>
      )}

      {/* Live Status panel */}
      {trainOption === "live" && (
        <div className="train-pnr-panel">
          <div className="pnr-input-wrap">
            <label className="mmt-field-label">Enter Train Number or Name</label>
            <input className="pnr-input" placeholder="Enter train number or name" />
          </div>
          <div className="mmt-search-btn-row">
            <button className="mmt-search-btn">CHECK STATUS</button>
          </div>
        </div>
      )}

      {/* Book Train panel */}
      {trainOption === "book" && (
        <>
          <div className="mmt-search-row">
            {/* FROM */}
            <div className={`mmt-field mmt-field-from ${activeDropdown === "from" ? "mmt-field-active" : ""}`}
              onClick={() => { setActiveDropdown(activeDropdown === "from" ? null : "from"); setSearchQuery(""); }}>
              <span className="mmt-field-label">From</span>
              <div className="mmt-city-name">{from}</div>
              <span className="mmt-airport-code">{fromCode}</span>
              {/* Swap - positioned at right edge of From */}
              <button className="mmt-swap" onClick={(e) => { e.stopPropagation(); swapStations(); }}>
                <FaExchangeAlt />
              </button>
              {activeDropdown === "from" && <StationDropdown type="from" />}
            </div>

            {/* TO */}
            <div className={`mmt-field mmt-field-to ${activeDropdown === "to" ? "mmt-field-active" : ""}`}
              onClick={() => { setActiveDropdown(activeDropdown === "to" ? null : "to"); setSearchQuery(""); }}>
              <span className="mmt-field-label">To</span>
              <div className="mmt-city-name">{to}</div>
              <span className="mmt-airport-code">{toCode}</span>
              {activeDropdown === "to" && <StationDropdown type="to" />}
            </div>

            {/* TRAVEL DATE */}
            <div className="mmt-field mmt-field-date">
              <span className="mmt-field-label">Travel Date</span>
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
              <input type="date" className="mmt-date-hidden" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            {/* CLASS */}
            <div className="mmt-field train-class-field">
              <span className="mmt-field-label">Class</span>
              <div className="train-class-display">{trainClass}</div>
              <span className="mmt-airport-code">All Class</span>
              <select
                className="train-class-hidden"
                value={trainClass}
                onChange={(e) => setTrainClass(e.target.value)}
              >
                <option>All</option>
                <option>Sleeper (SL)</option>
                <option>3rd AC (3A)</option>
                <option>2nd AC (2A)</option>
                <option>1st AC (1A)</option>
                <option>Chair Car (CC)</option>
                <option>2nd Seating (2S)</option>
              </select>
            </div>
          </div>

          <div className="mmt-search-btn-row">
            <button className="mmt-search-btn">SEARCH</button>
          </div>
        </>
      )}
    </div>
  );
}