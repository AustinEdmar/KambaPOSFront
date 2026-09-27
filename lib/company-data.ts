export interface Company {
    id: number

    name: string
    trade_name: string | null
    nif: string
    cae: string | null

    address: string | null
    city: string | null
    province: string | null
    postal_code: string | null
    country: string | null

    phone: string | null
    email: string | null
    website: string | null

    logo_path: string | null

    software_name: string | null
    certificate_number: string | null
    certificate_issuer: string | null
    software_version: string | null

    currency: string | null
    vat_regime: string | null

    agt_username: string | null
    agt_signature_version: number | null
    agt_env: string | null

    agt_private_key_configured: boolean
    agt_public_key_configured: boolean
    agt_software_private_key_configured: boolean

    created_at: string
    updated_at: string
}

export interface CompanyPagination {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
}