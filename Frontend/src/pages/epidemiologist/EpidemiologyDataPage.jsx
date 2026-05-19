import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllOutbreaks } from '../../api/outbreakApi'
import { getEpidemiologyDataByOutbreakId, createEpidemiologyData, updateEpidemiologyData } from '../../api/epidemiologyDataApi'

const DATA_STATUSES = ['RECORDED', 'ANALYZED', 'ARCHIVED']
const SAMPLE_JSON = '{"totalCases": 320, "activeCases": 58, "fatalities": 7}'
const EMPTY_FORM = { metricsJson: SAMPLE_JSON, date: new Date().toISOString().slice(0, 10), status: 'RECORDED' }

const tryParseJson = (str) => {
  try { return JSON.parse(str) } catch { return null }
}

const EpidemiologyDataPage = () => {
  const [outbreaks, setOutbreaks] = useState([])
  const [selectedOutbreakId, setSelectedOutbreakId] = useState('')
  const [dataList, setDataList] = useState([])
  const [loadingOutbreaks, setLoadingOutbreaks] = useState(true)
  const [loadingData, setLoadingData] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    getAllOutbreaks()
      .then(res => setOutbreaks(res.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingOutbreaks(false))
  }, [])

  const fetchData = useCallback(() => {
    if (!selectedOutbreakId) return
    setLoadingData(true)
    setFetchError('')
    getEpidemiologyDataByOutbreakId(selectedOutbreakId)
      .then(res => setDataList(res.data?.data ?? []))
      .catch(err => {
        setFetchError(err?.response?.data?.message || 'Failed to load epidemiology data')
        setDataList([])
      })
      .finally(() => setLoadingData(false))
  }, [selectedOutbreakId])

  useEffect(() => { fetchData() }, [fetchData])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
  }

  const openEdit = d => {
    setEditTarget(d)
    setForm({ metricsJson: d.metricsJson, date: d.date, status: d.status })
    setSaveError('')
    setSaveSuccess('')
    setShowForm(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaveError('')
    setSaveSuccess('')
    if (!selectedOutbreakId) { setSaveError('Please select an outbreak first.'); return }
    if (!form.metricsJson.trim()) { setSaveError('Metrics JSON is required.'); return }
    if (!form.date) { setSaveError('Date is required.'); return }
    setSaving(true)
    try {
      if (editTarget) {
        await updateEpidemiologyData(editTarget.id, { metricsJson: form.metricsJson, date: form.date, status: form.status })
        setSaveSuccess('Epidemiology data updated successfully.')
      } else {
        await createEpidemiologyData({ outbreakId: Number(selectedOutbreakId), metricsJson: form.metricsJson, date: form.date, status: form.status })
        setSaveSuccess('Epidemiology data created successfully.')
      }
      setForm(EMPTY_FORM)
      setShowForm(false)
      setEditTarget(null)
      fetchData()
    } catch (err) {
      setSaveError(err?.response?.data?.message || 'Failed to save epidemiology data')
    } finally {
      setSaving(false)
    }
  }

  const selectedOutbreak = outbreaks.find(o => String(o.id) === String(selectedOutbreakId))

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="page-title">Epidemiology Data</h2>
        <p className="text-muted">Record and analyze epidemiological metrics for outbreaks.</p>
      </div>

      {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}

      {/* Outbreak selector */}
      <Card title="Select Outbreak" className="mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Outbreak</label>
            {loadingOutbreaks ? <Loader message="Loading outbreaks…" /> : (
              <select className="form-select" value={selectedOutbreakId} onChange={e => { setSelectedOutbreakId(e.target.value); setShowForm(false) }}>
                <option value="">— Select an outbreak —</option>
                {outbreaks.map(o => (
                  <option key={o.id} value={o.id}>#{o.id} — {o.diseaseType} ({o.location}) [{o.status}]</option>
                ))}
              </select>
            )}
          </div>
          {selectedOutbreak && (
            <div className="col-md-6 d-flex align-items-center gap-2">
              <StatusBadge status={selectedOutbreak.status} />
              <span className="text-muted small">📍 {selectedOutbreak.location} · Start: {selectedOutbreak.startDate}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Create / Edit form */}
      {showForm && (
        <Card title={editTarget ? `Edit Data #${editTarget.id}` : 'Add Epidemiology Data'} className="mb-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">
                Metrics JSON <span className="text-danger">*</span>
                <span className="text-muted small ms-2">e.g. {SAMPLE_JSON}</span>
              </label>
              <textarea
                name="metricsJson"
                className={`form-control font-monospace ${form.metricsJson && !tryParseJson(form.metricsJson) ? 'border-warning' : ''}`}
                rows={4}
                value={form.metricsJson}
                onChange={handleChange}
                placeholder={SAMPLE_JSON}
              />
              {form.metricsJson && !tryParseJson(form.metricsJson) && (
                <div className="text-warning small mt-1">⚠️ JSON appears malformed — backend will validate on submit.</div>
              )}
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Date <span className="text-danger">*</span></label>
                <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                  {DATA_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editTarget ? 'Update' : 'Add Data'}</Button>
              <Button variant="outline-secondary" onClick={() => { setShowForm(false); setEditTarget(null) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Data list */}
      {selectedOutbreakId && (
        <Card
          header={
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Data for Outbreak #{selectedOutbreakId}</h5>
              {!showForm && <Button onClick={openCreate}>+ Add Data</Button>}
            </div>
          }
        >
          {fetchError && <div className="alert alert-danger py-2">{fetchError}</div>}
          {loadingData ? <Loader message="Loading data…" /> : dataList.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted mb-3">No epidemiology data found for this outbreak.</p>
              <Button onClick={openCreate}>Add First Entry</Button>
            </div>
          ) : (
            <div className="row g-3">
              {dataList.map(d => {
                const parsed = tryParseJson(d.metricsJson)
                return (
                  <div key={d.id} className="col-md-6">
                    <div className="card card-surface h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <span className="fw-medium small">Entry #{d.id}</span>
                            <span className="text-muted small ms-2">{d.date}</span>
                          </div>
                          <div className="d-flex gap-2 align-items-center">
                            <StatusBadge status={d.status} />
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => openEdit(d)}>Edit</button>
                          </div>
                        </div>
                        {parsed ? (
                          <div className="row g-2">
                            {Object.entries(parsed).map(([k, v]) => (
                              <div key={k} className="col-6">
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{k}</div>
                                <div className="fw-medium small">{String(v)}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <pre className="bg-light p-2 rounded small mb-0" style={{ fontSize: '0.7rem', whiteSpace: 'pre-wrap' }}>{d.metricsJson}</pre>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      )}

      {!selectedOutbreakId && !loadingOutbreaks && (
        <div className="alert alert-info">Select an outbreak above to view and manage its epidemiology data.</div>
      )}
    </DashboardLayout>
  )
}

export default EpidemiologyDataPage
