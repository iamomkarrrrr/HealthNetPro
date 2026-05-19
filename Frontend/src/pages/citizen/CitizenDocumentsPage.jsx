import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import StatusBadge from '../../components/common/StatusBadge'
import useCitizen from '../../hooks/useCitizen'
import { getDocumentsByCitizenId, createCitizenDocument } from '../../api/citizenDocumentApi'

const CitizenDocumentsPage = () => {
  const { citizenId, loading: citizenLoading } = useCitizen()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ docType: 'ID_PROOF', fileUri: '' })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')
  const [saveError, setSaveError] = useState('')

  const fetchDocuments = useCallback(() => {
    if (!citizenId) return
    setLoading(true)
    setFetchError('')
    getDocumentsByCitizenId(citizenId)
      .then((res) => setDocuments(res.data?.data ?? []))
      .catch((err) => {
        const status = err?.response?.status
        if (status === 403) {
          setFetchError('Access denied while loading documents.')
        } else {
          setFetchError(err?.response?.data?.message || 'Failed to load documents')
        }
      })
      .finally(() => setLoading(false))
  }, [citizenId])

  useEffect(() => {
    if (!citizenLoading) fetchDocuments()
  }, [citizenLoading, fetchDocuments])

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setSaveError('')
    setSaveSuccess('')
    if (!form.fileUri.trim()) { setFormError('File URI is required'); return }
    setSaving(true)
    try {
      await createCitizenDocument({
        citizenId,
        docType: form.docType,
        fileUri: form.fileUri.trim(),
        verificationStatus: 'PENDING',
      })
      setSaveSuccess('Document added successfully. Verification is pending.')
      setForm({ docType: 'ID_PROOF', fileUri: '' })
      setShowForm(false)
      fetchDocuments()
    } catch (err) {
      setSaveError(err?.response?.data?.message || 'Failed to add document')
    } finally {
      setSaving(false)
    }
  }

  if (citizenLoading || loading) {
    return <DashboardLayout><Loader message="Loading documents…" /></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="page-title">My Documents</h2>
          <p className="text-muted mb-0">View your uploaded documents and verification status.</p>
        </div>
        {citizenId && (
          <Button onClick={() => { setShowForm(!showForm); setSaveError(''); setSaveSuccess('') }}>
            {showForm ? 'Cancel' : '+ Add Document'}
          </Button>
        )}
      </div>

      {!citizenId && (
        <div className="alert alert-warning">Please create your citizen profile first.</div>
      )}

      {fetchError && <div className="alert alert-danger py-2">{fetchError}</div>}
      {saveSuccess && <div className="alert alert-success py-2">{saveSuccess}</div>}
      {saveError && <div className="alert alert-danger py-2">{saveError}</div>}

      {/* Add document form */}
      {showForm && citizenId && (
        <Card title="Add Document" className="mb-4">
          <div className="alert alert-secondary small mb-3">
            Real PDF/image upload will be available in a later version. For now, enter the file URI path.
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Document Type</label>
                <select name="docType" className="form-select" value={form.docType} onChange={handleChange}>
                  <option value="ID_PROOF">ID Proof</option>
                  <option value="HEALTH_CARD">Health Card</option>
                </select>
              </div>
              <div className="col-md-8">
                <label className="form-label">File URI <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="fileUri"
                  className={`form-control ${formError ? 'is-invalid' : ''}`}
                  value={form.fileUri}
                  onChange={handleChange}
                  placeholder="/uploads/citizen/5/aadhaar.pdf"
                />
                {formError && <div className="invalid-feedback">{formError}</div>}
              </div>
            </div>
            <div className="mt-3">
              <Button type="submit" disabled={saving}>
                {saving ? 'Submitting…' : 'Submit Document'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Document list */}
      {documents.length === 0 && !fetchError && (
        <div className="alert alert-info">
          No documents uploaded yet. Click <strong>+ Add Document</strong> to add one.
        </div>
      )}

      {documents.length > 0 && (
        <div className="row g-4">
          {documents.map((doc) => (
            <div key={doc.id} className="col-md-6 col-xl-4">
              <Card>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <div className="fw-semibold">{doc.docType?.replace('_', ' ')}</div>
                    <div className="text-muted small">
                      Uploaded: {doc.uploadedDate?.slice(0, 10) ?? '—'}
                    </div>
                  </div>
                  <StatusBadge status={doc.verificationStatus} />
                </div>
                {doc.fileUri && (
                  <div className="text-muted small text-truncate" title={doc.fileUri}>
                    📄 {doc.fileUri.split('/').pop()}
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default CitizenDocumentsPage
