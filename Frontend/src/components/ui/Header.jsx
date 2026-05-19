import { Search, Bell } from 'lucide-react'
import useAuth from '../../hooks/useAuth'

const Header = ({ title, subtitle }) => {
  const { user } = useAuth()
  const initials = user?.firstName && user?.lastName ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'AS'

  return (
    <header className="pl-20 pr-6 py-6 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input placeholder="Search" className="pl-3 pr-10 py-2 rounded-lg border border-gray-200 bg-white text-sm" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"><Search size={16} /></div>
          </div>
          <div className="relative">
            <button className="p-2 rounded-md bg-white border border-gray-200">
              <Bell size={18} />
            </button>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </div>
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-1">
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">{initials}</div>
            <div className="text-sm">
              <div className="font-semibold">{user?.firstName ?? 'Adhiyu'} {user?.lastName ?? 'Scaldos'}</div>
              <div className="text-xs text-gray-500">Medical Doctor</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
