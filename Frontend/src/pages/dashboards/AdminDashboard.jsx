import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import StatCard from '../../components/common/StatCard'

const AdminDashboard = () => {
  const cards = [
    'Manage Users',
    'Create Staff User',
    'Manage Citizens',
    'System Reports',
    'Notifications',
    'Audit Logs',
    'Module Overview'
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Admin Dashboard</h2>
        <p className="text-muted">Manage system users, citizen accounts, audit logs, and reporting operations.</p>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <StatCard title="Active Users" value="82" description="System-wide accounts" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Staff Requests" value="4" description="Approval pending" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Audit Logs" value="12" description="Recent entries" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Reports" value="7" description="New reports available" />
        </div>
      </div>
      <div className="row g-4 mb-4">
        {cards.map((title) => (
          <div key={title} className="col-md-6 col-xl-4">
            <Card className="h-100" title={title}>
              <p className="text-muted small mb-0">Placeholder for admin management workflows.</p>
            </Card>
          </div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-lg-6">
          <Card title="System Overview">
            <div className="text-muted small">Operational metrics and status summary are prepared for future integration.</div>
          </Card>
        </div>
        <div className="col-lg-6">
          <Card title="Audit & Users">
            <div className="text-muted small">Audit logs and user management shortcuts will appear here.</div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
