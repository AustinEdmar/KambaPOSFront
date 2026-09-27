"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"

import { CategoriesTable } from "@/components/categories/CategoriesTable"
import { CategoryFormModal } from "@/components/categories/CategoryFormModal"
import { DeleteCategoryModal } from "@/components/categories/DeleteCategoryModal"

import {
    Category,
    CategoryPagination,
} from "@/lib/categories-data"

const DEFAULT_PAGINATION: CategoryPagination = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: null,
    to: null,
}

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState(1)

    const [pagination, setPagination] =
        useState<CategoryPagination>(
            DEFAULT_PAGINATION,
        )

    // undefined = modal fechado
    // null = criar
    // Category = editar
    const [formCategory, setFormCategory] =
        useState<Category | null | undefined>(undefined)

    const [deleteCategory, setDeleteCategory] =
        useState<Category | null>(null)

    const fetchCategories = useCallback(async () => {
        setLoading(true)

        try {
            const { data } = await api.get("/categories", {
                params: {
                    page,
                },
            })

            const list: Category[] = Array.isArray(data?.data)
                ? data.data
                : []

            setCategories(list)

            if (data?.meta) {
                setPagination({
                    current_page: data.meta.current_page ?? page,
                    last_page: data.meta.last_page ?? 1,
                    per_page: data.meta.per_page ?? 10,
                    total: data.meta.total ?? list.length,
                    from: data.meta.from ?? null,
                    to: data.meta.to ?? null,
                })
            } else {
                setPagination({
                    current_page: page,
                    last_page: 1,
                    per_page: 10,
                    total: list.length,
                    from: list.length > 0 ? 1 : null,
                    to: list.length,
                })
            }
        } catch (error: any) {
            setCategories([])

            setPagination(DEFAULT_PAGINATION)

            toast.error(
                error?.response?.data?.message ??
                "Não foi possível carregar as categorias.",
            )
        } finally {
            setLoading(false)
        }
    }, [page])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const handlePageChange = (newPage: number) => {
        if (newPage < 1) {
            return
        }

        if (newPage > pagination.last_page) {
            return
        }

        setPage(newPage)
    }

    const handleSaved = () => {
        setFormCategory(undefined)

        // Depois de criar/editar, recarrega a página atual
        fetchCategories()
    }

    const handleDeleted = () => {
        setDeleteCategory(null)

        // Se eliminarmos o último item da página,
        // voltamos para a página anterior.
        if (
            categories.length === 1 &&
            page > 1
        ) {
            setPage((current) => current - 1)
            return
        }

        fetchCategories()
    }

    return (
        <div className="dash-root">
            <div className="dash-topbar">
                <div>
                    <h1 className="dash-title">
                        Categorias
                    </h1>

                    <p className="dash-subtitle">
                        Organize os produtos por categorias
                    </p>
                </div>
            </div>

            <CategoriesTable
                categories={categories}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onNew={() => setFormCategory(null)}
                onEdit={setFormCategory}
                onDelete={setDeleteCategory}
            />

            {formCategory !== undefined && (
                <CategoryFormModal
                    category={formCategory}
                    onClose={() => setFormCategory(undefined)}
                    onSaved={handleSaved}
                />
            )}

            {deleteCategory && (
                <DeleteCategoryModal
                    category={deleteCategory}
                    onClose={() => setDeleteCategory(null)}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    )
}