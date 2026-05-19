const Button = ({ children, variant = 'primary', ...props }) => {
  const base = 'px-4 py-2 rounded-md font-medium focus:outline-none'
  const styles = variant === 'primary' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-700'
  return (
    <button className={`${base} ${styles}`} {...props}>
      {children}
    </button>
  )
}

export default Button
