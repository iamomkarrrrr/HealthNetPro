import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import StatCard from '../../components/common/StatCard'

const ComplianceOfficerConsole = () => {
  const cards = [
    'Policy Monitoring',
    'Compliance Records',
    'Audits',
    'Compliance Reports',
    'Notifications'
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Compliance Officer Console</h2>
        <p className="text-muted">Track policy adherence, review audits, and generate compliance reports.</p>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <StatCard title="Compliance Checks" value="27" description="Records reviewed" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Audits" value="8" description="Open audit cases" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Policies" value="12" description="Monitored policies" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Alerts" value="2" description="Compliance alerts" />
        </div>
      </div>
      <div className="row g-4 mb-4">
        {cards.map((title) => (
          <div key={title} className="col-md-6 col-xl-4">
            <Card className="h-100" title={title}>
              <p className="text-muted small mb-0">Placeholder for compliance workflows and audit tracking.</p>
            </Card>
          </div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-lg-6">
          <Card title="Audit Summary">
            <div className="text-muted small">Audit progress and policy action items will appear here.</div>
          </Card>
        </div>
        <div className="col-lg-6">
          <Card title="Compliance Status">
            <div className="text-muted small">Compliance records will be surfaced after backend integration.</div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ComplianceOfficerConsole
