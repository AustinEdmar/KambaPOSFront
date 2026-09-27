"use client"
import { useState } from "react"
import { CHART_DATA } from "@/lib/dashboard-data"

const MAX_V = Math.max(...CHART_DATA.map(d => d.value))

export function RevenueChart() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  return (
    <div className="dash-card chart-card">
      <div className="card-head">
        <div>
          <h2 className="card-title">Receita</h2>
          <div className="revenue-big">$9.431,42</div>
          <span className="revenue-tag">
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
            +5,6% vs semana anterior
          </span>
        </div>
        <div className="chart-legend">
          <span className="legend-dot primary" /><span className="legend-label">Receita</span>
        </div>
      </div>
      <div className="bar-chart-wrap">
        <div className="bar-y-labels">
          {["200k", "150k", "100k", "50k", "0"].map(l => <span key={l} className="bar-y-label">{l}</span>)}
        </div>
        <div className="bar-columns">
          {CHART_DATA.map((d, i) => {
            const pct = d.value / MAX_V
            const isActive = d.active || hoveredBar === i
            return (
              <div key={i} className="bar-col" onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                <div className="bar-tooltip-wrap">
                  {isActive && (
                    <div className="bar-tooltip">
                      <span className="bar-tooltip-date">{d.day}</span>
                      <span className="bar-tooltip-val">${(d.value / 1000).toFixed(1)}k</span>
                      {d.active && <span className="bar-tooltip-pct">+5.6%</span>}
                    </div>
                  )}
                </div>
                <div className={`bar-fill ${isActive ? "active" : ""}`} style={{ height: `${Math.max(pct * 140, 8)}px` }} />
                <span className={`bar-label ${isActive ? "active" : ""}`}>{d.day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
