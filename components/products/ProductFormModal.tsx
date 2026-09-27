"use client"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { Category, Product, TaxRate, getProductImageUrl, unwrapList } from "@/lib/products-data"

interface ProductFormModalProps {
  product: Product | null // null = criar novo
  categories: Category[]
  onClose: () => void
  onSaved: () => void
}

export function ProductFormModal({ product, categories, onClose, onSaved }: ProductFormModalProps) {
  const isEdit = product !== null

  const [name, setName] = useState(product?.name ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState(product ? String(product.price) : "")
  const [productCode, setProductCode] = useState(product?.product_code ?? "")
  const [unit, setUnit] = useState(product?.unit ?? "UN")
  const [barcode, setBarcode] = useState(product?.barcode ?? "")
  const [categoryId, setCategoryId] = useState(product?.category_id ? String(product.category_id) : "")
  const [taxRateId, setTaxRateId] = useState(product?.tax_rate_id ? String(product.tax_rate_id) : "")
  const [taxExemptionReason, setTaxExemptionReason] = useState(product?.tax_exemption_reason ?? "")
  const [stock, setStock] = useState(product ? String(product.stock) : "0")
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(getProductImageUrl(product?.image_path))

  const [taxRates, setTaxRates] = useState<TaxRate[]>([])
  const [taxRatesAvailable, setTaxRatesAvailable] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    // Endpoint assumido — se a rota real for outra, ajustar aqui.
    // Em caso de falha, o formulário cai para um input numérico manual.
    api.get("/tax-rates", { params: { per_page: 100 } })
      .then(({ data }) => { if (active) setTaxRates(unwrapList<TaxRate>(data)) })
      .catch(() => { if (active) setTaxRatesAvailable(false) })
    return () => { active = false }
  }, [])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    if (file) setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name || !price || !taxRateId) return

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      if (description) formData.append("description", description)
      formData.append("price", price)
      if (productCode) formData.append("product_code", productCode)
      formData.append("unit", unit || "UN")
      formData.append("tax_rate_id", taxRateId)
      if (taxExemptionReason) formData.append("tax_exemption_reason", taxExemptionReason)
      if (!isEdit) formData.append("stock", stock || "0")
      if (barcode) formData.append("barcode", barcode)
      if (categoryId) formData.append("category_id", categoryId)
      formData.append("is_active", isActive ? "1" : "0")
      if (imageFile) formData.append("image", imageFile)

      if (isEdit && product) {
        // Laravel não faz parse de multipart em requests PUT — usa-se POST
        // com _method=PUT (method spoofing), senão o upload de imagem falha.
        formData.append("_method", "PUT")
        await api.post(`/products/${product.id}`, formData)
        toast.success("Produto atualizado")
      } else {
        await api.post("/products", formData)
        toast.success("Produto criado")
      }
      onSaved()
    } catch (error: any) {
      const errors = error?.response?.data?.errors
      const firstError = errors ? Object.values(errors)[0] : null
      const message = Array.isArray(firstError) ? firstError[0] : error?.response?.data?.message ?? "Erro ao guardar produto."
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal product-form-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-emoji">{isEdit ? "✏️" : "🆕"}</span>
            <div>
              <h3 className="modal-title">{isEdit ? "Editar Produto" : "Novo Produto"}</h3>
              <span className="modal-id">{isEdit ? (product?.product_code ?? `#${product?.id}`) : "Preenche os dados do produto"}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form-body">
          <div className="product-form-image">
            <label htmlFor="product_image" className="product-image-upload">
              {imagePreview ? <img src={imagePreview} alt="" /> : <span>📷</span>}
            </label>
            <input id="product_image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} hidden />
          </div>

          <div className="shift-form-grid">
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label" htmlFor="name">Nome</label>
              <input id="name" className="form-input" required value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="price">Preço (Kz)</label>
              <input id="price" className="form-input" type="number" min={0} step="0.01" required value={price} onChange={e => setPrice(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="unit">Unidade</label>
              <input id="unit" className="form-input" value={unit} onChange={e => setUnit(e.target.value)} placeholder="UN" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="product_code">Código</label>
              <input id="product_code" className="form-input" value={productCode} onChange={e => setProductCode(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="barcode">Código de barras</label>
              <input id="barcode" className="form-input" value={barcode} onChange={e => setBarcode(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category_id">Categoria</label>
              <select id="category_id" className="form-input" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">Sem categoria</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tax_rate_id">Taxa de IVA</label>
              {taxRatesAvailable && taxRates.length > 0 ? (
                <select id="tax_rate_id" className="form-input" required value={taxRateId} onChange={e => setTaxRateId(e.target.value)}>
                  <option value="">Selecionar…</option>
                  {taxRates.map(t => <option key={t.id} value={t.id}>{t.description} · {t.tax_percentage}%</option>)}
                </select>
              ) : (
                <input id="tax_rate_id" className="form-input" type="number" min={1} required value={taxRateId} onChange={e => setTaxRateId(e.target.value)} placeholder="ID da taxa" />
              )}
            </div>

            {!isEdit && (
              <div className="form-group">
                <label className="form-label" htmlFor="stock">Stock inicial</label>
                <input id="stock" className="form-input" type="number" min={0} required value={stock} onChange={e => setStock(e.target.value)} />
              </div>
            )}

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label" htmlFor="description">Descrição</label>
              <input id="description" className="form-input" value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="product-checkbox-label">
                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                Produto ativo
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="modal-btn primary" disabled={submitting}>
              {submitting ? "A guardar…" : isEdit ? "Guardar alterações" : "Criar Produto"}
            </button>
            <button type="button" className="modal-btn secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}