const StatCard = ({ label, value }) => {
  return (
    <div className="card-rounded p-4">
      <div className="text-sm text-gray-500 uppercase">{label}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  )
}

export default StatCard
