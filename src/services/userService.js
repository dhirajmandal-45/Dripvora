import { api } from "./api";

export const getProfile = () => api.get("/dripvora/user/profile").then((r) => r.data);
export const updateProfile = (payload) => api.put("/dripvora/user/profile-update", payload).then((r) => r.data);
export const deactivateAccount = () => api.delete("/dripvora/user/profile-delete").then((r) => r.data);
