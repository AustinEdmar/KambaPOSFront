"use client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { CloseShiftResult, formatCurrency } from "@/lib/shifts-data"

interface OrdersSalesSummary {
  total_sales: string
  total_subtotal: string
  total_iva: string
  total_discount: string
  orders_count: number
}

interface CloseShiftModalProps {
  shiftId: number
  onClose: () => void
  onClosed: () => void
}

export function CloseShiftModal({ shiftId, onClose, onClosed }: CloseShiftModalProps) {
  const [summary, setSummary] = useState<OrdersSalesSummary | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<CloseShiftResult | null>(null)

  useEffect(() => {
    let active = true
    setLoadingSummary(true)
    api.get("/orders/sales", { params: { shift_id: shiftId, method_payment: "cash", per_page: 1 } })
      .then(({ data }) => { if (active) setSummary(data.summary) })
      .catch(() => { if (active) setSummary(null) })
      .finally(() => { if (active) setLoadingSummary(false) })
    return () => { active = false }
  }, [shiftId])

  const handleConfirm = async () => {
    if (!summary) return
    setSubmitting(true)
    try {
      const { data } = await api.post<CloseShiftResult>("/shifts/close", {
        final_cash_amount: Number(summary.total_sales),
      })
      setResult(data)
      toast.success("Turno fechado com sucesso")
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Erro ao fechar turno."
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={result ? undefined : onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-emoji">🔴</span>
            <div>
              <h3 className="modal-title">Fechar Turno</h3>
              <span className="modal-id">{result ? "Resumo do turno" : "Total de vendas em dinheiro"}</span>
            </div>
          </div>
          {!result && (
            <button className="modal-close" onClick={onClose}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>

        {!result ? (
          <>
            <div className="shift-close-preview">
              {loadingSummary && <p className="tx-count">A calcular total de vendas…</p>}

              {!loadingSummary && !summary && (
                <p className="tx-count">Não foi possível obter o total de vendas.</p>
              )}

              {!loadingSummary && summary && (
                <>
                  <span className="modal-detail-label">Valor a fechar (dinheiro)</span>
                  <div className="shift-close-amount">{formatCurrency(summary.total_sales)}</div>
                  <span className="tx-count">{summary.orders_count} pedidos pagos em dinheiro neste turno</span>
                </>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn danger"
                disabled={submitting || loadingSummary || !summary}
                onClick={handleConfirm}
              >
                {submitting ? "A fechar…" : "Confirmar Fecho"}
              </button>
              <button type="button" className="modal-btn secondary" onClick={onClose}>Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-summary">
              <div className="modal-summary-row"><span>Vendas brutas</span><span>{formatCurrency(result.gross_sales)}</span></div>
              <div className="modal-summary-row"><span>Reembolsos</span><span>{formatCurrency(result.refund_total)}</span></div>
              <div className="modal-summary-row"><span>Vendas líquidas</span><span>{formatCurrency(result.net_sales)}</span></div>
              <div className="modal-summary-divider" />
              <div className="modal-summary-row"><span>Caixa esperado</span><span>{formatCurrency(result.expected_cash)}</span></div>
              <div className="modal-summary-row"><span>Caixa contado</span><span>{formatCurrency(result.final_cash)}</span></div>
              <div className={`modal-summary-row total ${Number(result.difference) < 0 ? "shift-diff-negative" : Number(result.difference) > 0 ? "shift-diff-positive" : ""}`}>
                <span>Diferença</span><span>{formatCurrency(result.difference)}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn primary" onClick={onClosed}>Concluir</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}