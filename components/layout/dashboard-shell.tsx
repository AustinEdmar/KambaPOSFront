"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { SaleModal } from "@/components/sale/SaleModal"

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [saleOpen, setSaleOpen] = useState(false)

    function handleConfirm() {
        setConfirmOpen(false)
        setSaleOpen(true)
    }

    useEffect(() => {
        if (!confirmOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setConfirmOpen(false)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [confirmOpen])

    return (
        <div className="pos-root">
            <Sidebar />

            <div className="pos-main">
                {/* Agora abre o popup de confirmação, não o modal de venda */}
                <Header onOpenSale={() => setConfirmOpen(true)} />

                <main className="pos-content">
                    {children}
                </main>
            </div>

            {/* Popup Sim / Não */}
            {confirmOpen && (
                <div
                    className="confirm-overlay"
                    onClick={() => setConfirmOpen(false)}
                >
                    <div
                        className="confirm-modal"
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="confirm-icon">💰</div>
                        <h3 className="confirm-title">Abrir  Venda?</h3>
                        <p className="confirm-text">
                            Deseja abrir pedido de venda?
                        </p>
                        <div className="confirm-actions">
                            <button
                                className="confirm-btn confirm-no"
                                onClick={() => setConfirmOpen(false)}
                            >
                                Não
                            </button>
                            <button
                                className="confirm-btn confirm-yes confirm-yes-primary"
                                autoFocus
                                onClick={handleConfirm}
                            >
                                Sim
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {saleOpen && (
                <SaleModal
                    onClose={() => setSaleOpen(false)}
                    onCompleted={() => router.refresh()}
                />
            )}
        </div>
    )
}