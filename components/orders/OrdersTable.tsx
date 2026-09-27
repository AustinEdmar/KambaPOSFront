"use client"

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
}

export function OrdersTable({ orders, payments, loading, onView }: OrdersTableProps) {
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
                                            <button className="tx-more" title="Ver detalhes" onClick={() => onView(order)}>
                                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}