import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar"
import { StatsGrid } from "@/components/dashboard/StatsGrid"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { PopularMenu } from "@/components/dashboard/PopularMenu"
import { TransactionsPanel } from "@/components/dashboard/TransactionsPanel"
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown"
import { QuickActions } from "@/components/dashboard/QuickActions"

export default function Dashboard() {
  return (
    <div className="dash-root">
      <DashboardTopbar />
      <StatsGrid />

      <div className="dash-mid">
        <RevenueChart />
        <PopularMenu />
      </div>

      <div className="dash-bottom">
        <TransactionsPanel />
        <div className="dash-side-col">
          <CategoryBreakdown />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}