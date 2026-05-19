import PublicHeader from './PublicHeader'
import PublicFooter from './PublicFooter'

const PublicLayout = ({ children }) => {
  return (
    <div>
      <PublicHeader />
      <main className="py-5">
        <div className="container">{children}</div>
      </main>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout
