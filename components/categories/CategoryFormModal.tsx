"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { Category } from "@/lib/categories-data"

interface CategoryFormModalProps {
    category: Category | null
    onClose: () => void
    onSaved: () => void
}

export function CategoryFormModal({
    category,
    onClose,
    onSaved,
}: CategoryFormModalProps) {
    const isEdit = category !== null

    const [name, setName] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (category) {
            setName(category.name)
            setImage(null)
            setPreview(category.image_path)
        } else {
            setName("")
            setImage(null)
            setPreview(null)
        }
    }, [category])

    const handleImageChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        setImage(file)

        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!name.trim()) {
            toast.error("O nome da categoria é obrigatório.")
            return
        }

        setSubmitting(true)

        try {
            const formData = new FormData()

            formData.append("name", name.trim())

            if (image) {
                formData.append("image", image)
            }

            if (isEdit) {
                formData.append("_method", "PUT")

                await api.post(
                    `/categories/${category.id}`,
                    formData,
                )

                toast.success("Categoria atualizada com sucesso.")
            } else {
                await api.post("/categories", formData)

                toast.success("Categoria criada com sucesso.")
            }

            onSaved()
        } catch (error: any) {
            const response = error?.response?.data

            const errors = response?.errors

            if (errors) {
                const firstError = Object.values(errors)[0]

                if (Array.isArray(firstError) && firstError.length > 0) {
                    toast.error(String(firstError[0]))
                } else {
                    toast.error("Verifique os dados informados.")
                }
            } else {
                toast.error(
                    response?.message ??
                    "Ocorreu um erro ao guardar a categoria.",
                )
            }
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
            <div className="modal product-form-modal">
                <div className="modal-header">
                    <div className="modal-title-row">
                        <div className="modal-emoji">
                            🗂️
                        </div>

                        <div>
                            <h2 className="modal-title">
                                {isEdit
                                    ? "Editar Categoria"
                                    : "Nova Categoria"}
                            </h2>

                            {isEdit && (
                                <span className="modal-id">
                                    #{category.id}
                                </span>
                            )}
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

                <form onSubmit={handleSubmit}>
                    <div className="product-form-body">
                        <div className="shift-form-grid">
                            <div className="form-group">
                                <label className="form-label">
                                    Nome da categoria
                                </label>

                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Ex.: Bebidas"
                                    maxLength={255}
                                    autoFocus
                                    disabled={submitting}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Imagem
                                </label>

                                <label className="product-image-upload">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                        />
                                    ) : (
                                        <div className="product-thumb-empty">
                                            +
                                        </div>
                                    )}

                                    <span>
                                        {image
                                            ? image.name
                                            : "Selecionar imagem"}
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        disabled={submitting}
                                        hidden
                                    />
                                </label>

                                <small>
                                    JPG, JPEG, PNG ou WEBP. Máximo 2 MB.
                                </small>
                            </div>
                        </div>
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
                            type="submit"
                            className="modal-btn primary"
                            disabled={submitting}
                        >
                            {submitting
                                ? "A guardar..."
                                : isEdit
                                    ? "Guardar alterações"
                                    : "Criar categoria"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}