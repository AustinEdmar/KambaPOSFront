"use client"

const CATEGORIES = [
  { label: "Pratos Principais", pct: "60%", color: "#3554C1" },
  { label: "Bebidas", pct: "25%", color: "#8B5CF6" },
  { label: "Sobremesas", pct: "15%", color: "#10B981" },
]

export function CategoryBreakdown() {
  return (
    <div className="dash-card cat-card">
      <div className="card-head"><h2 className="card-title">Categorias</h2></div>
      <div className="cat-donut-wrap">
        <svg viewBox="0 0 120 120" width="120" height="120">
          <circle cx="60" cy="60" r="48" fill="none" stroke="#F5F4F0" strokeWidth="20" />
          <circle cx="60" cy="60" r="48" fill="none" stroke="#3554C1" strokeWidth="20" strokeDasharray="180 301.59" strokeLinecap="round" transform="rotate(-90 60 60)" />
          <circle cx="60" cy="60" r="48" fill="none" stroke="#8B5CF6" strokeWidth="20" strokeDasharray="75 301.59" strokeDashoffset="-180" strokeLinecap="round" transform="rotate(-90 60 60)" />
          <circle cx="60" cy="60" r="48" fill="none" stroke="#10B981" strokeWidth="20" strokeDasharray="46 301.59" strokeDashoffset="-255" strokeLinecap="round" transform="rotate(-90 60 60)" />
        </svg>
        <div className="cat-center">
          <div className="cat-total-label">Total</div>
          <div className="cat-total-val">$1.234</div>
        </div>
      </div>
      <div className="cat-legend">
        {CATEGORIES.map((c, i) => (
          <div key={i} className="cat-legend-row">
            <span className="cat-legend-dot" style={{ background: c.color }} />
            <span className="cat-legend-label">{c.label}</span>
            <span className="cat-legend-pct" style={{ color: c.color }}>{c.pct}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
