"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"

import { UsersTable } from "@/components/users/UsersTable"
import { UsersStats } from "@/components/users/UsersStats"
import { UsersToolbar } from "@/components/users/UsersToolbar"
import { UserFormModal } from "@/components/users/UserFormModal"
import { DeleteUserModal } from "@/components/users/DeleteUserModal"

import { User, computeUserStats, filterUsers } from "@/lib/users-data"

export default function Users() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const [formUser, setFormUser] = useState<User | null | undefined>(undefined)
    const [deleteUser, setDeleteUser] = useState<User | null>(null)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await api.get("/users")
            setUsers(Array.isArray(data) ? data : data?.data ?? [])
        } catch (error: any) {
            setUsers([])
            toast.error(error?.response?.data?.message ?? "Erro ao carregar utilizadores.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    const stats = useMemo(() => computeUserStats(users), [users])
    const filteredUsers = useMemo(() => filterUsers(users, search), [users, search])

    return (
        <div className="dash-root">
            <UsersStats stats={stats} />

            <UsersToolbar
                search={search}
                onSearchChange={setSearch}
                onNewUser={() => setFormUser(null)}
            />

            <UsersTable
                users={filteredUsers}
                loading={loading}
                onEdit={setFormUser}
                onDelete={setDeleteUser}
            />

            {formUser !== undefined && (
                <UserFormModal
                    user={formUser}
                    onClose={() => setFormUser(undefined)}
                    onSaved={() => { setFormUser(undefined); fetchUsers() }}
                />
            )}

            {deleteUser && (
                <DeleteUserModal
                    user={deleteUser}
                    onClose={() => setDeleteUser(null)}
                    onDeleted={() => { setDeleteUser(null); fetchUsers() }}
                />
            )}
        </div>
    )
}