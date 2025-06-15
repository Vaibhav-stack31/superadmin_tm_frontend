"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, RefreshCcw, User, Calendar, Building } from "lucide-react";

const STATUS_MAP = {
  Approved: "Active",
  Pending: "Pending",
  Rejected: "Suspended"
};

const REVERSE_STATUS_MAP = {
  Active: "Approved",
  Pending: "Pending",
  Suspended: "Rejected"
};

export default function ClientDetails() {
  const [activeTab, setActiveTab] = useState("Approved");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [availablePlans, setAvailablePlans] = useState([]);

  // Function to fetch clients based on status
  const fetchClients = async (statusLabel) => {
    setLoading(true);
    try {
      const backendStatus = STATUS_MAP[statusLabel];
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/companyRegister/status`,
        { params: { status: backendStatus } }
      );
      
      const clientData = response.data.companies || [];
      setClients(clientData);
      
      // Extract unique plans for filtering
      const plans = [...new Set(clientData.map(client => 
        client.planPreferences?.desiredPlan).filter(Boolean))];
      setAvailablePlans(plans);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleAction = async (id, newStatus) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/companyRegister/updateStatus/${id}`,
        { status: newStatus },
        {withCredentials: true},
        { headers: { "Content-Type": "application/json" } }
      );
      
      // Refresh the client list
      fetchClients(activeTab);
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Status update failed");
    }
  };

  // Filter clients based on search term and plan filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === "" || 
      client.companyInfo.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlan = filterPlan === "" || 
      client.planPreferences?.desiredPlan === filterPlan;
    
    return matchesSearch && matchesPlan;
  });

  // Fetch clients when tab changes
  useEffect(() => {
    fetchClients(activeTab);
  }, [activeTab]);

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Client Management</h2>
        <button 
          onClick={() => fetchClients(activeTab)} 
          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-gray-700"
        >
          <RefreshCcw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {["Approved", "Pending", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md transition-all duration-200 font-medium ${
              activeTab === tab 
                ? "bg-white text-blue-700 shadow-sm" 
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company name..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative md:w-56">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-gray-400" />
          </div>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Plans</option>
            {availablePlans.map(plan => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="text-left bg-gray-50 text-gray-600 text-sm">
                <th className="px-6 py-3 font-medium">Company</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Applied on</th>
                <th className="px-6 py-3 font-medium">Expected Start</th>
                <th className="px-6 py-3 font-medium">Expected Users</th>
                {activeTab === "Pending" && (
                  <th className="px-6 py-3 font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.length > 0 ? (
                filteredClients.map((client, i) => (
                  <tr key={i} className="text-sm text-gray-700 hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Building size={16} className="text-gray-400" />
                      {client.companyInfo.companyName}
                    </td>
                    <td className="px-6 py-4">{client.planPreferences?.desiredPlan || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          client.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : client.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {REVERSE_STATUS_MAP[client.status] || client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {client.planPreferences?.expectedStartDate
                        ? new Date(client.planPreferences.expectedStartDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      {client.planPreferences?.numberOfExpectedUsers ?? "N/A"}
                    </td>
                    {activeTab === "Pending" && (
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleAction(client._id, "Active")}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(client._id, "Suspended")}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={activeTab === "Pending" ? 7 : 6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchTerm || filterPlan 
                      ? "No matching clients found. Try adjusting your search or filters."
                      : `No ${activeTab.toLowerCase()} clients found.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
            Showing {filteredClients.length} of {clients.length} clients
          </div>
        </div>
      )}
    </main>
  );
}