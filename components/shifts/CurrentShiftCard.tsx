"use client"
import { Shift, formatCurrency, formatDateTime, SHIFT_STATUS_META } from "@/lib/shifts-data"

interface CurrentShiftCardProps {
  shift: Shift | null
  loading: boolean
  onOpenClick: () => void
  onCloseClick: () => void
}

export function CurrentShiftCard({ shift, loading, onOpenClick, onCloseClick }: CurrentShiftCardProps) {
  if (loading) {
    return (
      <div className="dash-card shift-current-card">
        <p className="tx-count">A carregar turno atual…</p>
      </div>
    )
  }

  if (!shift) {
    return (
      <div className="dash-card shift-empty-state">
        <div className="shift-empty-icon">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
        </div>
        <div className="shift-empty-text">
          <h2 className="card-title">Nenhum turno aberto</h2>
          <p className="tx-count">Abra um turno para começar a registar vendas.</p>
        </div>
        <button className="modal-btn primary shift-open-btn" onClick={onOpenClick}>
          Abrir Turno
        </button>
      </div>
    )
  }

  const meta = SHIFT_STATUS_META[shift.status]

  return (
    <div className="dash-card shift-current-card">
      <div className="card-head">
        <div>
          <div className="shift-current-title-row">
            <h2 className="card-title">Turno atual</h2>
            <span className="tx-status" style={{ background: meta.bg, color: meta.text }}>{meta.label}</span>
          </div>
          <p className="tx-count">Terminal {shift.terminal_id} · {shift.user?.name ?? "—"}</p>
        </div>
        <button className="modal-btn danger" onClick={onCloseClick}>Fechar Turno</button>
      </div>
      <div className="shift-current-grid">
        <div className="modal-detail">
          <span className="modal-detail-label">Fundo inicial</span>
          <span className="modal-detail-value">{formatCurrency(shift.initial_amount)}</span>
        </div>
        <div className="modal-detail">
          <span className="modal-detail-label">Aberto em</span>
          <span className="modal-detail-value">{formatDateTime(shift.opened_at)}</span>
        </div>
        <div className="modal-detail">
          <span className="modal-detail-label">Pedidos</span>
          <span className="modal-detail-value">{shift.orders_count ?? 0}</span>
        </div>
        <div className="modal-detail">
          <span className="modal-detail-label">Vendas brutas</span>
          <span className="modal-detail-value">{formatCurrency(shift.gross_sales)}</span>
        </div>
      </div>
    </div>
  )
}
