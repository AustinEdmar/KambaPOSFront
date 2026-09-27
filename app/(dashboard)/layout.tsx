import { StoreProvider } from "@/stores/provider"
import { AuthGuard } from "@/components/AuthGuard"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import "@/styles/dashboard-theme.css"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AuthGuard>

        <div className="pos-root">
          <Sidebar />
          <div className="pos-main">
            <Header />
            <main className="pos-content">
              {children}
            </main>
          </div>
        </div>
      </AuthGuard>
    </StoreProvider>
  )
}