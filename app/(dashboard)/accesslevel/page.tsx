"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"
import { AcessLevelsTable } from "@/components/access-levels/AcessLevelTable"
import { AcessLevelFormModal } from "@/components/access-levels/AcessLevelFormModal"
import { DeleteAcessLevelModal } from "@/components/access-levels/DeleteAcessLevelModal"
import { AcessLevel } from "@/lib/acess-level-data"

export default function AccessLevels() {
    const [accessLevels, setAccessLevels] = useState<AcessLevel[]>([])
    const [loading, setLoading] = useState(true)

    // undefined = modal fechado
    // null = criar
    // AcessLevel = editar
    const [formAccessLevel, setFormAccessLevel] = useState<
        AcessLevel | null | undefined
    >(undefined)

    const [deleteAccessLevel, setDeleteAccessLevel] =
        useState<AcessLevel | null>(null)

    const fetchAccessLevels = useCallback(async () => {
        setLoading(true)

        try {
            const { data } = await api.get("/access-levels")

            const list: AcessLevel[] = Array.isArray(data)
                ? data
                : data?.data ?? []

            setAccessLevels(list)
        } catch (error: any) {
            setAccessLevels([])

            toast.error(
                error?.response?.data?.message ??
                "Erro ao carregar níveis de acesso."
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAccessLevels()
    }, [fetchAccessLevels])

    return (
        <div className="dash-root">
            <div className="dash-topbar">
                <div>
                    <h1 className="dash-title">Níveis de Acesso</h1>

                    <p className="dash-subtitle">
                        Gerencie os níveis de acesso dos utilizadores
                    </p>
                </div>
            </div>

            <AcessLevelsTable
                accessLevels={accessLevels}
                loading={loading}
                onNew={() => setFormAccessLevel(null)}
                onEdit={setFormAccessLevel}
                onDelete={setDeleteAccessLevel}
            />

            {formAccessLevel !== undefined && (
                <AcessLevelFormModal
                    accessLevel={formAccessLevel}
                    onClose={() => setFormAccessLevel(undefined)}
                    onSaved={() => {
                        setFormAccessLevel(undefined)
                        fetchAccessLevels()
                    }}
                />
            )}

            {deleteAccessLevel && (
                <DeleteAcessLevelModal
                    accessLevel={deleteAccessLevel}
                    onClose={() => setDeleteAccessLevel(null)}
                    onDeleted={() => {
                        setDeleteAccessLevel(null)
                        fetchAccessLevels()
                    }}
                />
            )}
        </div>
    )
}