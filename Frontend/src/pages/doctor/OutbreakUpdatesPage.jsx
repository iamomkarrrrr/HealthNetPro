import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllOutbreaks } from '../../api/outbreakApi'

const OUTBREAK_STATUSES = ['DETECTED', 'ACTIVE', 'CONTAINED', 'CLOSED']
const EMPTY_FORM = null

const OutbreakUpdatesPage = () => {
  const [outbreaks, setOutbreaks] = useState([])
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [filter, setFilter] = useState('ALL')

  const fetchOutbreaks = useCallback(() => {
    setLoading(true)
    getAllOutbreaks()
      .then(res => setOutbreaks(res.data?.data ?? []))
      .catch(err => {
        console.error('[OutbreakUpdatesPage]', err?.response ?? err)
        if (err?.response?.status === 403) setAccessDenied(true)
        else if (!err?.response) setFetchError('Backend server is not reachable.')
        else setFetchError(err?.response?.data?.message || 'Failed to load outbreaks')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchOutbreaks() }, [fetchOutbreaks])

  // This page is view-only for DOCTOR role: no create handlers are present here.

  const active = outbreaks.filter(o => ['DETECTED', 'ACTIVE'].includes(o.status))
  const filtered = filter === 'ALL' ? outbreaks : outbreaks.filter(o => o.status === filter)

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="page-title">Outbreak Updates</h2>
          <p className="text-muted mb-0">Monitor active disease outbreaks and stay updated with public health alerts.</p>
        </div>
      </div>

      {/* 403 read access denied */}
      {accessDenied && (
        <div className="alert alert-warning">
          <h6 className="alert-heading">⚠️ Access Denied</h6>
          <p className="mb-1">DOCTOR role does not have read permission for outbreak data.</p>
          <p className="mb-0 small">
            <strong>Backend fix:</strong> Add <code>'DOCTOR'</code> to{' '}
            <code>@PreAuthorize</code> on <code>GET /api/v1/outbreaks</code> in{' '}
            <code>OutbreakController.java</code>.
          </p>
        </div>
      )}

      {fetchError && <div className="alert alert-danger py-2">{fetchError}</div>}
      {/* No create UI for DOCTOR role: view-only page. */}

      {!accessDenied && !fetchError && (
        <>
          {/* Active alert banner */}
          {active.length > 0 && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
              <span className="fs-5">⚠️</span>
              <strong>{active.length} active outbreak{active.length > 1 ? 's' : ''} detected.</strong>
            </div>
          )}

          {/* Filter tabs */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
            {['ALL', ...OUTBREAK_STATUSES].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? <Loader message="Loading outbreaks…" /> : filtered.length === 0 ? (
            <div className="alert alert-info">No outbreaks found for the selected filter.</div>
          ) : (
            <div className="row g-4">
              {filtered.map(o => {
                const isActive = ['DETECTED', 'ACTIVE'].includes(o.status)
                return (
                  <div key={o.id} className="col-md-6 col-xl-4">
                    <div className={`card card-surface h-100 ${isActive ? 'border-danger' : ''}`}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className={`mb-0 ${isActive ? 'text-danger' : ''}`}>{o.diseaseType}</h6>
                          <StatusBadge status={o.status} />
                        </div>
                        <div className="text-muted small mb-2">📍 {o.location}</div>
                        <div className="text-muted small">
                          <span>Start: {o.startDate}</span>
                          {o.endDate && <span className="ms-3">End: {o.endDate}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

export default OutbreakUpdatesPage
