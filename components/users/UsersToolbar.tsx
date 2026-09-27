"use client"

interface UsersToolbarProps {
    search: string
    onSearchChange: (value: string) => void
    onNewUser: () => void
}

export function UsersToolbar({
    search,
    onSearchChange,
    onNewUser,
}: UsersToolbarProps) {
    return (
        <div className="dash-topbar">
            <div>
                <h1 className="dash-title">Utilizadores</h1>
                <p className="dash-subtitle">
                    Gerencie os utilizadores e respetivos níveis de acesso
                </p>
            </div>

            <div className="dash-filters">
                <div className="dash-search">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Pesquisar por nome, email, telefone ou nível…"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <button className="dash-export-btn" onClick={onNewUser}>
                    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Novo Utilizador
                </button>
            </div>
        </div>
    )
}