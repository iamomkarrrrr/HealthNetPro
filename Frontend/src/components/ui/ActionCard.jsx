const ActionCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="card-rounded p-4 hover:shadow-md transition cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
          <Icon size={18} />
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </div>
    </div>
  )
}

export default ActionCard
