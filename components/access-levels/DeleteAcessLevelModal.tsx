"use client"

import { useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"
import { AcessLevel } from "@/lib/acess-level-data"

interface DeleteAcessLevelModalProps {
  accessLevel: AcessLevel
  onClose: () => void
  onDeleted: () => void
}

export function DeleteAcessLevelModal({
  accessLevel,
  onClose,
  onDeleted,
}: DeleteAcessLevelModalProps) {
  const [submitting, setSubmitting] = useState(false)

  const handleDelete = async () => {
    setSubmitting(true)

    try {
      await api.delete(
        `/access-levels/${accessLevel.id}`
      )

      toast.success("Nível de acesso eliminado.")

      onDeleted()
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "Erro ao eliminar nível de acesso."

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
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-emoji">
              🗑️
            </span>

            <div>
              <h3 className="modal-title">
                Eliminar Nível de Acesso
              </h3>

              <span className="modal-id">
                #{accessLevel.id}
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
            padding: "0 20px 16px",
          }}
        >
          Tens a certeza que queres eliminar o
          nível de acesso{" "}
          <strong>
            "{accessLevel.name}"
          </strong>
          ? Se existirem utilizadores associados,
          o servidor recusará a eliminação.
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