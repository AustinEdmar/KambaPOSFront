"use client"

import { Users, UserCheck, UserX, ShieldCheck } from "lucide-react"
import { UserStats } from "@/lib/users-data"

interface UsersStatsProps {
    stats: UserStats
}

export function UsersStats({ stats }: UsersStatsProps) {
    const cards = [
        {
            title: "Total de utilizadores",
            value: stats.total_users,
            icon: Users,
            iconClass: "dash-stat-icon-blue",
        },
        {
            title: "Ativos",
            value: stats.active_users,
            icon: UserCheck,
            iconClass: "dash-stat-icon-green",
        },
        {
            title: "Inativos",
            value: stats.inactive_users,
            icon: UserX,
            iconClass: "dash-stat-icon-red",
        },
        {
            title: "Administradores",
            value: stats.admin_users,
            icon: ShieldCheck,
            iconClass: "dash-stat-icon-purple",
        },
    ]

    return (
        <div className="dash-stat-grid">
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