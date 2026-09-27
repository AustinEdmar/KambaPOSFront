"use client"
import { POPULAR } from "@/lib/dashboard-data"

export function PopularMenu() {
  return (
    <div className="dash-card">
      <div className="card-head">
        <h2 className="card-title">Menu Popular</h2>
        <a href="/menu" className="card-link">Ver todos</a>
      </div>
      <div className="popular-list">
        <div className="popular-head-row"><span>Item</span><span>Qtd</span><span>Total</span><span>Trend</span></div>
        {POPULAR.map((m, i) => (
          <div key={i} className="popular-row">
            <div className="popular-name">
              <span className="popular-rank">#{i + 1}</span>
              <span className="popular-emoji">{m.emoji}</span>
              <span className="popular-label">{m.name}</span>
            </div>
            <span className="popular-qty">{m.qty}x</span>
            <span className="popular-total">{m.total}</span>
            <span className={`popular-trend ${m.trend >= 0 ? "up" : "down"}`}>{m.trend >= 0 ? "↑" : "↓"}{Math.abs(m.trend)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
