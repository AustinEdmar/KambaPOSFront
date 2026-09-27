"use client"

import { FormEvent, useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"
import { AcessLevel } from "@/lib/acess-level-data"

interface AcessLevelFormModalProps {
  accessLevel: AcessLevel | null
  onClose: () => void
  onSaved: () => void
}

export function AcessLevelFormModal({
  accessLevel,
  onClose,
  onSaved,
}: AcessLevelFormModalProps) {
  const isEdit = accessLevel !== null

  const [name, setName] = useState(accessLevel?.name ?? "")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("O nome é obrigatório.")
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        name: name.trim(),
      }

      if (isEdit && accessLevel) {
        await api.put(
          `/access-levels/${accessLevel.id}`,
          payload
        )

        toast.success("Nível de acesso atualizado.")
      } else {
        await api.post("/access-levels", payload)

        toast.success("Nível de acesso criado.")
      }

      onSaved()
    } catch (error: any) {
      const errors = error?.response?.data?.errors

      const firstError = errors
        ? Object.values(errors)[0]
        : null

      const message = Array.isArray(firstError)
        ? firstError[0]
        : error?.response?.data?.message ??
        "Erro ao guardar nível de acesso."

      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-emoji">
              {isEdit ? "✏️" : "🆕"}
            </span>

            <div>
              <h3 className="modal-title">
                {isEdit
                  ? "Editar Nível de Acesso"
                  : "Novo Nível de Acesso"}
              </h3>

              <span className="modal-id">
                {isEdit
                  ? `#${accessLevel?.id}`
                  : "Preencha o nome do nível"}
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
            <div
              className="form-group"
              style={{ gridColumn: "1 / -1" }}
            >
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
                maxLength={255}
                placeholder="Ex: Supervisor"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                autoFocus
              />
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
                  : "Criar Nível"}
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