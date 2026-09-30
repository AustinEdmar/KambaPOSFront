"use client"

import { DocumentType, InvoiceStatus, InvoiceFilters } from "@/lib/invoices-data"

interface InvoicesToolbarProps {
    filters: InvoiceFilters
    onChange: (filters: InvoiceFilters) => void
}

const DOC_TYPES: { value: DocumentType | ""; label: string }[] = [
    { value: "", label: "Todos" },
    { value: "FT", label: "FT" },
    { value: "FR", label: "FR" },
    { value: "TV", label: "TV" },
    { value: "NC", label: "NC" },
    { value: "ND", label: "ND" },
    { value: "RC", label: "RC" },
    { value: "RG", label: "RG" },
]

export function InvoicesToolbar({ filters, onChange }: InvoicesToolbarProps) {
    const set = <K extends keyof InvoiceFilters>(key: K, value: InvoiceFilters[K]) =>
        onChange({ ...filters, [key]: value })

    return (
        <div className="dash-topbar">
            <div>
                <h1 className="dash-title">Facturas</h1>
                <p className="dash-subtitle">Documentos fiscais e submissão AGT</p>
            </div>

            <div className="dash-filters">
                <div className="dash-search">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Pesquisar por número ou cliente…"
                        value={filters.search}
                        onChange={(e) => set("search", e.target.value)}
                    />
                </div>

                {DOC_TYPES.map((t) => (
                    <button
                        key={t.value}
                        className={`dash-filter-btn ${filters.document_type === t.value ? "active" : ""}`}
                        onClick={() => set("document_type", t.value)}
                    >
                        {t.label}
                    </button>
                ))}

                <select
                    className="form-input products-select"
                    value={filters.status}
                    onChange={(e) => set("status", e.target.value as InvoiceStatus | "")}
                >
                    <option value="">Todos os estados</option>
                    <option value="issued">Emitida</option>
                    <option value="cancelled">Anulada</option>
                    <option value="credited">Creditada</option>
                </select>

                <input
                    className="form-input"
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => set("date_from", e.target.value)}
                    style={{ width: 140 }}
                />
                <input
                    className="form-input"
                    type="date"
                    value={filters.date_to}
                    onChange={(e) => set("date_to", e.target.value)}
                    style={{ width: 140 }}
                />
            </div>
        </div>
    )
}