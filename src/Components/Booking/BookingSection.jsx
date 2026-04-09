import { useState } from "react";
import ServiceTabs from "./ServiceTabs";
import FlightPanel from "./FlightPanel";
import TrainPanel from "./TrainPanel";
import PackagePanel from "./PackagePanel";
import "./booking.css";

export default function Booking() {
  const [service, setService] = useState("flights");

  const renderPanel = () => {
    switch (service) {
      case "flights":
        return <FlightPanel />;
      case "trains":
        return <TrainPanel />;
      case "packages":
        return <PackagePanel />;
      default:
        return <FlightPanel />;
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-card">
        <ServiceTabs service={service} setService={setService} />
        <div className="panel-area">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
}