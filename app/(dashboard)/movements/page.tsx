"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"

import { MovementsStats } from "@/components/stock-movements/MovementsStats"
import { MovementsToolbar } from "@/components/stock-movements/MovementsToolbar"
import { MovementsTable } from "@/components/stock-movements/MovementsTable"

import {
    StockMovement,
    StockMovementType,
    PaginatedStockMovements,
    computeMovementStats,
    filterMovements,
} from "@/lib/stock-movements-data"

export default function MovementsPage() {
    const [data, setData] = useState<PaginatedStockMovements | null>(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)

    const [search, setSearch] = useState("")
    const [type, setType] = useState<StockMovementType | "">("")

    const fetchMovements = useCallback(async (targetPage: number) => {
        setLoading(true)
        try {
            const { data } = await api.get<PaginatedStockMovements>("/stock-movements", {
                params: { page: targetPage },
            })
            setData(data)
        } catch (error: any) {
            setData(null)
            toast.error(
                error?.response?.data?.message ?? "Erro ao carregar movimentações."
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchMovements(page)
    }, [page, fetchMovements])

    useEffect(() => {
        const handler = () => fetchMovements(page)
        window.addEventListener("sale:completed", handler)
        return () => window.removeEventListener("sale:completed", handler)
    }, [page, fetchMovements])

    const movements: StockMovement[] = data?.data ?? []

    const stats = useMemo(
        () => computeMovementStats(movements, data?.meta.total ?? 0),
        [movements, data]
    )

    const filteredMovements = useMemo(
        () => filterMovements(movements, search, type),
        [movements, search, type]
    )

    return (
        <div className="dash-root">
            <MovementsStats stats={stats} />

            <MovementsToolbar
                search={search}
                type={type}
                onSearchChange={setSearch}
                onTypeChange={setType}
            />

            <MovementsTable
                movements={filteredMovements}
                loading={loading}
                currentPage={data?.meta.current_page ?? 1}
                lastPage={data?.meta.last_page ?? 1}
                from={data?.meta.from ?? null}
                to={data?.meta.to ?? null}
                total={data?.meta.total ?? 0}
                onPageChange={setPage}
            />
        </div>
    )
}