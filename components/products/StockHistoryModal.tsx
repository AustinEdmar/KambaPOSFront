"use client"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { PaginatedStockMovements, Product, STOCK_MOVEMENT_META } from "@/lib/products-data"
import { formatDateTime } from "@/lib/shifts-data"

interface StockHistoryModalProps {
  product: Product
  onClose: () => void
}

export function StockHistoryModal({ product, onClose }: StockHistoryModalProps) {
  const [data, setData] = useState<PaginatedStockMovements | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let active = true
    setLoading(true)
    api.get<PaginatedStockMovements>(`/products/${product.id}/stock-history`, { params: { page } })
      .then(({ data }) => { if (active) setData(data) })
      .catch(() => { if (active) setData(null) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [product.id, page])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal product-history-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-emoji">📜</span>
            <div>
              <h3 className="modal-title">Histórico de Stock</h3>
              <span className="modal-id">{product.name}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="product-history-body">
          {loading && <p className="tx-count" style={{ padding: 20 }}>A carregar…</p>}
          {!loading && data?.data.length === 0 && <p className="tx-count" style={{ padding: 20 }}>Sem movimentos registados.</p>}
          {!loading && data?.data.map((m) => {
            const meta = STOCK_MOVEMENT_META[m.type]
            return (
              <div key={m.id} className="product-history-row">
                <span className="tx-status" style={{ background: `${meta.color}1A`, color: meta.color }}>{meta.label}</span>
                <div className="product-history-info">
                  <span className="tx-name">{m.quantity > 0 ? "+" : ""}{m.quantity} un. · {m.stock_before} → {m.stock_after}</span>
                  <span className="tx-time">{formatDateTime(m.created_at)} · {m.user?.name ?? "—"}{m.note ? ` · ${m.note}` : ""}</span>
                </div>
              </div>
            )
          })}
        </div>

        {data && data.last_page > 1 && (
          <div className="pagination product-history-pagination">
            <span className="pag-info">Página {data.current_page} de {data.last_page}</span>
            <div className="pag-controls">
              <button className="pag-btn" disabled={data.current_page === 1} onClick={() => setPage(p => p - 1)} title="Anterior">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button className="pag-btn" disabled={data.current_page === data.last_page} onClick={() => setPage(p => p + 1)} title="Próxima">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
