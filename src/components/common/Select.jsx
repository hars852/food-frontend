import "./Select.css";

const Select = ({ className = "", children, ...props }) => (
  <span className={`common-select ${className}`}>
    <select {...props}>{children}</select>
    <svg className="common-select-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </span>
);
export default Select;
