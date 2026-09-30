"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
    Order,
    Payment,
    ORDER_STATUS_META,
    PAYMENT_METHOD_META,
    formatCurrency,
    formatDateTime,
    getProductImageUrl,
} from "@/lib/orders-data"

interface OrdersTableProps {
    orders: Order[]
    payments: Record<number, Payment>
    loading: boolean
    onView: (order: Order) => void
    /** Deve chamar DELETE /orders/{id}/empty e lançar erro se falhar */
    onDelete: (order: Order) => Promise<void>
}

export function OrdersTable({ orders, payments, loading, onView, onDelete }: OrdersTableProps) {
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
    const [deleting, setDeleting] = useState(false)

    async function handleConfirmDelete() {
        if (!orderToDelete) return
        const order = orderToDelete

        // 1) Verificações no front (o backend valida novamente)
        if (order.status !== "open") {
            toast.error(`O pedido #${order.id} não pode ser apagado: só pedidos abertos podem ser removidos.`)
            setOrderToDelete(null)
            return
        }

        const hasItems = order.items.some((i) => i.status === "active")
        if (hasItems) {
            toast.error(`O pedido #${order.id} possui itens e não pode ser apagado.`)
            setOrderToDelete(null)
            return
        }

        // 2) Apagar
        try {
            setDeleting(true)
            await onDelete(order)
            toast.success(`Pedido vazio #${order.id} apagado com sucesso.`)
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message ??
                err?.message ??
                "Erro ao apagar o pedido."
            )
        } finally {
            setDeleting(false)
            setOrderToDelete(null)
        }
    }

    return (
        <div className="dash-card tx-card">
            <div className="tx-card-head">
                <div>
                    <h2 className="card-title">Pedidos</h2>
                    <p className="tx-count">{orders.length} pedidos encontrados</p>
                </div>
            </div>

            <div className="table-scroll">
                <table className="tx-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Pedido</th>
                            <th>Funcionário</th>
                            <th>Pagamento</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Aberto em</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={8} className="tx-date">A carregar…</td>
                            </tr>
                        )}

                        {!loading && orders.length === 0 && (
                            <tr>
                                <td colSpan={8} className="tx-date">Nenhum pedido encontrado.</td>
                            </tr>
                        )}

                        {!loading &&
                            orders.map((order) => {
                                const meta = ORDER_STATUS_META[order.status]
                                const firstItem = order.items[0]
                                const img = firstItem
                                    ? getProductImageUrl(firstItem.product?.image_path)
                                    : null
                                const payment = payments[order.id]
                                const payMeta = payment
                                    ? PAYMENT_METHOD_META[payment.method_payment]
                                    : null

                                return (
                                    <tr key={order.id} className="tx-row" onClick={() => onView(order)}>
                                        <td>
                                            {img ? (
                                                <img src={img} alt={firstItem?.product_name} className="product-thumb" />
                                            ) : (
                                                <span className="product-thumb product-thumb-empty">📦</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="tx-name">#{order.id}</div>
                                            <div className="tx-time">
                                                {order.items.reduce((s, i) => s + i.quantity, 0)} itens
                                            </div>
                                        </td>
                                        <td>{order.user?.name ?? "—"}</td>
                                        <td>
                                            {payMeta ? (
                                                <span className="payment-badge">
                                                    <span className="payment-badge-icon">{payMeta.icon}</span>
                                                    {payMeta.label}
                                                </span>
                                            ) : (
                                                <span className="tx-date">—</span>
                                            )}
                                        </td>
                                        <td className="tx-price">{formatCurrency(order.total)}</td>
                                        <td>
                                            <span
                                                className="tx-status"
                                                style={{ background: meta.bg, color: meta.color }}
                                            >
                                                {meta.label}
                                            </span>
                                        </td>
                                        <td className="tx-date">{formatDateTime(order.opened_at)}</td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <div className="tx-actions">
                                                <button
                                                    className="tx-more"
                                                    title="Ver detalhes"
                                                    onClick={() => onView(order)}
                                                >
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                </button>

                                                <button
                                                    className="tx-more tx-delete"
                                                    title="Apagar pedido"
                                                    onClick={() => setOrderToDelete(order)}
                                                >
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                        <path d="M10 11v6M14 11v6" />
                                                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>

            {/* Popup de confirmação */}
            {orderToDelete && (
                <div
                    className="confirm-overlay"
                    onClick={() => !deleting && setOrderToDelete(null)}
                >
                    <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="confirm-icon">🗑️</div>
                        <h3 className="confirm-title">Apagar pedido #{orderToDelete.id}?</h3>
                        <p className="confirm-text">
                            Só é possível apagar pedidos abertos e sem itens. Deseja continuar?
                        </p>
                        <div className="confirm-actions">
                            <button
                                className="confirm-btn confirm-no"
                                disabled={deleting}
                                onClick={() => setOrderToDelete(null)}
                            >
                                Não
                            </button>
                            <button
                                className="confirm-btn confirm-yes"
                                disabled={deleting}
                                onClick={handleConfirmDelete}
                            >
                                {deleting ? "A apagar…" : "Sim"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}