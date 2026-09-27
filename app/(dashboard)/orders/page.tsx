"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"

import { OrdersStats } from "@/components/orders/OrdersStats"
import { OrdersToolbar } from "@/components/orders/OrdersToolbar"
import { OrdersTable } from "@/components/orders/OrdersTable"
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal"

import { Order, OrderStatus, Payment, computeOrderStats, filterOrders } from "@/lib/orders-data"

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [payments, setPayments] = useState<Record<number, Payment>>({})
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState<OrderStatus | "">("")

    const [viewOrder, setViewOrder] = useState<Order | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
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
            setOrders([])
            setPayments({})
            toast.error(
                error?.response?.data?.message ?? "Erro ao carregar pedidos."
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const stats = useMemo(() => computeOrderStats(orders), [orders])
    const filteredOrders = useMemo(
        () => filterOrders(orders, search, status),
        [orders, search, status]
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
                onView={setViewOrder}
            />

            {viewOrder && (
                <OrderDetailsModal
                    order={viewOrder}
                    payment={payments[viewOrder.id]}
                    onClose={() => setViewOrder(null)}
                />
            )}
        </div>
    )
}