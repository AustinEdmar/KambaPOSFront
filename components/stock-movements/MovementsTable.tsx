"use client"

import {
    StockMovement,
    MOVEMENT_TYPE_META,
    formatDateTime,
    getProductImageUrl,
} from "@/lib/stock-movements-data"

interface MovementsTableProps {
    movements: StockMovement[]
    loading: boolean
    currentPage: number
    lastPage: number
    from: number | null
    to: number | null
    total: number
    onPageChange: (page: number) => void
}

export function MovementsTable({
    movements,
    loading,
    currentPage,
    lastPage,
    from,
    to,
    total,
    onPageChange,
}: MovementsTableProps) {
    return (
        <div className="dash-card tx-card">
            <div className="tx-card-head">
                <div>
                    <h2 className="card-title">Movimentações</h2>
                    <p className="tx-count">{total} movimentos encontrados</p>
                </div>
            </div>

            <div className="table-scroll">
                <table className="tx-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Produto</th>
                            <th>Tipo</th>
                            <th>Quantidade</th>
                            <th>Stock</th>
                            <th>Funcionário</th>
                            <th>Nota</th>
                            <th>Data</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={8} className="tx-date">A carregar…</td>
                            </tr>
                        )}

                        {!loading && movements.length === 0 && (
                            <tr>
                                <td colSpan={8} className="tx-date">Nenhuma movimentação encontrada.</td>
                            </tr>
                        )}

                        {!loading &&
                            movements.map((m) => {
                                const meta = MOVEMENT_TYPE_META[m.type]
                                const img = getProductImageUrl(m.product?.image_path)
                                const isPositive = m.quantity > 0

                                return (
                                    <tr key={m.id} className="tx-row">
                                        <td>
                                            {img ? (
                                                <img src={img} alt={m.product?.name} className="product-thumb" />
                                            ) : (
                                                <span className="product-thumb product-thumb-empty">📦</span>
                                            )}
                                        </td>

                                        <td>
                                            <div className="tx-name">{m.product?.name ?? "—"}</div>
                                            <div className="tx-time">{m.product?.product_code ?? "—"}</div>
                                        </td>

                                        <td>
                                            <span
                                                className="tx-status"
                                                style={{ background: meta.bg, color: meta.color }}
                                            >
                                                {meta.label}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className="movement-qty-badge"
                                                style={{ background: meta.bg, color: meta.color }}
                                            >
                                                {isPositive ? "+" : ""}
                                                {m.quantity} {m.product?.unit ?? "UN"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="movement-stock-change">
                                                {m.stock_before} → <b>{m.stock_after}</b>
                                            </span>
                                        </td>

                                        <td>{m.user?.name ?? "—"}</td>

                                        <td>
                                            <span className="movement-note" title={m.note ?? ""}>
                                                {m.note ?? "—"}
                                            </span>
                                        </td>

                                        <td className="tx-date">{formatDateTime(m.created_at)}</td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>

            {lastPage > 1 && (
                <div className="pagination">
                    <span className="pag-info">
                        Mostrando {from ?? 0}–{to ?? 0} de {total}
                    </span>

                    <div className="pag-controls">
                        <button
                            className="pag-btn"
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(1)}
                            title="Primeira"
                        >
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polyline points="11 17 6 12 11 7" />
                                <polyline points="18 17 13 12 18 7" />
                            </svg>
                        </button>

                        <button
                            className="pag-btn"
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                            title="Anterior"
                        >
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>

                        {Array.from({ length: lastPage }, (_, i) => i + 1)
                            .filter((n) => n === 1 || n === lastPage || Math.abs(n - currentPage) <= 1)
                            .reduce<(number | "…")[]>((acc, n, idx, arr) => {
                                if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("…")
                                acc.push(n)
                                return acc
                            }, [])
                            .map((n, i) =>
                                n === "…" ? (
                                    <span key={`e${i}`} className="pag-ellipsis">…</span>
                                ) : (
                                    <button
                                        key={n}
                                        className={`pag-num ${currentPage === n ? "active" : ""}`}
                                        onClick={() => onPageChange(n as number)}
                                    >
                                        {n}
                                    </button>
                                )
                            )}

                        <button
                            className="pag-btn"
                            disabled={currentPage === lastPage}
                            onClick={() => onPageChange(currentPage + 1)}
                            title="Próxima"
                        >
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>

                        <button
                            className="pag-btn"
                            disabled={currentPage === lastPage}
                            onClick={() => onPageChange(lastPage)}
                            title="Última"
                        >
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <polyline points="13 17 18 12 13 7" />
                                <polyline points="6 17 11 12 6 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}