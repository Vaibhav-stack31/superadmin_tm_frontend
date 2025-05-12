"use client";
import { useState } from "react";

export default function MainContent() {
  const [activeTab, setActiveTab] = useState("Approved");

  const clients = [
    { name: "Acme inc", plan: "Basic", status: "Approved", usage: "25%" },
    { name: "Globex Corporation", plan: "Premium", status: "Approved", usage: "90%" },
    { name: "Soylent Corp", plan: "Free", status: "Approved", usage: "50%" },
    { name: "Initech", plan: "Active", status: "Pending", usage: "10%" },
    { name: "Umbrella Corporation", plan: "Premium", status: "Approved", usage: "75%" },
    { name: "Stark Industries", plan: "Premium", status: "Approved", usage: "60%" },
    { name: "Wayne Enterprises", plan: "Suspended", status: "Rejected", usage: "0%" },
    { name: "Wonka Industries", plan: "Premium", status: "Approved", usage: "30%" },
    { name: "Wonka Industries", plan: "Premium", status: "Rejected", usage: "30%" },
  ];

  const filteredClients = clients.filter((client) => client.status === activeTab);

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Clients</h2>

      <div className="flex gap-4 mb-6">
        {["Approved", "Pending", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded text-white transition-all duration-200 ${
              activeTab === tab ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg overflow-hidden">
          <thead>
            <tr className="text-left bg-gray-100 text-gray-600 text-sm">
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Plan</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Usage</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, i) => (
              <tr key={i} className="border-t text-sm text-gray-700">
                <td className="px-6 py-3">{client.name}</td>
                <td className="px-6 py-3">{client.plan}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      client.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : client.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-3">{client.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
