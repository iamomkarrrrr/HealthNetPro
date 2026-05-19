import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'

const UnauthorizedPage = () => {
  return (
    <PublicLayout>
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card card-surface p-5 text-center shadow-soft">
            <h1 className="display-4">Unauthorized</h1>
            <p className="lead text-muted">You do not have permission to access this page.</p>
            <Link to="/login" className="btn btn-primary">Return to Login</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default UnauthorizedPage
