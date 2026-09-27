"use client"
import { useState } from "react"
import { Period } from "@/lib/dashboard-data"

interface DashboardTopbarProps {
  userName?: string
  weekLabel?: string
}

export function DashboardTopbar({ userName = "Taretan Aditya", weekLabel = "Semana de 15–21 Mar 2025" }: DashboardTopbarProps) {
  const [period, setPeriod] = useState<Period>("semana")

  return (
    <div className="dash-topbar">
      <div>
        <h1 className="dash-title">Olá, {userName}! 👋</h1>
        <p className="dash-subtitle">Resumo do seu restaurante · {weekLabel}</p>
      </div>
      <div className="dash-filters">
        {(["hoje", "semana", "mes"] as Period[]).map(p => (
          <button key={p} className={`dash-period-btn ${period === p ? "active" : ""}`} onClick={() => setPeriod(p)}>
            {p === "hoje" ? "Hoje" : p === "semana" ? "Esta semana" : "Este mês"}
          </button>
        ))}
        <button className="dash-filter-btn">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          Período
        </button>
        <button className="dash-export-btn">
          <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
          Exportar
        </button>
      </div>
    </div>
  )
}
