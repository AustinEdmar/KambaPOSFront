"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"
import { PaginatedProducts, Product, Category, unwrapList, getProductImageUrl } from "@/lib/products-data"
import {
    Order,
    OrderItem,
    PaymentMethod,
    PAYMENT_METHOD_META,
    formatCurrency,
    toNumber,
} from "@/lib/orders-data"

interface SaleModalProps {
    onClose: () => void
    onCompleted?: () => void
}



const METHODS = Object.keys(PAYMENT_METHOD_META) as PaymentMethod[]

export function SaleModal({ onClose, onCompleted }: SaleModalProps) {
    const onDragStart = (e: React.MouseEvent) => {
        const el = scrollRef.current
        if (!el) return
        dragState.current = {
            isDown: true,
            startX: e.pageX - el.offsetLeft,
            scrollLeft: el.scrollLeft,
            moved: false,
        }
        setIsDragging(true)
    }

    const onDragMove = (e: React.MouseEvent) => {
        const el = scrollRef.current
        if (!el || !dragState.current.isDown) return
        e.preventDefault()
        const x = e.pageX - el.offsetLeft
        const walk = x - dragState.current.startX
        if (Math.abs(walk) > 4) dragState.current.moved = true
        el.scrollLeft = dragState.current.scrollLeft - walk
    }

    const endDrag = () => {
        dragState.current.isDown = false
        setIsDragging(false)
    }

    // impede que um "click" dispare logo a seguir a um arrasto
    const handleCategoryClick = (id: string) => {
        if (dragState.current.moved) return
        setCategoryId(id)
    }
    const [order, setOrder] = useState<Order | null>(null)
    const [initializing, setInitializing] = useState(true)

    const [categories, setCategories] = useState<Category[]>([])
    const [categoryId, setCategoryId] = useState<string>("")

    // drag-to-scroll
    const scrollRef = useRef<HTMLDivElement>(null)
    const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false })
    const [isDragging, setIsDragging] = useState(false)

    const [products, setProducts] = useState<Product[]>([])
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [search, setSearch] = useState("")

    const [busy, setBusy] = useState(false)

    // PIN para diminuir/remover itens
    const [pinTarget, setPinTarget] = useState<{ item: OrderItem; quantity: number } | null>(null)
    const [pin, setPin] = useState("")

    // Pagamento
    const [step, setStep] = useState<"cart" | "payment">("cart")
    const [method, setMethod] = useState<PaymentMethod>("cash")
    const [received, setReceived] = useState("")

    const startedRef = useRef(false)

    const activeItems = (order?.items ?? []).filter((i) => i.status === "active")
    const total = toNumber(order?.total)
    const receivedNum = toNumber(received)
    const change = Math.max(0, receivedNum - total)
    const canPay =
        activeItems.length > 0 && (method !== "cash" || receivedNum >= total)

    // ── Pedido ───────────────────────────────────────────
    const fetchOrder = async (id: number): Promise<Order | null> => {
        const { data } = await api.get<Order[]>("/orders")
        return data.find((o) => o.id === id && o.status === "open") ?? null
    }

    const ensureOrder = useCallback(async () => {
        try {
            const { data } = await api.post<Order>("/orders/open")
            setOrder({ ...data, items: [] })
        } catch (error: any) {
            if (error?.response?.status === 409) {
                // já existe um pedido aberto — retoma-o
                const id = error.response.data?.order?.id
                const found = id ? await fetchOrder(id) : null
                if (found) setOrder(found)
                return
            }
            toast.error(error?.response?.data?.message ?? "Não foi possível abrir o pedido.")
            onClose()
        }
    }, [onClose])

    const reload = async () => {
        if (!order) return
        const fresh = await fetchOrder(order.id)
        if (fresh) setOrder(fresh)
        else await ensureOrder()
        fetchProducts(search, categoryId, true)
    }

    useEffect(() => {
        if (startedRef.current) return
        startedRef.current = true
        ensureOrder().finally(() => setInitializing(false))
    }, [ensureOrder])

    // ── Categorias ─────────────────────────────────────────
    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await api.get("/categories", { params: { per_page: 100 } })
            setCategories(unwrapList<Category>(data))
        } catch {
            setCategories([])
        }
    }, [])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    // ── Produtos ─────────────────────────────────────────
    const fetchProducts = useCallback(async (term: string, catId: string, silent = false) => {
        if (!silent) setLoadingProducts(true)
        try {
            const { data } = await api.get<PaginatedProducts>("/products", {
                params: {
                    only_active: 1,
                    per_page: 100,
                    search: term || undefined,
                    category_id: catId || undefined,
                },
            })
            setProducts(data.data)
        } catch {
            setProducts([])
        } finally {
            setLoadingProducts(false)
        }
    }, [])

    useEffect(() => {
        const t = setTimeout(() => fetchProducts(search, categoryId), 300)
        return () => clearTimeout(t)
    }, [search, categoryId, fetchProducts])


    // ── Acções do carrinho ───────────────────────────────
    const addProduct = async (product: Product) => {
        if (!order || busy) return
        setBusy(true)
        try {
            await api.post(`/orders/${order.id}/add-item`, {
                product_id: product.id,
                quantity: 1,
            })
            await reload()
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                error?.response?.data?.error ??
                "Erro ao adicionar produto."
            )
        } finally {
            setBusy(false)
        }
    }

    const confirmDecrement = async () => {
        if (!order || !pinTarget || busy) return
        setBusy(true)
        try {
            await api.post(`/orders/${order.id}/decrement-item`, {
                product_id: pinTarget.item.product_id,
                quantity: pinTarget.quantity,
                authorization_pin: pin,
            })
            setPinTarget(null)
            setPin("")
            await reload()
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                error?.response?.data?.error ??
                "Erro ao remover item."
            )
        } finally {
            setBusy(false)
        }
    }

    // ── Fechar venda ─────────────────────────────────────
    const finishSale = async () => {
        if (!order || !canPay || busy) return
        setBusy(true)
        try {
            const body: Record<string, unknown> = {
                payment_method: method,
                document_type: "FR",
                currency: "AOA",
            }

            if (method === "cash") {
                body.received = receivedNum
                body.change = Number(change.toFixed(2))
            }

            const { data } = await api.post(`/orders/${order.id}/close`, body)

            toast.success(`Venda concluída — ${data.invoice_number}`)
            onCompleted?.()
            onClose()
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                error?.response?.data?.error ??
                "Erro ao fechar a venda."
            )
        } finally {
            setBusy(false)
        }
    }

    // ── UI ───────────────────────────────────────────────
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal sale-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <div className="modal-title">Nova venda</div>
                        <div className="modal-id">
                            {order ? `Pedido #${order.id}` : "A preparar pedido…"}
                        </div>
                    </div>

                    <button className="modal-close" onClick={onClose} title="Fechar">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="sale-body">
                    {/* ── Produtos ── */}
                    <section className="sale-products">
                        <div className="sale-products-head">
                            <div className="dash-search" style={{ width: "100%" }}>
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Pesquisar produto, código ou barcode…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div
                            ref={scrollRef}
                            className={`sale-categories ${isDragging ? "dragging" : ""}`}
                            onMouseDown={onDragStart}
                            onMouseMove={onDragMove}
                            onMouseUp={endDrag}
                            onMouseLeave={endDrag}
                        >
                            <button
                                type="button"
                                className={`sale-category-card ${categoryId === "" ? "active" : ""}`}
                                onClick={() => handleCategoryClick("")}
                            >
                                <span className="sale-category-icon">☰</span>
                                Todas
                            </button>

                            {categories.map((c) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    className={`sale-category-card ${categoryId === String(c.id) ? "active" : ""}`}
                                    onClick={() => handleCategoryClick(String(c.id))}
                                >
                                    <span className="sale-category-icon">{c.name.charAt(0).toUpperCase()}</span>
                                    {c.name}
                                </button>
                            ))}
                        </div>

                        <div className="sale-grid">
                            {loadingProducts && <p className="tx-date">A carregar…</p>}

                            {!loadingProducts && products.length === 0 && (
                                <p className="tx-date">Nenhum produto encontrado.</p>
                            )}

                            {!loadingProducts &&
                                products.map((p) => {
                                    const img = getProductImageUrl(p.image_path)
                                    const out = p.stock <= 0

                                    return (
                                        <button
                                            key={p.id}
                                            type="button"
                                            className="sale-product"
                                            disabled={out || busy || !order}
                                            onClick={() => addProduct(p)}
                                        >
                                            <div className="sale-product-img">
                                                {img ? <img src={img} alt={p.name} /> : <span>📦</span>}
                                            </div>
                                            <div className="sale-product-name">{p.name}</div>
                                            <div className="sale-product-meta">
                                                <span className="tx-price">{formatCurrency(p.price)}</span>
                                                <span className={out ? "shift-diff-negative" : "tx-time"}>
                                                    {out ? "Sem stock" : `${p.stock} ${p.unit}`}
                                                </span>
                                            </div>
                                        </button>
                                    )
                                })}
                        </div>
                    </section>

                    {/* ── Carrinho / Pagamento ── */}
                    <aside className="sale-cart">
                        {step === "cart" ? (
                            <>
                                <div className="sale-cart-title">
                                    Carrinho
                                    <span className="tx-time">{activeItems.length} produtos</span>
                                </div>

                                <div className="sale-cart-list">
                                    {initializing && <p className="tx-date">A abrir pedido…</p>}

                                    {!initializing && activeItems.length === 0 && (
                                        <p className="tx-date">Selecione produtos para começar.</p>
                                    )}

                                    {activeItems.map((item) => {
                                        const img = getProductImageUrl(item.product?.image_path)

                                        return (
                                            <div className="sale-line" key={item.id}>
                                                {img ? (
                                                    <img src={img} alt={item.product_name} className="product-thumb" />
                                                ) : (
                                                    <span className="product-thumb product-thumb-empty">📦</span>
                                                )}

                                                <div className="sale-line-info">
                                                    <span className="tx-name">{item.product_name}</span>
                                                    <span className="tx-time">{formatCurrency(item.unit_price)}</span>

                                                    <div className="sale-qty">
                                                        <button
                                                            type="button"
                                                            disabled={busy}
                                                            onClick={() => setPinTarget({ item, quantity: 1 })}
                                                        >
                                                            −
                                                        </button>
                                                        <span>{item.quantity}</span>
                                                        <button
                                                            type="button"
                                                            disabled={busy}
                                                            onClick={() =>
                                                                addProduct({ id: item.product_id } as Product)
                                                            }
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="sale-line-side">
                                                    <span className="tx-price">{formatCurrency(item.total_with_iva)}</span>
                                                    <button
                                                        type="button"
                                                        className="tx-more"
                                                        title="Remover"
                                                        onClick={() =>
                                                            setPinTarget({ item, quantity: item.quantity })
                                                        }
                                                    >
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {pinTarget && (
                                    <div className="sale-pin">
                                        <label className="form-label">
                                            PIN de autorização — {pinTarget.quantity === pinTarget.item.quantity ? "remover" : "diminuir"}{" "}
                                            {pinTarget.item.product_name}
                                        </label>
                                        <input
                                            className="form-input"
                                            type="password"
                                            inputMode="numeric"
                                            value={pin}
                                            autoFocus
                                            onChange={(e) => setPin(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && pin && confirmDecrement()}
                                        />
                                        <div className="sale-pin-actions">
                                            <button
                                                className="modal-btn secondary"
                                                onClick={() => {
                                                    setPinTarget(null)
                                                    setPin("")
                                                }}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                className="modal-btn primary"
                                                disabled={!pin || busy}
                                                onClick={confirmDecrement}
                                            >
                                                Confirmar
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="sale-totals">
                                    <div className="modal-summary-row">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(order?.subtotal)}</span>
                                    </div>
                                    <div className="modal-summary-row">
                                        <span>IVA</span>
                                        <span>{formatCurrency(order?.iva)}</span>
                                    </div>
                                    <div className="modal-summary-row total">
                                        <span>Total</span>
                                        <span>{formatCurrency(order?.total)}</span>
                                    </div>

                                    <button
                                        className="modal-btn primary"
                                        style={{ width: "100%", marginTop: 8 }}
                                        disabled={activeItems.length === 0 || busy}
                                        onClick={() => setStep("payment")}
                                    >
                                        Pagar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="sale-cart-title">
                                    Pagamento
                                    <span className="tx-price">{formatCurrency(order?.total)}</span>
                                </div>

                                <div className="sale-cart-list">
                                    <label className="form-label">Método de pagamento</label>

                                    <div className="sale-methods">
                                        {METHODS.map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                className={`sale-method ${method === m ? "active" : ""}`}
                                                onClick={() => setMethod(m)}
                                            >
                                                <span>{PAYMENT_METHOD_META[m].icon}</span>
                                                {PAYMENT_METHOD_META[m].label}
                                            </button>
                                        ))}
                                    </div>

                                    {method === "cash" && (
                                        <div className="form-group" style={{ marginTop: 14 }}>
                                            <label className="form-label">Valor recebido</label>
                                            <input
                                                className="form-input"
                                                type="number"
                                                min={0}
                                                value={received}
                                                placeholder="0,00"
                                                onChange={(e) => setReceived(e.target.value)}
                                            />

                                            <button
                                                type="button"
                                                className="dash-filter-btn"
                                                style={{ alignSelf: "flex-start" }}
                                                onClick={() => setReceived(String(total))}
                                            >
                                                Valor exato
                                            </button>

                                            <div className="modal-summary-row" style={{ marginTop: 6 }}>
                                                <span>Troco</span>
                                                <span className="tx-price">{formatCurrency(change)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="sale-totals">
                                    <button
                                        className="modal-btn primary"
                                        style={{ width: "100%" }}
                                        disabled={!canPay || busy}
                                        onClick={finishSale}
                                    >
                                        {busy ? "A processar…" : "Fechar venda"}
                                    </button>
                                    <button
                                        className="modal-btn secondary"
                                        style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
                                        disabled={busy}
                                        onClick={() => setStep("cart")}
                                    >
                                        Voltar ao carrinho
                                    </button>
                                </div>
                            </>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    )
}