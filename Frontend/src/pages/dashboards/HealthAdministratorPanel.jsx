import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import StatCard from '../../components/common/StatCard'

const HealthAdministratorPanel = () => {
  const cards = [
    'Program Oversight',
    'Staff Management',
    'Vaccination Programs',
    'Facility/Operations Overview',
    'Reports',
    'Notifications'
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Health Administrator Panel</h2>
        <p className="text-muted">Oversee health programs, vaccination efforts, and operational readiness.</p>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <StatCard title="Programs" value="6" description="Active health initiatives" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Staff" value="18" description="Staff members assigned" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Vaccination Sites" value="12" description="Sites onboarded" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Reports" value="9" description="Operational reports" />
        </div>
      </div>
      <div className="row g-4 mb-4">
        {cards.map((title) => (
          <div key={title} className="col-md-6 col-xl-4">
            <Card className="h-100" title={title}>
              <p className="text-muted small mb-0">Future module placeholder for {title} tools.</p>
            </Card>
          </div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-lg-7">
          <Card title="Operations Summary">
            <p className="text-muted small mb-0">Operational overview and staff statistics will be available here.</p>
          </Card>
        </div>
        <div className="col-lg-5">
          <Card title="Program Health">
            <div className="text-muted small">Program performance metrics ready for future integration.</div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default HealthAdministratorPanel
