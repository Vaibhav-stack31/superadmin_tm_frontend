"use client";
import { BarChartBig } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <span className="text-gray-600 font-medium">SUPER ADMIN</span>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Clients" value="120" />
        <Card title="Active Users" value="1,580" />
        <Card title="Monthly Revenue" value="INR 12,540" />
        <Card title="New Signups" value="32" />
      </div>

      {/* License Usage & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 bg-white p-4 rounded-lg shadow">
          <h1 className="font-semibold mb-3 text-xl">License Usage</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4 cursor-pointer">
            + Create Client
          </button>
          <UsageBar label="Free" percent={60} />
          <UsageBar label="Basic" percent={40} />
          <UsageBar label="Premium" percent={20} />
        </div>

        <div className="col-span-1 lg:col-span-2 bg-white p-4 rounded-lg shadow">
          <h1 className="font-semibold mb-3 text-xl">Analytics & Logs</h1>
          <p className="text-sm text-gray-500 mb-2">System-wide Usage</p>
          <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            <BarChartBig className="w-8 h-8" />
            <span className="ml-2">Graph Placeholder</span>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
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
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}

function ClientRow({ name, plan, users, status }) {
  const statusColor =
    status === "Active"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";

  return (
    <tr className="border-t">
      <td className="py-2">{name}</td>
      <td>{plan}</td>
      <td>{users}</td>
      <td>
        <span className={`px-2 py-1 text-xs rounded ${statusColor}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}
