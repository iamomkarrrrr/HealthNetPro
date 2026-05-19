const Card = ({ title, children, className = '', header, footer }) => {
  return (
    <div className={`card card-surface ${className}`}>
      {(title || header) && (
        <div className="card-header bg-white border-0">
          {header || <h5 className="mb-0">{title}</h5>}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer bg-white border-0">{footer}</div>}
    </div>
  )
}

export default Card
