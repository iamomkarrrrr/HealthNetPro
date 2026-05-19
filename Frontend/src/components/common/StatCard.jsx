const StatCard = ({ title, value, icon, description }) => {
  return (
    <div className="card card-surface h-100">
      <div className="card-body d-flex align-items-start gap-3">
        <div className="text-primary bg-primary bg-opacity-10 rounded-3 p-3">{icon}</div>
        <div>
          <div className="text-muted small">{title}</div>
          <h5 className="mb-1">{value}</h5>
          {description && <div className="text-muted small">{description}</div>}
        </div>
      </div>
    </div>
  )
}

export default StatCard
