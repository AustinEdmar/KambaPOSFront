"use client"

import { useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"
import { User } from "@/lib/users-data"

interface DeleteUserModalProps {
    user: User
    onClose: () => void
    onDeleted: () => void
}

export function DeleteUserModal({
    user,
    onClose,
    onDeleted,
}: DeleteUserModalProps) {
    const [submitting, setSubmitting] =
        useState(false)

    const handleDelete = async () => {
        setSubmitting(true)

        try {
            await api.delete(
                `/users/${user.id}`
            )

            toast.success(
                "Utilizador eliminado."
            )

            onDeleted()
        } catch (error: any) {
            const message =
                error?.response?.data?.message ??
                "Erro ao eliminar utilizador."

            toast.error(message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                <div className="modal-header">
                    <div className="modal-title-row">
                        <span className="modal-emoji">
                            🗑️
                        </span>

                        <div>
                            <h3 className="modal-title">
                                Eliminar Utilizador
                            </h3>

                            <span className="modal-id">
                                #{user.id}
                            </span>
                        </div>
                    </div>

                    <button
                        className="modal-close"
                        onClick={onClose}
                    >
                        <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <line
                                x1="18"
                                y1="6"
                                x2="6"
                                y2="18"
                            />

                            <line
                                x1="6"
                                y1="6"
                                x2="18"
                                y2="18"
                            />
                        </svg>
                    </button>
                </div>

                <p
                    className="tx-count"
                    style={{
                        padding:
                            "0 20px 16px",
                    }}
                >
                    Tens a certeza que queres eliminar
                    o utilizador{" "}
                    <strong>
                        "{user.name}"
                    </strong>
                    ?

                    <br />

                    Esta ação irá remover também os
                    tokens de autenticação do utilizador.
                </p>

                <div className="modal-actions">
                    <button
                        className="modal-btn danger"
                        disabled={submitting}
                        onClick={handleDelete}
                    >
                        {submitting
                            ? "A eliminar…"
                            : "Eliminar"}
                    </button>

                    <button
                        className="modal-btn secondary"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}