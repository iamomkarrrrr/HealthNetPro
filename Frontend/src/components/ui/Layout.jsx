import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ title = 'Dashboard', subtitle = '' }) => {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="pl-20">
        <Header title={title} subtitle={subtitle} />
        <main className="max-w-7xl mx-auto px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
