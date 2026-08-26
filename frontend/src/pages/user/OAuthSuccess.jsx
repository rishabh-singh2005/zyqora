import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authSuccess, authFailure } from "../../features/auth/authSlice";
import axiosInstance from "../../api/axiosInstance";

export default function OAuthSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .post("/api/auth/refresh")
      .then((refreshResponse) =>
        axiosInstance
          .get("/api/users/me", {
            headers: { Authorization: `Bearer ${refreshResponse.data.accessToken}` },
          })
          .then((res) => ({ res, accessToken: refreshResponse.data.accessToken }))
      )
      .then(({ res, accessToken }) => {
        dispatch(authSuccess({ user: res.data.user, accessToken }));

        const isAdmin = res.data.user.role === "ADMIN" || res.data.user.role === "SUPER_ADMIN";
        const from = sessionStorage.getItem("postLoginRedirect") || "/";
        sessionStorage.removeItem("postLoginRedirect");

        navigate(isAdmin ? "/admin" : from);
      })
      .catch(() => {
        dispatch(authFailure("Failed to complete login"));
        navigate("/login");
      });
  }, [dispatch, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-muted font-body">Completing login...</p>
    </div>
  );
}
