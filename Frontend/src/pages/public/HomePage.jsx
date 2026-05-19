import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'

const HomePage = () => {
  return (
    <PublicLayout>
      <section className="py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <span className="badge bg-info bg-opacity-10 text-info mb-3">Healthcare Intelligence</span>
            <h1 className="display-5 fw-bold">HealthNet</h1>
            <p className="lead text-muted">A comprehensive outbreak and pandemic management system for citizens, clinicians, and public health teams.</p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Link to="/login" className="btn btn-primary btn-lg">Login</Link>
              <Link to="/register" className="btn btn-outline-primary btn-lg">Citizen Register</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="row gy-4">
          <div className="col-md-6 col-lg-4">
            <div className="card card-surface h-100 p-4">
              <h5>Outbreak Alerts</h5>
              <p className="text-muted">Stay informed with near real-time outbreak notifications and community health warnings.</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card card-surface h-100 p-4">
              <h5>Vaccination Schedules</h5>
              <p className="text-muted">Track immunization programs, appointment reminders, and vaccination status.</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card card-surface h-100 p-4">
              <h5>Health Profile Access</h5>
              <p className="text-muted">Manage your personal profile, health documents, and verification status securely.</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card card-surface h-100 p-4">
              <h5>Public Health Surveillance</h5>
              <p className="text-muted">Support community monitoring and response through trusted healthcare data.</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card card-surface h-100 p-4">
              <h5>Compliance & Reporting</h5>
              <p className="text-muted">Maintain audit-ready records and transparency for local health authorities.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

export default HomePage
