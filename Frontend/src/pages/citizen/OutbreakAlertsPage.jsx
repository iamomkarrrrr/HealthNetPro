import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getOutbreaks } from '../../api/outbreakApi'

const OutbreakAlertsPage = () => {
  const [outbreaks, setOutbreaks] = useState([])
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    getOutbreaks()
      .then((res) => setOutbreaks(res.data?.data ?? []))
      .catch((err) => {
        console.error('[OutbreakAlertsPage] API error:', err?.response ?? err)
        if (err?.response?.status === 403) {
          setAccessDenied(true)
        } else if (!err?.response) {
          setError('Backend server is not reachable. Please ensure the backend is running.')
        } else {
          setError(err?.response?.data?.message || 'Failed to load outbreak data.')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const active = outbreaks.filter((o) => ['DETECTED', 'ACTIVE'].includes(o.status))
  const filtered = filter === 'ALL' ? outbreaks : outbreaks.filter((o) => o.status === filter)

  if (loading) return <DashboardLayout><Loader message="Loading outbreak alerts…" /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Outbreak Alerts</h2>
        <p className="text-muted">Stay informed about disease outbreaks and public health alerts.</p>
      </div>

      {/* ── 403 RBAC message ── */}
      {accessDenied && (
        <div className="alert alert-warning">
          <h6 className="alert-heading">⚠️ Access Denied</h6>
          <p className="mb-2">
            Citizens currently do not have read permission for outbreak alerts.
          </p>
          <hr />
          <p className="mb-1 small"><strong>Backend fix required:</strong></p>
          <p className="mb-0 small">
            In <code>OutbreakController.java</code>, update the <code>@PreAuthorize</code> on{' '}
            <code>GET /api/v1/outbreaks</code> to include <code>'CITIZEN'</code>:
          </p>
          <pre className="mt-2 mb-0 p-2 bg-light rounded small">
{`@PreAuthorize("hasAnyRole('EPIDEMIOLOGIST','ADMIN',
  'DOCTOR','HEALTH_ADMINISTRATOR',
  'COMPLIANCE_OFFICER','CITIZEN')")
@GetMapping`}
          </pre>
        </div>
      )}

      {/* ── Generic error ── */}
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* ── Normal content ── */}
      {!accessDenied && !error && (
        <>
          {active.length > 0 ? (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
              <span className="fs-5">⚠️</span>
              <div>
                <strong>{active.length} active outbreak{active.length > 1 ? 's' : ''} detected.</strong>{' '}
                Please follow public health guidelines and stay informed.
              </div>
            </div>
          ) : (
            <div className="alert alert-success mb-4">✅ No active outbreaks detected at this time.</div>
          )}

          <div className="d-flex gap-2 mb-4 flex-wrap">
            {['ALL', 'DETECTED', 'ACTIVE', 'CONTAINED', 'CLOSED'].map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="alert alert-info">No outbreaks found for the selected filter.</div>
          )}

          <div className="row g-4">
            {filtered.map((o) => {
              const isActive = ['DETECTED', 'ACTIVE'].includes(o.status)
              return (
                <div key={o.id} className="col-md-6 col-xl-4">
                  <div className={`card card-surface h-100 ${isActive ? 'border-danger' : ''}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className={`mb-0 ${isActive ? 'text-danger' : ''}`}>{o.diseaseType}</h6>
                        <StatusBadge status={o.status} />
                      </div>
                      <div className="text-muted small mb-3">📍 {o.location}</div>
                      <div className="d-flex gap-3 text-muted small flex-wrap">
                        <span>Start: {o.startDate}</span>
                        {o.endDate && <span>End: {o.endDate}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default OutbreakAlertsPage
