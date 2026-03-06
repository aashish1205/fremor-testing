import { useState } from "react";
import { FaExchangeAlt, FaTrain } from "react-icons/fa";
import "./TrainPanel.css";

export default function TrainPanel() {
  const [from, setFrom] = useState("Mumbai");
  const [to, setTo] = useState("Delhi");
  const [date, setDate] = useState("");

  const swapStations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div className="train-panel">
      <div className="train-search-wrapper">

        {/* From */}
        <div className="train-location">
          <label className="label">From</label>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="station-input"
          />
        </div>

        {/* Swap Button */}
        <button className="train-swap-btn" onClick={swapStations}>
          <FaExchangeAlt />
        </button>

        {/* To */}
        <div className="train-location">
          <label className="label">To</label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="station-input"
          />
        </div>

        {/* Date */}
        <div className="train-date">
          <label className="label">Departure</label>
          <input
            type="date"
            className="date-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Class */}
        <div className="train-class">
          <label className="label">Class</label>
          <select className="class-select">
            <option>All</option>
            <option>Sleeper</option>
            <option>3AC</option>
            <option>2AC</option>
            <option>1AC</option>
            <option>Chair Car</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div className="train-search-btn">
        <button className="search-train">
          <FaTrain /> Search Trains
        </button>
      </div>
    </div>
  );
}