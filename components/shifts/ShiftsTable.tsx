"use client"
import { PaginatedShifts, Shift, formatCurrency, formatDateTime, SHIFT_STATUS_META } from "@/lib/shifts-data"

interface ShiftsTableProps {
  data: PaginatedShifts | null
  loading: boolean
  onPageChange: (page: number) => void
  onRowClick: (shift: Shift) => void
}

export function ShiftsTable({ data, loading, onPageChange, onRowClick }: ShiftsTableProps) {
  return (
    <div className="dash-card tx-card">
      <div className="tx-card-head">
        <div>
          <h2 className="card-title">Histórico de Turnos</h2>
          <p className="tx-count">{data ? `${data.total} turnos encontrados` : "—"}</p>
        </div>
      </div>

      <div className="table-scroll">
        <table className="tx-table">
          <thead>
            <tr>
              <th>ID</th><th>Utilizador</th><th>Terminal</th><th>Abertura</th><th>Fecho</th><th>Vendas Líq.</th><th>Diferença</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="tx-date">A carregar…</td></tr>
            )}
            {!loading && data?.data.length === 0 && (
              <tr><td colSpan={8} className="tx-date">Nenhum turno encontrado.</td></tr>
            )}
            {!loading && data?.data.map((s) => {
              const meta = SHIFT_STATUS_META[s.status]
              const diff = s.difference !== null ? Number(s.difference) : null
              return (
                <tr key={s.id} className="tx-row" onClick={() => onRowClick(s)}>
                  <td className="tx-id">#{s.id}</td>
                  <td className="tx-name">{s.user?.name ?? "—"}</td>
                  <td className="tx-table-num">{s.terminal_id}</td>
                  <td className="tx-date">{formatDateTime(s.opened_at)}</td>
                  <td className="tx-date">{formatDateTime(s.closed_at)}</td>
                  <td className="tx-price">{formatCurrency(s.net_sales)}</td>
                  <td className={diff === null ? "tx-qty" : diff < 0 ? "shift-diff-negative" : diff > 0 ? "shift-diff-positive" : "tx-qty"}>
                    {diff === null ? "—" : formatCurrency(diff)}
                  </td>
                  <td><span className="tx-status" style={{ background: meta.bg, color: meta.text }}>{meta.label}</span></td>
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