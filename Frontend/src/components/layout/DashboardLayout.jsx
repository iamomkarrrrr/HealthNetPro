import Sidebar from './Sidebar'
import Topbar from './Topbar'

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="d-flex flex-column flex-fill overflow-hidden">
        <Topbar />
        <main className="flex-fill p-4 dashboard-main overflow-auto">
          <div className="container-fluid">{children}</div>
        </main>
        <footer className="layout-footer py-3 px-4">
          <div className="d-flex justify-content-between align-items-center text-muted small">
            <span>HealthNet &mdash; Outbreak &amp; Pandemic Management System</span>
            <span>&copy; 2026 HealthNet. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default DashboardLayout
