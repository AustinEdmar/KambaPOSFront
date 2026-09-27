"use client"

import { AcessLevel } from "@/lib/acess-level-data"

interface AcessLevelsTableProps {
  accessLevels: AcessLevel[]
  loading: boolean
  onNew: () => void
  onEdit: (accessLevel: AcessLevel) => void
  onDelete: (accessLevel: AcessLevel) => void
}

export function AcessLevelsTable({
  accessLevels,
  loading,
  onNew,
  onEdit,
  onDelete,
}: AcessLevelsTableProps) {
  return (
    <div className="dash-card tx-card">
      <div className="tx-card-head">
        <div>
          <h2 className="card-title">Níveis de Acesso</h2>

          <p className="tx-count">
            {accessLevels.length} níveis encontrados
          </p>
        </div>

        <div className="tx-filters">
          <button
            className="dash-export-btn"
            onClick={onNew}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>

            Novo Nível
          </button>
        </div>
      </div>

      <div className="table-scroll">
        <table className="tx-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Criado em</th>
              <th>Atualizado em</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="tx-date">
                  A carregar…
                </td>
              </tr>
            )}

            {!loading && accessLevels.length === 0 && (
              <tr>
                <td colSpan={5} className="tx-date">
                  Nenhum nível de acesso encontrado.
                </td>
              </tr>
            )}

            {!loading &&
              accessLevels.map((accessLevel) => (
                <tr
                  key={accessLevel.id}
                  className="tx-row"
                  onClick={() => onEdit(accessLevel)}
                >
                  <td className="tx-id">
                    #{accessLevel.id}
                  </td>

                  <td>
                    <div className="tx-name">
                      {accessLevel.name}
                    </div>
                  </td>

                  <td className="tx-date">
                    {new Date(
                      accessLevel.created_at
                    ).toLocaleDateString("pt-PT")}
                  </td>

                  <td className="tx-date">
                    {new Date(
                      accessLevel.updated_at
                    ).toLocaleDateString("pt-PT")}
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
                          onEdit(accessLevel)
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
                          onDelete(accessLevel)
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