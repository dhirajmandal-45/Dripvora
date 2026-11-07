import { api } from "./api";

// Step 1 of both flows: the backend e-mails a 6-digit OTP. No token is issued yet.
export const signup = (payload) => api.post("/dripvora/signup", payload).then((r) => r.data);
export const login = (email, password) => api.post("/dripvora/login", { email, password }).then((r) => r.data);

// Step 2: verify the OTP -> { token, userId, name, email }
export const verifyOtp = (email, otp) => api.post("/dripvora/verify-otp", { email, otp }).then((r) => r.data);
export const resendOtp = (email) => api.post("/dripvora/resend-otp", { email }).then((r) => r.data);

// Profile calls live in userService but the AuthContext reaches them through here.
export { getProfile, updateProfile, deactivateAccount } from "./userService";
