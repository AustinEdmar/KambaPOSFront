"use client"

import { ReportFilters, OrderStatusFilter, PaymentMethodFilter } from "@/lib/reports-data"

interface ReportsFiltersProps {
    filters: ReportFilters
    onChange: (filters: ReportFilters) => void
    onExportPdf: () => void
    exporting: boolean
}

const STATUS_OPTIONS: { value: OrderStatusFilter; label: string }[] = [
    { value: "", label: "Todos os estados" },
    { value: "open", label: "Aberto" },
    { value: "closed", label: "Fechado" },
    { value: "refunded", label: "Reembolsado" },
    { value: "partial_refund", label: "Reemb. parcial" },
]

const PAYMENT_OPTIONS: { value: PaymentMethodFilter; label: string }[] = [
    { value: "", label: "Todos os métodos" },
    { value: "cash", label: "Dinheiro" },
    { value: "card", label: "Cartão" },
    { value: "qrcode", label: "QR Code" },
    { value: "BankTransfer", label: "Transferência" },
    { value: "multicaixa", label: "Multicaixa" },
]

export function ReportsFilters({ filters, onChange, onExportPdf, exporting }: ReportsFiltersProps) {
    const set = <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) =>
        onChange({ ...filters, [key]: value })

    return (
        <div className="dash-card">
            <div className="shift-form-grid">
                <div className="form-group">
                    <label className="form-label">Data inicial</label>
                    <input
                        className="form-input"
                        type="date"
                        value={filters.date_from}
                        onChange={(e) => set("date_from", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Data final</label>
                    <input
                        className="form-input"
                        type="date"
                        value={filters.date_to}
                        onChange={(e) => set("date_to", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Estado</label>
                    <select
                        className="form-input products-select"
                        value={filters.status}
                        onChange={(e) => set("status", e.target.value as OrderStatusFilter)}
                    >
                        {STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Método de pagamento</label>
                    <select
                        className="form-input products-select"
                        value={filters.method_payment}
                        onChange={(e) => set("method_payment", e.target.value as PaymentMethodFilter)}
                    >
                        {PAYMENT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Turno (ID)</label>
                    <input
                        className="form-input"
                        type="number"
                        min={1}
                        placeholder="Todos"
                        value={filters.shift_id}
                        onChange={(e) => set("shift_id", e.target.value)}
                    />
                </div>
            </div>

            <div className="modal-actions" style={{ borderTop: "none", paddingTop: 0 }}>
                <button
                    className="modal-btn secondary"
                    onClick={() => onChange({ date_from: "", date_to: "", status: "", method_payment: "", shift_id: "" })}
                >
                    Limpar filtros
                </button>

                <button className="modal-btn primary" onClick={onExportPdf} disabled={exporting}>
                    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <polyline points="9 15 12 18 15 15" />
                    </svg>
                    {exporting ? "A gerar PDF…" : "Exportar PDF"}
                </button>
            </div>
        </div>
    )
}