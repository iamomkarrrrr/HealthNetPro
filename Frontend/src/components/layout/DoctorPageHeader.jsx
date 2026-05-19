import { Search, Bell } from 'lucide-react'
import useAuth from '../../hooks/useAuth'

const DoctorPageHeader = ({ title, subtitle }) => {
  const { user } = useAuth()
  const userInitials = user?.firstName && user?.lastName 
    ? (user.firstName[0] + user.lastName[0]).toUpperCase()
    : 'AS'
  const userName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : 'Adhiyu Scaldos'

  return (
    <div className="doctor-header mb-4">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <h1 className="doctor-page-title mb-2">{title}</h1>
          <p className="doctor-page-description mb-0">{subtitle}</p>
        </div>
        <div className="d-flex align-items-center gap-3 w-100 w-md-auto">
          <div className="input-group doctor-search flex-fill flex-md-grow-0">
            <span className="input-group-text bg-white border-end-0"><Search size={16} /></span>
            <input type="search" className="form-control border-start-0" placeholder="Search" />
          </div>
          <button type="button" className="btn btn-outline-secondary position-relative p-2 rounded-circle">
            <Bell size={18} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger" style={{ width: '10px', height: '10px' }}></span>
          </button>
          <div className="d-flex align-items-center gap-2 bg-white border rounded-3 px-3 py-2 shadow-sm">
            <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              {userInitials}
            </div>
            <div>
              <div className="fw-bold">{userName}</div>
              <div className="text-muted small">Medical Doctor</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorPageHeader
