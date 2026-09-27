export interface Category {
    id: number
    name: string
}

export interface TaxRate {
    id: number
    tax_code: string
    description: string
    tax_percentage: string | number
    exemption_reason?: string | null
}

export interface ProductStats {
    total_products: number
    active_products: number
    total_stock: number
    low_stock_products: number
    stock_value: number
}

export interface Product {
    id: number
    category_id: number | null
    tax_rate_id: number
    name: string
    description: string | null
    price: string | number
    product_code: string | null
    unit: string
    tax_exemption_reason: string | null
    stock: number
    barcode: string | null
    is_active: boolean
    image_path: string | null
    created_at: string
    updated_at: string
    category?: Category | null
    // A API devolve a relação Eloquent taxRate() serializada como "tax_rate"
    // (Laravel converte nomes de relação camelCase para snake_case no JSON).
    tax_rate?: TaxRate | null
}

export interface PaginatedProducts {
    current_page: number
    data: Product[]
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
    stats: ProductStats
}

export type StockMovementType = "purchase" | "adjustment" | "loss" | "sale" | "refund"

export interface StockMovement {
    id: number
    product_id: number
    user_id: number
    type: StockMovementType
    quantity: number
    stock_before: number
    stock_after: number
    note: string | null
    created_at: string
    user?: { id: number; name: string }
}

export interface PaginatedStockMovements {
    current_page: number
    data: StockMovement[]
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
}

export const STOCK_MOVEMENT_META: Record<StockMovementType, { label: string; color: string }> = {
    purchase: { label: "Entrada", color: "#0D9668" },
    adjustment: { label: "Ajuste", color: "#4B5578" },
    loss: { label: "Quebra", color: "#E14356" },
    sale: { label: "Venda", color: "#3554C1" },
    refund: { label: "Reembolso", color: "#B7791F" },
}

/** Normaliza listas de referência (categorias, taxas) que podem vir
 * paginadas (Laravel apiResource) ou como array simples. */
export function unwrapList<T>(payload: unknown): T[] {
    if (Array.isArray(payload)) return payload as T[]
    if (payload && typeof payload === "object" && Array.isArray((payload as any).data)) {
        return (payload as any).data as T[]
    }
    return []
}

export function getProductImageUrl(path: string | null | undefined): string | null {
    if (!path) return null
    const base = process.env.NEXT_PUBLIC_API_IMAGE ?? ""
    return `${base}/storage/${path}`
}

export function formatCurrency(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return "—"
    const num = typeof value === "string" ? parseFloat(value) : value
    if (Number.isNaN(num)) return "—"
    return `${num.toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`
}

export function formatDateTime(value: string | null | undefined): string {
    if (!value) return "—"
    // Laravel devolve microssegundos (6 dígitos) — o Date só aceita milissegundos (3)
    const safe = value.replace(/(\.\d{3})\d*Z$/, "$1Z")
    const date = new Date(safe)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
}