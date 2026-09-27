"use client"

import { useState } from "react"
import { toast } from "sonner"

import api from "@/lib/axios"
import { Company } from "@/lib/company-data"

interface DeleteCompanyModalProps {
  company: Company
  onClose: () => void
  onDeleted: () => void
}

export function DeleteCompanyModal({
  company,
  onClose,
  onDeleted,
}: DeleteCompanyModalProps) {
  const [submitting, setSubmitting] = useState(false)

  const handleDelete = async () => {
    setSubmitting(true)

    try {
      await api.delete(
        `/company/${company.id}`,
      )

      toast.success(
        "Empresa eliminada com sucesso.",
      )

      onDeleted()
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
        "Não foi possível eliminar a empresa.",
      )
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
                Eliminar Empresa
              </h2>

              <span className="modal-id">
                #{company.id}
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

        <p>
          Tem certeza que deseja eliminar a empresa{" "}
          <strong>{company.name}</strong>?
        </p>

        <p>
          Esta operação não pode ser desfeita.
        </p>

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