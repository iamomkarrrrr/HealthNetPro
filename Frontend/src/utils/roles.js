// Core role constants — match backend enum values exactly
export const ADMIN = 'ADMIN'                           // backward compat only
export const CITIZEN = 'CITIZEN'
export const DOCTOR = 'DOCTOR'
export const HEALTH_WORKER = 'HEALTH_WORKER'           // backend alias for DOCTOR
export const EPIDEMIOLOGIST = 'EPIDEMIOLOGIST'
export const HEALTH_ADMINISTRATOR = 'HEALTH_ADMINISTRATOR'
export const COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER'
export const AUDITOR = 'AUDITOR'
export const GOVERNMENT_AUDITOR = 'GOVERNMENT_AUDITOR' // backend alias for AUDITOR

// Roles that map to the Health Administrator Panel (ADMIN = backward compat)
export const HEALTH_ADMIN_ROLES = [HEALTH_ADMINISTRATOR, ADMIN]

// Staff role dropdown — never show ADMIN or CITIZEN here
export const STAFF_ASSIGNABLE_ROLES = [
  DOCTOR,
  EPIDEMIOLOGIST,
  HEALTH_ADMINISTRATOR,
  COMPLIANCE_OFFICER,
  AUDITOR,
]

// All visible roles for login dropdown (no ADMIN, no HEALTH_WORKER, no GOVERNMENT_AUDITOR)
export const LOGIN_ROLE_OPTIONS = [
  { value: CITIZEN,               label: 'Citizen' },
  { value: DOCTOR,                label: 'Doctor' },
  { value: EPIDEMIOLOGIST,        label: 'Epidemiologist' },
  { value: HEALTH_ADMINISTRATOR,  label: 'Health Administrator' },
  { value: COMPLIANCE_OFFICER,    label: 'Compliance Officer' },
  { value: AUDITOR,               label: 'Auditor' },
]

// Human-readable label for any role value (including backend legacy values)
export const getRoleLabel = (role) => {
  switch (role) {
    case CITIZEN:              return 'Citizen'
    case DOCTOR:               return 'Doctor'
    case HEALTH_WORKER:        return 'Doctor'
    case EPIDEMIOLOGIST:       return 'Epidemiologist'
    case HEALTH_ADMINISTRATOR: return 'Health Administrator'
    case ADMIN:                return 'Health Administrator'  // hide ADMIN from UI
    case COMPLIANCE_OFFICER:   return 'Compliance Officer'
    case AUDITOR:              return 'Auditor'
    case GOVERNMENT_AUDITOR:   return 'Auditor'
    default:                   return role ?? 'Unknown'
  }
}

// Legacy group exports kept for any existing imports
export const STAFF_ROLES = [DOCTOR, HEALTH_WORKER, EPIDEMIOLOGIST, HEALTH_ADMINISTRATOR, COMPLIANCE_OFFICER]
export const AUDITOR_ROLES = [AUDITOR, GOVERNMENT_AUDITOR]
export const DOCTOR_ROLES = [DOCTOR, HEALTH_WORKER]
