"use client"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { ShiftDetail, formatCurrency, formatDateTime, SHIFT_STATUS_META } from "@/lib/shifts-data"

interface ShiftDetailModalProps {
  shiftId: number
  onClose: () => void
}

export function ShiftDetailModal({ shiftId, onClose }: ShiftDetailModalProps) {
  const [shift, setShift] = useState<ShiftDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    api.get<ShiftDetail>(`/shifts/${shiftId}`)
      .then(({ data }) => { if (active) setShift(data) })
      .catch(() => { if (active) setShift(null) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [shiftId])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-emoji">🧾</span>
            <div>
              <h3 className="modal-title">Turno #{shiftId}</h3>
              <span className="modal-id">{shift?.user?.name ?? "—"}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {loading && <p className="tx-count" style={{ padding: 20 }}>A carregar…</p>}

        {!loading && shift && (
          <>
            <div className="modal-status-bar" style={{
              background: SHIFT_STATUS_META[shift.status].bg,
              borderColor: SHIFT_STATUS_META[shift.status].bg,
              color: SHIFT_STATUS_META[shift.status].text,
            }}>
              <span className="modal-status-dot" style={{ background: SHIFT_STATUS_META[shift.status].text }} />
              <span className="modal-status-text">Status: <strong>{SHIFT_STATUS_META[shift.status].label}</strong></span>
            </div>

            <div className="modal-grid">
              <div className="modal-detail"><span className="modal-detail-label">Terminal</span><span className="modal-detail-value">{shift.terminal_id}</span></div>
              <div className="modal-detail"><span className="modal-detail-label">Pedidos</span><span className="modal-detail-value">{shift.orders?.length ?? shift.orders_count ?? 0}</span></div>
              <div className="modal-detail"><span className="modal-detail-label">Abertura</span><span className="modal-detail-value">{formatDateTime(shift.opened_at)}</span></div>
              <div className="modal-detail"><span className="modal-detail-label">Fecho</span><span className="modal-detail-value">{formatDateTime(shift.closed_at)}</span></div>
            </div>

            <div className="modal-summary">
              <div className="modal-summary-row"><span>Fundo inicial</span><span>{formatCurrency(shift.initial_amount)}</span></div>
              <div className="modal-summary-row"><span>Vendas brutas</span><span>{formatCurrency(shift.gross_sales)}</span></div>
              <div className="modal-summary-row"><span>Reembolsos</span><span>{formatCurrency(shift.refund_total)}</span></div>
              <div className="modal-summary-row"><span>Vendas líquidas</span><span>{formatCurrency(shift.net_sales)}</span></div>
              <div className="modal-summary-divider" />
              <div className="modal-summary-row"><span>Caixa esperado</span><span>{formatCurrency(shift.expected_cash_amount)}</span></div>
              <div className="modal-summary-row"><span>Caixa contado</span><span>{formatCurrency(shift.final_cash_amount)}</span></div>
              <div className="modal-summary-row total"><span>Diferença</span><span>{formatCurrency(shift.difference)}</span></div>
            </div>
          </>
        )}

        {!loading && !shift && (
          <p className="tx-count" style={{ padding: 20 }}>Não foi possível carregar o turno.</p>
        )}
      </div>
    </div>
  )
}
