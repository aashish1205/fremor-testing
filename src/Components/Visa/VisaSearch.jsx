import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./VisaSearch.css";

export default function VisaSearch() {
  const [countries, setCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [search, setSearch] = useState("");
  const [nationality, setNationality] = useState("India");
  const dropdownRef = useRef();

  // Fetch countries API
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data
          .map((c) => ({
            name: c.name.common,
            flag: c.flags.png,
            visaType: getVisaType(c.name.common),
            price: getVisaPrice(c.name.common),
            processing: getProcessingTime(c.name.common),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formatted);
      });
  }, []);

  // Example visa rules
  const getVisaType = (country) => {
    const eVisaCountries = [
      "Thailand",
      "Vietnam",
      "Indonesia",
      "Sri Lanka",
      "Turkey",
      "United Arab Emirates",
    ];
    return eVisaCountries.includes(country) ? "E-VISA" : "VISA REQUIRED";
  };

  const getVisaPrice = (country) => {
    const priceMap = {
      Thailand: "$50",
      Vietnam: "$45",
      Indonesia: "$35",
      Turkey: "$60",
      Australia: "$120",
      Canada: "$150",
    };
    return priceMap[country] || "$80";
  };

  const getProcessingTime = (country) => {
    const fast = ["Thailand", "Sri Lanka", "Vietnam"];
    return fast.includes(country) ? "2-3 Days" : "5-7 Days";
  };

  // Close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const checkEligibility = () => {
    if (!selectedCountry) {
      alert("Please select destination");
      return;
    }

    alert(
      `Visa Info for ${selectedCountry.name}
Nationality: ${nationality}
Visa Type: ${selectedCountry.visaType}
Processing Time: ${selectedCountry.processing}
Estimated Cost: ${selectedCountry.price}`
    );
  };

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
            {selectedCountry?.name || "Where are you going?"}
          </div>

          {showDropdown && (
            <div className="country-dropdown animated">
              <input
                type="text"
                placeholder="Search Country"
                className="country-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="country-list">
                {filteredCountries.slice(0, 80).map((country, index) => (
                  <div
                    key={index}
                    className="country-item"
                    onClick={() => {
                      setSelectedCountry(country);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="country-left">
                      <img src={country.flag} alt="" />
                      <div>
                        <strong>{country.name}</strong>
                        <p>Processing: {country.processing}</p>
                      </div>
                    </div>

                    <span className="visa-tag">{country.visaType}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Departure */}
        <div className="search-item">
          <label>DATE OF DEPARTURE</label>
          <DatePicker
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            placeholderText="Select Date"
            className="date-input"
          />
        </div>

        {/* Return */}
        <div className="search-item">
          <label>DATE OF RETURN</label>
          <DatePicker
            selected={returnDate}
            onChange={(date) => setReturnDate(date)}
            placeholderText="Select Date"
            className="date-input"
          />
        </div>
      </div>

      {/* Eligibility */}
      {selectedCountry && (
        <div className="visa-info">
          <img src={selectedCountry.flag} alt="" />
          <div>
            <h4>{selectedCountry.name}</h4>
            <p>Visa Type: {selectedCountry.visaType}</p>
            <p>Processing: {selectedCountry.processing}</p>
            <p>Estimated Cost: {selectedCountry.price}</p>
          </div>
        </div>
      )}

      <div className="visa-actions">
        

        <button className="visa-search-btn">SEARCH</button>
      </div>
    </div>
  );
}