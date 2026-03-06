import { useState } from "react";
import "./FlightPanel.css";

export default function FlightPanel() {
  const [tripType, setTripType] = useState("oneway");

  const [fromCity, setFromCity] = useState("Mumbai");
  const [toCity, setToCity] = useState("Delhi");

  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [travellers, setTravellers] = useState(1);

  // Swap Cities
  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  return (
    <div className="flight-panel">
      {/* Trip Type */}
      <div className="trip-type">
        <button
          className={tripType === "oneway" ? "trip-btn active" : "trip-btn"}
          onClick={() => setTripType("oneway")}
        >
          One Way
        </button>

        <button
          className={tripType === "round" ? "trip-btn active" : "trip-btn"}
          onClick={() => setTripType("round")}
        >
          Round Trip
        </button>

        <button
          className={tripType === "multi" ? "trip-btn active" : "trip-btn"}
          onClick={() => setTripType("multi")}
        >
          Multi City
        </button>
      </div>

      {/* Search Layout */}
      <div className="search-wrapper">
        {/* From */}
        <div className="location from">
          <span className="label">From</span>
          <input
            className="city-input"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
          />
        </div>

        {/* Swap Button */}
        <div className="swap-btn" onClick={handleSwap}>
          ⇄
        </div>

        {/* To */}
        <div className="location to">
          <span className="label">To</span>
          <input
            className="city-input"
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
          />
        </div>

        {/* Departure */}
        <div className="date-box">
          <label>Departure</label>
          <input
            type="date"
            className="date-input"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>

        {/* Return Date */}
        {tripType === "round" && (
          <div className="date-box">
            <label>Return</label>
            <input
              type="date"
              className="date-input"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        )}

        {/* Travellers */}
        <div className="travellers">
          <label>Travellers</label>
          <select
            className="traveller-select"
            value={travellers}
            onChange={(e) => setTravellers(e.target.value)}
          >
            <option value="1">1 Traveller</option>
            <option value="2">2 Travellers</option>
            <option value="3">3 Travellers</option>
            <option value="4">4 Travellers</option>
            <option value="5">5 Travellers</option>
          </select>
        </div>
      </div>

      {/* Special Fares */}
      <div className="fares">
        <button className="fare active">Regular</button>
        <button className="fare">Student</button>
        <button className="fare">Senior Citizen</button>
        <button className="fare">Doctor & Nurses</button>
      </div>

      {/* Search Button */}
      <div className="search-btn">
        <button
          className="search-flight"
          onClick={() =>
            console.log({
              fromCity,
              toCity,
              departureDate,
              returnDate,
              travellers,
              tripType,
            })
          }
        >
          Search Flights
        </button>
      </div>
    </div>
  );
}