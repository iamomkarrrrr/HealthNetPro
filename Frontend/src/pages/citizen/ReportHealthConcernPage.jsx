import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'

const ReportHealthConcernPage = () => (
  <DashboardLayout>
    <div className="mb-4">
      <h2 className="page-title">Report Health Concern</h2>
      <p className="text-muted">Submit a health concern or symptom report to your local health authority.</p>
    </div>
    <div className="row justify-content-center">
      <div className="col-lg-7">
        <Card>
          <div className="text-center py-4">
            <div className="fs-1 mb-3">🏥</div>
            <h5 className="mb-2">Feature Coming Soon</h5>
            <p className="text-muted mb-4">
              The ability to report health concerns directly through the portal is currently under development.
              This feature will allow you to submit symptoms, request a health check, and receive guidance from
              public health officials.
            </p>
            <div className="alert alert-info text-start">
              <strong>In the meantime, if you have an urgent health concern:</strong>
              <ul className="mb-0 mt-2">
                <li>Contact your nearest health clinic or hospital.</li>
                <li>Call the public health helpline.</li>
                <li>Reach out to your assigned doctor through the HealthNet system.</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </DashboardLayout>
)

export default ReportHealthConcernPage
