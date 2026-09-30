
"use client"

import {
    ArrowDownCircle,
    ArrowUpCircle,
    RefreshCcw,
    AlertTriangle,
    ListTree,
} from "lucide-react"

import { StockMovementStats } from "@/lib/stock-movements-data"

interface MovementsStatsProps {
    stats: StockMovementStats
}

export function MovementsStats({ stats }: MovementsStatsProps) {
    const cards = [
        {
            title: "Total de movimentos",
            value: stats.total,
            icon: ListTree,
            iconClass: "products-stat-icon-blue",
        },
        {
            title: "Entradas (página)",
            value: stats.inbound,
            icon: ArrowUpCircle,
            iconClass: "products-stat-icon-green",
        },
        {
            title: "Saídas (página)",
            value: stats.outbound,
            icon: ArrowDownCircle,
            iconClass: "products-stat-icon-red",
        },
        {
            title: "Ajustes (página)",
            value: stats.adjustments,
            icon: RefreshCcw,
            iconClass: "products-stat-icon-purple",
        },
        {
            title: "Quebras (página)",
            value: stats.losses,
            icon: AlertTriangle,
            iconClass: "products-stat-icon-teal",
        },
    ]

    return (
        <div className="products-stats">
            {cards.map((card) => {
                const Icon = card.icon

                return (
                    <div
                        className="stat-card"
                        key={card.title}
                    >
                        <div className="stat-header">
                            <span className="stat-label">
                                {card.title}
                            </span>

                            <div
                                className={`stat-icon-wrap ${card.iconClass}`}
                            >
                                <Icon size={19} />
                            </div>
                        </div>

                        <div className="stat-value">
                            {card.value}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
