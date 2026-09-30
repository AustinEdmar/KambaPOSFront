"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"

import { ReportsFilters } from "@/components/reports/ReportsFilters"
import { ReportsStats } from "@/components/reports/ReportsStats"
import { ReportsTable } from "@/components/reports/ReportsTable"

import {
    ReportOrder,
    ReportSummary,
    ReportFilters,
    DEFAULT_FILTERS,
    buildQueryParams,
} from "@/lib/reports-data"

interface OrdersResponse {
    orders: {
        data: ReportOrder[]
        current_page: number
        last_page: number
        from: number | null
        to: number | null
        total: number
    }
    summary: ReportSummary
}

export default function ReportsPage() {
    const [filters, setFilters] = useState<ReportFilters>(DEFAULT_FILTERS)
    const [page, setPage] = useState(1)

    const [orders, setOrders] = useState<ReportOrder[]>([])
    const [summary, setSummary] = useState<ReportSummary | null>(null)
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, from: null as number | null, to: null as number | null, total: 0 })

    const [loading, setLoading] = useState(true)
    const [exporting, setExporting] = useState(false)

    const fetchReport = useCallback(async (targetPage: number, currentFilters: ReportFilters) => {
        setLoading(true)
        try {
            const { data } = await api.get<OrdersResponse>("/reports/orders", {
                params: { ...buildQueryParams(currentFilters), page: targetPage },
            })
            setOrders(data.orders.data)
            setSummary(data.summary)
            setPagination({
                current_page: data.orders.current_page,
                last_page: data.orders.last_page,
                from: data.orders.from,
                to: data.orders.to,
                total: data.orders.total,
            })
        } catch (error: any) {
            setOrders([])
            setSummary(null)
            toast.error(error?.response?.data?.message ?? "Erro ao carregar o relatório.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchReport(page, filters)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    const applyFilters = (next: ReportFilters) => {
        setFilters(next)
        setPage(1)
        fetchReport(1, next)
    }

    const exportPdf = async () => {
        setExporting(true)
        try {
            const response = await api.get("/reports/orders/pdf", {
                params: buildQueryParams(filters),
                responseType: "blob",
            })

            const blob = new Blob([response.data], { type: "application/pdf" })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `relatorio-vendas-${new Date().toISOString().slice(0, 10)}.pdf`
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error: any) {
            toast.error("Erro ao gerar o PDF do relatório.")
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="dash-root">
            <div className="dash-topbar">
                <div>
                    <h1 className="dash-title">Relatórios</h1>
                    <p className="dash-subtitle">Vendas filtradas por período, estado e pagamento</p>
                </div>
            </div>

            <ReportsStats summary={summary} />

            <ReportsFilters
                filters={filters}
                onChange={applyFilters}
                onExportPdf={exportPdf}
                exporting={exporting}
            />

            <ReportsTable
                orders={orders}
                loading={loading}
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                from={pagination.from}
                to={pagination.to}
                total={pagination.total}
                onPageChange={setPage}
            />
        </div>
    )
}