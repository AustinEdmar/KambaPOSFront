export interface ShiftUser {
  id: number
  name: string
}

export type ShiftStatus = "open" | "closed"

export interface Shift {
  id: number
  user_id: number
  initial_amount: string
  expected_cash_amount: string | null
  difference: string | null
  gross_sales: string
  refund_total: string
  net_sales: string
  final_cash_amount: string | null
  status: ShiftStatus
  terminal_id: string
  opened_at: string
  closed_at: string | null
  created_at: string
  updated_at: string
  orders_count?: number
  user?: ShiftUser
}

export interface ShiftDetail extends Shift {
  orders?: unknown[]
  payments?: unknown[]
  refunds?: unknown[]
  cashMovements?: unknown[]
}

export interface PaginatedShifts {
  current_page: number
  data: Shift[]
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface CloseShiftResult {
  message: string
  gross_sales: string | number
  refund_total: string | number
  net_sales: string | number
  expected_cash: string | number
  final_cash: string | number
  difference: string | number
}

export const SHIFT_STATUS_META: Record<ShiftStatus, { bg: string; text: string; label: string }> = {
  open: { bg: "#E4F9F2", text: "#0D9668", label: "Aberto" },
  closed: { bg: "#EBEFF9", text: "#4B5578", label: "Fechado" },
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