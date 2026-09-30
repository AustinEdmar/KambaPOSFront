"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"

import { InvoicesStats } from "@/components/invoices/InvoicesStats"
import { InvoicesToolbar } from "@/components/invoices/InvoicesToolbar"
import { InvoicesTable } from "@/components/invoices/InvoicesTable"
import { InvoiceDetailsModal } from "@/components/invoices/InvoiceDetailsModal"

import {
    Invoice, InvoiceTotals, InvoiceFilters, DEFAULT_INVOICE_FILTERS, buildInvoiceQueryParams,
} from "@/lib/invoices-data"

interface InvoicesResponse {
    success: boolean
    totals: InvoiceTotals
    data: {
        data: Invoice[]
        current_page: number
        last_page: number
        from: number | null
        to: number | null
        total: number
    }
}

export default function InvoicesPage() {
    const [filters, setFilters] = useState<InvoiceFilters>(DEFAULT_INVOICE_FILTERS)
    const [page, setPage] = useState(1)

    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [totals, setTotals] = useState<InvoiceTotals | null>(null)
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, from: null as number | null, to: null as number | null, total: 0 })

    const [loading, setLoading] = useState(true)
    const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null)

    const fetchInvoices = useCallback(async (targetPage: number, currentFilters: InvoiceFilters) => {
        setLoading(true)
        try {
            const { data } = await api.get<InvoicesResponse>("/invoices", {
                params: { ...buildInvoiceQueryParams(currentFilters), page: targetPage },
            })
            setInvoices(data.data.data)
            setTotals(data.totals)
            setPagination({
                current_page: data.data.current_page,
                last_page: data.data.last_page,
                from: data.data.from,
                to: data.data.to,
                total: data.data.total,
            })
        } catch (error: any) {
            setInvoices([])
            setTotals(null)
            toast.error(error?.response?.data?.message ?? "Erro ao carregar facturas.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchInvoices(page, filters)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    const applyFilters = (next: InvoiceFilters) => {
        setFilters(next)
        setPage(1)
        fetchInvoices(1, next)
    }

    const openDetails = async (invoice: Invoice) => {
        try {
            const { data } = await api.get(`/invoices/${invoice.id}`)
            setViewInvoice(data.data)
        } catch {
            setViewInvoice(invoice)
        }
    }

    return (
        <div className="dash-root">
            <InvoicesStats totals={totals} />

            <InvoicesToolbar filters={filters} onChange={applyFilters} />

            <InvoicesTable
                invoices={invoices}
                loading={loading}
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                from={pagination.from}
                to={pagination.to}
                total={pagination.total}
                onPageChange={setPage}
                onView={openDetails}
            />

            {viewInvoice && (
                <InvoiceDetailsModal
                    invoice={viewInvoice}
                    onClose={() => setViewInvoice(null)}
                    onChanged={() => fetchInvoices(page, filters)}
                />
            )}
        </div>
    )
}