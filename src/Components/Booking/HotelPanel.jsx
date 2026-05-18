export default function HotelPanel() {
  return (
    <div className="search-grid hotel">
      <input placeholder="City / Hotel" />
      <input type="date" />
      <input type="date" />
      <button className="search-btn-inner">SEARCH HOTELS</button>
    </div>
  );
}