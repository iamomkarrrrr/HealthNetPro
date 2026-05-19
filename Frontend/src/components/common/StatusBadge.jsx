const STATUS_MAP = {
  // Citizen / generic
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  SUSPENDED: 'danger',
  // Document
  PENDING: 'warning',
  VERIFIED: 'success',
  REJECTED: 'danger',
  // Immunization
  GIVEN: 'success',
  MISSED: 'danger',
  // Outbreak
  DETECTED: 'danger',
  CONTAINED: 'warning',
  CLOSED: 'secondary',
  // Vaccination program
  UPCOMING: 'info',
  COMPLETED: 'secondary',
  // Notification
  UNREAD: 'primary',
  READ: 'secondary',
  // Disease case
  REPORTED: 'primary',
  UNDER_TREATMENT: 'warning',
  RECOVERED: 'success',
  // Case update
  OBSERVED: 'info',
  FOLLOW_UP: 'warning',
  STABLE: 'success',
  CRITICAL: 'danger',
  // Epidemiology data
  RECORDED: 'info',
  ANALYZED: 'success',
  ARCHIVED: 'secondary',
  // Report scope
  OUTBREAK: 'danger',
  VACCINATION: 'success',
  COMPLIANCE: 'primary',
  CASE: 'info',
  // Compliance result
  PASS: 'success',
  FAIL: 'danger',
  WARNING: 'warning',
  NON_COMPLIANT: 'danger',
  // Audit status
  OPEN: 'warning',
  IN_REVIEW: 'info',
}

const StatusBadge = ({ status }) => {
  const variant = STATUS_MAP[status] ?? 'secondary'
  return <span className={`badge bg-${variant}`}>{status?.replace(/_/g, ' ')}</span>
}

export default StatusBadge
