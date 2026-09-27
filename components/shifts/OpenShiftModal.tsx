"use client"
import { FormEvent, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"

interface OpenShiftModalProps {
  onClose: () => void
  onOpened: () => void
}

export function OpenShiftModal({ onClose, onOpened }: OpenShiftModalProps) {
  const [initialAmount, setInitialAmount] = useState("")
  const [terminalId, setTerminalId] = useState("A")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!initialAmount) return

    setSubmitting(true)
    try {
      await api.post("/shifts/open", {
        initial_amount: Number(initialAmount),
        terminal_id: terminalId || undefined,
      })
      toast.success("Turno aberto com sucesso")
      onOpened()
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Erro ao abrir turno."
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
            <span className="modal-emoji">🟢</span>
            <div>
              <h3 className="modal-title">Abrir Turno</h3>
              <span className="modal-id">Fundo de caixa inicial</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="shift-form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="initial_amount">Valor inicial (Kz)</label>
              <input
                id="initial_amount"
                className="form-input"
                type="number"
                min={0}
                step="0.01"
                required
                autoFocus
                value={initialAmount}
                onChange={e => setInitialAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="terminal_id">Terminal</label>
              <input
                id="terminal_id"
                className="form-input"
                type="text"
                maxLength={20}
                value={terminalId}
                onChange={e => setTerminalId(e.target.value)}
                placeholder="A"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="modal-btn primary" disabled={submitting}>
              {submitting ? "A abrir…" : "Abrir Turno"}
            </button>
            <button type="button" className="modal-btn secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
