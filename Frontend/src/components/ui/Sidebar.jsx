import { NavLink } from 'react-router-dom'
import { Home, Stethoscope, ClipboardList, UserCircle, Activity, Bell } from 'lucide-react'

const links = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/disease-cases', icon: Stethoscope, label: 'Disease Cases' },
  { to: '/case-updates', icon: ClipboardList, label: 'Case Updates' },
  { to: '/patient-records', icon: UserCircle, label: 'Patient Records' },
  { to: '/outbreak-updates', icon: Activity, label: 'Outbreak Updates' },
  { to: '/notifications', icon: Bell, label: 'Notifications' }
]

const Sidebar = () => {
  return (
    <aside className="sidebar-64 bg-white border-r border-gray-100 min-h-screen fixed">
      <div className="h-full flex flex-col items-center py-4">
        <div className="mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold">H</div>
        </div>
        <nav className="flex flex-col gap-3">
          {links.map((l) => {
            const Icon = l.icon
            return (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `w-12 h-12 flex items-center justify-center rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`} title={l.label}>
                <Icon size={20} />
              </NavLink>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
