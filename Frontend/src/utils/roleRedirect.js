import {
  ADMIN,
  CITIZEN,
  DOCTOR,
  HEALTH_WORKER,
  EPIDEMIOLOGIST,
  HEALTH_ADMINISTRATOR,
  COMPLIANCE_OFFICER,
  AUDITOR,
  GOVERNMENT_AUDITOR,
} from './roles'

export const getDashboardPath = (role) => {
  switch (role) {
    case HEALTH_ADMINISTRATOR:
    case ADMIN:                  // backward compat — old ADMIN accounts land here
      return '/health-admin/dashboard'
    case CITIZEN:
      return '/citizen/dashboard'
    case DOCTOR:
    case HEALTH_WORKER:
      return '/doctor/dashboard'
    case EPIDEMIOLOGIST:
      return '/epidemiologist/dashboard'
    case COMPLIANCE_OFFICER:
      return '/compliance/dashboard'
    case AUDITOR:
    case GOVERNMENT_AUDITOR:
      return '/auditor/dashboard'
    default:
      return '/unauthorized'
  }
}
