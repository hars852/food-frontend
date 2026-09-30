import { useState } from "react";
import "./PasswordInput.css";

const PasswordInput = ({ label, ...inputProps }) => {
  const [visible, setVisible] = useState(false);

  return <label className="form-field password-field">
    <span>{label}</span>
    <span className="password-input-wrap">
      <input {...inputProps} type={visible ? "text" : "password"} />
      <button
        className="password-visibility-toggle"
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible
          ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8"/><path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.1-2.2 3.1M6.2 6.2C3.9 7.7 2.8 9.7 2.5 12c.6 1.6 2 3.5 4.2 4.9A9.6 9.6 0 0012 19c1 0 1.9-.1 2.8-.4"/></svg>
          : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="2.5"/></svg>}
      </button>
    </span>
  </label>;
};

export default PasswordInput;
