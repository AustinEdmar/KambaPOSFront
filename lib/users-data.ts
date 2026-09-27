export interface AccessLevel {
    id: number
    name: string
    created_at?: string
    updated_at?: string
}

export interface User {
    id: number
    name: string
    email: string
    profile_photo: string | null
    phone: string | null
    active: boolean
    access_level_id: number
    authorization_pin?: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
    access_level?: AccessLevel | null
}

export interface UserStats {
    total_users: number
    active_users: number
    inactive_users: number
    admin_users: number
}

export function computeUserStats(users: User[]): UserStats {
    return {
        total_users: users.length,
        active_users: users.filter((u) => u.active).length,
        inactive_users: users.filter((u) => !u.active).length,
        admin_users: users.filter(
            (u) => u.access_level?.name?.toLowerCase() === "admin"
        ).length,
    }
}

export function filterUsers(users: User[], search: string): User[] {
    const term = search.trim().toLowerCase()
    if (!term) return users

    return users.filter((u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.phone ?? "").toLowerCase().includes(term) ||
        (u.access_level?.name ?? "").toLowerCase().includes(term)
    )
}