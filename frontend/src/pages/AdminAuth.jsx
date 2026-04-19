import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAdminSession, getAdminToken } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialSignupState = {
  name: "",
  email: "",
  password: ""
};

const initialLoginState = {
  email: "",
  password: ""
};

function AdminAuth() {
  const navigate = useNavigate();
  const [hasAdmin, setHasAdmin] = useState(null);
  const [signupData, setSignupData] = useState(initialSignupState);
  const [loginData, setLoginData] = useState(initialLoginState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAdminToken()) {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    const loadStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/status`);
        const result = await response.json();
        setHasAdmin(result.hasAdmin);
      } catch {
        setError("Could not load admin status");
        setHasAdmin(true);
      }
    };

    loadStatus();
  }, [navigate]);

  const handleSignupChange = (event) => {
    setSignupData({
      ...signupData,
      [event.target.name]: event.target.value
    });
  };

  const handleLoginChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value
    });
  };

  const submitAuth = async (endpoint, payload) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Authentication failed");
      }

      saveAdminSession(result);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    await submitAuth("signup", signupData);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    await submitAuth("login", loginData);
  };

  const title = hasAdmin ? "Admin Login" : "Master Signup";
  const subtitle = hasAdmin
    ? "The master account already exists. Log in to download the receipts Excel file."
    : "Create the one and only master admin account for the client.";

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{subtitle}</p>
        <p className="mt-1 text-sm text-slate-500">
          Only one master signup is allowed. After that, access is login-only.
        </p>

        {error ? (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {hasAdmin === null ? (
          <p className="mt-6 text-slate-600">Checking admin setup...</p>
        ) : hasAdmin ? (
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Field
              label="Email"
              name="email"
              type="email"
              value={loginData.email}
              onChange={handleLoginChange}
            />
            <Field
              label="Password"
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleLoginChange}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-700 px-4 py-3 text-white font-semibold hover:bg-green-800 disabled:bg-green-400"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <Field
              label="Name"
              name="name"
              value={signupData.name}
              onChange={handleSignupChange}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={signupData.email}
              onChange={handleSignupChange}
            />
            <Field
              label="Password"
              name="password"
              type="password"
              value={signupData.password}
              onChange={handleSignupChange}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-700 px-4 py-3 text-white font-semibold hover:bg-green-800 disabled:bg-green-400"
            >
              {loading ? "Creating account..." : "Create Master Admin"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        {...props}
        required
        className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
      />
    </label>
  );
}

export default AdminAuth;
