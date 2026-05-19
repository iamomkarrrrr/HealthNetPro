const Input = ({ label, id, type = 'text', value, onChange, placeholder, error, ...props }) => {
  return (
    <div className="mb-3">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <input
        id={id}
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  )
}

export default Input
