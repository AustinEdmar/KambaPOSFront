"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"

import { OrdersStats } from "@/components/orders/OrdersStats"
import { OrdersToolbar } from "@/components/orders/OrdersToolbar"
import { OrdersTable } from "@/components/orders/OrdersTable"
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal"

import { Order, OrderStatus, Payment, computeOrderStats, filterOrders } from "@/lib/orders-data"

const REFRESH_INTERVAL_MS = 3000

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [payments, setPayments] = useState<Record<number, Payment>>({})
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState<OrderStatus | "">("")

    // Guardamos só o id, para o modal acompanhar as atualizações da lista
    const [viewOrderId, setViewOrderId] = useState<number | null>(null)

    // Evita requisições sobrepostas quando o servidor demora mais que o intervalo
    const fetching = useRef(false)

    const fetchData = useCallback(async (silent = false) => {
        if (fetching.current) return
        fetching.current = true

        if (!silent) setLoading(true)
        try {
            const [ordersRes, paymentsRes] = await Promise.all([
                api.get<Order[]>("/orders"),
                api.get<Payment[]>("/payment"),
            ])

            setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : [])

            const paymentsList = Array.isArray(paymentsRes.data) ? paymentsRes.data : []
            const byOrderId: Record<number, Payment> = {}
            for (const p of paymentsList) {
                byOrderId[p.order_id] = p
            }
            setPayments(byOrderId)
        } catch (error: any) {
            // No refresh silencioso não limpamos a tabela nem mostramos toast,
            // para não incomodar o utilizador com falhas momentâneas de rede
            if (!silent) {
                setOrders([])
                setPayments({})
                toast.error(
                    error?.response?.data?.message ?? "Erro ao carregar pedidos."
                )
            }
        } finally {
            if (!silent) setLoading(false)
            fetching.current = false
        }
    }, [])

    useEffect(() => {
        fetchData() // carregamento inicial (com loading)

        const interval = setInterval(() => {
            if (document.hidden) return // não atualiza com a aba escondida
            fetchData(true)
        }, REFRESH_INTERVAL_MS)

        return () => clearInterval(interval)
    }, [fetchData])

    // Apaga pedido vazio; o erro é tratado (toast) dentro do OrdersTable
    const handleDeleteOrder = useCallback(async (order: Order) => {
        await api.delete(`/orders/${order.id}/empty`)
        setOrders((prev) => prev.filter((o) => o.id !== order.id))
    }, [])

    const stats = useMemo(() => computeOrderStats(orders), [orders])

    const filteredOrders = useMemo(
        () => filterOrders(orders, search, status),
        [orders, search, status]
    )

    // Pedido do modal derivado da lista, sempre atualizado
    const viewOrder = useMemo(
        () => orders.find((o) => o.id === viewOrderId) ?? null,
        [orders, viewOrderId]
    )

    return (
        <div className="dash-root">
            <OrdersStats stats={stats} />

            <OrdersToolbar
                search={search}
                status={status}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
            />

            <OrdersTable
                orders={filteredOrders}
                payments={payments}
                loading={loading}
                onView={(order) => setViewOrderId(order.id)}
                onDelete={handleDeleteOrder}
            />

            {viewOrder && (
                <OrderDetailsModal
                    order={viewOrder}
                    payment={payments[viewOrder.id]}
                    onClose={() => setViewOrderId(null)}
                />
            )}
        </div>
    )
}