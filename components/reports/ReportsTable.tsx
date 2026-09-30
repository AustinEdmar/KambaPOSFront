"use client"

import { ReportOrder, formatCurrency, formatDateTime } from "@/lib/reports-data"
import { ORDER_STATUS_META } from "@/lib/orders-data"

interface ReportsTableProps {
    orders: ReportOrder[]
    loading: boolean
    currentPage: number
    lastPage: number
    from: number | null
    to: number | null
    total: number
    onPageChange: (page: number) => void
}

export function ReportsTable({
    orders, loading, currentPage, lastPage, from, to, total, onPageChange,
}: ReportsTableProps) {
    return (
        <div className="dash-card tx-card">
            <div className="tx-card-head">
                <div>
                    <h2 className="card-title">Resultados</h2>
                    <p className="tx-count">{total} pedidos encontrados</p>
                </div>
            </div>

            <div className="table-scroll">
                <table className="tx-table">
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Funcionário</th>
                            <th>Subtotal</th>
                            <th>IVA</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr><td colSpan={7} className="tx-date">A carregar…</td></tr>
                        )}
                        {!loading && orders.length === 0 && (
                            <tr><td colSpan={7} className="tx-date">Nenhum resultado para estes filtros.</td></tr>
                        )}
                        {!loading && orders.map((o) => {
                            const meta = ORDER_STATUS_META[o.status as keyof typeof ORDER_STATUS_META]
                            return (
                                <tr key={o.id} className="tx-row">
                                    <td className="tx-id">#{o.id}</td>
                                    <td>{o.user?.name ?? "—"}</td>
                                    <td className="tx-table-num">{formatCurrency(o.subtotal)}</td>
                                    <td className="tx-table-num">{formatCurrency(o.iva)}</td>
                                    <td className="tx-price">{formatCurrency(o.total)}</td>
                                    <td>
                                        <span className="tx-status" style={{ background: meta?.bg, color: meta?.color }}>
                                            {meta?.label ?? o.status}
                                        </span>
                                    </td>
                                    <td className="tx-date">{formatDateTime(o.created_at)}</td>
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