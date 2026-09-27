"use client"

import { Category, CategoryPagination } from "@/lib/categories-data"

interface CategoriesTableProps {
    categories: Category[]
    loading: boolean
    pagination: CategoryPagination
    onPageChange: (page: number) => void
    onNew: () => void
    onEdit: (category: Category) => void
    onDelete: (category: Category) => void
}

export function CategoriesTable({
    categories,
    loading,
    pagination,
    onPageChange,
    onNew,
    onEdit,
    onDelete,
}: CategoriesTableProps) {
    const getPageNumbers = () => {
        const current = pagination.current_page
        const last = pagination.last_page

        if (last <= 7) {
            return Array.from({ length: last }, (_, i) => i + 1)
        }

        const pages: (number | "...")[] = []

        pages.push(1)

        if (current > 3) {
            pages.push("...")
        }

        const start = Math.max(2, current - 1)
        const end = Math.min(last - 1, current + 1)

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        if (current < last - 2) {
            pages.push("...")
        }

        pages.push(last)

        return pages
    }

    return (
        <div className="dash-card tx-card">
            <div className="tx-card-head">
                <div>
                    <div className="card-title">
                        Categorias
                    </div>
                </div>

                <div className="tx-filters">
                    <button
                        type="button"
                        className="dash-export-btn"
                        onClick={onNew}
                    >
                        + Nova categoria
                    </button>
                </div>
            </div>

            <div className="table-scroll">
                <table className="tx-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Categoria</th>
                            <th>Imagem</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="tx-date">
                                    A carregar categorias...
                                </td>
                            </tr>
                        ) : categories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="tx-date">
                                    Nenhuma categoria encontrada.
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="tx-row"
                                    onClick={() => onEdit(category)}
                                >
                                    <td>
                                        <span className="tx-id">
                                            #{category.id}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="tx-item">
                                            <div className="tx-name">
                                                {category.name}
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        {category.image_path ? (
                                            <img
                                                src={category.image_path}
                                                alt={category.name}
                                                className="product-thumb"
                                            />
                                        ) : (
                                            <div className="product-thumb-empty">
                                                —
                                            </div>
                                        )}
                                    </td>

                                    <td
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <div className="product-actions">
                                            <button
                                                type="button"
                                                className="tx-more"
                                                onClick={() => onEdit(category)}
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                type="button"
                                                className="tx-more"
                                                onClick={() => onDelete(category)}
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination.last_page > 1 && (
                <div className="pagination">
                    <div className="pag-info">
                        {pagination.from && pagination.to ? (
                            <>
                                Mostrando {pagination.from}–{pagination.to} de{" "}
                                <strong>{pagination.total}</strong>
                            </>
                        ) : (
                            <>
                                Mostrando 0 de <strong>{pagination.total}</strong>
                            </>
                        )}
                    </div>

                    <div className="pag-controls">
                        <button
                            type="button"
                            className="pag-btn"
                            disabled={pagination.current_page === 1}
                            onClick={() =>
                                onPageChange(pagination.current_page - 1)
                            }
                        >
                            ←
                        </button>

                        {getPageNumbers().map((page, index) =>
                            page === "..." ? (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="pag-ellipsis"
                                >
                                    ...
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    key={page}
                                    className={`pag-num ${page === pagination.current_page ? "active" : ""
                                        }`}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </button>
                            ),
                        )}

                        <button
                            type="button"
                            className="pag-btn"
                            disabled={
                                pagination.current_page === pagination.last_page
                            }
                            onClick={() =>
                                onPageChange(pagination.current_page + 1)
                            }
                        >
                            →
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}