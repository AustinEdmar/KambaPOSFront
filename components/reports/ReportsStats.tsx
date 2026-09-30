"use client"

import { Receipt, TrendingUp, Percent, MinusCircle } from "lucide-react"
import { ReportSummary, formatCurrency } from "@/lib/reports-data"

interface ReportsStatsProps {
    summary: ReportSummary | null
}

export function ReportsStats({ summary }: ReportsStatsProps) {
    const cards = [
        {
            title: "Pedidos",
            value: summary?.orders_count ?? 0,
            icon: Receipt,
            iconClass: "products-stat-icon-blue",
        },
        {
            title: "Subtotal",
            value: formatCurrency(summary?.total_subtotal),
            icon: TrendingUp,
            iconClass: "products-stat-icon-purple",
        },
        {
            title: "IVA",
            value: formatCurrency(summary?.total_iva),
            icon: Percent,
            iconClass: "products-stat-icon-teal",
        },
        {
            title: "Desconto",
            value: formatCurrency(summary?.total_discount),
            icon: MinusCircle,
            iconClass: "products-stat-icon-red",
        },
        {
            title: "Total de vendas",
            value: formatCurrency(summary?.total_sales),
            icon: TrendingUp,
            iconClass: "products-stat-icon-green",
        },
    ]

    return (
        <div className="products-stats">
            {cards.map((card) => {
                const Icon = card.icon
                return (
                    <div className="stat-card" key={card.title}>
                        <div className="stat-header">
                            <span className="stat-label">{card.title}</span>
                            <div className={`stat-icon-wrap ${card.iconClass}`}>
                                <Icon size={19} />
                            </div>
                        </div>
                        <div className="stat-value">{card.value}</div>
                    </div>
                )
            })}
        </div>
    )
}