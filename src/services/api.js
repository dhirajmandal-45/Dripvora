import axios from "axios";

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");
export const TOKEN_KEY = "dripvora:token";

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (token) => {
  try { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
};

// Read the `exp` claim without verifying — the server is the real authority.
export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return !!payload.exp && Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export const api = axios.create({ baseURL: API_URL, timeout: 20000 });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise every failure into an Error carrying a readable `message` and the HTTP `status`.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    // Spring returns 403 (not 401) for a missing/expired token on protected routes.
    // 403 on an admin route just means "not an admin", so don't treat that as an expired session.
    if (getToken() && (status === 401 || (status === 403 && !url.includes("/admin/")))) {
      window.dispatchEvent(new CustomEvent("dripvora:session-expired"));
    }
    const err = new Error(errorMessage(error));
    err.status = status;
    err.data = error.response?.data;
    return Promise.reject(err);
  }
);

// Turn any axios error into a readable message.
function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error.response) {
    return `Can't reach the DripVora server at ${API_URL}. Is the backend running?`;
  }
  const data = error.response.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  if (error.response.status === 403) return "You don't have permission to do that.";
  return fallback;
}
