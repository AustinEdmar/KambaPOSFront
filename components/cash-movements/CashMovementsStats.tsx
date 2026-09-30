"use client"

import { ArrowUpCircle, ArrowDownCircle, Scale } from "lucide-react"

import { CashMovementsCurrent, formatCurrency, toNumber } from "@/lib/cash-movements-data"

interface CashMovementsStatsProps {
    data: CashMovementsCurrent | null
}

export function CashMovementsStats({ data }: CashMovementsStatsProps) {
    const net = toNumber(data?.net)

    const cards = [
        {
            title: "Total de reforços",
            value: formatCurrency(data?.total_inflow),
            icon: ArrowUpCircle,
            iconClass: "products-stat-icon-green",
        },
        {
            title: "Total de sangrias",
            value: formatCurrency(data?.total_outflow),
            icon: ArrowDownCircle,
            iconClass: "products-stat-icon-red",
        },
        {
            title: "Saldo líquido",
            value: formatCurrency(data?.net),
            icon: Scale,
            iconClass: net < 0 ? "products-stat-icon-red" : "products-stat-icon-blue",
        },
    ]

    return (
        <div className="products-stats" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
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