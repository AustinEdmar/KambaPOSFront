"use client"

import { ClipboardList, Clock, CheckCircle2, RotateCcw, Wallet } from "lucide-react"
import { OrderStats, formatCurrency } from "@/lib/orders-data"

interface OrdersStatsProps {
    stats: OrderStats
}

export function OrdersStats({ stats }: OrdersStatsProps) {
    const cards = [
        {
            label: "Total de pedidos",
            value: String(stats.total_orders),
            icon: ClipboardList,
            accent: "#3554C1",
            accentBg: "rgba(53, 84, 193, 0.09)",
        },
        {
            label: "Abertos",
            value: String(stats.open_orders),
            icon: Clock,
            accent: "#7657C8",
            accentBg: "#F0ECFF",
        },
        {
            label: "Fechados",
            value: String(stats.closed_orders),
            icon: CheckCircle2,
            accent: "#0D9668",
            accentBg: "#E4F9F2",
        },
        {
            label: "Reembolsados",
            value: String(stats.refunded_orders),
            icon: RotateCcw,
            accent: "#E14356",
            accentBg: "#FDEDEE",
        },
        {
            label: "Receita (fechados)",
            value: formatCurrency(stats.total_revenue),
            icon: Wallet,
            accent: "#159B85",
            accentBg: "rgba(61, 219, 191, 0.14)",
        },
    ]

    return (
        <div className="order-stat-grid">
            {cards.map((card) => {
                const Icon = card.icon
                return (
                    <div
                        className="order-stat-card"
                        key={card.label}
                        style={{ "--accent": card.accent, "--accent-bg": card.accentBg } as React.CSSProperties}
                    >
                        <div className="order-stat-icon">
                            <Icon size={15} />
                        </div>

                        <div className="order-stat-text">
                            <span className="order-stat-value" title={card.value}>{card.value}</span>
                            <span className="order-stat-label">{card.label}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}