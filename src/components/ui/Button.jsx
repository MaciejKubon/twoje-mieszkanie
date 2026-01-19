
const Button = ({ children, onClick, type = "button", variant = "primary", className = "", ...props }) => {
  const baseStyles = "w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/30 focus:ring-indigo-500",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 focus:ring-slate-500 border border-slate-600",
    outline: "border-2 border-slate-600 text-slate-300 hover:border-indigo-500 hover:text-indigo-400 focus:ring-indigo-500 bg-transparent"
  };

  // Inline styles since we are using vanilla CSS mostly but I will use style objects to map the classes above if Tailwind isn't installed. 
  // WAIT - the prompt said "Use Vanilla CSS... Avoid using TailwindCSS unless the USER explicitly requests it".
  // I must RETRACT the Tailwind classes usage and rewrite with modules or styled components or just CSS classes.
  // I will write this with CSS modules approach or just BEM-like classes since I put variables in index.css.

  /* Let's fix this to be pure CSS classes based, fitting the `index.css` I just wrote */
  
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'outline': return 'btn-outline';
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
