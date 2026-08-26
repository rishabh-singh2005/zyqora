import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../api/auth.api";
import Button from "../../components/common/Button";
import logo from "../../assets/logo.png";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signupUser(form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl2 shadow-soft p-10 text-center space-y-4">
          <img src={logo} alt="Zyqora" className="h-14 mx-auto rounded-xl2" />
          <h1 className="text-2xl font-display font-bold text-ink">Check your email</h1>
          <p className="text-sm text-muted font-body">
            We've sent a verification link to <strong>{form.email}</strong>. Verify your email to activate your account.
          </p>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl2 shadow-soft p-10 space-y-6">
        <div className="text-center space-y-2">
          <img src={logo} alt="Zyqora" className="h-14 mx-auto rounded-xl2" />
          <h1 className="text-2xl font-display font-bold text-ink">Create your account</h1>
          <p className="text-sm text-muted font-body">Join Zyqora and start shopping</p>
        </div>

        {error && (
          <div className="bg-secondary-100 text-secondary-600 text-sm font-body rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-body font-medium text-ink">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm font-body font-medium text-ink">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-body font-medium text-ink">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg border border-primary-100 px-4 py-2.5 font-body text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
              placeholder="At least 6 characters"
            />
          </div>

          <Button variant="primary" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="relative text-center">
          <span className="bg-white/80 px-3 text-xs text-muted font-body relative z-10">or continue with</span>
          <div className="absolute top-1/2 left-0 right-0 border-t border-primary-100 -z-0" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href={`${import.meta.env.VITE_API_URL}/api/auth/google`}
            className="flex items-center justify-center gap-2 border border-gray-200 bg-white rounded-lg py-2.5 font-body text-sm font-medium text-ink hover:bg-gray-50 hover:shadow-sm transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </a>
          <a
            href={`${import.meta.env.VITE_API_URL}/api/auth/facebook`}
            className="flex items-center justify-center gap-2 border border-gray-200 bg-[#1877F2] rounded-lg py-2.5 font-body text-sm font-medium text-white hover:bg-[#166FE5] hover:shadow-sm transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
            </svg>
            Facebook
          </a>
        </div>

        <p className="text-center text-sm font-body text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
