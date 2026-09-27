"use client"

import { FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"

import {
    User,
    AccessLevel,
} from "@/lib/users-data"

interface UserFormModalProps {
    user: User | null
    onClose: () => void
    onSaved: () => void
}

export function UserFormModal({
    user,
    onClose,
    onSaved,
}: UserFormModalProps) {
    const isEdit = user !== null

    const [name, setName] =
        useState(user?.name ?? "")

    const [email, setEmail] =
        useState(user?.email ?? "")

    const [phone, setPhone] =
        useState(user?.phone ?? "")

    const [active, setActive] =
        useState(user?.active ?? true)

    const [accessLevelId, setAccessLevelId] =
        useState(
            user?.access_level_id
                ? String(user.access_level_id)
                : ""
        )

    const [password, setPassword] =
        useState("")

    const [passwordConfirmation, setPasswordConfirmation] =
        useState("")

    const [authorizationPin, setAuthorizationPin] =
        useState("")

    const [profilePhoto, setProfilePhoto] =
        useState<File | null>(null)

    const [accessLevels, setAccessLevels] =
        useState<AccessLevel[]>([])

    const [loadingLevels, setLoadingLevels] =
        useState(true)

    const [submitting, setSubmitting] =
        useState(false)

    useEffect(() => {
        const fetchAccessLevels = async () => {
            setLoadingLevels(true)

            try {
                const { data } =
                    await api.get("/access-levels")

                const levels: AccessLevel[] =
                    Array.isArray(data)
                        ? data
                        : data?.data ?? []

                setAccessLevels(levels)
            } catch {
                toast.error(
                    "Erro ao carregar níveis de acesso."
                )
            } finally {
                setLoadingLevels(false)
            }
        }

        fetchAccessLevels()
    }, [])

    const handleSubmit = async (
        e: FormEvent
    ) => {
        e.preventDefault()

        if (!name.trim()) {
            toast.error("O nome é obrigatório.")
            return
        }

        if (!email.trim()) {
            toast.error("O email é obrigatório.")
            return
        }

        if (!accessLevelId) {
            toast.error(
                "Seleciona um nível de acesso."
            )
            return
        }

        if (!isEdit && !password) {
            toast.error(
                "A password é obrigatória."
            )
            return
        }

        if (
            password &&
            password !== passwordConfirmation
        ) {
            toast.error(
                "As passwords não coincidem."
            )
            return
        }

        setSubmitting(true)

        try {
            const formData = new FormData()

            formData.append(
                "name",
                name.trim()
            )

            formData.append(
                "email",
                email.trim()
            )

            formData.append(
                "phone",
                phone.trim()
            )

            formData.append(
                "active",
                active ? "1" : "0"
            )

            formData.append(
                "access_level_id",
                accessLevelId
            )

            if (password) {
                formData.append(
                    "password",
                    password
                )

                formData.append(
                    "password_confirmation",
                    passwordConfirmation
                )
            }

            if (authorizationPin) {
                formData.append(
                    "authorization_pin",
                    authorizationPin
                )
            }

            if (profilePhoto) {
                formData.append(
                    "profile_photo",
                    profilePhoto
                )
            }

            if (isEdit && user) {
                await api.post(
                    `/users/${user.id}?_method=PUT`,
                    formData
                )

                toast.success(
                    "Utilizador atualizado."
                )
            } else {
                await api.post(
                    "/users",
                    formData
                )

                toast.success(
                    "Utilizador criado."
                )
            }

            onSaved()
        } catch (error: any) {
            const errors =
                error?.response?.data?.errors

            const firstError = errors
                ? Object.values(errors)[0]
                : null

            const message =
                Array.isArray(firstError)
                    ? firstError[0]
                    : error?.response?.data?.message ??
                    "Erro ao guardar utilizador."

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
                style={{
                    maxWidth: "700px",
                }}
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                <div className="modal-header">
                    <div className="modal-title-row">
                        <span className="modal-emoji">
                            {isEdit ? "✏️" : "🆕"}
                        </span>

                        <div>
                            <h3 className="modal-title">
                                {isEdit
                                    ? "Editar Utilizador"
                                    : "Novo Utilizador"}
                            </h3>

                            <span className="modal-id">
                                {isEdit
                                    ? `#${user?.id}`
                                    : "Preencha os dados do utilizador"}
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

                <form onSubmit={handleSubmit}>
                    <div className="shift-form-grid">

                        {/* Nome */}
                        <div className="form-group">
                            <label
                                className="form-label"
                                htmlFor="name"
                            >
                                Nome
                            </label>

                            <input
                                id="name"
                                className="form-input"
                                type="text"
                                required
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label
                                className="form-label"
                                htmlFor="email"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                className="form-input"
                                type="email"
                                required
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {/* Telefone */}
                        <div className="form-group">
                            <label
                                className="form-label"
                                htmlFor="phone"
                            >
                                Telefone
                            </label>

                            <input
                                id="phone"
                                className="form-input"
                                type="text"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(
                                        e.target.value
                                    )
                                }
                                placeholder="Ex: 923000000"
                            />
                        </div>

                        {/* Access Level */}
                        <div className="form-group">
                            <label
                                className="form-label"
                                htmlFor="access_level_id"
                            >
                                Nível de acesso
                            </label>

                            <select
                                id="access_level_id"
                                className="form-input"
                                value={accessLevelId}
                                disabled={loadingLevels}
                                onChange={(e) =>
                                    setAccessLevelId(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    {loadingLevels
                                        ? "A carregar..."
                                        : "Selecionar nível"}
                                </option>

                                {accessLevels.map(
                                    (level) => (
                                        <option
                                            key={level.id}
                                            value={level.id}
                                        >
                                            {level.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label
                                className="form-label"
                                htmlFor="password"
                            >
                                {isEdit
                                    ? "Nova password"
                                    : "Password"}
                            </label>

                            <input
                                id="password"
                                className="form-input"
                                type="password"
                                required={!isEdit}
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder={
                                    isEdit
                                        ? "Deixar vazio para manter"
                                        : "Mínimo 8 caracteres"
                                }
                            />
                        </div>

                        {/* Password confirmation */}
                        <div className="form-group">
                            <label
                                className="form-label"
                                htmlFor="password_confirmation"
                            >
                                Confirmar password
                            </label>

                            <input
                                id="password_confirmation"
                                className="form-input"
                                type="password"
                                required={!isEdit}
                                value={
                                    passwordConfirmation
                                }
                                onChange={(e) =>
                                    setPasswordConfirmation(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {/* PIN */}
                        <div className="form-group">
                            <label
                                className="form-label"
                                htmlFor="authorization_pin"
                            >
                                PIN de autorização
                            </label>

                            <input
                                id="authorization_pin"
                                className="form-input"
                                type="password"
                                inputMode="numeric"
                                maxLength={6}
                                value={
                                    authorizationPin
                                }
                                onChange={(e) =>
                                    setAuthorizationPin(
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                                placeholder="6 dígitos"
                            />
                        </div>

                        {/* Foto */}
                        <div className="form-group">
                            <label
                                className="form-label"
                                htmlFor="profile_photo"
                            >
                                Foto de perfil
                            </label>

                            <input
                                id="profile_photo"
                                className="form-input"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setProfilePhoto(
                                        e.target.files?.[0] ??
                                        null
                                    )
                                }
                            />
                        </div>

                        {/* Active */}
                        <div
                            className="form-group"
                            style={{
                                display: "flex",
                                alignItems: "flex-end",
                            }}
                        >
                            <label className="product-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={(e) =>
                                        setActive(
                                            e.target.checked
                                        )
                                    }
                                />

                                Utilizador ativo
                            </label>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="submit"
                            className="modal-btn primary"
                            disabled={submitting}
                        >
                            {submitting
                                ? "A guardar…"
                                : isEdit
                                    ? "Guardar alterações"
                                    : "Criar Utilizador"}
                        </button>

                        <button
                            type="button"
                            className="modal-btn secondary"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}