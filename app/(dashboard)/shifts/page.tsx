"use client"

import { useCallback, useEffect, useState } from "react"
import api from "@/lib/axios"
import { CurrentShiftCard } from "@/components/shifts/CurrentShiftCard"
import { OpenShiftModal } from "@/components/shifts/OpenShiftModal"
import { CloseShiftModal } from "@/components/shifts/CloseShiftModal"
import { ShiftsTable } from "@/components/shifts/ShiftsTable"
import { ShiftDetailModal } from "@/components/shifts/ShiftDetailModal"
import { PaginatedShifts, Shift } from "@/lib/shifts-data"

export default function Shifts() {
    const [currentShift, setCurrentShift] = useState<Shift | null>(null)
    const [loadingCurrent, setLoadingCurrent] = useState(true)

    const [shiftsData, setShiftsData] = useState<PaginatedShifts | null>(null)
    const [loadingList, setLoadingList] = useState(true)

    const [page, setPage] = useState(1)

    const [openModalVisible, setOpenModalVisible] = useState(false)
    const [closeModalVisible, setCloseModalVisible] = useState(false)
    const [detailShiftId, setDetailShiftId] = useState<number | null>(null)

    const fetchCurrent = useCallback(async () => {
        setLoadingCurrent(true)

        try {
            const { data } = await api.get<Shift>("/shifts/current")
            setCurrentShift(data)
        } catch (error: any) {
            if (error?.response?.status === 404) {
                setCurrentShift(null)
            }
        } finally {
            setLoadingCurrent(false)
        }
    }, [])

    const fetchShifts = useCallback(async (targetPage: number) => {
        setLoadingList(true)

        try {
            const { data } = await api.get<PaginatedShifts>("/shifts", {
                params: {
                    page: targetPage,
                    per_page: 20,
                },
            })

            setShiftsData(data)
        } catch (error) {
            console.error("Erro ao carregar turnos:", error)
        } finally {
            setLoadingList(false)
        }
    }, [])

    useEffect(() => {
        fetchCurrent()
    }, [fetchCurrent])

    useEffect(() => {
        fetchShifts(page)
    }, [page, fetchShifts])

    const refreshAll = async () => {
        await Promise.all([
            fetchCurrent(),
            fetchShifts(page),
        ])
    }

    return (
        <div className="dash-root">

            <div className="dash-topbar">
                <div>
                    <h1 className="dash-title">
                        Turnos
                    </h1>

                    <p className="dash-subtitle">
                        Abertura, fecho e histórico de turnos de caixa
                    </p>
                </div>
            </div>

            <CurrentShiftCard
                shift={currentShift}
                loading={loadingCurrent}
                onOpenClick={() => setOpenModalVisible(true)}
                onCloseClick={() => setCloseModalVisible(true)}
            />

            <ShiftsTable
                data={shiftsData}
                loading={loadingList}
                onPageChange={setPage}
                onRowClick={(shift) => setDetailShiftId(shift.id)}
            />

            {openModalVisible && (
                <OpenShiftModal
                    onClose={() => setOpenModalVisible(false)}
                    onOpened={async () => {
                        setOpenModalVisible(false)
                        await refreshAll()
                    }}
                />
            )}

            {closeModalVisible && currentShift && (
                <CloseShiftModal
                    shiftId={currentShift.id}
                    onClose={() => setCloseModalVisible(false)}
                    onClosed={async () => {
                        setCloseModalVisible(false)
                        await refreshAll()
                    }}
                />
            )}

            {detailShiftId !== null && (
                <ShiftDetailModal
                    shiftId={detailShiftId}
                    onClose={() => setDetailShiftId(null)}
                />
            )}

        </div>
    )
}