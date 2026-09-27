"use client"
import { FormEvent, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { TaxRate, TAX_CODES, TAX_CODE_LABELS } from "@/lib/tax-rates-data"

interface TaxRateFormModalProps {
  taxRate: TaxRate | null // null = criar nova
  onClose: () => void
  onSaved: () => void
}

export function TaxRateFormModal({ taxRate, onClose, onSaved }: TaxRateFormModalProps) {
  const isEdit = taxRate !== null

  const [taxCode, setTaxCode] = useState(taxRate?.tax_code ?? "NOR")
  const [description, setDescription] = useState(taxRate?.description ?? "")
  const [taxPercentage, setTaxPercentage] = useState(taxRate ? String(taxRate.tax_percentage) : "")
  const [country, setCountry] = useState(taxRate?.country ?? "AO")
  const [exemptionReason, setExemptionReason] = useState(taxRate?.exemption_reason ?? "")
  const [isActive, setIsActive] = useState(taxRate?.is_active ?? true)
  const [submitting, setSubmitting] = useState(false)

  const isExempt = taxCode === "ISE" || taxPercentage === "0"

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!description || taxPercentage === "") return

    setSubmitting(true)
    try {
      const payload = {
        tax_type: "IVA",
        tax_code: taxCode,
        description,
        tax_percentage: Number(taxPercentage),
        country: country || "AO",
        is_active: isActive,
        exemption_reason: exemptionReason || null,
      }

      if (isEdit && taxRate) {
        await api.put(`/tax-rates/${taxRate.id}`, payload)
        toast.success("Taxa atualizada")
      } else {
        await api.post("/tax-rates", payload)
        toast.success("Taxa criada")
      }
      onSaved()
    } catch (error: any) {
      const errors = error?.response?.data?.errors
      const firstError = errors ? Object.values(errors)[0] : null
      const message = Array.isArray(firstError) ? firstError[0] : error?.response?.data?.message ?? "Erro ao guardar taxa."
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-emoji">{isEdit ? "✏️" : "🆕"}</span>
            <div>
              <h3 className="modal-title">{isEdit ? "Editar Taxa" : "Nova Taxa de IVA"}</h3>
              <span className="modal-id">{isEdit ? `#${taxRate?.id}` : "Preenche os dados da taxa"}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="shift-form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="tax_code">Código (AGT)</label>
              <select id="tax_code" className="form-input" value={taxCode} onChange={e => setTaxCode(e.target.value)}>
                {TAX_CODES.map(code => (
                  <option key={code} value={code}>{code} · {TAX_CODE_LABELS[code]}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tax_percentage">Percentagem (%)</label>
              <input
                id="tax_percentage" className="form-input" type="number" min={0} max={100} step="0.01" required
                value={taxPercentage} onChange={e => setTaxPercentage(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label" htmlFor="description">Descrição</label>
              <input
                id="description" className="form-input" required placeholder="Ex: Taxa normal de IVA"
                value={description} onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="country">País</label>
              <input id="country" className="form-input" maxLength={3} value={country} onChange={e => setCountry(e.target.value.toUpperCase())} />
            </div>

            <div className="form-group" style={{ display: "flex", alignItems: "flex-end" }}>
              <label className="product-checkbox-label">
                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                Taxa ativa
              </label>
            </div>

            {isExempt && (
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label" htmlFor="exemption_reason">Motivo de isenção</label>
                <input
                  id="exemption_reason" className="form-input" placeholder="Obrigatório no SAF-T quando a taxa é 0%"
                  value={exemptionReason} onChange={e => setExemptionReason(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="submit" className="modal-btn primary" disabled={submitting}>
              {submitting ? "A guardar…" : isEdit ? "Guardar alterações" : "Criar Taxa"}
            </button>
            <button type="button" className="modal-btn secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
