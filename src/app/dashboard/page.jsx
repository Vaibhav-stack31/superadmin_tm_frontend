"use client";
import { useState, useEffect } from "react";
import { BarChartBig } from "lucide-react";

export default function DashboardPage() {
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    websiteURL: "",
    companyEmail: "",
    companyPhone: "",
    country: "",
    state: "",
    fullName: "",
    officialEmail: "",
    designation: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    desiredPlan: "Free",
    expectedStartDate: "",
    expectedUsers: "",
    terms: false,
  });

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Basic password match validation
  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const payload = {
    companyInfo: {
      companyName: form.companyName,
      websiteURL: form.websiteURL,
      companyEmail: form.companyEmail,
      phoneNumber: form.companyPhone,
      country: form.country,
      state: form.state,
    },
    adminInfo: {
      fullName: form.fullName,
      officialEmail: form.officialEmail,
      designation: form.designation,
      phoneNumber: form.phoneNumber,
      password: form.password,
    },
    planPreferences: {
      desiredPlan: form.desiredPlan,
      expectedStartDate: form.expectedStartDate,
      numberOfExpectedUsers: parseInt(form.expectedUsers || "1"),
    },
    termsAccepted: form.terms,
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/companyRegister/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Client Registered Successfully!");
      setShowModal(false);
      // Reset form
      setForm({
        companyName: "",
        websiteURL: "",
        companyEmail: "",
        companyPhone: "",
        country: "",
        state: "",
        fullName: "",
        officialEmail: "",
        designation: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        desiredPlan: "Free",
        expectedStartDate: "",
        expectedUsers: "",
        terms: false,
      });
    } else {
      alert(data.error || "Registration failed!");
    }
  } catch (error) {
    console.error("Submission error:", error);
    alert("Something went wrong!");
  }
};

  return (
    <div className="p-4 md:p-6 w-full max-w-screen">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto px-2 sm:px-4 py-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-3xl relative max-h-[95vh] overflow-y-auto">
            <button
              className="absolute top-2 right-3 text-2xl font-bold text-gray-600 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Company Registration Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Company Info */}
              <div>
                <h3 className="font-semibold mb-2">Company Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input name="companyName" required placeholder="Company Name *" value={form.companyName} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                  <input name="websiteURL" required placeholder="Website URL(Optional)" value={form.websiteURL} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                  <input name="companyEmail" required placeholder="Company Email *" value={form.companyEmail} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                  <input name="companyPhone" required placeholder="Phone Number *" value={form.companyPhone} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                  <input name="country" required placeholder="Country *" value={form.country} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                  <input name="state" required placeholder="State *" value={form.state} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                </div>
              </div>

              {/* Admin Info */}
              <div>
                <h3 className="font-semibold mb-2">Primary Admin (Owner) Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input name="fullName" required placeholder="Full Name *" value={form.fullName} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                  <input name="officialEmail" type="email" required placeholder="Official Email *" value={form.officialEmail} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                  <input name="designation" required placeholder="Designation *" value={form.designation} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                  <input name="phoneNumber" required placeholder="Phone Number *" value={form.phoneNumber} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                  <input name="password" type="password" required placeholder="Create Password *" value={form.password} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                  <input name="confirmPassword" type="password" required placeholder="Confirm Password *" value={form.confirmPassword} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                </div>
              </div>

              {/* Plan */}
              <div>
                <h3 className="font-semibold mb-2">Plan & Preferences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select name="desiredPlan" value={form.desiredPlan} onChange={handleChange} className="border px-3 py-2 rounded w-full">
                    <option value="Free">Free</option>
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                  </select>
                  <input
                    type="date"
                    name="expectedStartDate"
                    placeholder="Expected Start Date"
                    min={new Date().toISOString().split("T")[0]}
                    value={form.expectedStartDate}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  />
                  <input name="expectedUsers" placeholder="Number of Expected Users *" value={form.expectedUsers} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start sm:items-center space-x-2">
                <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} required className="mt-1" />
                <label className="text-sm">
                  I agree to the <a href="#" className="text-blue-600 underline">terms and conditions</a>.
                </label>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <span className="text-gray-600 font-medium">SUPER ADMIN</span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Clients" value="120" />
        <Card title="Active Users" value="1,580" />
        <Card title="Monthly Revenue" value="INR 12,540" />
        <Card title="New Signups" value="32" />
      </div>

      {/* Charts and Create Client */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 bg-white p-4 rounded-lg shadow w-full">
          <h1 className="font-semibold mb-3 text-xl">License Usage</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4 w-full sm:w-auto"
            onClick={() => setShowModal(true)}
          >
            + Create Client
          </button>
          <UsageBar label="Free" percent={60} />
          <UsageBar label="Basic" percent={40} />
          <UsageBar label="Premium" percent={20} />
        </div>

        <div className="col-span-1 lg:col-span-2 bg-white p-4 rounded-lg shadow w-full">
          <h1 className="font-semibold mb-3 text-xl">Analytics & Logs</h1>
          <p className="text-sm text-gray-500 mb-2">System-wide Usage</p>
          <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            <BarChartBig className="w-8 h-8" />
            <span className="ml-2">Graph Placeholder</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto w-full">
        <h1 className="font-semibold mb-4 text-xl">Clients</h1>
        <table className="min-w-[600px] w-full text-md">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2">Name</th>
              <th>Plan</th>
              <th>Users</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <ClientRow name="Acme Inc." plan="Premium" users={250} status="Active" />
            <ClientRow name="Beta Solutions" plan="Free" users={45} status="Active" />
            <ClientRow name="Gamma LLC" plan="Basic" users={180} status="Active" />
            <ClientRow name="Delta Enterprises" plan="Premium" users={75} status="Suspended" />
            <ClientRow name="Epsilon Corp" plan="Basic" users={120} status="Active" />
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Components ---
function Card({ title, value }) {
  return (
    <div className="bg-[#f1fdfd] p-4 py-7 rounded shadow text-center">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-gray-600 text-xl">{title}</div>
    </div>
  );
}

function UsageBar({ label, percent }) {
  return (
    <div className="mb-2">
      <div className="text-md mb-1">{label}</div>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function ClientRow({ name, plan, users, status }) {
  const statusColor = status === "Active" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";
  return (
    <tr className="border-t">
      <td className="py-2">{name}</td>
      <td>{plan}</td>
      <td>{users}</td>
      <td>
        <span className={`px-2 py-1 text-xs rounded ${statusColor}`}>{status}</span>
      </td>
    </tr>
  );
}
