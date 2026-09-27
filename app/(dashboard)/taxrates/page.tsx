"use client"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { TaxRatesTable } from "@/components/tax-rates/TaxRatesTable"
import { TaxRateFormModal } from "@/components/tax-rates/TaxRateFormModal"
import { DeleteTaxRateModal } from "@/components/tax-rates/DeleteTaxRateModal"
import { TaxRate } from "@/lib/tax-rates-data"

export default function TaxRates() {
    const [taxRates, setTaxRates] = useState<TaxRate[]>([])
    const [loading, setLoading] = useState(true)
    const [showInactive, setShowInactive] = useState(true)

    // formTaxRate: undefined = modal fechado, null = criar, TaxRate = editar
    const [formTaxRate, setFormTaxRate] = useState<TaxRate | null | undefined>(undefined)
    const [deleteTaxRate, setDeleteTaxRate] = useState<TaxRate | null>(null)

    const fetchTaxRates = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await api.get("/tax-rates", { params: { all: 1 } })
            const list: TaxRate[] = Array.isArray(data) ? data : data?.data ?? []
            setTaxRates(list)
        } catch {
            setTaxRates([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchTaxRates() }, [fetchTaxRates])

    const visibleTaxRates = showInactive ? taxRates : taxRates.filter(t => t.is_active)

    const handleToggleActive = async (t: TaxRate) => {
        try {
            await api.patch(`/tax-rates/${t.id}/toggle-active`)
            fetchTaxRates()
        } catch (error: any) {
            toast.error(error?.response?.data?.message ?? "Erro ao alterar estado da taxa.")
        }
    }

    return (
        <div className="dash-root">
            <div className="dash-topbar">
                <div>
                    <h1 className="dash-title">Taxas de IVA</h1>
                    <p className="dash-subtitle">Códigos, percentagens e isenções usados nos produtos</p>
                </div>
            </div>

            <TaxRatesTable
                taxRates={visibleTaxRates}
                loading={loading}
                showInactive={showInactive}
                onShowInactiveChange={setShowInactive}
                onNew={() => setFormTaxRate(null)}
                onEdit={setFormTaxRate}
                onToggleActive={handleToggleActive}
                onDelete={setDeleteTaxRate}
            />

            {formTaxRate !== undefined && (
                <TaxRateFormModal
                    taxRate={formTaxRate}
                    onClose={() => setFormTaxRate(undefined)}
                    onSaved={() => { setFormTaxRate(undefined); fetchTaxRates() }}
                />
            )}

            {deleteTaxRate && (
                <DeleteTaxRateModal
                    taxRate={deleteTaxRate}
                    onClose={() => setDeleteTaxRate(null)}
                    onDeleted={() => { setDeleteTaxRate(null); fetchTaxRates() }}
                />
            )}
        </div>
    )
}