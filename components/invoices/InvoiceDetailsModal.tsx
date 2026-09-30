"use client"

import { useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"
import {
    Invoice, DOCUMENT_TYPE_META, INVOICE_STATUS_META, FE_STATUS_META,
    formatCurrency, formatDateTime,
} from "@/lib/invoices-data"

interface InvoiceDetailsModalProps {
    invoice: Invoice
    onClose: () => void
    onChanged: () => void
}

// ── Formato devolvido por GET /tax-rates ────────────────
interface TaxRateOption {
    id: number
    tax_code: string
    description: string
    tax_percentage: string
    is_active: boolean
}

// ── Formato devolvido por GET /products (só o que usamos) ─
interface ProductOption {
    id: number
    name: string
    product_code: string
    price: string
    unit: string
    tax_rate_id: number
    is_active: boolean
}

interface DebitLine {
    product_id: string // "" = encargo avulso (sem produto do catálogo)
    description: string
    quantity: string
    unit_price: string
    tax_rate_id: string // id da tabela tax_rates (não o código: há 2 "RED", 5% e 7%)
    product_code: string
    tax_exemption_code: string
    tax_exemption_reason: string
}

const emptyLine = (defaultTaxRateId = ""): DebitLine => ({
    product_id: "",
    description: "",
    quantity: "1",
    unit_price: "",
    tax_rate_id: defaultTaxRateId,
    product_code: "",
    tax_exemption_code: "",
    tax_exemption_reason: "",
})

type Mode = "none" | "cancel" | "debit"

export function InvoiceDetailsModal({ invoice, onClose, onChanged }: InvoiceDetailsModalProps) {
    const [busy, setBusy] = useState(false)
    const [mode, setMode] = useState<Mode>("none")

    const [cancelReason, setCancelReason] = useState("")

    const [debitReason, setDebitReason] = useState("")
    const [debitLines, setDebitLines] = useState<DebitLine[]>([emptyLine()])

    const [taxRates, setTaxRates] = useState<TaxRateOption[]>([])
    const [products, setProducts] = useState<ProductOption[]>([])
    const [optionsLoaded, setOptionsLoaded] = useState(false)
    const [loadingOptions, setLoadingOptions] = useState(false)

    const docMeta = DOCUMENT_TYPE_META[invoice.document_type]
    const statusMeta = INVOICE_STATUS_META[invoice.status]
    const feMeta = invoice.fe_status ? FE_STATUS_META[invoice.fe_status] : null

    const canCancel = invoice.status === "issued"
    const canSubmitAgt = !invoice.fe_status || invoice.fe_status === "not_sent" || invoice.fe_status === "invalid"

    // ND só faz sentido sobre documentos de venda (FT/FR), já emitidos e não rejeitados pela AGT
    const canDebit =
        ["FT", "FR"].includes(invoice.document_type) &&
        ["issued", "credited"].includes(invoice.status) &&
        invoice.fe_status !== "invalid"

    const errorMessage = (error: any, fallback: string) => {
        const data = error?.response?.data
        const firstValidation = data?.errors ? Object.values<any>(data.errors)?.[0]?.[0] : null
        return firstValidation ?? data?.message ?? data?.error ?? fallback
    }

    // ── Carrega taxas + catálogo (uma só vez, ao abrir o formulário de ND) ──
    const loadDebitOptions = async () => {
        if (optionsLoaded || loadingOptions) return
        setLoadingOptions(true)
        try {
            const ratesRes = await api.get("/tax-rates")
            const rates: TaxRateOption[] = (ratesRes.data?.data ?? ratesRes.data ?? []).filter(
                (r: TaxRateOption) => r.is_active
            )

            // /products é paginado (10 por página): percorre todas as páginas
            const all: ProductOption[] = []
            let page = 1
            let lastPage = 1
            do {
                const { data } = await api.get("/products", { params: { page } })
                all.push(...(data?.data ?? []))
                lastPage = data?.last_page ?? 1
                page++
            } while (page <= lastPage)

            const defaultId = String((rates.find((r) => r.tax_code === "NOR") ?? rates[0])?.id ?? "")

            setTaxRates(rates)
            setProducts(all.filter((p) => p.is_active))
            setDebitLines((ls) => ls.map((l) => (l.tax_rate_id ? l : { ...l, tax_rate_id: defaultId })))
            setOptionsLoaded(true)
        } catch (error: any) {
            toast.error(errorMessage(error, "Erro ao carregar produtos e taxas."))
        } finally {
            setLoadingOptions(false)
        }
    }

    const openDebit = () => {
        setMode("debit")
        loadDebitOptions()
    }

    const defaultTaxRateId = () =>
        String((taxRates.find((r) => r.tax_code === "NOR") ?? taxRates[0])?.id ?? "")

    const rateOf = (line: DebitLine) => taxRates.find((r) => String(r.id) === line.tax_rate_id)

    const submitCancel = async () => {
        if (!cancelReason.trim() || busy) return
        setBusy(true)
        try {
            const { data } = await api.post(`/invoices/${invoice.id}/cancel`, { reason: cancelReason })
            toast.success(`Factura anulada — NC: ${data.credit_note_number}`)
            onChanged()
            onClose()
        } catch (error: any) {
            toast.error(errorMessage(error, "Erro ao anular a factura."))
        } finally {
            setBusy(false)
        }
    }

    const updateLine = (index: number, patch: Partial<DebitLine>) =>
        setDebitLines((lines) => lines.map((l, i) => (i === index ? { ...l, ...patch } : l)))

    // Ao escolher um produto, preenche tudo a partir do catálogo
    const pickProduct = (index: number, productId: string) => {
        if (!productId) {
            updateLine(index, { product_id: "", product_code: "" })
            return
        }
        const p = products.find((x) => String(x.id) === productId)
        if (!p) return
        updateLine(index, {
            product_id: productId,
            description: p.name,
            unit_price: p.price,
            tax_rate_id: String(p.tax_rate_id),
            product_code: p.product_code,
        })
    }

    const debitLinesValid =
        debitLines.length > 0 &&
        debitLines.every(
            (l) =>
                l.description.trim() &&
                l.product_code.trim() &&
                rateOf(l) &&
                Number(l.quantity) > 0 &&
                l.unit_price !== "" && Number(l.unit_price) >= 0
        )

    const debitPreview = debitLines.reduce(
        (acc, l) => {
            const pct = Number(rateOf(l)?.tax_percentage ?? 0)
            const sub = Math.round(Number(l.quantity || 0) * Number(l.unit_price || 0) * 100) / 100
            const tax = Math.ceil(sub * (pct / 100) * 100 - 1e-9) / 100
            return { taxable: acc.taxable + sub, tax: acc.tax + tax }
        },
        { taxable: 0, tax: 0 }
    )

    const submitDebit = async () => {
        if (!debitReason.trim() || !debitLinesValid || busy) return
        setBusy(true)
        try {
            const payload = {
                reason: debitReason,
                items: debitLines.map((l) => {
                    const rate = rateOf(l)!
                    return {
                        ...(l.product_id ? { product_id: Number(l.product_id) } : {}),
                        description: l.description,
                        quantity: Number(l.quantity),
                        unit_price: Number(l.unit_price),
                        tax_code: rate.tax_code,
                        tax_rate: Number(rate.tax_percentage),
                        product_code: l.product_code,
                        ...(rate.tax_code === "ISE"
                            ? {
                                tax_exemption_code: l.tax_exemption_code || null,
                                tax_exemption_reason: l.tax_exemption_reason || null,
                            }
                            : {}),
                    }
                }),
            }
            const { data } = await api.post(`/invoices/${invoice.id}/debit-note`, payload)
            toast.success(`Nota de débito emitida — ${data.debit_note_number}`)
            onChanged()
            onClose()
        } catch (error: any) {
            toast.error(errorMessage(error, "Erro ao emitir a nota de débito."))
        } finally {
            setBusy(false)
        }
    }

    const submitAgt = async () => {
        if (busy) return
        setBusy(true)
        try {
            const { data } = await api.post(`/fe/invoices/${invoice.id}/submit`)
            toast.success(`Submetida à AGT — estado: ${data.fe_status}`)
            onChanged()
        } catch (error: any) {
            toast.error(errorMessage(error, "Erro ao submeter à AGT."))
        } finally {
            setBusy(false)
        }
    }

    const checkAgtStatus = async () => {
        if (busy) return
        setBusy(true)
        try {
            const { data } = await api.get(`/fe/invoices/${invoice.id}/status`)
            toast.success(`Estado AGT: ${FE_STATUS_META[data.fe_status]?.label ?? data.fe_status}`)
            onChanged()
        } catch (error: any) {
            toast.error(errorMessage(error, "Erro ao consultar estado AGT."))
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal product-history-modal"
                style={{ maxHeight: "90vh", overflowY: "auto" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <div>
                        <div className="modal-title">{invoice.invoice_number}</div>
                        <div className="modal-id">{formatDateTime(invoice.issued_at)}</div>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="modal-status-bar" style={{ background: statusMeta.bg, borderColor: statusMeta.bg, color: statusMeta.color }}>
                    <span className="modal-status-dot" style={{ background: statusMeta.color }} />
                    <span className="modal-status-text">{statusMeta.label}</span>
                </div>

                <div className="modal-grid">
                    <div className="modal-detail">
                        <span className="modal-detail-label">Tipo</span>
                        <span className="modal-detail-value">{docMeta.label} ({invoice.document_type})</span>
                    </div>
                    <div className="modal-detail">
                        <span className="modal-detail-label">Cliente</span>
                        <span className="modal-detail-value">{invoice.customer?.name ?? "—"}</span>
                    </div>
                    <div className="modal-detail">
                        <span className="modal-detail-label">Funcionário</span>
                        <span className="modal-detail-value">{invoice.user?.name ?? "—"}</span>
                    </div>
                    <div className="modal-detail">
                        <span className="modal-detail-label">Estado AGT</span>
                        <span className="modal-detail-value">{feMeta?.label ?? "Não enviada"}</span>
                    </div>
                </div>

                {invoice.items && invoice.items.length > 0 && (
                    <div className="product-history-body">
                        {invoice.items.map((item) => (
                            <div className="product-history-row" key={item.id}>
                                <div className="product-history-info" style={{ flex: 1 }}>
                                    <span className="tx-name">{item.description}</span>
                                    <span className="tx-time">
                                        {item.quantity} × {formatCurrency(item.unit_price)}
                                    </span>
                                </div>
                                <span className="tx-price">{formatCurrency(item.gross_amount)}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="modal-summary">
                    <div className="modal-summary-row">
                        <span>Base tributável</span>
                        <span>{formatCurrency(invoice.taxable_amount)}</span>
                    </div>
                    <div className="modal-summary-row">
                        <span>IVA</span>
                        <span>{formatCurrency(invoice.tax_amount)}</span>
                    </div>
                    <hr className="modal-summary-divider" />
                    <div className="modal-summary-row total">
                        <span>Total</span>
                        <span>{formatCurrency(invoice.total_amount)}</span>
                    </div>
                </div>

                {mode === "cancel" && (
                    <div className="sale-pin">
                        <label className="form-label">Motivo da anulação</label>
                        <input
                            className="form-input"
                            value={cancelReason}
                            autoFocus
                            onChange={(e) => setCancelReason(e.target.value)}
                        />
                        <div className="sale-pin-actions">
                            <button className="modal-btn secondary" onClick={() => setMode("none")}>
                                Voltar
                            </button>
                            <button
                                className="modal-btn danger"
                                disabled={!cancelReason.trim() || busy}
                                onClick={submitCancel}
                            >
                                Confirmar anulação
                            </button>
                        </div>
                    </div>
                )}

                {mode === "debit" && (
                    <div className="sale-pin">
                        <label className="form-label">Motivo da nota de débito</label>
                        <input
                            className="form-input"
                            value={debitReason}
                            autoFocus
                            placeholder="Ex.: Taxa de entrega não facturada"
                            onChange={(e) => setDebitReason(e.target.value)}
                        />

                        {loadingOptions && (
                            <p className="tx-time" style={{ marginTop: 12 }}>A carregar produtos e taxas…</p>
                        )}

                        {optionsLoaded && debitLines.map((line, i) => {
                            const rate = rateOf(line)
                            const fromCatalog = !!line.product_id

                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 8,
                                        marginTop: 12,
                                        paddingTop: 12,
                                        borderTop: "1px dashed #d9def0",
                                    }}
                                >
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <label className="form-label">Produto</label>
                                        <select
                                            className="form-input"
                                            value={line.product_id}
                                            onChange={(e) => pickProduct(i, e.target.value)}
                                        >
                                            <option value="">Encargo avulso (sem produto)</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} — {p.product_code}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <label className="form-label">Descrição</label>
                                        <input
                                            className="form-input"
                                            value={line.description}
                                            onChange={(e) => updateLine(i, { description: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label">Código do produto</label>
                                        <input
                                            className="form-input"
                                            value={line.product_code}
                                            readOnly={fromCatalog}
                                            placeholder="Ex.: TAXA-ENTREGA"
                                            onChange={(e) => updateLine(i, { product_code: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Quantidade</label>
                                        <input
                                            className="form-input"
                                            type="number"
                                            min="0.001"
                                            step="any"
                                            value={line.quantity}
                                            onChange={(e) => updateLine(i, { quantity: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label">Preço unitário</label>
                                        <input
                                            className="form-input"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={line.unit_price}
                                            onChange={(e) => updateLine(i, { unit_price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Imposto</label>
                                        <select
                                            className="form-input"
                                            value={line.tax_rate_id}
                                            onChange={(e) => updateLine(i, { tax_rate_id: e.target.value })}
                                        >
                                            {taxRates.map((r) => (
                                                <option key={r.id} value={r.id}>
                                                    {r.description} ({r.tax_code} · {Number(r.tax_percentage)}%)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {rate?.tax_code === "ISE" && (
                                        <>
                                            <div>
                                                <label className="form-label">Código de isenção</label>
                                                <input
                                                    className="form-input"
                                                    value={line.tax_exemption_code}
                                                    placeholder="Ex.: M01"
                                                    onChange={(e) => updateLine(i, { tax_exemption_code: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Motivo de isenção</label>
                                                <input
                                                    className="form-input"
                                                    value={line.tax_exemption_reason}
                                                    onChange={(e) => updateLine(i, { tax_exemption_reason: e.target.value })}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {debitLines.length > 1 && (
                                        <div style={{ gridColumn: "1 / -1" }}>
                                            <button
                                                className="modal-btn secondary"
                                                type="button"
                                                onClick={() => setDebitLines((ls) => ls.filter((_, idx) => idx !== i))}
                                            >
                                                Remover linha
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {optionsLoaded && (
                            <>
                                <button
                                    className="modal-btn secondary"
                                    type="button"
                                    style={{ marginTop: 12 }}
                                    onClick={() => setDebitLines((ls) => [...ls, emptyLine(defaultTaxRateId())])}
                                >
                                    + Adicionar linha
                                </button>

                                <div className="modal-summary" style={{ marginTop: 12 }}>
                                    <div className="modal-summary-row">
                                        <span>Base tributável</span>
                                        <span>{formatCurrency(debitPreview.taxable)}</span>
                                    </div>
                                    <div className="modal-summary-row">
                                        <span>IVA</span>
                                        <span>{formatCurrency(debitPreview.tax)}</span>
                                    </div>
                                    <hr className="modal-summary-divider" />
                                    <div className="modal-summary-row total">
                                        <span>Total ND</span>
                                        <span>{formatCurrency(debitPreview.taxable + debitPreview.tax)}</span>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="sale-pin-actions">
                            <button className="modal-btn secondary" onClick={() => setMode("none")}>
                                Voltar
                            </button>
                            <button
                                className="modal-btn primary"
                                disabled={!optionsLoaded || !debitReason.trim() || !debitLinesValid || busy}
                                onClick={submitDebit}
                            >
                                Emitir nota de débito
                            </button>
                        </div>
                    </div>
                )}

                {mode === "none" && (
                    <div className="modal-actions">
                        {canCancel && (
                            <button className="modal-btn danger" onClick={() => setMode("cancel")} disabled={busy}>
                                Anular (gera NC)
                            </button>
                        )}

                        {canDebit && (
                            <button className="modal-btn secondary" onClick={openDebit} disabled={busy}>
                                Nota de débito
                            </button>
                        )}

                        {canSubmitAgt && (
                            <button className="modal-btn primary" onClick={submitAgt} disabled={busy}>
                                Submeter à AGT
                            </button>
                        )}

                        {invoice.fe_status === "pending" && (
                            <button className="modal-btn secondary" onClick={checkAgtStatus} disabled={busy}>
                                Consultar estado
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}