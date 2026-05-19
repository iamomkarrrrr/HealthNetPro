import { Link } from 'react-router-dom'

const PublicFooter = () => {
  return (
    <footer className="layout-footer py-5 mt-5">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <h5>HealthNet</h5>
            <p className="text-muted">A secure outbreak and pandemic management portal for citizens, clinics, and public health teams.</p>
          </div>
          <div className="col-md-4">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li><Link to="/login" className="text-muted text-decoration-none">Login</Link></li>
              <li><Link to="/register" className="text-muted text-decoration-none">Citizen Register</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6>Contact</h6>
            <p className="text-muted mb-1">support@healthnet.gov</p>
            <p className="text-muted">+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="text-center text-muted small mt-4">© 2026 HealthNet. All rights reserved.</div>
      </div>
    </footer>
  )
}

export default PublicFooter
