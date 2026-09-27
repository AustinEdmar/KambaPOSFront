"use client"

import { useState } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { Category } from "@/lib/categories-data"

interface DeleteCategoryModalProps {
    category: Category
    onClose: () => void
    onDeleted: () => void
}

export function DeleteCategoryModal({
    category,
    onClose,
    onDeleted,
}: DeleteCategoryModalProps) {
    const [submitting, setSubmitting] = useState(false)

    const handleDelete = async () => {
        setSubmitting(true)

        try {
            await api.delete(`/categories/${category.id}`)

            toast.success("Categoria eliminada com sucesso.")

            onDeleted()
        } catch (error: any) {
            const message =
                error?.response?.data?.message ??
                "Não foi possível eliminar a categoria."

            toast.error(message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div
            className="modal-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose()
                }
            }}
        >
            <div className="modal">
                <div className="modal-header">
                    <div className="modal-title-row">
                        <div className="modal-emoji">
                            🗑️
                        </div>

                        <div>
                            <h2 className="modal-title">
                                Eliminar Categoria
                            </h2>

                            <span className="modal-id">
                                #{category.id}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        ×
                    </button>
                </div>

                <div>
                    <p>
                        Tem certeza que deseja eliminar a categoria{" "}
                        <strong>{category.name}</strong>?
                    </p>

                    <p>
                        Esta operação não pode ser desfeita.
                    </p>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="modal-btn secondary"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="modal-btn danger"
                        onClick={handleDelete}
                        disabled={submitting}
                    >
                        {submitting
                            ? "A eliminar..."
                            : "Eliminar"}
                    </button>
                </div>
            </div>
        </div>
    )
}