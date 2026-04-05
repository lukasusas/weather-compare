export default function LoadingState() {
  return (
    <div>
      {[1, 2, 3].map((day) => (
        <div key={day} className="day-section">
          <div className="skeleton-line" style={{ height: '28px', width: '140px', marginBottom: '1rem' }}></div>
          <div className="loading-grid">
            {[1, 2, 3, 4].map((card) => (
              <div key={card} className="skeleton-card">
                <div className="skeleton-line" style={{ height: '12px', width: '80px' }}></div>
                <div className="skeleton-line" style={{ height: '56px', width: '100px' }}></div>
                <div className="skeleton-line" style={{ height: '80px' }}></div>
                <div className="skeleton-line" style={{ height: '12px' }}></div>
                <div className="skeleton-line" style={{ height: '12px' }}></div>
                <div className="skeleton-line" style={{ height: '12px', width: '60%' }}></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
