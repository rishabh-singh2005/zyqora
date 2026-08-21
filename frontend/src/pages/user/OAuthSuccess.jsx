import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authSuccess, authFailure } from "../../features/auth/authSlice";
import axiosInstance from "../../api/axiosInstance";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    // fetch the actual user profile using this token, since Google's redirect only gives us the token
    axiosInstance
      .get("/api/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        dispatch(authSuccess({ user: res.data.user, accessToken }));
        const from = sessionStorage.getItem("postLoginRedirect") || "/";
        sessionStorage.removeItem("postLoginRedirect");
        navigate(from);
      })
      .catch(() => {
        dispatch(authFailure("Failed to complete login"));
        navigate("/login");
      });
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-muted font-body">Completing login...</p>
    </div>
  );
}
