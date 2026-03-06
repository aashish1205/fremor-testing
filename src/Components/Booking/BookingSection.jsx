import { useState } from "react";
import ServiceTabs from "./ServiceTabs";
import FlightPanel from "./FlightPanel";
import HotelPanel from "./HotelPanel";
import TrainPanel from "./TrainPanel";
import BusPanel from "./BusPanel";
import CabPanel from "./CabPanel";
import "./booking.css";

export default function Booking() {
  const [service, setService] = useState("flights");

  const renderPanel = () => {
    switch (service) {
      case "flights":
        return <FlightPanel />;
      case "hotels":
        return <HotelPanel />;
      case "trains":
        return <TrainPanel />;
      case "buses":
        return <BusPanel />;
      case "cabs":
        return <CabPanel />;
      default:
        return <FlightPanel />;
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-card">
        <ServiceTabs service={service} setService={setService} />
        {renderPanel()}
      </div>
    </div>
  );
}