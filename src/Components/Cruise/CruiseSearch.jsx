import React, { useState } from "react";
import Select from "react-select";
import ReactCountryFlag from "react-country-flag";
import "./cruiseSearch.css";

function CruiseSearch() {
  const [destination, setDestination] = useState(null);
  const [month, setMonth] = useState(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const countries = [
    { value: "US", label: "United States", code: "US" },
    { value: "AE", label: "Dubai", code: "AE" },
    { value: "MV", label: "Maldives", code: "MV" },
    { value: "BS", label: "Bahamas", code: "BS" },
    { value: "IT", label: "Italy", code: "IT" },
    { value: "FR", label: "France", code: "FR" },
    { value: "IN", label: "India", code: "IN" },
    { value: "SG", label: "Singapore", code: "SG" },
  ];

  const countryOptions = countries.map((c) => ({
    value: c.value,
    label: (
      <div className="country-option">
        <ReactCountryFlag svg countryCode={c.code} />
        {c.label}
      </div>
    ),
  }));

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1];

  const months = [
    "Jan","Feb","Mar","Apr",
    "May","Jun","Jul","Aug",
    "Sep","Oct","Nov","Dec",
  ];

  const handleSearch = () => {
    console.log("Destination:", destination);
    console.log("Month:", month);
  };

  return (
    <div className="cruise-search-wrapper">
      <div className="cruise-search-card">

        <div className="cruise-search-grid">

          {/* Destination */}
          <div className="cruise-field">
            <label>CRUISING TO</label>
           <Select
  options={countryOptions}
  placeholder="Select Destination"
  classNamePrefix="country-select"
  onChange={setDestination}
  menuPortalTarget={document.body}
  menuPosition="fixed"
  styles={{
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({
      ...base,
      width: "100%"
    })
  }}
/>
          </div>

          {/* Month Picker */}
          <div className="cruise-field month-field">
            <label>TRAVEL MONTH</label>

            <div
              className="month-input"
              onClick={() => setShowMonthPicker(!showMonthPicker)}
            >
              {month ? month : "Select Month"}
            </div>

            {showMonthPicker && (
              <div className="month-picker">
                {years.map((year) => (
                  <div key={year}>
                    <h4>{year}</h4>
                    <div className="months-grid">
                      {months.map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setMonth(`${m} ${year}`);
                            setShowMonthPicker(false);
                          }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <button className="cruise-search-btn" onClick={handleSearch}>
          SEARCH CRUISES
        </button>

      </div>
    </div>
  );
}

export default CruiseSearch;