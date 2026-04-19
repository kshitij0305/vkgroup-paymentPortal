import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STAMP_PATH = "/stamp.jpg";

function Receipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadReceipt = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/receipt/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Could not load receipt");
        }

        if (!ignore) {
          setData(result);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Could not load receipt");
        }
      }
    };

    loadReceipt();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white w-full max-w-xl border shadow-lg p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold text-red-700">Receipt unavailable</h2>
          <p className="text-gray-700">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-green-700 text-white px-6 py-2 rounded"
          >
            Back to Form
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <p className="text-lg font-medium text-gray-700">Loading receipt...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 p-6">
      <div className="bg-white w-[800px] border shadow-lg p-6">
        <div className="bg-green-700 text-white p-4 relative">
          <h1 className="text-3xl font-bold">V.K. GROUP</h1>
          <BrandLogo className="absolute right-4 top-4 h-20 w-20 shadow-sm" />
        </div>

        <h2 className="text-center text-xl font-semibold mt-4 underline">Receipt</h2>

        <div className="mt-6 space-y-2 text-lg">
          <p><strong>Receipt ID:</strong> {data.receiptId}</p>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Father's Name:</strong> {data.fatherName}</p>
          <p><strong>Address:</strong> {data.address}</p>
          <p><strong>PVR Apply Date:</strong> {data.applyDate}</p>
          <p><strong>Mobile:</strong> {data.mobile1}{data.mobile2 ? `, ${data.mobile2}` : ""}</p>
          <p><strong>Designation:</strong> {data.designation}</p>
          <p><strong>DOB:</strong> {data.dob}</p>
          <p><strong>Date of Visit:</strong> {data.visitDate}</p>
          <p><strong>Date of Issue:</strong> {data.issueDate}</p>
          <p><strong>Payment Status:</strong> {data.status}</p>
          <p><strong>Payment ID:</strong> {data.paymentId || "Pending"}</p>
          <p className="font-semibold mt-4">Amount: Rs. {data.amount}</p>
          <p>Amount in Words: Rupees Two Hundred and Fifty Only</p>
        </div>

        <div className="mt-10 flex justify-end">
          <div className="w-40 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
            <img
              src={STAMP_PATH}
              alt="Official stamp and signature"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>

        <div className="mt-6 text-sm">
          <p>This is not a refundable payment.</p>
        </div>

        <div className="text-center mt-6 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-green-700 text-white px-6 py-2 rounded"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
