"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"

import { CashMovementsStats } from "@/components/cash-movements/CashMovementsStats"
import { CashMovementsToolbar } from "@/components/cash-movements/CashMovementsToolbar"
import { CashMovementsTable } from "@/components/cash-movements/CashMovementsTable"
import { CashMovementFormModal } from "@/components/cash-movements/CashMovementFormModal"

import {
    CashMovementsCurrent,
    CashMovementType,
    filterMovements,
} from "@/lib/cash-movements-data"

export default function CashMovementsPage() {
    const [data, setData] = useState<CashMovementsCurrent | null>(null)
    const [loading, setLoading] = useState(true)
    const [noShift, setNoShift] = useState(false)

    const [search, setSearch] = useState("")
    const [type, setType] = useState<CashMovementType | "">("")

    const [formType, setFormType] = useState<CashMovementType | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await api.get<CashMovementsCurrent>("/cash-movements/current")
            setData(data)
            setNoShift(false)
        } catch (error: any) {
            if (error?.response?.status === 404) {
                setData(null)
                setNoShift(true)
            } else {
                setData(null)
                toast.error(
                    error?.response?.data?.message ?? "Erro ao carregar movimentos de caixa."
                )
            }
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        const handler = () => fetchData()
        window.addEventListener("sale:completed", handler)
        return () => window.removeEventListener("sale:completed", handler)
    }, [fetchData])

    const movements = data?.movements ?? []
    const filteredMovements = useMemo(
        () => filterMovements(movements, search, type),
        [movements, search, type]
    )

    if (noShift && !loading) {
        return (
            <div className="dash-root">
                <div className="dash-card shift-empty-state">
                    <div className="shift-empty-icon">
                        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <circle cx="12" cy="12" r="2" />
                        </svg>
                    </div>
                    <div className="shift-empty-text">
                        <div className="card-title">Nenhum turno aberto</div>
                        <p className="tx-count">Abra o caixa para registar reforços e sangrias.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="dash-root">
            <CashMovementsStats data={data} />

            <CashMovementsToolbar
                search={search}
                type={type}
                onSearchChange={setSearch}
                onTypeChange={setType}
                onNewInflow={() => setFormType("inflow")}
                onNewOutflow={() => setFormType("outflow")}
            />

            <CashMovementsTable movements={filteredMovements} loading={loading} />

            {formType && (
                <CashMovementFormModal
                    type={formType}
                    onClose={() => setFormType(null)}
                    onSaved={() => {
                        setFormType(null)
                        fetchData()
                    }}
                />
            )}
        </div>
    )
}