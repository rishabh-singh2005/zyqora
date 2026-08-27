import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/common/Button";
import logo from "../../assets/logo.png";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    axiosInstance
      .get(`/api/auth/verify/${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed. The link may be invalid or expired.");
      });
  }, [token]);

  // Automatic redirect to home page after success
  useEffect(() => {
    if (status !== "success") return;

    if (countdown <= 0) {
      navigate("/?verified=true");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, countdown, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl2 shadow-soft p-10 text-center space-y-5">
        <img src={logo} alt="Zyqora" className="h-14 mx-auto rounded-xl2" />

        {status === "verifying" && (
          <div className="space-y-3 py-6">
            <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted font-body text-sm">Verifying your email address...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 size={52} className="mx-auto text-green-500" />
            <h1 className="text-2xl font-display font-bold text-ink">Email Verified!</h1>
            <p className="text-sm font-body text-muted">{message}</p>
            
            <p className="text-xs text-primary-600 font-medium">
              Redirecting to home page in <span className="font-bold">{countdown}</span> seconds...
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/?verified=true" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full flex items-center justify-center gap-1.5">
                  Go to Home <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full">Log In</Button>
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle size={52} className="mx-auto text-secondary-500" />
            <h1 className="text-2xl font-display font-bold text-ink">Verification Failed</h1>
            <p className="text-sm font-body text-muted">{message}</p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full">Log In</Button>
              </Link>
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}