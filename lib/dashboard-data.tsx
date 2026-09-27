export type Period = "hoje" | "semana" | "mes"
export type TxStatus = "pago" | "pendente" | "cancelado"

export interface Transaction {
  id: string
  name: string
  date: string
  time: string
  qty: number
  price: string
  priceNum: number
  status: TxStatus
  emoji: string
  table: string
  staff: string
  category: string
}

export const STATS = [
  {
    label: "Total Vendas",
    value: "2.421",
    change: "+12,4%",
    up: true,
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
    color: "#3554C1", bg: "rgba(53,84,193,0.08)",
  },
  {
    label: "Total Pedidos",
    value: "1.821",
    change: "+8,1%",
    up: true,
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 12h3M12 16h3M9 12h.01M9 16h.01" /></svg>,
    color: "#8B5CF6", bg: "#F3EEFF",
  },
  {
    label: "Receita Total",
    value: "$9.431",
    change: "+5,6%",
    up: true,
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
    color: "#10B981", bg: "#ECFDF5",
  },
  {
    label: "Cancelamentos",
    value: "124",
    change: "-2,3%",
    up: false,
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
    color: "#EF4444", bg: "#FEF2F2",
  },
]

export const CHART_DATA = [
  { day: "15/03", value: 38000 },
  { day: "16/03", value: 112000 },
  { day: "17/03", value: 65000 },
  { day: "18/03", value: 158000 },
  { day: "19/03", value: 134000 },
  { day: "20/03", value: 94127, active: true },
  { day: "21/03", value: 78000 },
]

export const POPULAR = [
  { name: "Pho Vietnamita", qty: 129, total: "$4.128", trend: 14, emoji: "🍜" },
  { name: "Arroz Frito", qty: 98, total: "$3.136", trend: 8, emoji: "🍳" },
  { name: "Char Kuey Teow", qty: 76, total: "$2.432", trend: -3, emoji: "🥘" },
  { name: "Pad Thai", qty: 61, total: "$1.952", trend: 22, emoji: "🍝" },
  { name: "Laksa", qty: 44, total: "$1.408", trend: 5, emoji: "🍲" },
]

export const ALL_TRANSACTIONS: Transaction[] = [
  { id: "TX-0091", name: "Pho Vietnamita", date: "12 Set, 2025", time: "14:32", qty: 2, price: "$38", priceNum: 38, status: "pago", emoji: "🍜", table: "Mesa 4", staff: "Ana Lima", category: "Pratos Principais" },
  { id: "TX-0090", name: "Salada Especial", date: "12 Set, 2025", time: "13:58", qty: 1, price: "$22", priceNum: 22, status: "pago", emoji: "🥗", table: "Mesa 7", staff: "Carlos Dias", category: "Entradas" },
  { id: "TX-0089", name: "Tomato Burger", date: "11 Set, 2025", time: "19:47", qty: 2, price: "$56", priceNum: 56, status: "pendente", emoji: "🍔", table: "Mesa 2", staff: "Ana Lima", category: "Pratos Principais" },
  { id: "TX-0088", name: "Laksa", date: "11 Set, 2025", time: "20:03", qty: 1, price: "$16", priceNum: 16, status: "cancelado", emoji: "🍲", table: "Mesa 1", staff: "João Mendes", category: "Pratos Principais" },
  { id: "TX-0087", name: "Pad Thai", date: "10 Set, 2025", time: "12:30", qty: 3, price: "$48", priceNum: 48, status: "pago", emoji: "🍝", table: "Mesa 5", staff: "Carlos Dias", category: "Pratos Principais" },
  { id: "TX-0086", name: "Arroz Frito", date: "10 Set, 2025", time: "18:15", qty: 2, price: "$32", priceNum: 32, status: "pago", emoji: "🍳", table: "Mesa 3", staff: "João Mendes", category: "Pratos Principais" },
  { id: "TX-0085", name: "Suco de Manga", date: "09 Set, 2025", time: "11:00", qty: 4, price: "$20", priceNum: 20, status: "pago", emoji: "🥭", table: "Mesa 6", staff: "Ana Lima", category: "Bebidas" },
  { id: "TX-0084", name: "Chá Verde", date: "09 Set, 2025", time: "16:22", qty: 2, price: "$10", priceNum: 10, status: "pago", emoji: "🍵", table: "Mesa 8", staff: "Carlos Dias", category: "Bebidas" },
  { id: "TX-0083", name: "Mochi Sorvete", date: "08 Set, 2025", time: "14:44", qty: 6, price: "$36", priceNum: 36, status: "pendente", emoji: "🍡", table: "Mesa 2", staff: "João Mendes", category: "Sobremesas" },
  { id: "TX-0082", name: "Char Kuey Teow", date: "08 Set, 2025", time: "19:05", qty: 2, price: "$64", priceNum: 64, status: "pago", emoji: "🥘", table: "Mesa 9", staff: "Ana Lima", category: "Pratos Principais" },
  { id: "TX-0081", name: "Noodle Soup", date: "07 Set, 2025", time: "12:10", qty: 1, price: "$18", priceNum: 18, status: "cancelado", emoji: "🍜", table: "Mesa 4", staff: "Carlos Dias", category: "Pratos Principais" },
  { id: "TX-0080", name: "Tapiokas Doces", date: "07 Set, 2025", time: "15:55", qty: 3, price: "$27", priceNum: 27, status: "pago", emoji: "🧆", table: "Mesa 11", staff: "João Mendes", category: "Sobremesas" },
  { id: "TX-0079", name: "Pho Vietnamita", date: "06 Set, 2025", time: "13:20", qty: 1, price: "$19", priceNum: 19, status: "pago", emoji: "🍜", table: "Mesa 6", staff: "Ana Lima", category: "Pratos Principais" },
  { id: "TX-0078", name: "Água de Coco", date: "06 Set, 2025", time: "11:45", qty: 2, price: "$12", priceNum: 12, status: "pago", emoji: "🥥", table: "Mesa 3", staff: "Carlos Dias", category: "Bebidas" },
  { id: "TX-0077", name: "Gyoza Frito", date: "05 Set, 2025", time: "18:00", qty: 5, price: "$45", priceNum: 45, status: "pendente", emoji: "🥟", table: "Mesa 7", staff: "João Mendes", category: "Entradas" },
  { id: "TX-0076", name: "Pad Thai", date: "05 Set, 2025", time: "20:30", qty: 2, price: "$32", priceNum: 32, status: "pago", emoji: "🍝", table: "Mesa 5", staff: "Ana Lima", category: "Pratos Principais" },
  { id: "TX-0075", name: "Chá de Jasmim", date: "04 Set, 2025", time: "16:00", qty: 3, price: "$18", priceNum: 18, status: "pago", emoji: "🍵", table: "Mesa 10", staff: "Carlos Dias", category: "Bebidas" },
  { id: "TX-0074", name: "Mochi Sorvete", date: "04 Set, 2025", time: "14:12", qty: 4, price: "$24", priceNum: 24, status: "cancelado", emoji: "🍡", table: "Mesa 1", staff: "João Mendes", category: "Sobremesas" },
]

export const STATUS_META: Record<TxStatus, { bg: string; text: string; label: string; border: string }> = {
  pago: { bg: "#ECFDF5", text: "#059669", label: "Pago", border: "#D1FAE5" },
  pendente: { bg: "#FFF7ED", text: "#F97316", label: "Pendente", border: "#FED7AA" },
  cancelado: { bg: "#FEF2F2", text: "#EF4444", label: "Cancelado", border: "#FECACA" },
}

export const PAGE_SIZE = 6
