"use client"

import { ReactNode } from "react"

export interface SettingsNavItem {
    id: string
    label: string
    icon: ReactNode
}

interface SettingsSubNavProps {
    title?: string
    items: SettingsNavItem[]
    activeId: string
    onSelect: (id: string) => void
}

export function SettingsSubNav({
    title = "Sub-secções",
    items,
    activeId,
    onSelect,
}: SettingsSubNavProps) {
    return (
        <nav className="settings-subnav">
            <div className="settings-subnav-title">{title}</div>

            {items.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    className={`settings-subnav-item ${activeId === item.id ? "active" : ""}`}
                    onClick={() => onSelect(item.id)}
                >
                    <span className="settings-subnav-icon">{item.icon}</span>
                    {item.label}
                </button>
            ))}
        </nav>
    )
}