"use client"

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react"
import { toast } from "sonner"

import api from "@/lib/axios"
import { Company } from "@/lib/company-data"

interface CompanyFormModalProps {
    company: Company | null
    onClose: () => void
    onSaved: () => void
}

export function CompanyFormModal({
    company,
    onClose,
    onSaved,
}: CompanyFormModalProps) {
    const isEdit = company !== null

    const [name, setName] = useState("")
    const [tradeName, setTradeName] = useState("")
    const [nif, setNif] = useState("")
    const [cae, setCae] = useState("")

    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [province, setProvince] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [country, setCountry] = useState("AO")

    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [website, setWebsite] = useState("")

    const [softwareName, setSoftwareName] = useState("")
    const [certificateNumber, setCertificateNumber] =
        useState("")
    const [certificateIssuer, setCertificateIssuer] =
        useState("")
    const [softwareVersion, setSoftwareVersion] =
        useState("")

    const [currency, setCurrency] = useState("AOA")
    const [vatRegime, setVatRegime] = useState("normal")

    const [agtUsername, setAgtUsername] = useState("")
    const [agtPassword, setAgtPassword] = useState("")

    const [agtPrivateKeyPath, setAgtPrivateKeyPath] =
        useState("")
    const [agtPublicKeyPath, setAgtPublicKeyPath] =
        useState("")
    const [
        agtSoftwarePrivateKeyPath,
        setAgtSoftwarePrivateKeyPath,
    ] = useState("")

    const [agtSignatureVersion, setAgtSignatureVersion] =
        useState("1")

    const [agtEnv, setAgtEnv] = useState("hml")

    const [logo, setLogo] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] =
        useState<string | null>(null)

    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (company) {
            setName(company.name ?? "")
            setTradeName(company.trade_name ?? "")
            setNif(company.nif ?? "")
            setCae(company.cae ?? "")

            setAddress(company.address ?? "")
            setCity(company.city ?? "")
            setProvince(company.province ?? "")
            setPostalCode(company.postal_code ?? "")
            setCountry(company.country ?? "AO")

            setPhone(company.phone ?? "")
            setEmail(company.email ?? "")
            setWebsite(company.website ?? "")

            setSoftwareName(company.software_name ?? "")
            setCertificateNumber(
                company.certificate_number ?? "",
            )
            setCertificateIssuer(
                company.certificate_issuer ?? "",
            )
            setSoftwareVersion(
                company.software_version ?? "",
            )

            setCurrency(company.currency ?? "AOA")
            setVatRegime(company.vat_regime ?? "normal")

            setAgtUsername(company.agt_username ?? "")
            setAgtPassword("")

            setAgtPrivateKeyPath("")
            setAgtPublicKeyPath("")
            setAgtSoftwarePrivateKeyPath("")

            setAgtSignatureVersion(
                String(company.agt_signature_version ?? 1),
            )

            setAgtEnv(company.agt_env ?? "hml")

            setLogo(null)
            setLogoPreview(company.logo_path)
        } else {
            setName("")
            setTradeName("")
            setNif("")
            setCae("")

            setAddress("")
            setCity("")
            setProvince("")
            setPostalCode("")
            setCountry("AO")

            setPhone("")
            setEmail("")
            setWebsite("")

            setSoftwareName("")
            setCertificateNumber("")
            setCertificateIssuer("")
            setSoftwareVersion("")

            setCurrency("AOA")
            setVatRegime("normal")

            setAgtUsername("")
            setAgtPassword("")
            setAgtPrivateKeyPath("")
            setAgtPublicKeyPath("")
            setAgtSoftwarePrivateKeyPath("")
            setAgtSignatureVersion("1")
            setAgtEnv("hml")

            setLogo(null)
            setLogoPreview(null)
        }
    }, [company])

    const handleLogoChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        setLogo(file)
        setLogoPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault()

        if (!name.trim()) {
            toast.error("O nome da empresa é obrigatório.")
            return
        }

        if (!nif.trim()) {
            toast.error("O NIF é obrigatório.")
            return
        }

        setSubmitting(true)

        try {
            const formData = new FormData()

            formData.append("name", name.trim())
            formData.append("trade_name", tradeName.trim())
            formData.append("nif", nif.trim())
            formData.append("cae", cae.trim())

            formData.append("address", address.trim())
            formData.append("city", city.trim())
            formData.append("province", province.trim())
            formData.append("postal_code", postalCode.trim())
            formData.append("country", country.trim())

            formData.append("phone", phone.trim())
            formData.append("email", email.trim())
            formData.append("website", website.trim())

            formData.append(
                "software_name",
                softwareName.trim(),
            )

            formData.append(
                "certificate_number",
                certificateNumber.trim(),
            )

            formData.append(
                "certificate_issuer",
                certificateIssuer.trim(),
            )

            formData.append(
                "software_version",
                softwareVersion.trim(),
            )

            formData.append("currency", currency.trim())
            formData.append("vat_regime", vatRegime)

            formData.append(
                "agt_username",
                agtUsername.trim(),
            )

            /*
             * Só enviamos a password se o utilizador
             * realmente escrever uma nova password.
             */
            if (agtPassword.trim()) {
                formData.append(
                    "agt_password",
                    agtPassword,
                )
            }

            formData.append(
                "agt_private_key_path",
                agtPrivateKeyPath.trim(),
            )

            formData.append(
                "agt_public_key_path",
                agtPublicKeyPath.trim(),
            )

            formData.append(
                "agt_software_private_key_path",
                agtSoftwarePrivateKeyPath.trim(),
            )

            formData.append(
                "agt_signature_version",
                agtSignatureVersion,
            )

            formData.append("agt_env", agtEnv)

            if (logo) {
                formData.append("logo", logo)
            }

            if (isEdit) {
                formData.append("_method", "PUT")

                await api.post(
                    `/company/${company.id}`,
                    formData,
                )

                toast.success(
                    "Empresa atualizada com sucesso.",
                )
            } else {
                await api.post(
                    "/company",
                    formData,
                )

                toast.success(
                    "Empresa criada com sucesso.",
                )
            }

            onSaved()
        } catch (error: any) {
            const response = error?.response?.data
            const errors = response?.errors

            if (errors) {
                const firstError = Object.values(errors)[0]

                if (
                    Array.isArray(firstError) &&
                    firstError.length > 0
                ) {
                    toast.error(String(firstError[0]))
                } else {
                    toast.error(
                        "Verifique os dados informados.",
                    )
                }
            } else {
                toast.error(
                    response?.message ??
                    "Erro ao guardar a empresa.",
                )
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div
            className="modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !submitting) {
                    onClose()
                }
            }}
            style={{
                padding: "16px",
                overflowY: "auto",
                alignItems: "center",
            }}
        >
            <div
                className="modal product-form-modal company-modal"
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                    width: "100%",
                    maxWidth: "900px",
                    maxHeight: "calc(100vh - 32px)",
                    height: "auto",
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    boxSizing: "border-box",
                }}
            >
                <div
                    className="modal-header"
                    style={{
                        flexShrink: 0,
                    }}
                >
                    <div className="modal-title-row">
                        <span className="modal-emoji">🏢</span>

                        <div>
                            <h2 className="modal-title">
                                Editar empresa
                            </h2>

                            <p className="modal-id">
                                ID: {company.id}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="company-form"
                    style={{
                        flex: "1 1 auto",
                        minHeight: 0,
                        overflowY: "auto",
                        overflowX: "hidden",
                        padding: "20px",
                        boxSizing: "border-box",
                    }}
                >
                    {/* IDENTIFICAÇÃO */}
                    <div className="shift-form-grid">
                        <div className="form-group">
                            <label className="form-label">
                                Nome da empresa
                            </label>

                            <input
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Nome comercial
                            </label>

                            <input
                                className="form-input"
                                value={tradeName}
                                onChange={(e) => setTradeName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                NIF
                            </label>

                            <input
                                className="form-input"
                                value={nif}
                                onChange={(e) => setNif(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                CAE
                            </label>

                            <input
                                className="form-input"
                                value={cae}
                                onChange={(e) => setCae(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* ENDEREÇO */}
                    <div className="shift-form-grid">
                        <div className="form-group">
                            <label className="form-label">
                                Morada
                            </label>

                            <input
                                className="form-input"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Cidade
                            </label>

                            <input
                                className="form-input"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Província
                            </label>

                            <input
                                className="form-input"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Código postal
                            </label>

                            <input
                                className="form-input"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                País
                            </label>

                            <input
                                className="form-input"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* CONTACTOS */}
                    <div className="shift-form-grid">
                        <div className="form-group">
                            <label className="form-label">
                                Telefone
                            </label>

                            <input
                                className="form-input"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Website
                            </label>

                            <input
                                className="form-input"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* SOFTWARE */}
                    <div className="shift-form-grid">
                        <div className="form-group">
                            <label className="form-label">
                                Nome do software
                            </label>

                            <input
                                className="form-input"
                                value={softwareName}
                                onChange={(e) =>
                                    setSoftwareName(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Número do certificado
                            </label>

                            <input
                                className="form-input"
                                value={certificateNumber}
                                onChange={(e) =>
                                    setCertificateNumber(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Entidade certificadora
                            </label>

                            <input
                                className="form-input"
                                value={certificateIssuer}
                                onChange={(e) =>
                                    setCertificateIssuer(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Versão do software
                            </label>

                            <input
                                className="form-input"
                                value={softwareVersion}
                                onChange={(e) =>
                                    setSoftwareVersion(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Moeda
                            </label>

                            <input
                                className="form-input"
                                value={currency}
                                onChange={(e) =>
                                    setCurrency(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Regime IVA
                            </label>

                            <select
                                className="form-input"
                                value={vatRegime}
                                onChange={(e) =>
                                    setVatRegime(e.target.value)
                                }
                            >
                                <option value="normal">
                                    Normal
                                </option>

                                <option value="simplificado">
                                    Simplificado
                                </option>

                                <option value="exclusao">
                                    Exclusão
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* AGT */}
                    <div className="shift-form-grid">
                        <div className="form-group">
                            <label className="form-label">
                                Utilizador AGT
                            </label>

                            <input
                                className="form-input"
                                value={agtUsername}
                                onChange={(e) =>
                                    setAgtUsername(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Nova password AGT
                            </label>

                            <input
                                type="password"
                                className="form-input"
                                value={agtPassword}
                                onChange={(e) =>
                                    setAgtPassword(e.target.value)
                                }
                                placeholder="Deixe vazio para manter"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Ambiente AGT
                            </label>

                            <select
                                className="form-input"
                                value={agtEnv}
                                onChange={(e) =>
                                    setAgtEnv(e.target.value)
                                }
                            >
                                <option value="hml">
                                    Homologação
                                </option>

                                <option value="prod">
                                    Produção
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Versão assinatura
                            </label>

                            <input
                                type="number"
                                className="form-input"
                                value={agtSignatureVersion}
                                onChange={(e) =>
                                    setAgtSignatureVersion(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* CHAVES */}
                    <div className="shift-form-grid">
                        <div className="form-group">
                            <label className="form-label">
                                Chave privada AGT
                            </label>

                            <input
                                className="form-input"
                                value={agtPrivateKeyPath}
                                onChange={(e) =>
                                    setAgtPrivateKeyPath(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Chave pública AGT
                            </label>

                            <input
                                className="form-input"
                                value={agtPublicKeyPath}
                                onChange={(e) =>
                                    setAgtPublicKeyPath(e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Chave privada do software
                            </label>

                            <input
                                className="form-input"
                                value={agtSoftwarePrivateKeyPath}
                                onChange={(e) =>
                                    setAgtSoftwarePrivateKeyPath(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* LOGO */}
                    <div className="form-group">
                        <label className="form-label">
                            Logo
                        </label>

                        {logoPreview && (
                            <div className="product-form-image">
                                <img
                                    src={logoPreview}
                                    alt="Logo da empresa"
                                />
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleLogoChange}
                        />
                    </div>

                    <div
                        className="modal-actions"
                        style={{
                            position: "sticky",
                            bottom: 0,
                            marginTop: "20px",
                            paddingTop: "16px",
                            paddingBottom: "4px",
                            zIndex: 5,
                        }}
                    >
                        <button
                            type="button"
                            className="modal-btn secondary"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="modal-btn primary"
                            disabled={submitting}
                        >
                            {submitting
                                ? "A guardar..."
                                : "Guardar alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}