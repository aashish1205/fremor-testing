export default function CabPanel() {
  return (
    <div className="search-grid hotel">
      <input placeholder="Pickup Location" />
      <input placeholder="Drop Location" />
      <input type="date" />
      <button className="search-btn-inner">SEARCH CABS</button>
    </div>
  );
}