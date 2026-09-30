"use client"

import { FileText, Wallet, Percent, MinusCircle } from "lucide-react"
import { InvoiceTotals, formatCurrency } from "@/lib/invoices-data"

interface InvoicesStatsProps {
    totals: InvoiceTotals | null
}

export function InvoicesStats({ totals }: InvoicesStatsProps) {
    const cards = [
        {
            title: "Total de facturas",
            value: totals?.total_invoices ?? 0,
            icon: FileText,
            iconClass: "products-stat-icon-blue",
        },
        {
            title: "Receita total",
            value: formatCurrency(totals?.total_revenue),
            icon: Wallet,
            iconClass: "products-stat-icon-green",
        },
        {
            title: "IVA total",
            value: formatCurrency(totals?.total_iva),
            icon: Percent,
            iconClass: "products-stat-icon-teal",
        },
        {
            title: "Descontos",
            value: formatCurrency(totals?.total_discount),
            icon: MinusCircle,
            iconClass: "products-stat-icon-red",
        },
    ]

    return (
        <div className="products-stats" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
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