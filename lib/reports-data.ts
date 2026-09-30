export type OrderStatusFilter = "open" | "closed" | "refunded" | "partial_refund" | ""
export type PaymentMethodFilter = "cash" | "card" | "qrcode" | "BankTransfer" | "multicaixa" | ""

export interface ReportOrder {
    id: number
    status: string
    subtotal: number | string
    iva: number | string
    discount: number | string
    total: number | string
    created_at: string
    user?: { id: number; name: string }
}

export interface ReportSummary {
    total_sales: number | string
    total_subtotal: number | string
    total_iva: number | string
    total_discount: number | string
    orders_count: number
}

export interface ReportFilters {
    date_from: string
    date_to: string
    status: OrderStatusFilter
    method_payment: PaymentMethodFilter
    shift_id: string
}

export const DEFAULT_FILTERS: ReportFilters = {
    date_from: "",
    date_to: "",
    status: "",
    method_payment: "",
    shift_id: "",
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

export function buildQueryParams(filters: ReportFilters) {
    const params: Record<string, string> = {}
    if (filters.date_from) params.date_from = filters.date_from
    if (filters.date_to) params.date_to = filters.date_to
    if (filters.status) params.status = filters.status
    if (filters.method_payment) params.method_payment = filters.method_payment
    if (filters.shift_id) params.shift_id = filters.shift_id
    return params
}