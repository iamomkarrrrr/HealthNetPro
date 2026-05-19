import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import StatCard from '../../components/common/StatCard'

const GovernmentAuditorDashboard = () => {
  const cards = [
    'Disease Surveillance Review',
    'Compliance Monitoring',
    'Audit Review',
    'Reports',
    'Notifications'
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Government Auditor Dashboard</h2>
        <p className="text-muted">Review surveillance programs, audits, and compliance metrics for public health accountability.</p>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <StatCard title="Audit Reviews" value="11" description="Recent checks" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Surveillance" value="4" description="Active programs" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Compliance" value="93%" description="Policy adherence" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Reports" value="15" description="Pending review" />
        </div>
      </div>
      <div className="row g-4 mb-4">
        {cards.map((title) => (
          <div key={title} className="col-md-6 col-xl-4">
            <Card className="h-100" title={title}>
              <p className="text-muted small mb-0">Placeholder for auditing and review dashboards.</p>
            </Card>
          </div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-lg-7">
          <Card title="Surveillance Insights">
            <div className="text-muted small">Insights and data review will be added in a later module.</div>
          </Card>
        </div>
        <div className="col-lg-5">
          <Card title="Audit Timeline">
            <div className="text-muted small">Timeline and audit activity placeholders appear here.</div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default GovernmentAuditorDashboard
