"use client"

interface HeaderProps {
    userInitials?: string
    onOpenSale?: () => void
}

export function Header({ userInitials = "TA", onOpenSale }: HeaderProps) {
    return (
        <header className="pos-header">
            <div className="pos-search">
                <svg width="14" height="14" fill="none" stroke="#A8A29E" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                <span className="pos-search-placeholder">Pesquisar...</span>
                <span className="pos-search-kbd">⌘K</span>
            </div>

            <div className="pos-header-right">
                <button className="pos-icon-btn" title="Notificações">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
                    <span className="pos-notif-dot" />
                </button>

                <button className="pos-icon-btn" title="Modo escuro">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                </button>

                <div className="pos-header-divider" />

                <button className="pos-open-sale" onClick={onOpenSale}>
                    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.98-1.67L23 6H6" /></svg>
                    Abrir Venda
                </button>

                <div className="pos-avatar-sm">{userInitials}</div>
            </div>
        </header>
    )
}