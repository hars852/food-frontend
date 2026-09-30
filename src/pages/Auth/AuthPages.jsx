import { useContext, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import PasswordInput from "./PasswordInput";
import "./AuthPages.css";

const AuthForm = ({ mode }) => {
  const { login, register } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [notice] = useState(location.state?.message || "");
  const [busy, setBusy] = useState(false);
  const isRegister = mode === "register";
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setError("");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (isRegister && form.password !== form.confirmPassword) return setError("Passwords do not match.");
    setBusy(true);
    try {
      const action = isRegister ? register : login;
      await action(isRegister ? { name: form.name, email: form.email, password: form.password } : { email: form.email, password: form.password });
      const destination = location.state?.from;
      navigate(destination ? `${destination.pathname}${destination.search || ""}` : "/", { replace: true });
    } catch (requestError) { setError(requestError.response?.data?.message || requestError.message || "Unable to sign in. Please try again."); }
    finally { setBusy(false); }
  };
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><p className="auth-eyebrow">Customer account</p><h1>{isRegister ? "Create your account" : "Welcome back"}</h1><p className="auth-intro">{isRegister ? "Create an account to continue with your order." : "Sign in to continue where you left off."}</p>{notice && <p className="auth-success" role="status">{notice}</p>}{isRegister && <label className="form-field">Name<input name="name" value={form.name} onChange={change} autoComplete="name" maxLength="100" required /></label>}<label className="form-field">Email<input name="email" type="email" value={form.email} onChange={change} autoComplete="email" maxLength="254" required /></label><PasswordInput label="Password" name="password" value={form.password} onChange={change} autoComplete={isRegister ? "new-password" : "current-password"} minLength="8" required />{isRegister && <PasswordInput label="Confirm password" name="confirmPassword" value={form.confirmPassword} onChange={change} autoComplete="new-password" minLength="8" required />}{error && <p className="auth-error" role="alert">{error}</p>}<button className="auth-submit" disabled={busy}>{busy ? "Please wait?" : isRegister ? "Create account" : "Sign in"}</button>{!isRegister && <Link className="auth-link" to="/forgot-password">Forgot password?</Link>}<p className="auth-switch">{isRegister ? "Already have an account? " : "New here? "}<Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p></form></main>;
};

export const LoginPage = () => <AuthForm mode="login" />;
export const RegisterPage = () => <AuthForm mode="register" />;

export const ForgotPasswordPage = () => {
  const { url } = useContext(StoreContext);
  const [email, setEmail] = useState(""); const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (event) => { event.preventDefault(); setBusy(true); setError(""); setMessage(""); try { const response = await fetch(`${url}/api/user/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.message || "Unable to send reset instructions."); setMessage(data.message); } catch (requestError) { setError(requestError.message || "Unable to send reset instructions."); } finally { setBusy(false); } };
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><p className="auth-eyebrow">Account recovery</p><h1>Forgot password?</h1><p className="auth-intro">Enter your account email and we?ll send reset instructions if an account matches.</p><label className="form-field">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>{message && <p className="auth-success" role="status">{message}</p>}{error && <p className="auth-error" role="alert">{error}</p>}<button className="auth-submit" disabled={busy}>{busy ? "Sending?" : "Send reset link"}</button><p className="auth-switch"><Link to="/login">Back to sign in</Link></p></form></main>;
};

export const ResetPasswordPage = () => {
  const { token } = useParams(); const { url } = useContext(StoreContext); const navigate = useNavigate();
  const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (event) => { event.preventDefault(); setError(""); if (password.length < 8) return setError("Password must be at least 8 characters."); if (password !== confirm) return setError("Passwords do not match."); setBusy(true); try { const response = await fetch(`${url}/api/user/reset-password/${encodeURIComponent(token)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, confirmPassword: confirm }) }); const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.message || "This reset link is invalid or expired."); navigate("/login", { replace: true, state: { message: data.message } }); } catch (requestError) { setError(requestError.message || "Unable to reset password."); } finally { setBusy(false); } };
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><p className="auth-eyebrow">Account recovery</p><h1>Choose a new password</h1><PasswordInput label="New password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength="8" required /><PasswordInput label="Confirm new password" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" minLength="8" required />{error && <p className="auth-error" role="alert">{error}</p>}<button className="auth-submit" disabled={busy}>{busy ? "Saving?" : "Reset password"}</button></form></main>;
};
