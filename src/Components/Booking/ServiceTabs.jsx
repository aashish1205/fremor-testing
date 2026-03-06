import {
  FaPlane,
  FaHotel,
  FaTrain,
  FaBus,
  FaTaxi,
  FaUmbrellaBeach
} from "react-icons/fa";

import "./ServiceTabs.css";

const tabs = [
  { id: "flights", label: "Flights", icon: <FaPlane /> },
  { id: "trains", label: "Trains", icon: <FaTrain /> },
  { id: "buses", label: "Buses", icon: <FaBus /> },
  { id: "cabs", label: "Cabs", icon: <FaTaxi /> },
  { id: "hotels", label: "Hotels", icon: <FaHotel /> },
  { id: "villas", label: "Villas", icon: <FaUmbrellaBeach /> },
  { id: "packages", label: "Packages", icon: <FaUmbrellaBeach /> },
  
  
  
];

export default function ServiceTabs({ service, setService }) {
  return (
    <div className="services-wrapper">
      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${service === tab.id ? "active" : ""}`}
            onClick={() => setService(tab.id)}
          >
            <div className="icon">{tab.icon}</div>
            <span>{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}