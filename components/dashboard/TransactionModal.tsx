"use client"
import { Transaction, STATUS_META } from "@/lib/dashboard-data"

interface TransactionModalProps {
  tx: Transaction
  onClose: () => void
}

export function TransactionModal({ tx, onClose }: TransactionModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-emoji">{tx.emoji}</span>
            <div>
              <h3 className="modal-title">{tx.name}</h3>
              <span className="modal-id">{tx.id}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="modal-status-bar" style={{
          background: STATUS_META[tx.status].bg,
          borderColor: STATUS_META[tx.status].border,
          color: STATUS_META[tx.status].text,
        }}>
          <span className="modal-status-dot" style={{ background: STATUS_META[tx.status].text }} />
          <span className="modal-status-text">
            Status: <strong>{STATUS_META[tx.status].label}</strong>
          </span>
        </div>

        <div className="modal-grid">
          {[
            { label: "Data", value: tx.date },
            { label: "Horário", value: tx.time },
            { label: "Mesa", value: tx.table },
            { label: "Atendente", value: tx.staff },
            { label: "Categoria", value: tx.category },
            { label: "Quantidade", value: `${tx.qty}x` },
          ].map((d, i) => (
            <div key={i} className="modal-detail">
              <span className="modal-detail-label">{d.label}</span>
              <span className="modal-detail-value">{d.value}</span>
            </div>
          ))}
        </div>

        <div className="modal-summary">
          <div className="modal-summary-row">
            <span>Subtotal</span>
            <span>{tx.price}</span>
          </div>
          <div className="modal-summary-row">
            <span>Taxa de serviço (10%)</span>
            <span>${(tx.priceNum * 0.1).toFixed(2)}</span>
          </div>
          <div className="modal-summary-divider" />
          <div className="modal-summary-row total">
            <span>Total</span>
            <span>${(tx.priceNum * 1.1).toFixed(2)}</span>
          </div>
        </div>

        <div className="modal-actions">
          {tx.status === "pendente" && (
            <button className="modal-btn primary" onClick={onClose}>
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
              Confirmar Pagamento
            </button>
          )}
          <button className="modal-btn secondary" onClick={onClose}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Exportar Recibo
          </button>
          {tx.status !== "cancelado" && (
            <button className="modal-btn danger" onClick={onClose}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
