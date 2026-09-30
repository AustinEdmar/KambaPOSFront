"use client"

import { StockMovementType } from "@/lib/stock-movements-data"

interface MovementsToolbarProps {
    search: string
    type: StockMovementType | ""
    onSearchChange: (value: string) => void
    onTypeChange: (value: StockMovementType | "") => void
}

const TYPE_FILTERS: { value: StockMovementType | ""; label: string }[] = [
    { value: "", label: "Todos" },
    { value: "sale", label: "Vendas" },
    { value: "purchase", label: "Entradas" },
    { value: "adjustment", label: "Ajustes" },
    { value: "loss", label: "Quebras" },
    { value: "refund", label: "Reembolsos" },
]

export function MovementsToolbar({
    search,
    type,
    onSearchChange,
    onTypeChange,
}: MovementsToolbarProps) {
    return (
        <div className="dash-topbar">
            <div>
                <h1 className="dash-title">Movimentações</h1>
                <p className="dash-subtitle">Histórico de entradas e saídas de stock</p>
            </div>

            <div className="dash-filters">
                <div className="dash-search">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Pesquisar por produto, funcionário ou nota…"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {TYPE_FILTERS.map((f) => (
                    <button
                        key={f.value}
                        className={`dash-filter-btn ${type === f.value ? "active" : ""}`}
                        onClick={() => onTypeChange(f.value)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
        </div>
    )
}