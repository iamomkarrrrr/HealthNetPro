const ErrorMessage = ({ message }) => {
  if (!message) return null
  return (
    <div className="alert alert-danger py-2" role="alert">
      {message}
    </div>
  )
}

export default ErrorMessage
