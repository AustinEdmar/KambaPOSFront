"use client"

import {
    Package,
    PackageCheck,
    Boxes,
    AlertTriangle,
    CircleDollarSign,
} from "lucide-react"

import {
    PaginatedProducts,
    formatCurrency,
} from "@/lib/products-data"

interface ProductsStatsProps {
    data: PaginatedProducts | null
}

export function ProductsStats({ data }: ProductsStatsProps) {
    const stats = data?.stats

    const cards = [
        {
            title: "Total de produtos",
            value: stats?.total_products ?? 0,
            icon: Package,
            iconClass: "products-stat-icon-blue",
        },
        {
            title: "Produtos ativos",
            value: stats?.active_products ?? 0,
            icon: PackageCheck,
            iconClass: "products-stat-icon-green",
        },
        {
            title: "Stock total",
            value: stats?.total_stock ?? 0,
            icon: Boxes,
            iconClass: "products-stat-icon-purple",
        },
        {
            title: "Stock baixo",
            value: stats?.low_stock_products ?? 0,
            icon: AlertTriangle,
            iconClass: "products-stat-icon-red",
        },
        {
            title: "Valor do stock",
            value: formatCurrency(stats?.stock_value ?? 0),
            icon: CircleDollarSign,
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