"use client"

import { User } from "@/lib/users-data"

interface UsersTableProps {
    users: User[]
    loading: boolean
    onEdit: (user: User) => void
    onDelete: (user: User) => void
}

export function UsersTable({
    users,
    loading,
    onEdit,
    onDelete,
}: UsersTableProps) {
    return (
        <div className="dash-card tx-card">
            <div className="tx-card-head">
                <div>
                    <h2 className="card-title">
                        Utilizadores
                    </h2>

                    <p className="tx-count">
                        {users.length} utilizadores encontrados
                    </p>
                </div>
            </div>

            <div className="table-scroll">
                <table className="tx-table">
                    <thead>
                        <tr>
                            <th>Utilizador</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Nível de acesso</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="tx-date"
                                >
                                    A carregar…
                                </td>
                            </tr>
                        )}

                        {!loading && users.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="tx-date"
                                >
                                    Nenhum utilizador encontrado.
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="tx-row"
                                    onClick={() => onEdit(user)}
                                >
                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                            }}
                                        >
                                            {user.profile_photo ? (
                                                <img
                                                    src={user.profile_photo}
                                                    alt={user.name}
                                                    style={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius:
                                                            "50%",
                                                        objectFit:
                                                            "cover",
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius:
                                                            "50%",
                                                        display: "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        background:
                                                            "#EEF1F7",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            <div>
                                                <div className="tx-name">
                                                    {user.name}
                                                </div>

                                                <div className="tx-time">
                                                    #{user.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        {user.email}
                                    </td>

                                    <td>
                                        {user.phone ?? "—"}
                                    </td>

                                    <td>
                                        <span className="tx-status">
                                            {user.access_level?.name ??
                                                "—"}
                                        </span>
                                    </td>

                                    <td
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                    >
                                        <span
                                            className="tx-status"
                                            style={
                                                user.active
                                                    ? {
                                                        background:
                                                            "#E4F9F2",
                                                        color:
                                                            "#0D9668",
                                                    }
                                                    : {
                                                        background:
                                                            "#EBEFF9",
                                                        color:
                                                            "#4B5578",
                                                    }
                                            }
                                        >
                                            {user.active
                                                ? "Ativo"
                                                : "Inativo"}
                                        </span>
                                    </td>

                                    <td
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                    >
                                        <div className="product-actions">
                                            <button
                                                className="tx-more"
                                                title="Editar"
                                                onClick={() =>
                                                    onEdit(user)
                                                }
                                            >
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>

                                            <button
                                                className="tx-more"
                                                title="Eliminar"
                                                onClick={() =>
                                                    onDelete(user)
                                                }
                                            >
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}