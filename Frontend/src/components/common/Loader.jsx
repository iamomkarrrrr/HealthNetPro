const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="d-flex align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary me-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="text-muted">{message}</span>
    </div>
  )
}

export default Loader
