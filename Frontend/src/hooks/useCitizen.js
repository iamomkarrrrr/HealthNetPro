import { useState, useEffect } from 'react'
import { getMyCitizen } from '../api/citizenApi'

const isNotFound = (err) => {
  const status = err?.response?.status
  const msg = (err?.response?.data?.message || '').toLowerCase()
  return status === 404 || msg.includes('not found')
}

const useCitizen = () => {
  const [citizen, setCitizen] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMyCitizen()
      .then((res) => setCitizen(res.data?.data ?? null))
      .catch((err) => {
        if (isNotFound(err)) {
          setCitizen(null) // profile simply doesn't exist yet — not a crash
        } else {
          setError(err?.response?.data?.message || 'Failed to load citizen profile')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return { citizen, citizenId: citizen?.id ?? null, loading, error, setCitizen }
}

export default useCitizen
