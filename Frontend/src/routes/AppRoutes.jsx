import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from '../pages/public/HomePage'
import LoginPage from '../pages/public/LoginPage'
import CitizenRegisterPage from '../pages/public/CitizenRegisterPage'
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage'
import VerifyOtpPage from '../pages/public/VerifyOtpPage'
import ResetPasswordPage from '../pages/public/ResetPasswordPage'
import UnauthorizedPage from '../pages/errors/UnauthorizedPage'
import NotFoundPage from '../pages/errors/NotFoundPage'

import DoctorDashboard from '../pages/doctor/DoctorDashboard'
import DiseaseCasesPage from '../pages/doctor/DiseaseCasesPage'
import CaseUpdatesPage from '../pages/doctor/CaseUpdatesPage'
import PatientRecordsPage from '../pages/doctor/PatientRecordsPage'
import OutbreakUpdatesPage from '../pages/doctor/OutbreakUpdatesPage'
import DoctorNotificationsPage from '../pages/doctor/NotificationsPage'

import EpidemiologistDashboard from '../pages/epidemiologist/EpidemiologistDashboard'
import EpiOutbreaksPage from '../pages/epidemiologist/OutbreaksPage'
import EpidemiologyDataPage from '../pages/epidemiologist/EpidemiologyDataPage'
import DiseaseTrendsPage from '../pages/epidemiologist/DiseaseTrendsPage'
import EpiReportsPage from '../pages/epidemiologist/ReportsPage'
import ComplianceTrackingPage from '../pages/epidemiologist/ComplianceTrackingPage'
import EpiNotificationsPage from '../pages/epidemiologist/NotificationsPage'

import HealthAdminDashboard from '../pages/healthAdmin/HealthAdminDashboard'
import ProgramsOverviewPage from '../pages/healthAdmin/ProgramsOverviewPage'
import StaffManagementPage from '../pages/healthAdmin/StaffManagementPage'
import UserManagementPage from '../pages/healthAdmin/UserManagementPage'
import CitizenOverviewPage from '../pages/healthAdmin/CitizenOverviewPage'
import VaccinationProgramsPage from '../pages/healthAdmin/VaccinationProgramsPage'
import ImmunizationsPage from '../pages/healthAdmin/ImmunizationsPage'
import HAReportsPage from '../pages/healthAdmin/ReportsPage'
import HANotificationsPage from '../pages/healthAdmin/NotificationsPage'
import OperationsOverviewPage from '../pages/healthAdmin/OperationsOverviewPage'
import AuditLogsPage from '../pages/healthAdmin/AuditLogsPage'

import ComplianceDashboard from '../pages/compliance/ComplianceDashboard'
import ComplianceRecordsPage from '../pages/compliance/ComplianceRecordsPage'
import EntityReviewPage from '../pages/compliance/EntityReviewPage'
import ComplianceReportsPage from '../pages/compliance/ReportsPage'
import ComplianceNotificationsPage from '../pages/compliance/NotificationsPage'
import AuditorDashboard from '../pages/auditor/AuditorDashboard'
import AuditsPage from '../pages/auditor/AuditsPage'
import ComplianceReviewPage from '../pages/auditor/ComplianceReviewPage'
import AuditorReportsPage from '../pages/auditor/ReportsPage'
import SystemOverviewPage from '../pages/auditor/SystemOverviewPage'
import AuditorNotificationsPage from '../pages/auditor/NotificationsPage'

// Citizen module
import CitizenDashboard from '../pages/citizen/CitizenDashboard'
import CitizenProfilePage from '../pages/citizen/CitizenProfilePage'
import HealthProfilePage from '../pages/citizen/HealthProfilePage'
import CitizenDocumentsPage from '../pages/citizen/CitizenDocumentsPage'
import VaccinationRecordsPage from '../pages/citizen/VaccinationRecordsPage'
import VaccinationSchedulesPage from '../pages/citizen/VaccinationSchedulesPage'
import OutbreakAlertsPage from '../pages/citizen/OutbreakAlertsPage'
import CitizenNotificationsPage from '../pages/citizen/CitizenNotificationsPage'
import ReportHealthConcernPage from '../pages/citizen/ReportHealthConcernPage'

import ProtectedRoute from '../components/layout/ProtectedRoute'
import RoleRoute from '../components/layout/RoleRoute'
import {
  ADMIN, CITIZEN, DOCTOR, HEALTH_WORKER,
  EPIDEMIOLOGIST, HEALTH_ADMINISTRATOR,
  COMPLIANCE_OFFICER, AUDITOR, GOVERNMENT_AUDITOR,
} from '../utils/roles'

const Protected = ({ roles, children }) => (
  <ProtectedRoute>
    <RoleRoute allowedRoles={roles}>{children}</RoleRoute>
  </ProtectedRoute>
)

const HealthAdminRoute = ({ children }) => (
  <Protected roles={[HEALTH_ADMINISTRATOR, ADMIN]}>{children}</Protected>
)

const CitizenRoute = ({ children }) => (
  <Protected roles={[CITIZEN]}>{children}</Protected>
)

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<CitizenRegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/verify-otp" element={<VerifyOtpPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />

    {/* Legacy /admin/* redirects — backward compat for bookmarks / old ADMIN accounts */}
    <Route path="/admin/dashboard"     element={<Navigate to="/health-admin/dashboard" replace />} />
    <Route path="/admin/users"         element={<Navigate to="/health-admin/users" replace />} />
    <Route path="/admin/staff"         element={<Navigate to="/health-admin/staff" replace />} />
    <Route path="/admin/citizens"      element={<Navigate to="/health-admin/citizens" replace />} />
    <Route path="/admin/reports"       element={<Navigate to="/health-admin/reports" replace />} />
    <Route path="/admin/notifications" element={<Navigate to="/health-admin/notifications" replace />} />
    <Route path="/admin/audit-logs"    element={<Navigate to="/health-admin/audit-logs" replace />} />
    <Route path="/admin/*"             element={<Navigate to="/health-admin/dashboard" replace />} />

    {/* Citizen Portal */}
    <Route path="/citizen/dashboard"           element={<CitizenRoute><CitizenDashboard /></CitizenRoute>} />
    <Route path="/citizen/profile"             element={<CitizenRoute><CitizenProfilePage /></CitizenRoute>} />
    <Route path="/citizen/health-profile"      element={<CitizenRoute><HealthProfilePage /></CitizenRoute>} />
    <Route path="/citizen/documents"           element={<CitizenRoute><CitizenDocumentsPage /></CitizenRoute>} />
    <Route path="/citizen/vaccination-records" element={<CitizenRoute><VaccinationRecordsPage /></CitizenRoute>} />
    <Route path="/citizen/vaccination-schedules" element={<CitizenRoute><VaccinationSchedulesPage /></CitizenRoute>} />
    <Route path="/citizen/outbreak-alerts"     element={<CitizenRoute><OutbreakAlertsPage /></CitizenRoute>} />
    <Route path="/citizen/notifications"       element={<CitizenRoute><CitizenNotificationsPage /></CitizenRoute>} />
    <Route path="/citizen/report-health-concern" element={<CitizenRoute><ReportHealthConcernPage /></CitizenRoute>} />

    {/* Doctor */}
    <Route path="/doctor/dashboard"      element={<Protected roles={[DOCTOR, HEALTH_WORKER]}><DoctorDashboard /></Protected>} />
    <Route path="/doctor/disease-cases"  element={<Protected roles={[DOCTOR, HEALTH_WORKER]}><DiseaseCasesPage /></Protected>} />
    <Route path="/doctor/case-updates"   element={<Protected roles={[DOCTOR, HEALTH_WORKER]}><CaseUpdatesPage /></Protected>} />
    <Route path="/doctor/patient-records"element={<Protected roles={[DOCTOR, HEALTH_WORKER]}><PatientRecordsPage /></Protected>} />
    <Route path="/doctor/outbreak-updates" element={<Protected roles={[DOCTOR, HEALTH_WORKER]}><OutbreakUpdatesPage /></Protected>} />
    <Route path="/doctor/notifications"  element={<Protected roles={[DOCTOR, HEALTH_WORKER]}><DoctorNotificationsPage /></Protected>} />

    {/* Epidemiologist */}
    <Route path="/epidemiologist/dashboard"         element={<Protected roles={[EPIDEMIOLOGIST]}><EpidemiologistDashboard /></Protected>} />
    <Route path="/epidemiologist/outbreaks"         element={<Protected roles={[EPIDEMIOLOGIST]}><EpiOutbreaksPage /></Protected>} />
    <Route path="/epidemiologist/epidemiology-data" element={<Protected roles={[EPIDEMIOLOGIST]}><EpidemiologyDataPage /></Protected>} />
    <Route path="/epidemiologist/disease-trends"    element={<Protected roles={[EPIDEMIOLOGIST]}><DiseaseTrendsPage /></Protected>} />
    <Route path="/epidemiologist/reports"           element={<Protected roles={[EPIDEMIOLOGIST]}><EpiReportsPage /></Protected>} />
    <Route path="/epidemiologist/compliance-tracking" element={<Protected roles={[EPIDEMIOLOGIST]}><ComplianceTrackingPage /></Protected>} />
    <Route path="/epidemiologist/notifications"     element={<Protected roles={[EPIDEMIOLOGIST]}><EpiNotificationsPage /></Protected>} />

    {/* Health Administrator Panel — absorbs all admin functions */}
    <Route path="/health-admin/dashboard"           element={<HealthAdminRoute><HealthAdminDashboard /></HealthAdminRoute>} />
    <Route path="/health-admin/programs"            element={<HealthAdminRoute><ProgramsOverviewPage /></HealthAdminRoute>} />
    <Route path="/health-admin/users"               element={<HealthAdminRoute><UserManagementPage /></HealthAdminRoute>} />
    <Route path="/health-admin/staff"               element={<HealthAdminRoute><StaffManagementPage /></HealthAdminRoute>} />
    <Route path="/health-admin/citizens"            element={<HealthAdminRoute><CitizenOverviewPage /></HealthAdminRoute>} />
    <Route path="/health-admin/vaccination-programs"element={<HealthAdminRoute><VaccinationProgramsPage /></HealthAdminRoute>} />
    <Route path="/health-admin/immunizations"       element={<HealthAdminRoute><ImmunizationsPage /></HealthAdminRoute>} />
    <Route path="/health-admin/reports"             element={<HealthAdminRoute><HAReportsPage /></HealthAdminRoute>} />
    <Route path="/health-admin/notifications"       element={<HealthAdminRoute><HANotificationsPage /></HealthAdminRoute>} />
    <Route path="/health-admin/audit-logs"          element={<HealthAdminRoute><AuditLogsPage /></HealthAdminRoute>} />
    <Route path="/health-admin/operations-overview" element={<HealthAdminRoute><OperationsOverviewPage /></HealthAdminRoute>} />

    {/* Compliance Officer */}
    <Route path="/compliance/dashboard"     element={<Protected roles={[COMPLIANCE_OFFICER]}><ComplianceDashboard /></Protected>} />
    <Route path="/compliance/records"       element={<Protected roles={[COMPLIANCE_OFFICER]}><ComplianceRecordsPage /></Protected>} />
    <Route path="/compliance/entity-review" element={<Protected roles={[COMPLIANCE_OFFICER]}><EntityReviewPage /></Protected>} />
    <Route path="/compliance/reports"       element={<Protected roles={[COMPLIANCE_OFFICER]}><ComplianceReportsPage /></Protected>} />
    <Route path="/compliance/notifications" element={<Protected roles={[COMPLIANCE_OFFICER]}><ComplianceNotificationsPage /></Protected>} />

    {/* Auditor */}
    <Route path="/auditor/dashboard"         element={<Protected roles={[AUDITOR, GOVERNMENT_AUDITOR]}><AuditorDashboard /></Protected>} />
    <Route path="/auditor/audits"            element={<Protected roles={[AUDITOR, GOVERNMENT_AUDITOR]}><AuditsPage /></Protected>} />
    <Route path="/auditor/compliance-review" element={<Protected roles={[AUDITOR, GOVERNMENT_AUDITOR]}><ComplianceReviewPage /></Protected>} />
    <Route path="/auditor/reports"           element={<Protected roles={[AUDITOR, GOVERNMENT_AUDITOR]}><AuditorReportsPage /></Protected>} />
    <Route path="/auditor/system-overview"   element={<Protected roles={[AUDITOR, GOVERNMENT_AUDITOR]}><SystemOverviewPage /></Protected>} />
    <Route path="/auditor/notifications"     element={<Protected roles={[AUDITOR, GOVERNMENT_AUDITOR]}><AuditorNotificationsPage /></Protected>} />

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)

export default AppRoutes
