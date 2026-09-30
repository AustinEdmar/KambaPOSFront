import { getProductImageUrl } from "@/lib/products-data"

export { getProductImageUrl }

export interface OrderProduct {
    id: number
    name: string
    image_path: string | null
}

export interface OrderItem {
    id: number
    order_id: number
    product_id: number
    product_name: string
    product_code: string | null
    unit: string
    quantity: number
    unit_price: number | string
    discount_percent: number
    discount_amount: number
    iva_rate: number
    tax_code: string
    tax_exemption_reason: string | null
    iva_amount: number | string
    subtotal: number | string
    total_with_iva: number | string
    status: "active" | "refunded"
    product?: OrderProduct
}

export type OrderStatus = "open" | "closed" | "refunded" | "partial_refund"

export interface OrderUser {
    id: number
    name: string
}

export interface Order {
    id: number
    user_id: number
    shift_id: number
    customer_id: number | null
    status: OrderStatus
    subtotal: number | string
    iva: number | string
    discount: number | string
    total: number | string
    invoice_generated: boolean
    notes: string | null
    opened_at: string
    closed_at: string | null
    created_at: string
    updated_at: string
    items: OrderItem[]
    user?: OrderUser
}

export type PaymentMethod = "cash" | "card" | "qrcode" | "BankTransfer" | "multicaixa"

export interface Payment {
    id: number
    order_id: number
    shift_id: number
    user_id: number
    received: string | number | null
    change: string | number | null
    status: string
    method_payment: PaymentMethod
    amount: string | number
    currency: string
    paid_at: string
}




export const PAYMENT_METHOD_META: Record<PaymentMethod, { label: string; icon: string }> = {
    cash: { label: "Dinheiro", icon: "💵" },
    card: { label: "Cartão", icon: "💳" },
    qrcode: { label: "QR Code", icon: "📱" },
    BankTransfer: { label: "Transferência", icon: "🏦" },
    multicaixa: { label: "Multicaixa", icon: "🅜" },
}

export interface OrderStats {
    total_orders: number
    open_orders: number
    closed_orders: number
    refunded_orders: number
    total_revenue: number
}

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; bg: string; color: string }> = {
    open: { label: "Aberto", bg: "#EBEFF9", color: "#4B5578" },
    closed: { label: "Fechado", bg: "#E4F9F2", color: "#0D9668" },
    refunded: { label: "Reembolsado", bg: "#FDEDEE", color: "#E14356" },
    partial_refund: { label: "Reemb. parcial", bg: "#FFF4E5", color: "#B7791F" },
}

export function computeOrderStats(orders: Order[]): OrderStats {
    return {
        total_orders: orders.length,
        open_orders: orders.filter((o) => o.status === "open").length,
        closed_orders: orders.filter((o) => o.status === "closed").length,
        refunded_orders: orders.filter(
            (o) => o.status === "refunded" || o.status === "partial_refund"
        ).length,
        total_revenue: orders
            .filter((o) => o.status === "closed")
            .reduce((sum, o) => sum + toNumber(o.total), 0),
    }
}

export function filterOrders(
    orders: Order[],
    search: string,
    status: OrderStatus | ""
): Order[] {
    let result = orders

    if (status) {
        result = result.filter((o) => o.status === status)
    }

    const term = search.trim().toLowerCase()
    if (term) {
        result = result.filter((o) =>
            String(o.id).includes(term) ||
            (o.user?.name ?? "").toLowerCase().includes(term) ||
            o.items.some((i) => i.product_name.toLowerCase().includes(term))
        )
    }

    return result
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
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}