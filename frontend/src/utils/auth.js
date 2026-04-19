const TOKEN_KEY = "adminToken";
const ADMIN_KEY = "adminProfile";

export const getAdminToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredAdmin = () => {
  const value = localStorage.getItem(ADMIN_KEY);
  return value ? JSON.parse(value) : null;
};

export const saveAdminSession = ({ token, admin }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
};

export const clearAdminSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
};
