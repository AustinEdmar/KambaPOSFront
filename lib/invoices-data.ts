export type DocumentType = "FT" | "FR" | "TV" | "NC" | "ND" | "RC" | "RG"
export type InvoiceStatus = "issued" | "cancelled" | "credited"
export type FeStatus = "not_sent" | "pending" | "valid" | "invalid" | null

export interface InvoiceCustomer {
    id: number
    name: string
    tax_number: string | null
}

export interface InvoiceUser {
    id: number
    name: string
}

export interface InvoiceShift {
    id: number
    terminal_id: string | null
    opened_at: string
}

export interface InvoiceTaxSummary {
    id: number
    tax_code: string
    tax_rate: number
    taxable_amount: number | string
    tax_amount: number | string
    tax_exemption_reason: string | null
}

export interface InvoiceItem {
    id: number
    product_id: number | null
    description: string
    product_code: string | null
    unit: string
    quantity: number
    unit_price: number | string
    tax_rate: number
    tax_code: string
    net_amount: number | string
    tax_amount: number | string
    gross_amount: number | string
}

export interface Invoice {
    id: number
    order_id: number
    customer_id: number | null
    user_id: number
    shift_id: number
    document_type: DocumentType
    series: string
    sequence_number: number
    invoice_number: string
    taxable_amount: number | string
    tax_amount: number | string
    total_amount: number | string
    discount_amount: number | string
    paid_amount: number | string
    amount_outstanding?: number | string
    currency: string
    status: InvoiceStatus
    fe_status?: FeStatus
    agt_document_no?: string | null
    credit_note_id: number | null
    debit_note_id: number | null
    reference_reason: string | null
    issued_at: string
    delivered_at: string | null
    notes: string | null
    customer?: InvoiceCustomer
    user?: InvoiceUser
    shift?: InvoiceShift
    taxSummaries?: InvoiceTaxSummary[]
    items?: InvoiceItem[]
}

export interface InvoiceTotals {
    total_invoices: number
    total_revenue: number | string
    total_iva: number | string
    total_taxable: number | string
    total_discount: number | string
}

export const DOCUMENT_TYPE_META: Record<DocumentType, { label: string; bg: string; color: string }> = {
    FT: { label: "Factura", bg: "#EBEFF9", color: "#4B5578" },
    FR: { label: "Factura-Recibo", bg: "#E4F9F2", color: "#0D9668" },
    TV: { label: "Talão de Venda", bg: "#E4F9F2", color: "#0D9668" },
    NC: { label: "Nota de Crédito", bg: "#FDEDEE", color: "#E14356" },
    ND: { label: "Nota de Débito", bg: "#FFF4E5", color: "#B7791F" },
    RC: { label: "Recibo", bg: "#F0ECFF", color: "#7657C8" },
    RG: { label: "Recibo Geral", bg: "#F0ECFF", color: "#7657C8" },
}

export const INVOICE_STATUS_META: Record<InvoiceStatus, { label: string; bg: string; color: string }> = {
    issued: { label: "Emitida", bg: "#E4F9F2", color: "#0D9668" },
    cancelled: { label: "Anulada", bg: "#FDEDEE", color: "#E14356" },
    credited: { label: "Creditada", bg: "#FFF4E5", color: "#B7791F" },
}

export const FE_STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
    not_sent: { label: "Não enviada", bg: "#EBEFF9", color: "#4B5578" },
    pending: { label: "Pendente AGT", bg: "#FFF4E5", color: "#B7791F" },
    valid: { label: "Aceite AGT", bg: "#E4F9F2", color: "#0D9668" },
    invalid: { label: "Rejeitada AGT", bg: "#FDEDEE", color: "#E14356" },
}

export function toNumber(value: string | number | null | undefined): number {
    if (value === null || value === undefined) return 0
    const num = typeof value === "string" ? parseFloat(value) : value
    return Number.isNaN(num) ? 0 : num
}

export function formatCurrency(value: string | number | null | undefined): string {
    const num = toNumber(value)
    return `${num.toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`
}

export function formatDateTime(value: string | null | undefined): string {
    if (!value) return "—"
    const safe = value.replace(/(\.\d{3})\d*Z$/, "$1Z")
    const date = new Date(safe)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString("pt-PT", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    })
}

export interface InvoiceFilters {
    document_type: DocumentType | ""
    status: InvoiceStatus | ""
    date_from: string
    date_to: string
    search: string
}

export const DEFAULT_INVOICE_FILTERS: InvoiceFilters = {
    document_type: "",
    status: "",
    date_from: "",
    date_to: "",
    search: "",
}

export function buildInvoiceQueryParams(filters: InvoiceFilters) {
    const params: Record<string, string> = {}
    if (filters.document_type) params.document_type = filters.document_type
    if (filters.status) params.status = filters.status
    if (filters.date_from) params.date_from = filters.date_from
    if (filters.date_to) params.date_to = filters.date_to
    if (filters.search) params.search = filters.search
    return params
}