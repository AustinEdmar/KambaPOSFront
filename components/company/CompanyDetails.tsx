"use client"

import { Company } from "@/lib/company-data"

interface CompanyDetailsProps {
    company: Company | null
    loading: boolean
    section: "identification" | "contacts" | "software" | "agt"
}

function InfoRow({
    label,
    value,
}: {
    label: string
    value: string | number | null | undefined
}) {
    return (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <div className="form-input">
                {value !== null && value !== undefined && value !== ""
                    ? String(value)
                    : "—"}
            </div>
        </div>
    )
}

export function CompanyDetails({ company, loading, section }: CompanyDetailsProps) {
    if (loading) {
        return (
            <div className="dash-card">
                <p className="tx-date">A carregar dados da empresa...</p>
            </div>
        )
    }

    if (!company) {
        return (
            <div className="dash-card">
                <p className="tx-date">Nenhuma empresa encontrada.</p>
            </div>
        )
    }

    if (section === "identification") {
        return (
            <div className="dash-card">
                <div className="card-title">Identificação da empresa</div>
                <p className="dash-subtitle">Informações comerciais e fiscais</p>

                <div className="shift-form-grid">
                    <InfoRow label="Nome da empresa" value={company.name} />
                    <InfoRow label="Nome comercial" value={company.trade_name} />
                    <InfoRow label="NIF" value={company.nif} />
                    <InfoRow label="CAE" value={company.cae} />
                </div>
            </div>
        )
    }

    if (section === "contacts") {
        return (
            <div className="dash-card">
                <div className="card-title">Contactos e localização</div>
                <p className="dash-subtitle">Dados de contacto da empresa</p>

                <div className="shift-form-grid">
                    <InfoRow label="Morada" value={company.address} />
                    <InfoRow label="Cidade" value={company.city} />
                    <InfoRow label="Província" value={company.province} />
                    <InfoRow label="Código postal" value={company.postal_code} />
                    <InfoRow label="País" value={company.country} />
                    <InfoRow label="Telefone" value={company.phone} />
                    <InfoRow label="Email" value={company.email} />
                    <InfoRow label="Website" value={company.website} />
                </div>
            </div>
        )
    }

    if (section === "software") {
        return (
            <div className="dash-card">
                <div className="card-title">Software</div>
                <p className="dash-subtitle">Informações do software certificado</p>

                <div className="shift-form-grid">
                    <InfoRow label="Nome do software" value={company.software_name} />
                    <InfoRow label="Versão" value={company.software_version} />
                    <InfoRow label="Número do certificado" value={company.certificate_number} />
                    <InfoRow label="Entidade certificadora" value={company.certificate_issuer} />
                    <InfoRow label="Moeda" value={company.currency} />
                    <InfoRow label="Regime de IVA" value={company.vat_regime} />
                </div>
            </div>
        )
    }

    return (
        <div className="dash-card">
            <div className="card-title">Configuração AGT</div>
            <p className="dash-subtitle">Configurações de faturação eletrónica</p>

            <div className="shift-form-grid">
                <InfoRow label="Ambiente AGT" value={company.agt_env} />
                <InfoRow label="Versão da assinatura" value={company.agt_signature_version} />
                <InfoRow label="Utilizador AGT" value={company.agt_username} />
                <InfoRow
                    label="Chave privada AGT"
                    value={company.agt_private_key_configured ? "Configurada" : "Não configurada"}
                />
                <InfoRow
                    label="Chave pública AGT"
                    value={company.agt_public_key_configured ? "Configurada" : "Não configurada"}
                />
                <InfoRow
                    label="Chave privada do software"
                    value={company.agt_software_private_key_configured ? "Configurada" : "Não configurada"}
                />
            </div>
        </div>
    )
}