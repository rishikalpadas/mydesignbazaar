// Force dynamic rendering for all dashboard pages
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export default function DashboardLayoutRoot({ children }) {
  return children
}
