"use client"

const ACTIONS = [
  { label: "Nova Mesa", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="3" rx="1.5" /><path d="M5 10v7M19 10v7M8 17h8" /></svg> },
  { label: "Novo Pedido", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg> },
  { label: "Relatório", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 17V11M12 17V7M15 17v-4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg> },
  { label: "Fechar Caixa", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg> },
]

export function QuickActions() {
  return (
    <div className="dash-card qa-card">
      <h2 className="card-title" style={{ marginBottom: '12px' }}>Ações Rápidas</h2>
      <div className="qa-grid">
        {ACTIONS.map((qa, i) => (
          <button key={i} className="qa-btn">
            <span className="qa-icon">{qa.icon}</span>
            <span className="qa-label">{qa.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
