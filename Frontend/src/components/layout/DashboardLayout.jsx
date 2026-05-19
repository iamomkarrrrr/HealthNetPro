import Sidebar from './Sidebar'
import Topbar from './Topbar'

const DashboardLayout = ({ children }) => (
  <div className="hn-shell">
    <Sidebar />
    <div className="hn-main">
      <Topbar />
      <main className="hn-content">
        <div className="hn-page">{children}</div>
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

export default DashboardLayout
