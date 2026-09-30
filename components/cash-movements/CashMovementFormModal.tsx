"use client"

import { useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"
import { CashMovementType } from "@/lib/cash-movements-data"

interface CashMovementFormModalProps {
    type: CashMovementType
    onClose: () => void
    onSaved: () => void
}

export function CashMovementFormModal({ type, onClose, onSaved }: CashMovementFormModalProps) {
    const [movementType, setMovementType] = useState<CashMovementType>(type)
    const [amount, setAmount] = useState("")
    const [reason, setReason] = useState("")
    const [saving, setSaving] = useState(false)

    const isInflow = movementType === "inflow"
    const canSave = Number(amount) > 0 && !saving

    const submit = async () => {
        if (!canSave) return
        setSaving(true)
        try {
            await api.post("/cash-movements", {
                type: movementType,
                amount: Number(amount),
                reason: reason || undefined,
                currency: "AOA",
            })

            toast.success(
                isInflow ? "Reforço de caixa registado." : "Sangria registada."
            )
            onSaved()
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ?? "Erro ao registar o movimento."
            )
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">Novo movimento de caixa</div>

                    <button className="modal-close" onClick={onClose}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="shift-form-grid shift-form-grid-single" style={{ paddingBottom: 4 }}>
                    <div className="form-group">
                        <label className="form-label">Tipo de movimento</label>

                        <div className="cash-type-toggle">
                            <button
                                type="button"
                                className={`cash-type-btn inflow ${isInflow ? "active" : ""}`}
                                onClick={() => setMovementType("inflow")}
                            >
                                ↑ Reforço
                            </button>
                            <button
                                type="button"
                                className={`cash-type-btn outflow ${!isInflow ? "active" : ""}`}
                                onClick={() => setMovementType("outflow")}
                            >
                                ↓ Sangria
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Valor (AOA)</label>
                        <input
                            className="form-input"
                            type="number"
                            min={0.01}
                            step="0.01"
                            value={amount}
                            placeholder="0,00"
                            autoFocus
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Motivo (opcional)</label>
                        <input
                            className="form-input"
                            type="text"
                            value={reason}
                            placeholder={isInflow ? "Ex: Reforço de caixa" : "Ex: Retirada de dinheiro"}
                            onChange={(e) => setReason(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && canSave && submit()}
                        />
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="modal-btn secondary" onClick={onClose} disabled={saving}>
                        Cancelar
                    </button>
                    <button className="modal-btn primary" onClick={submit} disabled={!canSave}>
                        {saving ? "A guardar…" : "Registar"}
                    </button>
                </div>
            </div>
        </div>
    )
}