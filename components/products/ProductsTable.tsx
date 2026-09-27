"use client"
import { PaginatedProducts, Product, formatCurrency, getProductImageUrl } from "@/lib/products-data"

interface ProductsTableProps {
    data: PaginatedProducts | null
    loading: boolean
    onPageChange: (page: number) => void
    onEdit: (product: Product) => void
    onAdjustStock: (product: Product) => void
    onStockHistory: (product: Product) => void
    onToggleActive: (product: Product) => void
    onDelete: (product: Product) => void
}

export function ProductsTable({
    data, loading, onPageChange, onEdit, onAdjustStock, onStockHistory, onToggleActive, onDelete,
}: ProductsTableProps) {
    return (
        <div className="dash-card tx-card">
            <div className="tx-card-head">
                <div>
                    <h2 className="card-title">Catálogo</h2>
                    <p className="tx-count">{data ? `${data.total} produtos encontrados` : "—"}</p>
                </div>
            </div>

            <div className="table-scroll">
                <table className="tx-table">
                    <thead>
                        <tr>
                            <th></th><th>Produto</th><th>Categoria</th><th>Preço</th><th>IVA</th><th>Stock</th><th>Status</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr><td colSpan={8} className="tx-date">A carregar…</td></tr>
                        )}
                        {!loading && data?.data.length === 0 && (
                            <tr><td colSpan={8} className="tx-date">Nenhum produto encontrado.</td></tr>
                        )}
                        {!loading && data?.data.map((p) => {
                            const img = getProductImageUrl(p.image_path)
                            const lowStock = p.stock <= 5
                            return (
                                <tr key={p.id} className="tx-row" onClick={() => onEdit(p)}>
                                    <td>
                                        {img
                                            ? <img src={img} alt={p.name} className="product-thumb" />
                                            : <span className="product-thumb product-thumb-empty">📦</span>}
                                    </td>
                                    <td>
                                        <div className="tx-name">{p.name}</div>
                                        <div className="tx-time">{p.product_code ?? p.barcode ?? "—"}</div>
                                    </td>
                                    <td className="tx-table-num">{p.category?.name ?? "—"}</td>
                                    <td className="tx-price">{formatCurrency(p.price)}</td>
                                    <td className="tx-table-num" title={p.tax_rate?.description}>{p.tax_rate ? `${p.tax_rate.tax_code} · ${p.tax_rate.tax_percentage}%` : "—"}</td>
                                    <td className={lowStock ? "shift-diff-negative" : "tx-qty"}>{p.stock} {p.unit}</td>
                                    <td>
                                        <span className="tx-status" style={p.is_active ? { background: "#E4F9F2", color: "#0D9668" } : { background: "#EBEFF9", color: "#4B5578" }}>
                                            {p.is_active ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                    <td className="product-actions" onClick={e => e.stopPropagation()}>
                                        <button className="tx-more" title="Ajustar stock" onClick={() => onAdjustStock(p)}>
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                                        </button>
                                        <button className="tx-more" title="Histórico de stock" onClick={() => onStockHistory(p)}>
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 106 5.3L3 8" /><path d="M12 7v5l4 2" /></svg>
                                        </button>
                                        <button className="tx-more" title={p.is_active ? "Desativar" : "Ativar"} onClick={() => onToggleActive(p)}>
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-6" /></svg>
                                        </button>
                                        <button className="tx-more" title="Eliminar" onClick={() => onDelete(p)}>
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {data && data.last_page > 1 && (
                <div className="pagination">
                    <span className="pag-info">Mostrando {data.from ?? 0}–{data.to ?? 0} de {data.total}</span>
                    <div className="pag-controls">
                        <button className="pag-btn" disabled={data.current_page === 1} onClick={() => onPageChange(1)} title="Primeira">
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
                        </button>
                        <button className="pag-btn" disabled={data.current_page === 1} onClick={() => onPageChange(data.current_page - 1)} title="Anterior">
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                        </button>

                        {Array.from({ length: data.last_page }, (_, i) => i + 1)
                            .filter(n => n === 1 || n === data.last_page || Math.abs(n - data.current_page) <= 1)
                            .reduce<(number | "…")[]>((acc, n, idx, arr) => {
                                if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("…")
                                acc.push(n)
                                return acc
                            }, [])
                            .map((n, i) =>
                                n === "…"
                                    ? <span key={`e${i}`} className="pag-ellipsis">…</span>
                                    : <button key={n} className={`pag-num ${data.current_page === n ? "active" : ""}`} onClick={() => onPageChange(n as number)}>{n}</button>
                            )}

                        <button className="pag-btn" disabled={data.current_page === data.last_page} onClick={() => onPageChange(data.current_page + 1)} title="Próxima">
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                        <button className="pag-btn" disabled={data.current_page === data.last_page} onClick={() => onPageChange(data.last_page)} title="Última">
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}