import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAdminSession, getAdminToken, getStoredAdmin } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(getStoredAdmin());
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${getAdminToken()}`
          }
        });

        if (response.status === 401) {
          clearAdminSession();
          navigate("/admin", { replace: true });
          return;
        }

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Could not load admin profile");
        }

        setAdmin(result.admin);
      } catch (err) {
        setError(err.message || "Could not load admin profile");
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin", { replace: true });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/receipt/export`, {
        headers: {
          Authorization: `Bearer ${getAdminToken()}`
        }
      });

      if (response.status === 401) {
        clearAdminSession();
        navigate("/admin", { replace: true });
        return;
      }

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Could not download Excel file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "receipts.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Could not download Excel file");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200 p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="mt-2 text-slate-600">
              Signed in as {admin?.name || "Admin"}{admin?.email ? ` (${admin.email})` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Receipts Excel Export</h2>
          <p className="mt-2 text-slate-700">
            Download the latest Excel sheet containing paid receipts.
          </p>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="mt-5 rounded-lg bg-green-700 px-5 py-3 text-white font-semibold hover:bg-green-800 disabled:bg-green-400"
          >
            {isDownloading ? "Downloading..." : "Download Excel File"}
          </button>
        </div>

        {error ? (
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
