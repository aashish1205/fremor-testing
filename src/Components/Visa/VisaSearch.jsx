import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./VisaSearch.css";

export default function VisaSearch() {
  const [countries, setCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [search, setSearch] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarSelectingField, setCalendarSelectingField] = useState("departure"); // "departure" | "return"
  const [calendarBaseMonth, setCalendarBaseMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });
  const dropdownRef = useRef();
  const calendarRef = useRef();
  const navigate = useNavigate();

  // Fetch countries API
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data
          .map((c) => ({
            name: c.name.common,
            flag: c.flags.png,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(formatted);
      });
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Calendar helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 0).getDay();

  const getNextMonth = (year, month) => {
    if (month === 11) return { year: year + 1, month: 0 };
    return { year, month: month + 1 };
  };

  const getPrevMonth = (year, month) => {
    if (month === 0) return { year: year - 1, month: 11 };
    return { year, month: month - 1 };
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
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

  const handleDateClick = useCallback((day, month, year) => {
    const clicked = new Date(year, month, day);
    if (isBeforeToday(clicked)) return;

    if (calendarSelectingField === "departure") {
      setDepartureDate(clicked);
      // If return date exists and is before the new departure, reset it
      if (returnDate && clicked >= returnDate) {
        setReturnDate(null);
      }
      setCalendarSelectingField("return");
    } else {
      // Selecting return date
      if (departureDate && clicked <= departureDate) {
        // If clicked date is before departure, set it as new departure
        setDepartureDate(clicked);
        setReturnDate(null);
        setCalendarSelectingField("return");
      } else {
        setReturnDate(clicked);
        setShowCalendar(false);
        setCalendarSelectingField("departure");
      }
    }
  }, [calendarSelectingField, departureDate, returnDate]);

  const handlePrevMonth = () => {
    const prev = getPrevMonth(calendarBaseMonth.year, calendarBaseMonth.month);
    const now = new Date();
    // Don't allow going before current month
    if (prev.year > now.getFullYear() || 
        (prev.year === now.getFullYear() && prev.month >= now.getMonth())) {
      setCalendarBaseMonth(prev);
    }
  };

  const handleNextMonth = () => {
    const next = getNextMonth(calendarBaseMonth.year, calendarBaseMonth.month);
    setCalendarBaseMonth(next);
  };

  const openCalendar = (field) => {
    setCalendarSelectingField(field);
    setShowCalendar(true);
  };

  const formatDisplayDate = (date) => {
    if (!date) return "Select Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calculate max visa duration in days
  const getVisaDuration = () => {
    if (departureDate && returnDate) {
      const diff = Math.ceil((returnDate - departureDate) / (1000 * 60 * 60 * 24));
      return diff;
    }
    return null;
  };

  const renderMonthGrid = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const rows = [];
    let cells = [];

    // Previous month's trailing days
    const prevMonthInfo = getPrevMonth(year, month);
    const prevDays = getDaysInMonth(prevMonthInfo.year, prevMonthInfo.month);
    for (let i = firstDay; i > 0; i--) {
      cells.push(
        <td key={`prev-${i}`} className="cal-day cal-day-other">
          {prevDays - i + 1}
        </td>
      );
    }

    // Current month's days
    for (let d = 1; d <= daysInMonth; d++) {
      const thisDate = new Date(year, month, d);
      const isDisabled = isBeforeToday(thisDate);
      const isStart = isSameDay(thisDate, departureDate);
      const isEnd = isSameDay(thisDate, returnDate);
      const inRange = isInRange(thisDate);

      let className = "cal-day";
      if (isDisabled) className += " cal-day-disabled";
      if (isStart) className += " cal-day-start";
      if (isEnd) className += " cal-day-end";
      if (inRange) className += " cal-day-range";
      if (isStart || isEnd) className += " cal-day-selected";

      cells.push(
        <td
          key={`d-${d}`}
          className={className}
          onClick={() => !isDisabled && handleDateClick(d, month, year)}
        >
          <span>{d}</span>
        </td>
      );

      if ((firstDay + d) % 7 === 0 || d === daysInMonth) {
        // Fill remaining cells in the last row
        if (d === daysInMonth) {
          const remaining = 7 - cells.length;
          const nextMonthInfo = getNextMonth(year, month);
          for (let i = 1; i <= remaining; i++) {
            cells.push(
              <td key={`next-${i}`} className="cal-day cal-day-other">
                {i}
              </td>
            );
          }
        }
        rows.push(<tr key={`row-${rows.length}`}>{cells}</tr>);
        cells = [];
      }
    }

    return rows;
  };

  const secondMonth = getNextMonth(calendarBaseMonth.year, calendarBaseMonth.month);

  return (
    <div className="visa-search-wrapper">
      <div className="title-area text-center">
        <span className="sub-title">Apply for a Visa</span>
        <h2 className="sec-title">On Time, Powered by Experts</h2>
      </div>

      <div className="visa-search-box">
        {/* Destination */}
        <div className="search-item destination" ref={dropdownRef}>
          <label>SELECT DESTINATION</label>
          <div
            className="field-value"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedCountry ? (
              <span className="selected-country-display">
                <img src={selectedCountry.flag} alt="" className="selected-flag" />
                {selectedCountry.name}
              </span>
            ) : (
              "Where are you going?"
            )}
          </div>

          {showDropdown && (
            <div className="country-dropdown animated">
              <input
                type="text"
                placeholder="Search Country"
                className="country-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <div className="country-list">
                {filteredCountries.slice(0, 80).map((country, index) => (
                  <div
                    key={index}
                    className="country-item"
                    onClick={() => {
                      setSelectedCountry(country);
                      setShowDropdown(false);
                      setSearch("");
                    }}
                  >
                    <div className="country-left">
                      <img src={country.flag} alt="" />
                      <strong>{country.name}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Departure Date */}
        <div className="search-item" onClick={() => openCalendar("departure")}>
          <label>DATE OF DEPARTURE</label>
          <div className={`field-value ${departureDate ? "has-date" : ""}`}>
            {formatDisplayDate(departureDate)}
          </div>
        </div>

        {/* Return Date */}
        <div className="search-item" onClick={() => openCalendar("return")}>
          <label>DATE OF RETURN</label>
          <div className={`field-value ${returnDate ? "has-date" : ""}`}>
            {formatDisplayDate(returnDate)}
          </div>
        </div>
      </div>

      {/* Dual Month Calendar Popup */}
      {showCalendar && (
        <div className="cal-overlay" ref={calendarRef}>
          <div className="cal-popup">
            {/* Header */}
            <div className="cal-header">
              <div className="cal-header-labels">
                <span className={`cal-header-label ${calendarSelectingField === "departure" ? "active" : ""}`}
                  onClick={() => setCalendarSelectingField("departure")}>
                  Select Departure Date
                </span>
                <span className="cal-header-sep">–</span>
                <span className={`cal-header-label ${calendarSelectingField === "return" ? "active" : ""}`}
                  onClick={() => setCalendarSelectingField("return")}>
                  Select Return Date
                </span>
              </div>
              {departureDate && (
                <div className="cal-duration-info">
                  You can opt for a visa with a duration of up to 60 days
                </div>
              )}
            </div>

            {/* Two Month Grids */}
            <div className="cal-months">
              {/* Left Month */}
              <div className="cal-month">
                <div className="cal-month-header">
                  <button className="cal-nav-btn" onClick={handlePrevMonth}>←</button>
                  <span className="cal-month-title">
                    {monthNames[calendarBaseMonth.month]} {calendarBaseMonth.year}
                  </span>
                </div>
                <table className="cal-table">
                  <thead>
                    <tr>
                      {dayNames.map((d, i) => (
                        <th key={i}>{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {renderMonthGrid(calendarBaseMonth.year, calendarBaseMonth.month)}
                  </tbody>
                </table>
              </div>

              {/* Right Month */}
              <div className="cal-month">
                <div className="cal-month-header">
                  <span className="cal-month-title">
                    {monthNames[secondMonth.month]} {secondMonth.year}
                  </span>
                  <button className="cal-nav-btn" onClick={handleNextMonth}>→</button>
                </div>
                <table className="cal-table">
                  <thead>
                    <tr>
                      {dayNames.map((d, i) => (
                        <th key={i}>{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {renderMonthGrid(secondMonth.year, secondMonth.month)}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            {departureDate && returnDate && (
              <div className="cal-footer">
                <span className="cal-selected-range">
                  {formatDisplayDate(departureDate)} — {formatDisplayDate(returnDate)}
                  &nbsp;({getVisaDuration()} days)
                </span>
                <button className="cal-apply-btn" onClick={() => setShowCalendar(false)}>
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Button - always visible */}
      <div className="visa-actions">
        <button className="visa-search-btn" onClick={() => {
          if (!selectedCountry) {
            alert("Please select a destination");
            return;
          }
          if (!departureDate || !returnDate) {
            alert("Please select departure and return dates");
            return;
          }
          const params = new URLSearchParams({
            country: selectedCountry.name,
            flag: selectedCountry.flag,
            departure: departureDate.toISOString(),
            return: returnDate.toISOString()
          });
          navigate(`/visa/detail?${params.toString()}`);
        }}>SEARCH</button>
      </div>
    </div>
  );
}