import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/common/Button";
import logo from "../../assets/logo.png";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    axiosInstance
      .get(`/api/auth/verify/${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed. The link may be invalid or expired.");
      });
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl2 shadow-soft p-10 text-center space-y-4">
        <img src={logo} alt="Zyqora" className="h-14 mx-auto rounded-xl2" />

        {status === "verifying" && (
          <p className="text-muted font-body">Verifying your email...</p>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 size={48} className="mx-auto text-green-500" />
            <h1 className="text-2xl font-display font-bold text-ink">Email Verified!</h1>
            <p className="text-sm font-body text-muted">{message}</p>
            <Link to="/login">
              <Button variant="primary" className="mt-2">Log In Now</Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={48} className="mx-auto text-secondary-500" />
            <h1 className="text-2xl font-display font-bold text-ink">Verification Failed</h1>
            <p className="text-sm font-body text-muted">{message}</p>
            <Link to="/signup">
              <Button variant="secondary" className="mt-2">Back to Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}