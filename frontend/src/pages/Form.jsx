import React, { useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    address: "",
    applyDate: "",
    mobile1: "",
    mobile2: "",
    designation: "",
    dob: "",
    visitDate: "",
    issueDate: "",
    token: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userResponse = await fetch(`${API_BASE_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const userResult = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(userResult.error || "Could not create receipt");
      }

      const { receiptId } = userResult;

      const orderResponse = await fetch(`${API_BASE_URL}/api/payment/order`, {
        method: "POST"
      });
      const orderResult = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderResult.error || "Could not create payment order");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout failed to load");
      }

      const { key, order } = orderResult;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "V.K. GROUP",
        description: "Service Payment",
        order_id: order.id,
        handler: async function (response) {
          const verifyResponse = await fetch(`${API_BASE_URL}/api/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...response,
              receiptId
            })
          });
          const verifyResult = await verifyResponse.json();

          if (!verifyResponse.ok || !verifyResult.success) {
            throw new Error(
              verifyResult.message || verifyResult.error || "Payment verification failed"
            );
          }

          window.location.href = `/receipt/${receiptId}`;
        },
        prefill: {
          name: formData.name,
          contact: formData.mobile1
        },
        theme: {
          color: "#166534"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-[850px] bg-white shadow-lg border relative">
        <div className="bg-green-700 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-green-800 transform -skew-y-6 origin-top-left"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold">V.K. GROUP</h1>
            <p className="text-sm text-blue-200 mt-2">
              RZ-73/B, BLOCK-H, SAGARPURWEST, NEAR, <br />
              SANGAM CHOWK, NEW DELHI - 110046
            </p>
          </div>

          <BrandLogo className="absolute right-6 top-6 h-20 w-20 shadow-sm" />
        </div>

        <h2 className="text-center text-2xl font-semibold mt-6 underline">
          Application Form
        </h2>

        <div className="px-8 pt-4 flex justify-end">
          <Link
            to="/admin"
            className="rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
          >
            Admin Login
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" name="name" onChange={handleChange} />
            <Input label="Father's Name" name="fatherName" onChange={handleChange} />

            <Input label="Address" name="address" onChange={handleChange} />
            <Input label="PVR Apply Date" name="applyDate" type="date" onChange={handleChange} />

            <Input label="Mobile No (1)" name="mobile1" onChange={handleChange} />
            <Input label="Mobile No (2)" name="mobile2" onChange={handleChange} />

            <Input label="Designation" name="designation" onChange={handleChange} />
            <Input label="Date of Birth" name="dob" type="date" onChange={handleChange} />

            <Input label="Date of Visit" name="visitDate" type="date" onChange={handleChange} />
            <Input label="Date of Issue" name="issueDate" type="date" onChange={handleChange} />

            <Input label="Token No" name="token" onChange={handleChange} />
          </div>

          <div className="text-center mt-6">
            <p className="text-lg font-semibold">Amount: Rs. 250</p>
            <p className="text-sm text-gray-600">(Non-refundable payment)</p>
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-700 hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-green-400 text-white px-8 py-3 rounded text-lg"
            >
              {isSubmitting ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, name, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        required
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
}

export default Form;
