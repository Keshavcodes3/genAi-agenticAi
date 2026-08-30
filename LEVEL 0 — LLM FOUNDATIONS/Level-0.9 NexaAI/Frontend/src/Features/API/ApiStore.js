// Strip trailing slash so all service URLs like `${BASEURL}/api/xyz` are clean
export const BASEURL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");