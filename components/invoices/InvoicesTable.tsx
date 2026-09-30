"use client"

import {
    Invoice, DOCUMENT_TYPE_META, INVOICE_STATUS_META, FE_STATUS_META,
    formatCurrency, formatDateTime,
} from "@/lib/invoices-data"

interface InvoicesTableProps {
    invoices: Invoice[]
    loading: boolean
    currentPage: number
    lastPage: number
    from: number | null
    to: number | null
    total: number
    onPageChange: (page: number) => void
    onView: (invoice: Invoice) => void
}

export function InvoicesTable({
    invoices, loading, currentPage, lastPage, from, to, total, onPageChange, onView,
}: InvoicesTableProps) {
    return (
        <div className="dash-card tx-card">
            <div className="tx-card-head">
                <div>
                    <h2 className="card-title">Facturas</h2>
                    <p className="tx-count">{total} facturas encontradas</p>
                </div>
            </div>

            <div className="table-scroll">
                <table className="tx-table">
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Tipo</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>AGT</th>
                            <th>Emitida em</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr><td colSpan={8} className="tx-date">A carregar…</td></tr>
                        )}
                        {!loading && invoices.length === 0 && (
                            <tr><td colSpan={8} className="tx-date">Nenhuma factura encontrada.</td></tr>
                        )}
                        {!loading && invoices.map((inv) => {
                            const docMeta = DOCUMENT_TYPE_META[inv.document_type]
                            const statusMeta = INVOICE_STATUS_META[inv.status]
                            const feMeta = inv.fe_status ? FE_STATUS_META[inv.fe_status] : null

                            return (
                                <tr key={inv.id} className="tx-row" onClick={() => onView(inv)}>
                                    <td className="tx-name">{inv.invoice_number}</td>
                                    <td>
                                        <span className="tx-status" style={{ background: docMeta.bg, color: docMeta.color }}>
                                            {docMeta.label}
                                        </span>
                                    </td>
                                    <td>{inv.customer?.name ?? "—"}</td>
                                    <td className="tx-price">{formatCurrency(inv.total_amount)}</td>
                                    <td>
                                        <span className="tx-status" style={{ background: statusMeta.bg, color: statusMeta.color }}>
                                            {statusMeta.label}
                                        </span>
                                    </td>
                                    <td>
                                        {feMeta ? (
                                            <span className="tx-status" style={{ background: feMeta.bg, color: feMeta.color }}>
                                                {feMeta.label}
                                            </span>
                                        ) : "—"}
                                    </td>
                                    <td className="tx-date">{formatDateTime(inv.issued_at)}</td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <button className="tx-more" title="Ver detalhes" onClick={() => onView(inv)}>
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {lastPage > 1 && (
                <div className="pagination">
                    <span className="pag-info">Mostrando {from ?? 0}–{to ?? 0} de {total}</span>
                    <div className="pag-controls">
                        <button className="pag-btn" disabled={currentPage === 1} onClick={() => onPageChange(1)}>«</button>
                        <button className="pag-btn" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>‹</button>
                        <span className="pag-info">{currentPage} / {lastPage}</span>
                        <button className="pag-btn" disabled={currentPage === lastPage} onClick={() => onPageChange(currentPage + 1)}>›</button>
                        <button className="pag-btn" disabled={currentPage === lastPage} onClick={() => onPageChange(lastPage)}>»</button>
                    </div>
                </div>
            )}
        </div>
    )
}