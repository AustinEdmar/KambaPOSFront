import { StoreProvider } from "@/stores/provider"
import { AuthGuard } from "@/components/AuthGuard"

import { DashboardShell } from "@/components/layout/dashboard-shell"
import "@/styles/dashboard-theme.css"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AuthGuard>
        <DashboardShell>{children}</DashboardShell>
      </AuthGuard>
    </StoreProvider>
  )
}