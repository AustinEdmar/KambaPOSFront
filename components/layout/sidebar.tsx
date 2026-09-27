"use client"
import Link from 'next/link'
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { clearSessionTimeout } from '@/lib/axios'
import { useAuthStore } from '@/stores/auth'

const NAV_GROUPS = [
    {
        label: "Principal",
        items: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>,
            },
            {
                label: "Vendas",
                href: "/orders",
                badge: "3",
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
            },
            {
                label: "Categorias",
                href: "/categories",
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>,
            },
            {
                label: "Produtos",
                href: "/products",
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>,
            },
            {
                label: "Movimentacoes",
                href: "/movements",
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 10h18M7 15h2m4 0h2M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>,
            },
            {
                label: "Inventário",
                href: "/inventory",
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 10h18M7 15h2m4 0h2M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>,
            },
            {
                label: "Turnos",
                href: "/shifts",
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 10h18M7 15h2m4 0h2M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>,
            },
        ],
    },
    {
        label: "Análise",
        items: [
            /*  {
                 label: "Relatórios",
                 href: "/reports",
                 icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 17V11M12 17V7M15 17v-4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>,
             }, */
            {
                label: "Funcionários",
                href: "/users",
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
            },
            {
                label: "Níveis de Acesso",
                href: "/accesslevel",
                icon: (
                    <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
                        <path d="M8.5 12l2.2 2.2L15.5 9.5" />
                    </svg>
                ),
            },
            {
                label: "Taxas de IVA",
                href: "/taxrates",
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
            },
        ],
    },
    {
        label: "Sistema",
        items: [

            {
                label: "Configurações",
                href: "/company",
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
            },


            {
                label: "Ajuda",
                href: "/help",
                icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" /></svg>,
            },
        ],
    },
]

interface SidebarProps {
    storeName?: string
    storeType?: string
    storeInitial?: string
    userName?: string
    userRole?: string
    userInitials?: string
}

export function Sidebar({
    storeName = "Asean Magic",
    storeType = "Restaurante Asiático",
    storeInitial = "A",
    userName = "Taretan Aditya",
    userRole = "Administrador",
    userInitials = "TA",
}: SidebarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const { logout } = useAuthStore()

    const handleLogout = async () => {
        try {
            setIsLoading(true)
            logout()
            clearSessionTimeout()
            router.push('/login')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/')

    return (
        <aside className={`pos-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>

            {/* Logo */}
            <div className={`pos-logo ${sidebarOpen ? '' : 'collapsed'}`}>
                <div className="pos-logo-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M3 7h18M3 12h18M3 17h12" />
                    </svg>
                </div>
                {sidebarOpen && (
                    <div>
                        <div className="pos-brand">Kamba<span>POS</span></div>
                        <div className="pos-brand-sub">Point of Sale</div>
                    </div>
                )}
            </div>

            {/* Store */}
            {sidebarOpen && (
                <div className="pos-store-pill">
                    <div className="pos-store-icon">{storeInitial}</div>
                    <div className="pos-store-info">
                        <div className="pos-store-name">{storeName}</div>
                        <div className="pos-store-type">{storeType}</div>
                    </div>
                    <svg width="12" height="12" fill="none" stroke="#78716C" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
                </div>
            )}

            {/* Nav */}
            <nav className="pos-nav">
                {NAV_GROUPS.map((group) => (
                    <div key={group.label} className="pos-nav-group">
                        {sidebarOpen && <div className="pos-nav-label">{group.label}</div>}
                        {!sidebarOpen && <div className="pos-nav-sep" />}
                        {group.items.map((item) => {
                            const active = isActive(item.href)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    title={!sidebarOpen ? item.label : undefined}
                                    className={`pos-nav-item ${active ? 'active' : ''} ${!sidebarOpen ? 'icon-only' : ''}`}
                                >
                                    <span className="pos-nav-icon">{item.icon}</span>
                                    {sidebarOpen && <span className="pos-nav-text">{item.label}</span>}
                                    {sidebarOpen && item.badge && (
                                        <span className={`pos-badge ${active ? 'active' : ''}`}>{item.badge}</span>
                                    )}
                                    {!sidebarOpen && (
                                        <span className="pos-tooltip">{item.label}</span>
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                ))}
            </nav>

            {/* User */}
            <div className="pos-user">
                {sidebarOpen ? (
                    <div className="pos-user-row">
                        <div className="pos-avatar">{userInitials}</div>
                        <div className="pos-user-info">
                            <div className="pos-user-name">{userName}</div>
                            <div className="pos-user-role">{userRole}</div>
                        </div>
                        <button className="pos-logout" onClick={handleLogout} disabled={isLoading} title="Sair">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                        </button>
                    </div>
                ) : (
                    <button className="pos-logout-icon" onClick={handleLogout} disabled={isLoading} title="Sair">
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                    </button>
                )}
            </div>

            {/* Toggle */}
            <button className="pos-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                    style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.25s' }}>
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>
        </aside>
    )
}
