"use client"

import { CashMovementType } from "@/lib/cash-movements-data"

interface CashMovementsToolbarProps {
    search: string
    type: CashMovementType | ""
    onSearchChange: (value: string) => void
    onTypeChange: (value: CashMovementType | "") => void
    onNewInflow: () => void
    onNewOutflow: () => void
}

export function CashMovementsToolbar({
    search,
    type,
    onSearchChange,
    onTypeChange,
    onNewInflow,
    onNewOutflow,
}: CashMovementsToolbarProps) {
    return (
        <div className="dash-topbar">
            <div>
                <h1 className="dash-title">Movimentos de Caixa</h1>
                <p className="dash-subtitle">Reforços e sangrias do turno atual</p>
            </div>

            <div className="dash-filters">
                <div className="dash-search">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Pesquisar por motivo ou funcionário…"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <button
                    className={`dash-filter-btn ${type === "" ? "active" : ""}`}
                    onClick={() => onTypeChange("")}
                >
                    Todos
                </button>
                <button
                    className={`dash-filter-btn ${type === "inflow" ? "active" : ""}`}
                    onClick={() => onTypeChange("inflow")}
                >
                    Reforços
                </button>
                <button
                    className={`dash-filter-btn ${type === "outflow" ? "active" : ""}`}
                    onClick={() => onTypeChange("outflow")}
                >
                    Sangrias
                </button>

                <button className="dash-export-btn" onClick={onNewInflow}>
                    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Reforço
                </button>

                <button
                    className="dash-export-btn"
                    style={{ background: "#E14356" }}
                    onClick={onNewOutflow}
                >
                    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Sangria
                </button>
            </div>
        </div>
    )
}