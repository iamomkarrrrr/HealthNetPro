import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'

const NotFoundPage = () => {
  return (
    <PublicLayout>
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card card-surface p-5 text-center shadow-soft">
            <h1 className="display-4">404</h1>
            <p className="lead text-muted">The page you are looking for cannot be found.</p>
            <Link to="/" className="btn btn-outline-primary">Go to Home</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default NotFoundPage
