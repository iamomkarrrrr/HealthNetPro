import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllCitizens } from '../../api/citizenApi'
import { getHealthProfileByCitizenId } from '../../api/healthProfileApi'
import { getDocumentsByCitizenId } from '../../api/citizenDocumentApi'

const PatientRecordsPage = () => {
  const [citizens, setCitizens] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [healthProfile, setHealthProfile] = useState(null)
  const [documents, setDocuments] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    getAllCitizens()
      .then(res => setCitizens(res.data?.data ?? []))
      .catch(err => {
        if (err?.response?.status === 403) {
          setFetchError('Access denied. DOCTOR role requires GET /api/v1/citizens permission in backend RBAC.')
        } else {
          setFetchError(err?.response?.data?.message || 'Failed to load patient records')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const loadDetails = useCallback((citizen) => {
    setSelected(citizen)
    setHealthProfile(null)
    setDocuments([])
    setDetailLoading(true)
    Promise.allSettled([
      getHealthProfileByCitizenId(citizen.id),
      getDocumentsByCitizenId(citizen.id),
    ]).then(([hp, docs]) => {
      if (hp.status === 'fulfilled') setHealthProfile(hp.value.data?.data ?? null)
      if (docs.status === 'fulfilled') setDocuments(docs.value.data?.data ?? [])
    }).finally(() => setDetailLoading(false))
  }, [])

  const filtered = citizens.filter(c => {
    const q = search.toLowerCase()
    return (
      c.name?.toLowerCase().includes(q) ||
      String(c.id).includes(q) ||
      c.contactInfo?.includes(q)
    )
  })

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Patient Records</h2>
        <p className="text-muted">Search and view citizen health profiles and documents.</p>
      </div>

      {fetchError && (
        <div className="alert alert-warning">
          <strong>⚠️ {fetchError}</strong>
        </div>
      )}

      <div className="row g-4">
        {/* Left: citizen list */}
        <div className={selected ? 'col-lg-5' : 'col-12'}>
          <Card title="Citizens">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by name, ID, or contact…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {loading ? <Loader message="Loading patients…" /> : filtered.length === 0 ? (
              <p className="text-muted small mb-0">
                {citizens.length === 0 ? 'No citizens found.' : 'No results match your search.'}
              </p>
            ) : (
              <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                {filtered.map(c => (
                  <div
                    key={c.id}
                    className={`p-3 rounded mb-2 cursor-pointer border ${selected?.id === c.id ? 'border-primary bg-primary bg-opacity-10' : 'border-light bg-light'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => loadDetails(c)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-medium">{c.name}</div>
                        <div className="text-muted small">ID: {c.id} · {c.gender} · DOB: {c.dob}</div>
                        <div className="text-muted small">{c.contactInfo}</div>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: detail panel */}
        {selected && (
          <div className="col-lg-7">
            <Card
              header={
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{selected.name}</h5>
                  <button className="btn-close" onClick={() => setSelected(null)} />
                </div>
              }
            >
              {detailLoading ? <Loader message="Loading details…" /> : (
                <>
                  {/* Citizen info */}
                  <div className="row g-3 mb-4">
                    {[
                      ['Citizen ID', selected.id],
                      ['Date of Birth', selected.dob],
                      ['Gender', selected.gender],
                      ['Contact', selected.contactInfo],
                      ['Address', selected.address],
                      ['Status', <StatusBadge key="s" status={selected.status} />],
                    ].map(([label, value]) => (
                      <div key={label} className="col-md-6">
                        <div className="text-muted small">{label}</div>
                        <div className="fw-medium">{value ?? '—'}</div>
                      </div>
                    ))}
                  </div>

                  {/* Health profile */}
                  <h6 className="border-top pt-3 mb-3">Health Profile</h6>
                  {healthProfile ? (
                    <div className="row g-3 mb-4">
                      <div className="col-12">
                        <div className="text-muted small">Medical History</div>
                        <p className="mb-0 small" style={{ whiteSpace: 'pre-wrap' }}>
                          {healthProfile.medicalHistory || 'None recorded'}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <div className="text-muted small">Allergies</div>
                        <p className="mb-0 small">{healthProfile.allergies || 'None recorded'}</p>
                      </div>
                      <div className="col-md-6">
                        <div className="text-muted small">Status</div>
                        <StatusBadge status={healthProfile.status} />
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-info py-2 small mb-4">
                      No health profile available for this citizen.
                    </div>
                  )}

                  {/* Documents */}
                  <h6 className="border-top pt-3 mb-3">Documents</h6>
                  {documents.length === 0 ? (
                    <p className="text-muted small">No documents on file.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Type</th>
                            <th>Uploaded</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documents.map(d => (
                            <tr key={d.id}>
                              <td className="small">{d.docType?.replace('_', ' ')}</td>
                              <td className="small text-muted">{d.uploadedDate?.slice(0, 10)}</td>
                              <td><StatusBadge status={d.verificationStatus} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default PatientRecordsPage
