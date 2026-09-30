"use client"

import { CashMovement, CASH_MOVEMENT_TYPE_META, formatCurrency, formatDateTime } from "@/lib/cash-movements-data"

interface CashMovementsTableProps {
    movements: CashMovement[]
    loading: boolean
}

export function CashMovementsTable({ movements, loading }: CashMovementsTableProps) {
    return (
        <div className="dash-card tx-card">
            <div className="tx-card-head">
                <div>
                    <h2 className="card-title">Movimentos</h2>
                    <p className="tx-count">{movements.length} movimentos encontrados</p>
                </div>
            </div>

            <div className="table-scroll">
                <table className="tx-table">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Valor</th>
                            <th>Motivo</th>
                            <th>Funcionário</th>
                            <th>Data</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={5} className="tx-date">A carregar…</td>
                            </tr>
                        )}

                        {!loading && movements.length === 0 && (
                            <tr>
                                <td colSpan={5} className="tx-date">Nenhum movimento encontrado.</td>
                            </tr>
                        )}

                        {!loading &&
                            movements.map((m) => {
                                const meta = CASH_MOVEMENT_TYPE_META[m.type]

                                return (
                                    <tr key={m.id} className="tx-row">
                                        <td>
                                            <span
                                                className="tx-status"
                                                style={{ background: meta.bg, color: meta.color }}
                                            >
                                                {meta.icon} {meta.label}
                                            </span>
                                        </td>

                                        <td
                                            className="tx-price"
                                            style={{ color: meta.color }}
                                        >
                                            {m.type === "inflow" ? "+" : "-"}{formatCurrency(m.amount)}
                                        </td>

                                        <td>{m.reason ?? "—"}</td>

                                        <td>{m.user?.name ?? "—"}</td>

                                        <td className="tx-date">{formatDateTime(m.created_at)}</td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}