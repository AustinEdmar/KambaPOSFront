import { getProductImageUrl } from "@/lib/products-data"

export { getProductImageUrl }

export type StockMovementType = "sale" | "purchase" | "adjustment" | "loss" | "refund"

export interface StockMovementProduct {
    id: number
    name: string
    product_code: string | null
    unit: string
    image_path: string | null
}

export interface StockMovementUser {
    id: number
    name: string
}

export interface StockMovement {
    id: number
    product_id: number
    user_id: number
    type: StockMovementType
    quantity: number
    stock_before: number
    stock_after: number
    authorized_by: number | null
    reference_type: string | null
    reference_id: number | null
    note: string | null
    created_at: string
    updated_at: string
    user?: StockMovementUser
    product?: StockMovementProduct
}

export interface PaginatedStockMovements {
    data: StockMovement[]
    meta: {
        current_page: number
        from: number | null
        last_page: number
        per_page: number
        to: number | null
        total: number
    }
}

export const MOVEMENT_TYPE_META: Record<StockMovementType, { label: string; bg: string; color: string; icon: string }> = {
    sale: { label: "Venda", bg: "#FDEDEE", color: "#E14356", icon: "↓" },
    purchase: { label: "Entrada", bg: "#E4F9F2", color: "#0D9668", icon: "↑" },
    adjustment: { label: "Ajuste", bg: "#EBEFF9", color: "#4B5578", icon: "↻" },
    loss: { label: "Quebra", bg: "#FFF4E5", color: "#B7791F", icon: "⚠" },
    refund: { label: "Reembolso", bg: "#F0ECFF", color: "#7657C8", icon: "↑" },
}

export interface StockMovementStats {
    total: number
    inbound: number
    outbound: number
    adjustments: number
    losses: number
}

// NOTA: como a API pagina os movimentos, só "total" (meta.total) reflete a
// tabela inteira. Os restantes contadores são calculados apenas sobre os
// registos atualmente carregados (a página em exibição) — não é uma
// contagem global. Para stats globais fiáveis, o backend precisaria de
// devolver esses agregados (tal como já faz em /products com "stats").
export function computeMovementStats(
    pageMovements: StockMovement[],
    total: number
): StockMovementStats {
    return {
        total,
        inbound: pageMovements.filter((m) => m.quantity > 0).length,
        outbound: pageMovements.filter((m) => m.quantity < 0).length,
        adjustments: pageMovements.filter((m) => m.type === "adjustment").length,
        losses: pageMovements.filter((m) => m.type === "loss").length,
    }
}

export function filterMovements(
    movements: StockMovement[],
    search: string,
    type: StockMovementType | ""
): StockMovement[] {
    let result = movements

    if (type) {
        result = result.filter((m) => m.type === type)
    }

    const term = search.trim().toLowerCase()
    if (term) {
        result = result.filter((m) =>
            (m.product?.name ?? "").toLowerCase().includes(term) ||
            (m.product?.product_code ?? "").toLowerCase().includes(term) ||
            (m.user?.name ?? "").toLowerCase().includes(term) ||
            (m.note ?? "").toLowerCase().includes(term)
        )
    }

    return result
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