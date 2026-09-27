"use client"
import { TaxRate, TAX_CODE_LABELS, formatPercentage } from "@/lib/tax-rates-data"

interface TaxRatesTableProps {
  taxRates: TaxRate[]
  loading: boolean
  showInactive: boolean
  onShowInactiveChange: (v: boolean) => void
  onNew: () => void
  onEdit: (taxRate: TaxRate) => void
  onToggleActive: (taxRate: TaxRate) => void
  onDelete: (taxRate: TaxRate) => void
}

export function TaxRatesTable({
  taxRates, loading, showInactive, onShowInactiveChange, onNew, onEdit, onToggleActive, onDelete,
}: TaxRatesTableProps) {
  return (
    <div className="dash-card tx-card">
      <div className="tx-card-head">
        <div>
          <h2 className="card-title">Taxas de IVA</h2>
          <p className="tx-count">{taxRates.length} taxas encontradas</p>
        </div>
        <div className="tx-filters">
          <button
            className={`tx-filter-btn ${showInactive ? "active" : ""}`}
            onClick={() => onShowInactiveChange(!showInactive)}
          >
            Mostrar inativas
          </button>
          <button className="dash-export-btn" onClick={onNew}>
            <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Nova Taxa
          </button>
        </div>
      </div>

      <div className="table-scroll">
        <table className="tx-table">
          <thead>
            <tr>
              <th>Código</th><th>Tipo</th><th>Descrição</th><th>Percentagem</th><th>País</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="tx-date">A carregar…</td></tr>
            )}
            {!loading && taxRates.length === 0 && (
              <tr><td colSpan={7} className="tx-date">Nenhuma taxa encontrada.</td></tr>
            )}
            {!loading && taxRates.map((t) => (
              <tr key={t.id} className="tx-row" onClick={() => onEdit(t)}>
                <td className="tx-id" title={TAX_CODE_LABELS[t.tax_code] ?? t.tax_code}>{t.tax_code}</td>
                <td className="tx-table-num">{t.tax_type}</td>
                <td>
                  <div className="tx-name">{t.description}</div>
                  {t.exemption_reason && <div className="tx-time">{t.exemption_reason}</div>}
                </td>
                <td className="tx-price">{formatPercentage(t.tax_percentage)}</td>
                <td className="tx-table-num">{t.country}</td>
                <td onClick={e => e.stopPropagation()}>
                  <button
                    className="tx-status product-status-btn"
                    style={t.is_active ? { background: "#E4F9F2", color: "#0D9668" } : { background: "#EBEFF9", color: "#4B5578" }}
                    onClick={() => onToggleActive(t)}
                  >
                    {t.is_active ? "Ativa" : "Inativa"}
                  </button>
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <div className="product-actions">
                    <button className="tx-more" title="Editar" onClick={() => onEdit(t)}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button className="tx-more" title="Eliminar" onClick={() => onDelete(t)}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
