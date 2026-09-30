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

interface CashMovement {
  type: "inflow" | "outflow"
  amount: string
}

interface ShiftDetail {
  initial_amount: string
  cash_movements: CashMovement[]
}

const PAYMENT_METHODS = [
  { key: "cash", label: "Dinheiro" },
  { key: "qrcode", label: "QR Code" },
  { key: "card", label: "Cartão" },
] as const

type PaymentMethod = (typeof PAYMENT_METHODS)[number]["key"]
type SummaryByMethod = Record<PaymentMethod, OrdersSalesSummary | null>

interface CloseShiftModalProps {
  shiftId: number
  onClose: () => void
  onClosed: () => void
}

export function CloseShiftModal({ shiftId, onClose, onClosed }: CloseShiftModalProps) {
  const [summaries, setSummaries] = useState<SummaryByMethod | null>(null)
  const [shiftDetail, setShiftDetail] = useState<ShiftDetail | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<CloseShiftResult | null>(null)

  useEffect(() => {
    let active = true
    setLoadingSummary(true)

    Promise.all([
      Promise.all(
        PAYMENT_METHODS.map(({ key }) =>
          api
            .get("/orders/sales", { params: { shift_id: shiftId, method_payment: key, per_page: 1 } })
            .then(({ data }) => [key, data.summary as OrdersSalesSummary] as const)
            .catch(() => [key, null] as const)
        )
      ),
      api
        .get(`/shifts/${shiftId}`)
        .then(({ data }) => data)
        .catch(() => null),
    ])
      .then(([entries, shift]) => {
        if (!active) return
        setSummaries(Object.fromEntries(entries) as SummaryByMethod)
        setShiftDetail(
          shift
            ? {
              initial_amount: shift.initial_amount,
              cash_movements: shift.cash_movements ?? shift.cashMovements ?? [],
            }
            : null
        )
      })
      .finally(() => { if (active) setLoadingSummary(false) })

    return () => { active = false }
  }, [shiftId])

  const totalGeral = summaries
    ? PAYMENT_METHODS.reduce((acc, { key }) => acc + Number(summaries[key]?.total_sales ?? 0), 0)
    : 0

  const initialAmount = Number(shiftDetail?.initial_amount ?? 0)

  const inflow = (shiftDetail?.cash_movements ?? [])
    .filter(m => m.type === "inflow")
    .reduce((acc, m) => acc + Number(m.amount), 0)

  const outflow = (shiftDetail?.cash_movements ?? [])
    .filter(m => m.type === "outflow")
    .reduce((acc, m) => acc + Number(m.amount), 0)

  const finalAmount = initialAmount + totalGeral + inflow - outflow

  const ready = !loadingSummary && !!summaries && !!shiftDetail

  const handleConfirm = async () => {
    if (!summaries || !shiftDetail) return
    setSubmitting(true)
    try {
      const { data } = await api.post<CloseShiftResult>("/shifts/close", {
        final_cash_amount: finalAmount,
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
              <span className="modal-id">{result ? "Resumo do turno" : "Total de vendas por método"}</span>
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
              {loadingSummary && <p className="tx-count">A calcular total do turno…</p>}

              {!loadingSummary && !ready && (
                <p className="tx-count">Não foi possível obter os dados do turno.</p>
              )}

              {ready && (
                <>
                  <span className="modal-detail-label">Valor a fechar (total)</span>
                  <div className="shift-close-amount">{formatCurrency(String(finalAmount))}</div>
                  <span className="tx-count">
                    {PAYMENT_METHODS.reduce((acc, { key }) => acc + (summaries?.[key]?.orders_count ?? 0), 0)} pedidos pagos neste turno
                  </span>
                </>
              )}
            </div>

            {ready && summaries && (
              <div className="modal-summary">
                {PAYMENT_METHODS.map(({ key, label }) => (
                  <div key={key} className="modal-summary-row">
                    <span>{label} ({summaries[key]?.orders_count ?? 0})</span>
                    <span>{formatCurrency(summaries[key]?.total_sales ?? "0")}</span>
                  </div>
                ))}
                <div className="modal-summary-divider" />
                <div className="modal-summary-row">
                  <span>Vendas</span>
                  <span>{formatCurrency(String(totalGeral))}</span>
                </div>
                <div className="modal-summary-row">
                  <span>Fundo inicial</span>
                  <span>{formatCurrency(String(initialAmount))}</span>
                </div>
                {inflow > 0 && (
                  <div className="modal-summary-row">
                    <span>Entradas manuais</span>
                    <span>{formatCurrency(String(inflow))}</span>
                  </div>
                )}
                {outflow > 0 && (
                  <div className="modal-summary-row">
                    <span>Saídas manuais</span>
                    <span>-{formatCurrency(String(outflow))}</span>
                  </div>
                )}
                <div className="modal-summary-divider" />
                <div className="modal-summary-row total">
                  <span>Total a fechar</span>
                  <span>{formatCurrency(String(finalAmount))}</span>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn danger"
                disabled={submitting || !ready}
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