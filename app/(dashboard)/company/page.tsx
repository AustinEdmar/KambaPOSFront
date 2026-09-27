"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"

import { Company } from "@/lib/company-data"
import { CompanyDetails } from "@/components/company/CompanyDetails"
import { CompanyFormModal } from "@/components/company/CompanyFormModal"
import { SettingsSubNav, SettingsNavItem } from "@/components/settings/SettingsSubNav"

const SECTIONS: SettingsNavItem[] = [
    {
        id: "identification",
        label: "Identificação",
        icon: (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M7 9h10M7 13h6" />
            </svg>
        ),
    },
    {
        id: "contacts",
        label: "Contactos",
        icon: (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        ),
    },
    {
        id: "software",
        label: "Software",
        icon: (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="2" y="4" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 18v3" />
            </svg>
        ),
    },
    {
        id: "agt",
        label: "Configuração AGT",
        icon: (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
                <path d="M8.5 12l2.2 2.2L15.5 9.5" />
            </svg>
        ),
    },
]

export default function CompanyPage() {
    const [company, setCompany] = useState<Company | null>(null)
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [activeSection, setActiveSection] = useState<string>("identification")

    const fetchCompany = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await api.get("/company")
            const list: Company[] = Array.isArray(data?.data) ? data.data : []
            setCompany(list[0] ?? null)
        } catch (error: any) {
            setCompany(null)
            toast.error(
                error?.response?.data?.message ??
                "Não foi possível carregar os dados da empresa."
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchCompany() }, [fetchCompany])

    return (
        <div className="dash-root">
            <div className="settings-topbar">
                <div>
                    <h1 className="dash-title">Empresa</h1>
                    <p className="dash-subtitle">
                        Dados comerciais, fiscais e configuração AGT
                    </p>
                </div>

                <div className="settings-topbar-actions">
                    <button className="dash-btn-secondary" onClick={fetchCompany}>
                        Cancelar
                    </button>
                    <button className="dash-export-btn" onClick={() => setShowForm(true)}>
                        Editar
                    </button>
                </div>
            </div>

            <div className="settings-shell">
                <SettingsSubNav
                    title="Sub-secções"
                    items={SECTIONS}
                    activeId={activeSection}
                    onSelect={setActiveSection}
                />

                <div className="settings-content">
                    <CompanyDetails
                        company={company}
                        loading={loading}
                        section={activeSection as any}
                    />
                </div>
            </div>

            {showForm && company && (
                <CompanyFormModal
                    company={company}
                    onClose={() => setShowForm(false)}
                    onSaved={() => {
                        setShowForm(false)
                        fetchCompany()
                    }}
                />
            )}
        </div>
    )
}