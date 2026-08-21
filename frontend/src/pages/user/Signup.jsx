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