"use client"
import { useCallback, useEffect, useState } from "react"
import api from "@/lib/axios"
import { ProductsToolbar } from "@/components/products/ProductsToolbar"
import { ProductsTable } from "@/components/products/ProductsTable"
import { ProductFormModal } from "@/components/products/ProductFormModal"
import { AdjustStockModal } from "@/components/products/AdjustStockModal"
import { StockHistoryModal } from "@/components/products/StockHistoryModal"
import { DeleteProductModal } from "@/components/products/DeleteProductModal"
import { ProductsStats } from "@/components/products/ProductsStats"
import { Category, PaginatedProducts, Product, unwrapList } from "@/lib/products-data"
import { toast } from "sonner"

export default function Products() {
    const [data, setData] = useState<PaginatedProducts | null>(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)

    const [search, setSearch] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [onlyActive, setOnlyActive] = useState(false)
    const [lowStock, setLowStock] = useState(false)

    const [categories, setCategories] = useState<Category[]>([])

    // formProduct: undefined = modal fechado, null = criar, Product = editar
    const [formProduct, setFormProduct] = useState<Product | null | undefined>(undefined)
    const [adjustProduct, setAdjustProduct] = useState<Product | null>(null)
    const [historyProduct, setHistoryProduct] = useState<Product | null>(null)
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await api.get("/categories", { params: { per_page: 100 } })
            setCategories(unwrapList<Category>(data))
        } catch {
            setCategories([])
        }
    }, [])

    const fetchProducts = useCallback(async (targetPage: number) => {
        setLoading(true)
        try {
            const { data } = await api.get<PaginatedProducts>("/products", {
                params: {
                    page: targetPage,
                    search: search || undefined,
                    category_id: categoryId || undefined,
                    only_active: onlyActive ? 1 : undefined,
                    low_stock: lowStock ? 1 : undefined,
                },
            })
            setData(data)
        } finally {
            setLoading(false)
        }
    }, [search, categoryId, onlyActive, lowStock])

    useEffect(() => { fetchCategories() }, [fetchCategories])

    // Reinicia a paginação sempre que um filtro muda
    useEffect(() => { setPage(1) }, [search, categoryId, onlyActive, lowStock])

    // Busca os produtos (com pequeno debounce, útil sobretudo para a pesquisa)
    useEffect(() => {
        const timer = setTimeout(() => { fetchProducts(page) }, 300)
        return () => clearTimeout(timer)
    }, [page, fetchProducts])

    const refresh = () => fetchProducts(page)

    const handleToggleActive = async (p: Product) => {
        try {
            await api.patch(`/products/${p.id}/toggle-active`)
            refresh()
        } catch (error: any) {
            toast.error(error?.response?.data?.message ?? "Erro ao alterar estado do produto.")
        }
    }

    return (
        <div className="dash-root">
            <ProductsStats data={data} />
            <ProductsToolbar
                categories={categories}
                search={search}
                categoryId={categoryId}
                onlyActive={onlyActive}
                lowStock={lowStock}
                onSearchChange={setSearch}
                onCategoryChange={setCategoryId}
                onOnlyActiveChange={setOnlyActive}
                onLowStockChange={setLowStock}
                onNewProduct={() => setFormProduct(null)}
            />

            <ProductsTable
                data={data}
                loading={loading}
                onPageChange={setPage}
                onEdit={setFormProduct}
                onAdjustStock={setAdjustProduct}
                onStockHistory={setHistoryProduct}
                onToggleActive={handleToggleActive}
                onDelete={setDeleteProduct}
            />

            {formProduct !== undefined && (
                <ProductFormModal
                    product={formProduct}
                    categories={categories}
                    onClose={() => setFormProduct(undefined)}
                    onSaved={() => { setFormProduct(undefined); refresh() }}
                />
            )}

            {adjustProduct && (
                <AdjustStockModal
                    product={adjustProduct}
                    onClose={() => setAdjustProduct(null)}
                    onAdjusted={() => { setAdjustProduct(null); refresh() }}
                />
            )}

            {historyProduct && (
                <StockHistoryModal product={historyProduct} onClose={() => setHistoryProduct(null)} />
            )}

            {deleteProduct && (
                <DeleteProductModal
                    product={deleteProduct}
                    onClose={() => setDeleteProduct(null)}
                    onDeleted={() => { setDeleteProduct(null); refresh() }}
                />
            )}
        </div>
    )
}