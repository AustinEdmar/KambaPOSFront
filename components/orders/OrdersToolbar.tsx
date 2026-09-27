"use client"

import { OrderStatus } from "@/lib/orders-data"

interface OrdersToolbarProps {
    search: string
    status: OrderStatus | ""
    onSearchChange: (value: string) => void
    onStatusChange: (value: OrderStatus | "") => void
}

const STATUS_FILTERS: { value: OrderStatus | ""; label: string }[] = [
    { value: "", label: "Todos" },
    { value: "open", label: "Abertos" },
    { value: "closed", label: "Fechados" },
    { value: "refunded", label: "Reembolsados" },
    { value: "partial_refund", label: "Reemb. parcial" },
]

export function OrdersToolbar({
    search,
    status,
    onSearchChange,
    onStatusChange,
}: OrdersToolbarProps) {
    return (
        <div className="dash-topbar">
            <div>
                <h1 className="dash-title">Pedidos</h1>
                <p className="dash-subtitle">Histórico e acompanhamento de vendas</p>
            </div>

            <div className="dash-filters">
                <div className="dash-search">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Pesquisar por ID, funcionário ou produto…"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {STATUS_FILTERS.map((f) => (
                    <button
                        key={f.value}
                        className={`dash-filter-btn ${status === f.value ? "active" : ""}`}
                        onClick={() => onStatusChange(f.value)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
        </div>
    )
}