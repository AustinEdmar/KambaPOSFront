export const TAX_CODES = ["NOR", "INT", "RED", "ISE", "OUT"] as const
export type TaxCode = typeof TAX_CODES[number]

export const TAX_CODE_LABELS: Record<TaxCode, string> = {
  NOR: "Normal",
  INT: "Intermédia",
  RED: "Reduzida",
  ISE: "Isenta",
  OUT: "Outra",
}

export interface TaxRate {
  id: number
  tax_type: string
  tax_code: TaxCode
  description: string
  tax_percentage: string | number
  country: string
  is_active: boolean
  exemption_reason: string | null
  created_at: string
  updated_at: string
}

export function formatPercentage(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "—"
  const num = typeof value === "string" ? parseFloat(value) : value
  if (Number.isNaN(num)) return "—"
  return `${num}%`
}
