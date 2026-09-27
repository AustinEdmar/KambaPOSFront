"use client"
import { useState } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { Product } from "@/lib/products-data"

interface DeleteProductModalProps {
  product: Product
  onClose: () => void
  onDeleted: () => void
}

export function DeleteProductModal({ product, onClose, onDeleted }: DeleteProductModalProps) {
  const [submitting, setSubmitting] = useState(false)

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await api.delete(`/products/${product.id}`)
      toast.success("Produto eliminado")
      onDeleted()
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Erro ao eliminar produto."
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
            <span className="modal-emoji">🗑️</span>
            <div>
              <h3 className="modal-title">Eliminar Produto</h3>
              <span className="modal-id">{product.name}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <p className="tx-count" style={{ padding: "0 20px 16px" }}>
          Tens a certeza que queres eliminar &quot;{product.name}&quot;? Se já tiver vendas associadas, o servidor recusa e sugere desativar em vez de eliminar.
        </p>
        <div className="modal-actions">
          <button className="modal-btn danger" disabled={submitting} onClick={handleDelete}>
            {submitting ? "A eliminar…" : "Eliminar"}
          </button>
          <button className="modal-btn secondary" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
