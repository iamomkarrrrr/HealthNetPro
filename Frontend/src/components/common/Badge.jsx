const Badge = ({ children, variant = 'primary', className = '' }) => {
  return <span className={`badge bg-${variant} ${className}`}>{children}</span>
}

export default Badge
