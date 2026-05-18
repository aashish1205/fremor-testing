import {
  FaPlane,
  FaTrain,
  FaSuitcaseRolling
} from "react-icons/fa";

import "./ServiceTabs.css";

const tabs = [
  { id: "flights", label: "Flights", icon: <FaPlane /> },
  { id: "trains", label: "Trains", icon: <FaTrain /> },
  { id: "packages", label: "Holiday Packages", icon: <FaSuitcaseRolling /> },
];

export default function ServiceTabs({ service, setService }) {
  return (
    <div className="mmt-tabs-wrapper">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`mmt-tab ${service === tab.id ? "active" : ""}`}
          onClick={() => setService(tab.id)}
        >
          <span className="mmt-tab-icon">{tab.icon}</span>
          <span className="mmt-tab-label">{tab.label}</span>
        </div>
      ))}
    </div>
  );
}