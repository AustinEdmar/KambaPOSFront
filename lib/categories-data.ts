export interface Category {
    id: number
    name: string
    image_path: string | null
}

export interface CategoryPagination {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
}