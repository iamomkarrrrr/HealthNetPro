import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import StatCard from '../../components/common/StatCard'

const CitizenPortal = () => {
  const cards = [
    'My Profile',
    'Health Profile',
    'My Documents',
    'Vaccination Records',
    'Vaccination Schedules',
    'Outbreak Alerts',
    'Notifications',
    'Report Health Concern'
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Citizen Portal</h2>
        <p className="text-muted">Access your health profile, vaccination records, alerts, and document verification status.</p>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <StatCard title="Profile Status" value="Active" description="Verified citizen profile" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Vaccination" value="2 due" description="Upcoming appointments" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Documents" value="3 uploaded" description="Verification pending" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Alerts" value="1 active" description="Local outbreak notices" />
        </div>
      </div>
      <div className="row g-4 mb-4">
        {cards.map((title) => (
          <div key={title} className="col-md-6 col-xl-3">
            <Card className="h-100" title={title}>
              <p className="text-muted small mb-0">Placeholder for future integration: {title} functionality.</p>
            </Card>
          </div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-xl-8">
          <Card title="Recent Notifications">
            <p className="text-muted small">No notifications loaded yet. Notifications will appear here once integrated.</p>
          </Card>
        </div>
        <div className="col-xl-4">
          <Card title="Quick Status">
            <ul className="list-unstyled mb-0">
              <li className="mb-3"><strong>Status:</strong> Active citizen profile</li>
              <li className="mb-3"><strong>Next vaccine:</strong> Not scheduled</li>
              <li><strong>Alerts:</strong> No active outbreak alerts in your area</li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CitizenPortal
