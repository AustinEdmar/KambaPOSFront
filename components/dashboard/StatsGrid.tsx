"use client"
import { STATS } from "@/lib/dashboard-data"

export function StatsGrid() {
  return (
    <div className="dash-stats">
      {STATS.map((s, i) => (
        <div key={i} className="stat-card">
          <div className="stat-header">
            <span className="stat-label">{s.label}</span>
            <span className="stat-icon-wrap" style={{ background: s.bg, color: s.color }}>{s.icon}</span>
          </div>
          <div className="stat-value">{s.value}</div>
          <div className="stat-footer">
            <span className={`stat-change ${s.up ? "up" : "down"}`}>
              {s.up
                ? <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
                : <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>}
              {s.change}
            </span>
            <span className="stat-period">vs semana anterior</span>
          </div>
        </div>
      ))}
    </div>
  )
}
