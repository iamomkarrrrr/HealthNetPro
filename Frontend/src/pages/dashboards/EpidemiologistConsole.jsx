import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import StatCard from '../../components/common/StatCard'

const EpidemiologistConsole = () => {
  const cards = [
    'Outbreak Monitoring',
    'Epidemiology Data',
    'Disease Trends',
    'Data Analysis',
    'Compliance Tracking',
    'Reports'
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Epidemiologist Console</h2>
        <p className="text-muted">Monitor disease trends, outbreak patterns, and compliance status across regions.</p>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <StatCard title="Active Outbreaks" value="8" description="Monitored regions" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Data Feeds" value="5" description="Updated sources" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Trends" value="Stable" description="Disease movement" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Reports" value="14" description="Awaiting review" />
        </div>
      </div>
      <div className="row g-4 mb-4">
        {cards.map((title) => (
          <div key={title} className="col-md-6 col-xl-4">
            <Card className="h-100" title={title}>
              <p className="text-muted small mb-0">Placeholder dashboard action for {title}.</p>
            </Card>
          </div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-lg-8">
          <Card title="Trend Summary">
            <p className="text-muted small mb-0">Designated analytics cards will be added once data modules are integrated.</p>
          </Card>
        </div>
        <div className="col-lg-4">
          <Card title="Compliance Snapshot">
            <div className="text-muted small">Compliance tracking placeholders for regulatory oversight.</div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EpidemiologistConsole
