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

interface OrderDetailsModalProps {
    order: Order
    payment?: Payment
    onClose: () => void
}

export function OrderDetailsModal({ order, payment, onClose }: OrderDetailsModalProps) {
    const meta = ORDER_STATUS_META[order.status]
    const payMeta = payment ? PAYMENT_METHOD_META[payment.method_payment] : null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal product-history-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-row">
                        <div>
                            <div className="modal-title">Pedido #{order.id}</div>
                            <div className="modal-id">{formatDateTime(order.opened_at)}</div>
                        </div>
                    </div>

                    <button className="modal-close" onClick={onClose}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div
                    className="modal-status-bar"
                    style={{ background: meta.bg, borderColor: meta.bg, color: meta.color }}
                >
                    <span className="modal-status-dot" style={{ background: meta.color }} />
                    <span className="modal-status-text">{meta.label}</span>
                </div>

                <div className="modal-grid">
                    <div className="modal-detail">
                        <span className="modal-detail-label">Funcionário</span>
                        <span className="modal-detail-value">{order.user?.name ?? "—"}</span>
                    </div>

                    <div className="modal-detail">
                        <span className="modal-detail-label">Fechado em</span>
                        <span className="modal-detail-value">{formatDateTime(order.closed_at)}</span>
                    </div>

                    <div className="modal-detail">
                        <span className="modal-detail-label">Pagamento</span>
                        <span className="modal-detail-value">
                            {payMeta ? `${payMeta.icon} ${payMeta.label}` : "—"}
                        </span>
                    </div>

                    <div className="modal-detail">
                        <span className="modal-detail-label">Factura emitida</span>
                        <span className="modal-detail-value">
                            {order.invoice_generated ? "Sim" : "Não"}
                        </span>
                    </div>
                </div>

                <div className="product-history-body">
                    {order.items.map((item) => {
                        const img = getProductImageUrl(item.product?.image_path)

                        return (
                            <div className="product-history-row" key={item.id}>
                                {img ? (
                                    <img src={img} alt={item.product_name} className="product-thumb" />
                                ) : (
                                    <span className="product-thumb product-thumb-empty">📦</span>
                                )}

                                <div className="product-history-info" style={{ flex: 1 }}>
                                    <span className="tx-name">{item.product_name}</span>
                                    <span className="tx-time">
                                        {item.quantity} × {formatCurrency(item.unit_price)}
                                        {item.status === "refunded" && " — reembolsado"}
                                    </span>
                                </div>

                                <span className="tx-price">{formatCurrency(item.total_with_iva)}</span>
                            </div>
                        )
                    })}
                </div>

                <div className="modal-summary">
                    <div className="modal-summary-row">
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                    </div>

                    <div className="modal-summary-row">
                        <span>IVA</span>
                        <span>{formatCurrency(order.iva)}</span>
                    </div>

                    {Number(order.discount) > 0 && (
                        <div className="modal-summary-row">
                            <span>Desconto</span>
                            <span>-{formatCurrency(order.discount)}</span>
                        </div>
                    )}

                    {payment?.received != null && (
                        <div className="modal-summary-row">
                            <span>Recebido</span>
                            <span>{formatCurrency(payment.received)}</span>
                        </div>
                    )}

                    {payment?.change != null && (
                        <div className="modal-summary-row">
                            <span>Troco</span>
                            <span>{formatCurrency(payment.change)}</span>
                        </div>
                    )}

                    <hr className="modal-summary-divider" />

                    <div className="modal-summary-row total">
                        <span>Total</span>
                        <span>{formatCurrency(order.total)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}