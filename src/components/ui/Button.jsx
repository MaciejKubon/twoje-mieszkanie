
const Button = ({ children, onClick, type = "button", variant = "primary", className = "", ...props }) => {
  const baseStyles = "w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/30 focus:ring-indigo-500",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 focus:ring-slate-500 border border-slate-600",
    outline: "border-2 border-slate-600 text-slate-300 hover:border-indigo-500 hover:text-indigo-400 focus:ring-indigo-500 bg-transparent"
  };
  
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'outline': return 'btn-outline';
      case 'destructive': return 'btn-destructive';
      default: return 'btn-primary';
    }
  };

  return (
    <button 
      type={type} 
      className={`btn ${getVariantClass()} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
