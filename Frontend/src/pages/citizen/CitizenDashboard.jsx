import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import useAuth from '../../hooks/useAuth'
import useCitizen from '../../hooks/useCitizen'
import { getHealthProfileByCitizenId } from '../../api/healthProfileApi'
import { getDocumentsByCitizenId } from '../../api/citizenDocumentApi'
import { getImmunizationsByCitizenId } from '../../api/immunizationApi'
import { getVaccinationPrograms } from '../../api/vaccinationApi'
import { getOutbreaks } from '../../api/outbreakApi'
import { getNotificationsByUserId } from '../../api/notificationApi'

const CitizenDashboard = () => {
  const { user } = useAuth()
  const { citizen, citizenId, loading: citizenLoading } = useCitizen()

  const [healthProfile, setHealthProfile] = useState(null)
  const [documents, setDocuments] = useState([])
  const [immunizations, setImmunizations] = useState([])
  const [vaccinationPrograms, setVaccinationPrograms] = useState([])
  const [outbreaks, setOutbreaks] = useState([])
  const [outbreakAccessDenied, setOutbreakAccessDenied] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    if (!user?.userId) return
    setDataLoading(true)

    const citizenCalls = citizenId
      ? [
          getHealthProfileByCitizenId(citizenId),
          getDocumentsByCitizenId(citizenId),
          getImmunizationsByCitizenId(citizenId),
        ]
      : [Promise.resolve(null), Promise.resolve(null), Promise.resolve(null)]

    Promise.allSettled([
      ...citizenCalls,
      getVaccinationPrograms(),
      getOutbreaks(),
      getNotificationsByUserId(user.userId),
    ]).then(([hp, docs, imm, vax, ob, notif]) => {
      if (hp?.status === 'fulfilled' && hp.value) setHealthProfile(hp.value.data?.data ?? null)
      if (docs?.status === 'fulfilled' && docs.value) setDocuments(docs.value.data?.data ?? [])
      if (imm?.status === 'fulfilled' && imm.value) setImmunizations(imm.value.data?.data ?? [])
      if (vax.status === 'fulfilled') setVaccinationPrograms(vax.value.data?.data ?? [])
      if (ob.status === 'fulfilled') {
        setOutbreaks(ob.value.data?.data ?? [])
      } else if (ob.reason?.response?.status === 403) {
        setOutbreakAccessDenied(true)
      }
      if (notif.status === 'fulfilled') setNotifications(notif.value.data?.data ?? [])
    }).finally(() => setDataLoading(false))
  }, [citizenId, user?.userId])

  const activeOutbreaks = outbreaks.filter((o) => ['DETECTED', 'ACTIVE'].includes(o.status))
  const unreadNotifications = notifications.filter((n) => n.status === 'UNREAD')
  const pendingDocs = documents.filter((d) => d.verificationStatus === 'PENDING')
  const activeVaxPrograms = vaccinationPrograms.filter((v) => ['UPCOMING', 'ACTIVE'].includes(v.status))

  if (citizenLoading) {
    return <DashboardLayout><Loader message="Loading your portal…" /></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Citizen Portal</h2>
        <p className="text-muted">
          Welcome back, <strong>{user?.name}</strong>. Here is your health summary.
        </p>
      </div>

      {!citizen && (
        <div className="alert alert-warning mb-4">
          <strong>Citizen profile not set up.</strong>{' '}
          <Link to="/citizen/profile" className="alert-link">Create your citizen profile</Link>{' '}
          to access all features.
        </div>
      )}

      {/* Stat cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="card card-surface h-100">
            <div className="card-body">
              <div className="text-muted small mb-1">Profile Status</div>
              <h5 className="mb-1">
                {citizen
                  ? <StatusBadge status={citizen.status} />
                  : <span className="badge bg-warning">Not Created</span>}
              </h5>
              <div className="text-muted small">{citizen?.name ?? '—'}</div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="card card-surface h-100">
            <div className="card-body">
              <div className="text-muted small mb-1">Health Profile</div>
              <h5 className="mb-1">
                {healthProfile
                  ? <StatusBadge status={healthProfile.status} />
                  : <span className="badge bg-secondary">None</span>}
              </h5>
              <div className="text-muted small">{healthProfile ? 'On record' : 'Not created yet'}</div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="card card-surface h-100">
            <div className="card-body">
              <div className="text-muted small mb-1">Documents</div>
              <h5 className="mb-1">{documents.length}</h5>
              <div className="text-muted small">{pendingDocs.length} pending verification</div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="card card-surface h-100">
            <div className="card-body">
              <div className="text-muted small mb-1">Outbreak Alerts</div>
              {outbreakAccessDenied ? (
                <div className="text-muted small">Access restricted — <Link to="/citizen/outbreak-alerts">details</Link></div>
              ) : (
                <>
                  <h5 className={`mb-1 ${activeOutbreaks.length > 0 ? 'text-danger' : ''}`}>
                    {activeOutbreaks.length} Active
                  </h5>
                  <div className="text-muted small">{outbreaks.length} total</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Second row stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="card card-surface h-100">
            <div className="card-body">
              <div className="text-muted small mb-1">Immunizations</div>
              <h5 className="mb-1">{immunizations.length}</h5>
              <div className="text-muted small">
                {immunizations.filter((i) => i.status === 'GIVEN').length} given
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="card card-surface h-100">
            <div className="card-body">
              <div className="text-muted small mb-1">Vaccination Programs</div>
              <h5 className="mb-1">{activeVaxPrograms.length}</h5>
              <div className="text-muted small">Active / Upcoming</div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xl-3">
          <div className="card card-surface h-100">
            <div className="card-body">
              <div className="text-muted small mb-1">Notifications</div>
              <h5 className="mb-1">{unreadNotifications.length}</h5>
              <div className="text-muted small">Unread</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick action cards */}
      <div className="row g-4 mb-4">
        {[
          { label: 'My Profile', to: '/citizen/profile', desc: 'View and update your citizen profile.' },
          { label: 'Health Profile', to: '/citizen/health-profile', desc: 'View your medical history and allergies.' },
          { label: 'Documents', to: '/citizen/documents', desc: `${documents.length} document(s) on file.` },
          { label: 'Vaccination Records', to: '/citizen/vaccination-records', desc: `${immunizations.length} immunization record(s).` },
          { label: 'Vaccination Schedules', to: '/citizen/vaccination-schedules', desc: `${activeVaxPrograms.length} active/upcoming program(s).` },
          { label: 'Outbreak Alerts', to: '/citizen/outbreak-alerts', desc: outbreakAccessDenied ? 'View access status.' : `${activeOutbreaks.length} active alert(s).` },
          { label: 'Notifications', to: '/citizen/notifications', desc: `${unreadNotifications.length} unread notification(s).` },
          { label: 'Report Health Concern', to: '/citizen/report-health-concern', desc: 'Submit a health concern report.' },
        ].map(({ label, to, desc }) => (
          <div key={to} className="col-md-6 col-xl-3">
            <Link to={to} className="text-decoration-none">
              <div className="card card-surface h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-primary mb-1">{label}</h6>
                  <p className="text-muted small mb-0">{desc}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="row g-4">
        <div className="col-lg-7">
          <Card title="Recent Notifications">
            {dataLoading ? (
              <Loader message="Loading…" />
            ) : unreadNotifications.length === 0 ? (
              <p className="text-muted small mb-0">No unread notifications.</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {unreadNotifications.slice(0, 5).map((n) => (
                  <li key={n.id} className="d-flex justify-content-between align-items-start py-2 border-bottom">
                    <div>
                      <div className="small">{n.message}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {n.category} · {n.createdDate?.slice(0, 10)}
                      </div>
                    </div>
                    <StatusBadge status={n.status} />
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3">
              <Link to="/citizen/notifications" className="btn btn-sm btn-outline-primary">View all</Link>
            </div>
          </Card>
        </div>
        <div className="col-lg-5">
          <Card title="Active Outbreak Alerts">
            {dataLoading ? (
              <Loader message="Loading…" />
            ) : outbreakAccessDenied ? (
              <div className="text-muted small">
                Outbreak data is restricted for citizens.{' '}
                <Link to="/citizen/outbreak-alerts">See details</Link>.
              </div>
            ) : activeOutbreaks.length === 0 ? (
              <p className="text-muted small mb-0">No active outbreaks.</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {activeOutbreaks.slice(0, 4).map((o) => (
                  <li key={o.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                      <div className="small fw-semibold">{o.diseaseType}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{o.location}</div>
                    </div>
                    <StatusBadge status={o.status} />
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3">
              <Link to="/citizen/outbreak-alerts" className="btn btn-sm btn-outline-danger">View all alerts</Link>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CitizenDashboard
