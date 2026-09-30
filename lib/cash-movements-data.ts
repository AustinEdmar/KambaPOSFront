export type CashMovementType = "inflow" | "outflow"

export interface CashMovementUser {
    id: number
    name: string
}

export interface CashMovement {
    id: number
    shift_id: number
    user_id: number
    type: CashMovementType
    amount: string | number
    currency: string
    reason: string | null
    created_at: string
    updated_at: string
    user?: CashMovementUser
}

export interface CashMovementsCurrent {
    shift_id: number
    total_inflow: number | string
    total_outflow: number | string
    net: number | string
    movements: CashMovement[]
}

export const CASH_MOVEMENT_TYPE_META: Record<CashMovementType, { label: string; bg: string; color: string; icon: string }> = {
    inflow: { label: "Reforço", bg: "#E4F9F2", color: "#0D9668", icon: "↑" },
    outflow: { label: "Sangria", bg: "#FDEDEE", color: "#E14356", icon: "↓" },
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

export function filterMovements(movements: CashMovement[], search: string, type: CashMovementType | ""): CashMovement[] {
    let result = movements

    if (type) {
        result = result.filter((m) => m.type === type)
    }

    const term = search.trim().toLowerCase()
    if (term) {
        result = result.filter((m) =>
            (m.reason ?? "").toLowerCase().includes(term) ||
            (m.user?.name ?? "").toLowerCase().includes(term)
        )
    }

    return result
}