"use client"
import { FormEvent, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { Product } from "@/lib/products-data"

interface AdjustStockModalProps {
  product: Product
  onClose: () => void
  onAdjusted: () => void
}

const TYPES = [
  { value: "purchase", label: "Entrada (compra)" },
  { value: "adjustment", label: "Ajuste" },
  { value: "loss", label: "Quebra/perda" },
] as const

type MovementType = typeof TYPES[number]["value"]

export function AdjustStockModal({ product, onClose, onAdjusted }: AdjustStockModalProps) {
  const [type, setType] = useState<MovementType>("purchase")
  const [quantity, setQuantity] = useState("")
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const noteRequired = type !== "purchase"

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!quantity) return
    if (noteRequired && !note) {
      toast.error("A nota é obrigatória para ajustes e quebras.")
      return
    }

    setSubmitting(true)
    try {
      await api.post(`/products/${product.id}/adjust-stock`, {
        type,
        quantity: Number(quantity),
        note: note || undefined,
      })
      toast.success("Stock ajustado com sucesso")
      onAdjusted()
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Erro ao ajustar stock."
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
            <span className="modal-emoji">📦</span>
            <div>
              <h3 className="modal-title">Ajustar Stock</h3>
              <span className="modal-id">{product.name} · atual: {product.stock} {product.unit}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="shift-form-grid">
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Tipo</label>
              <div className="product-type-toggle">
                {TYPES.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    className={`dash-filter-btn ${type === t.value ? "active" : ""}`}
                    onClick={() => setType(t.value)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="quantity">Quantidade</label>
              <input id="quantity" className="form-input" type="number" min={1} required value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label" htmlFor="note">Nota {noteRequired && "(obrigatória)"}</label>
              <input id="note" className="form-input" value={note} onChange={e => setNote(e.target.value)} required={noteRequired} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="submit" className="modal-btn primary" disabled={submitting}>
              {submitting ? "A ajustar…" : "Confirmar"}
            </button>
            <button type="button" className="modal-btn secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
