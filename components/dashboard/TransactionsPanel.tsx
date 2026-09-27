"use client"
import { useState } from "react"
import { ALL_TRANSACTIONS, STATUS_META, PAGE_SIZE, Transaction, TxStatus } from "@/lib/dashboard-data"
import { TransactionModal } from "./TransactionModal"

export function TransactionsPanel() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<TxStatus | "todos">("todos")
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  const filtered = statusFilter === "todos"
    ? ALL_TRANSACTIONS
    : ALL_TRANSACTIONS.filter(t => t.status === statusFilter)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleFilterChange = (f: TxStatus | "todos") => {
    setStatusFilter(f)
    setPage(1)
  }

  return (
    <div className="dash-card tx-card">
      <div className="tx-card-head">
        <div>
          <h2 className="card-title">Transações Recentes</h2>
          <p className="tx-count">{filtered.length} transações encontradas</p>
        </div>
        <div className="tx-filters">
          {(["todos", "pago", "pendente", "cancelado"] as const).map(f => (
            <button
              key={f}
              className={`tx-filter-btn ${statusFilter === f ? "active" : ""}`}
              onClick={() => handleFilterChange(f)}
              style={statusFilter === f && f !== "todos" ? {
                background: STATUS_META[f as TxStatus]?.bg,
                color: STATUS_META[f as TxStatus]?.text,
                borderColor: STATUS_META[f as TxStatus]?.border,
              } : {}}
            >
              {f === "todos" ? "Todos" : STATUS_META[f].label}
            </button>
          ))}
        </div>
      </div>

      <table className="tx-table">
        <thead>
          <tr>
            <th>ID</th><th>Item</th><th>Mesa</th><th>Data</th><th>Qtd</th><th>Valor</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((t) => {
            const s = STATUS_META[t.status]
            return (
              <tr key={t.id} onClick={() => setSelectedTx(t)} className="tx-row">
                <td className="tx-id">{t.id}</td>
                <td>
                  <div className="tx-item">
                    <span className="tx-emoji">{t.emoji}</span>
                    <div>
                      <div className="tx-name">{t.name}</div>
                      <div className="tx-time">{t.time}</div>
                    </div>
                  </div>
                </td>
                <td className="tx-table-num">{t.table}</td>
                <td className="tx-date">{t.date}</td>
                <td className="tx-qty">{t.qty}x</td>
                <td className="tx-price">{t.price}</td>
                <td><span className="tx-status" style={{ background: s.bg, color: s.text }}>{s.label}</span></td>
                <td>
                  <button className="tx-more" onClick={e => { e.stopPropagation(); setSelectedTx(t) }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="pagination">
        <span className="pag-info">
          Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
        </span>
        <div className="pag-controls">
          <button className="pag-btn" disabled={page === 1} onClick={() => setPage(1)} title="Primeira">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
          </button>
          <button className="pag-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)} title="Anterior">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
            .reduce<(number | "…")[]>((acc, n, idx, arr) => {
              if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("…")
              acc.push(n)
              return acc
            }, [])
            .map((n, i) =>
              n === "…"
                ? <span key={`e${i}`} className="pag-ellipsis">…</span>
                : <button key={n} className={`pag-num ${page === n ? "active" : ""}`} onClick={() => setPage(n as number)}>{n}</button>
            )
          }

          <button className="pag-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} title="Próxima">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <button className="pag-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)} title="Última">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
          </button>
        </div>
      </div>

      {selectedTx && <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}
    </div>
  )
}
