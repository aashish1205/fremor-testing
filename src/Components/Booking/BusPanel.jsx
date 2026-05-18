export default function BusPanel() {
  return (
    <div className="search-grid hotel">
      <input placeholder="From City" />
      <input placeholder="To City" />
      <input type="date" />
      <button className="search-btn-inner">SEARCH BUSES</button>
    </div>
  );
}