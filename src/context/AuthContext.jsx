import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getToken, setToken } from "../services/api";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // If a token is already stored we must confirm it with the server before trusting it.
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    authService.getProfile()
      .then((profile) => { if (!cancelled) setUser(profile); })
      .catch((e) => {
        // Expired / invalid token -> drop it. A network error keeps the token so a reload can retry.
        if (e.status === 401 || e.status === 403) setToken(null);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // The API client fires this when the server rejects our token (expired / revoked).
  useEffect(() => {
    const onExpired = () => {
      setToken(null);
      setUser(null);
      toast("Your session has expired. Please sign in again.");
    };
    window.addEventListener("dripvora:session-expired", onExpired);
    return () => window.removeEventListener("dripvora:session-expired", onExpired);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAdmin: user?.role === "ADMIN",

    // Step 1 of both flows: backend e-mails an OTP.
    signup: authService.signup,
    login: authService.login,
    resendOtp: authService.resendOtp,

    // Step 2: exchange the e-mailed OTP for a JWT, then load the profile (which carries the role).
    async verifyOtp(email, otp) {
      const res = await authService.verifyOtp(email, otp);
      setToken(res.token);
      const profile = await authService.getProfile();
      setUser(profile);
      return profile;
    },

    async updateProfile(data) {
      const profile = await authService.updateProfile(data);
      setUser(profile);
      return profile;
    },

    async deactivate() {
      await authService.deactivateAccount();
      setToken(null);
      setUser(null);
    },

    logout() {
      setToken(null);
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
