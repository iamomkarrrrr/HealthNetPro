/**
 * Maps a notification category to the most relevant page path.
 * Role is used to pick the correct module when the same category
 * is relevant to multiple roles (e.g. CASE is relevant to DOCTOR
 * and EPIDEMIOLOGIST).
 */

const CATEGORY_ROLE_MAP = {
  CASE: {
    DOCTOR:               '/doctor/disease-cases',
    HEALTH_WORKER:        '/doctor/disease-cases',
    EPIDEMIOLOGIST:       '/epidemiologist/disease-trends',
    HEALTH_ADMINISTRATOR: '/health-admin/operations-overview',
    ADMIN:                '/health-admin/operations-overview',
    AUDITOR:              '/auditor/system-overview',
    GOVERNMENT_AUDITOR:   '/auditor/system-overview',
    COMPLIANCE_OFFICER:   '/compliance/records',
    CITIZEN:              '/citizen/dashboard',
  },
  OUTBREAK: {
    DOCTOR:               '/doctor/outbreak-updates',
    HEALTH_WORKER:        '/doctor/outbreak-updates',
    EPIDEMIOLOGIST:       '/epidemiologist/outbreaks',
    HEALTH_ADMINISTRATOR: '/health-admin/operations-overview',
    ADMIN:                '/health-admin/operations-overview',
    AUDITOR:              '/auditor/system-overview',
    GOVERNMENT_AUDITOR:   '/auditor/system-overview',
    COMPLIANCE_OFFICER:   '/compliance/records',
    CITIZEN:              '/citizen/outbreak-alerts',
  },
  VACCINATION: {
    DOCTOR:               '/doctor/patient-records',
    HEALTH_WORKER:        '/doctor/patient-records',
    EPIDEMIOLOGIST:       '/epidemiologist/dashboard',
    HEALTH_ADMINISTRATOR: '/health-admin/vaccination-programs',
    ADMIN:                '/health-admin/vaccination-programs',
    AUDITOR:              '/auditor/system-overview',
    GOVERNMENT_AUDITOR:   '/auditor/system-overview',
    COMPLIANCE_OFFICER:   '/compliance/records',
    CITIZEN:              '/citizen/vaccination-records',
  },
  COMPLIANCE: {
    DOCTOR:               '/doctor/dashboard',
    HEALTH_WORKER:        '/doctor/dashboard',
    EPIDEMIOLOGIST:       '/epidemiologist/compliance-tracking',
    HEALTH_ADMINISTRATOR: '/health-admin/operations-overview',
    ADMIN:                '/health-admin/operations-overview',
    AUDITOR:              '/auditor/compliance-review',
    GOVERNMENT_AUDITOR:   '/auditor/compliance-review',
    COMPLIANCE_OFFICER:   '/compliance/records',
    CITIZEN:              '/citizen/dashboard',
  },
  AUDIT: {
    DOCTOR:               '/doctor/dashboard',
    HEALTH_WORKER:        '/doctor/dashboard',
    EPIDEMIOLOGIST:       '/epidemiologist/dashboard',
    HEALTH_ADMINISTRATOR: '/health-admin/audit-logs',
    ADMIN:                '/health-admin/audit-logs',
    AUDITOR:              '/auditor/audits',
    GOVERNMENT_AUDITOR:   '/auditor/audits',
    COMPLIANCE_OFFICER:   '/compliance/dashboard',
    CITIZEN:              '/citizen/dashboard',
  },
}

// Fallback notification page per role
const NOTIFICATION_PAGE = {
  CITIZEN:              '/citizen/notifications',
  DOCTOR:               '/doctor/notifications',
  HEALTH_WORKER:        '/doctor/notifications',
  EPIDEMIOLOGIST:       '/epidemiologist/notifications',
  HEALTH_ADMINISTRATOR: '/health-admin/notifications',
  ADMIN:                '/health-admin/notifications',
  COMPLIANCE_OFFICER:   '/compliance/notifications',
  AUDITOR:              '/auditor/notifications',
  GOVERNMENT_AUDITOR:   '/auditor/notifications',
}

/**
 * Returns the best navigation path for a notification.
 * @param {string} category - Notification category (CASE, OUTBREAK, etc.)
 * @param {string} role     - Logged-in user role
 * @returns {string}        - Route path
 */
export const getNotificationPath = (category, role) => {
  return CATEGORY_ROLE_MAP[category]?.[role]
    ?? NOTIFICATION_PAGE[role]
    ?? '/unauthorized'
}

/**
 * Returns the notification page path for a given role.
 * @param {string} role
 * @returns {string}
 */
export const getNotificationPagePath = (role) =>
  NOTIFICATION_PAGE[role] ?? '/unauthorized'

// Category badge color classes (Bootstrap)
export const CATEGORY_BADGE_CLASS = {
  CASE:        'bg-info text-white',
  OUTBREAK:    'bg-danger text-white',
  VACCINATION: 'bg-success text-white',
  COMPLIANCE:  'bg-primary text-white',
  AUDIT:       'bg-dark text-white',
}

export const getCategoryBadgeClass = (category) =>
  CATEGORY_BADGE_CLASS[category] ?? 'bg-secondary text-white'
