"use client"
import { Category } from "@/lib/products-data"

interface ProductsToolbarProps {
  categories: Category[]
  search: string
  categoryId: string
  onlyActive: boolean
  lowStock: boolean
  onSearchChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onOnlyActiveChange: (v: boolean) => void
  onLowStockChange: (v: boolean) => void
  onNewProduct: () => void
}

export function ProductsToolbar({
  categories, search, categoryId, onlyActive, lowStock,
  onSearchChange, onCategoryChange, onOnlyActiveChange, onLowStockChange, onNewProduct,
}: ProductsToolbarProps) {
  return (
    <div className="dash-topbar">
      <div>
        <h1 className="dash-title">Produtos</h1>
        <p className="dash-subtitle">Catálogo, stock e preços</p>
      </div>
      <div className="dash-filters">
        <input
          className="form-input products-search"
          type="text"
          placeholder="Pesquisar por nome, código ou barcode…"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
        <select className="form-input products-select" value={categoryId} onChange={e => onCategoryChange(e.target.value)}>
          <option value="">Todas as categorias</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="button" className={`dash-filter-btn ${onlyActive ? "active" : ""}`} onClick={() => onOnlyActiveChange(!onlyActive)}>
          Só ativos
        </button>
        <button type="button" className={`dash-filter-btn ${lowStock ? "active" : ""}`} onClick={() => onLowStockChange(!lowStock)}>
          Stock baixo
        </button>
        <button className="dash-export-btn" onClick={onNewProduct}>
          <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Novo Produto
        </button>
      </div>
    </div>
  )
}
