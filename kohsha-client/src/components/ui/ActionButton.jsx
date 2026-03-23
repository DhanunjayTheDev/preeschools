export default function ActionButton({ children, onClick, color = 'primary', size = 'md' }) {
  // Color schemes for different header gradients
  const colorSchemes = {
    primary: 'bg-white text-primary-700 hover:bg-primary-50 shadow-md',
    violet: 'bg-white text-violet-700 hover:bg-violet-50 shadow-md',
    blue: 'bg-white text-blue-700 hover:bg-blue-50 shadow-md',
    emerald: 'bg-white text-emerald-700 hover:bg-emerald-50 shadow-md',
    teal: 'bg-white text-teal-700 hover:bg-teal-50 shadow-md',
    indigo: 'bg-white text-indigo-700 hover:bg-indigo-50 shadow-md',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
    md: 'px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200',
    lg: 'px-6 py-3 text-base font-bold rounded-lg transition-all duration-200',
  };

  return (
    <button
      onClick={onClick}
      className={`${sizes[size]} ${colorSchemes[color]} border-0 cursor-pointer active:scale-95 transform`}
    >
      {children}
    </button>
  );
}
