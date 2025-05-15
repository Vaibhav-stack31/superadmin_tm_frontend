"use client";
import { useState, useEffect, useMemo } from "react";
import {
  BarChartBig,
  X,
  Plus,
  Users,
  CreditCard,
  Building,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  RefreshCw
} from "lucide-react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import TimeRangeSignupsChart from "@/components/MonthlySignupsChart.jsx";

export default function DashboardPage() {
  const [data, setData] = useState({ total: 0, companies: [] });
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [timeRange, setTimeRange] = useState('monthly');

  // Filtered and paginated data
  const filteredClients = useMemo(() => {
    // First filter by search term
    let filtered = data.companies.filter(company =>
      company.companyInfo.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.companyInfo.companyEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then apply additional filters
    if (filter === "latest") {
      return filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filter === "oldest") {
      return filtered.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (filter === "active") {
      return filtered.filter(client => client.status === "Active");
    } else if (filter === "premium") {
      return filtered.filter(client => client.planPreferences.desiredPlan === "Premium");
    } else if (filter === "basic") {
      return filtered.filter(client => client.planPreferences.desiredPlan === "Basic");
    } else if (filter === "free") {
      return filtered.filter(client => client.planPreferences.desiredPlan === "Free");
    }
    return filtered;
  }, [filter, data.companies, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentItems = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate plan statistics
  const planStats = useMemo(() => {
    const total = data.companies.length || 1; // Avoid division by zero
    const freePlan = data.companies.filter(c => c.planPreferences.desiredPlan === "Free").length;
    const basicPlan = data.companies.filter(c => c.planPreferences.desiredPlan === "Basic").length;
    const premiumPlan = data.companies.filter(c => c.planPreferences.desiredPlan === "Premium").length;

    return {
      free: Math.round((freePlan / total) * 100),
      basic: Math.round((basicPlan / total) * 100),
      premium: Math.round((premiumPlan / total) * 100)
    };
  }, [data.companies]);

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
    desiredPlan: "Free",
    expectedStartDate: "",
    expectedUsers: "",
    terms: false,
    status: "Active",
  });

  const getCompanyDetail = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/companyRegister/getAllCompanies`,
        {
          withCredentials: true,
        }
      );

      setData(response.data);
      console.log("Company Details:", response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(
        "Error fetching company details:",
        error?.response?.data || error?.message || error
      );
      toast.error("Failed to load clients");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCompanyDetail();
  }, [refreshKey]);

  useEffect(() => {
    // Reset to page 1 when filter changes
    setCurrentPage(1);
  }, [filter, searchTerm]);

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

    const loadingToast = toast.loading("Registering new client...");


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
      },
      planPreferences: {
        desiredPlan: form.desiredPlan,
        expectedStartDate: form.expectedStartDate,
        numberOfExpectedUsers: parseInt(form.expectedUsers || "1"),
      },
      termsAccepted: form.terms,
      status: form.status,
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/companyRegister/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Check for any successful response (2xx status codes)
      if (res.status >= 200 && res.status < 300) {
        toast.dismiss(loadingToast);
        toast.success("Client Registered Successfully!");

        // Refresh the company list
        setRefreshKey(prev => prev + 1);
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
          desiredPlan: "Free",
          expectedStartDate: "",
          expectedUsers: "",
          terms: false,
          status: "Active",
        });
      } else {
        toast.dismiss(loadingToast);
        toast.error(res.data?.error || "Registration failed!");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Submission error:", error);
      toast.error(error.response?.data?.error || "Something went wrong!");
    }
  };

  const resetFilters = () => {
    setFilter("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="p-4 md:p-6 w-full max-w-screen bg-gray-50 min-h-screen">
      {/* Toaster */}
      <Toaster position="top-right" />

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto px-2 sm:px-4 py-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring" }}
              className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl relative max-h-[95vh] overflow-y-auto"
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Company Registration</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-700 flex items-center">
                    <Building className="w-4 h-4 mr-2 text-blue-600" />
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Company Name *</label>
                      <input
                        name="companyName"
                        required
                        value={form.companyName}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Website URL (Optional)</label>
                      <input
                        name="websiteURL"
                        value={form.websiteURL}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Company Email *</label>
                      <input
                        name="companyEmail"
                        type="email"
                        required
                        value={form.companyEmail}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Phone Number *</label>
                      <input
                        name="companyPhone"
                        required
                        value={form.companyPhone}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Country *</label>
                      <input
                        name="country"
                        required
                        value={form.country}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">State *</label>
                      <input
                        name="state"
                        required
                        value={form.state}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-700 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    Primary Admin Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Full Name *</label>
                      <input
                        name="fullName"
                        required
                        value={form.fullName}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Official Email *</label>
                      <input
                        name="officialEmail"
                        type="email"
                        required
                        value={form.officialEmail}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Designation *</label>
                      <input
                        name="designation"
                        required
                        value={form.designation}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Phone Number *</label>
                      <input
                        name="phoneNumber"
                        required
                        value={form.phoneNumber}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Plan */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-700 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                    Plan & Preferences
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Desired Plan</label>
                      <select
                        name="desiredPlan"
                        value={form.desiredPlan}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="Free">Free</option>
                        <option value="Basic">Basic</option>
                        <option value="Premium">Premium</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Expected Start Date</label>
                      <input
                        type="date"
                        name="expectedStartDate"
                        min={new Date().toISOString().split("T")[0]}
                        value={form.expectedStartDate}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Number of Expected Users *</label>
                      <input
                        name="expectedUsers"
                        type="number"
                        min="1"
                        required
                        value={form.expectedUsers}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Status</label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-2 p-2">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={form.terms}
                    onChange={handleChange}
                    required
                    className="mt-1 rounded cursor-pointer text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a>.
                  </label>
                </div>

                {/* Submit */}
                <div className="flex justify-end border-t pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mr-2 px-4 py-2 cursor-pointer text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Register Client
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-2">
        <div className="flex items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mr-3">Dashboard</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">SUPER ADMIN</span>
        </div>
        <button
          onClick={() => setRefreshKey(prev => prev + 1)}
          className="flex items-center bg-white text-gray-700 px-3 py-1 rounded border hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            title="Total Clients"
            value={data.total || 0}
            icon={<Building className="w-6 h-6 text-blue-600" />}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            title="Active Users"
            value={data.companies?.filter(c => c.status === "Active").length || 0}
            icon={<Users className="w-6 h-6 text-green-600" />}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            title="Premium Clients"
            value={data.companies?.filter(c => c.planPreferences.desiredPlan === "Premium").length || 0}
            icon={<CreditCard className="w-6 h-6 text-purple-600" />}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card
            title="New Clients (30d)"
            value={data.companies?.filter(c => {
              const createdDate = new Date(c.createdAt);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return createdDate >= thirtyDaysAgo;
            }).length || 0}
            icon={<UserPlus className="w-6 h-6 text-orange-600" />}
          />
        </motion.div>
      </div>

      {/* Charts and Create Client */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl text-gray-800">License Usage</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Client
            </motion.button>
          </div>
          <div className="space-y-4">
            <UsageBar label="Free" percent={planStats.free} color="blue" />
            <UsageBar label="Basic" percent={planStats.basic} color="green" />
            <UsageBar label="Premium" percent={planStats.premium} color="purple" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="font-semibold text-xl text-gray-800">Analytics & Logs</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  className="border border-gray-300 pl-3 pr-8 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-48 bg-white rounded-lg border border-gray-200 p-4">
            <TimeRangeSignupsChart
              companies={data.companies || []}
              timeRange={timeRange}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="text-lg font-semibold text-blue-800">{data.companies?.length || 0}</div>
              <div className="text-sm text-blue-600">Total Clients</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <div className="text-lg font-semibold text-green-800">
                {data.companies?.reduce((sum, company) => sum + parseInt(company.planPreferences.numberOfExpectedUsers || 0), 0)}
              </div>
              <div className="text-sm text-green-600">Total Users</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <div className="text-lg font-semibold text-purple-800">
                {data.companies?.filter(c => c.status === "Active").length || 0}
              </div>
              <div className="text-sm text-purple-600">Active Clients</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="font-semibold text-xl text-gray-800">Clients</h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <div className="flex items-center">
              <div className="relative">
                <select
                  className="border border-gray-300 pl-9 pr-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">All Clients</option>
                  <option value="active">Active Only</option>
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="premium">Premium Plan</option>
                  <option value="basic">Basic Plan</option>
                  <option value="free">Free Plan</option>
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {(filter || searchTerm) && (
                <button
                  onClick={resetFilters}
                  className="ml-2 p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                  title="Clear filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No clients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search term" : "Get started by creating a new client"}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Client
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Start Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((company, index) => (
                  <ClientRow
                    key={company._id || index}
                    name={company.companyInfo.companyName}
                    plan={company.planPreferences.desiredPlan}
                    users={company.planPreferences.numberOfExpectedUsers}
                    status={company.status || "Active"}
                    expectedStartDate={company.planPreferences.expectedStartDate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination - Only show if we have more than itemsPerPage items */}
        {!isLoading && filteredClients.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} entries
              {searchTerm && ` (filtered from ${data.total} total)`}
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded flex items-center ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Prev
              </button>

              {[...Array(Math.min(totalPages, 3))].map((_, i) => {
                // Show current page and adjacent pages
                let pageNum = currentPage;

                if (totalPages <= 3) {
                  // If 3 or fewer pages, show all
                  pageNum = i + 1;
                } else if (currentPage === 1) {
                  // If on first page, show 1,2,3
                  pageNum = i + 1;
                } else if (currentPage === totalPages) {
                  // If on last page, show last-2, last-1, last
                  pageNum = totalPages - 2 + i;
                } else {
                  // Otherwise show prev, current, next
                  pageNum = currentPage - 1 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded flex items-center ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// --- Components ---
function Card({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:translate-y-[-2px] hover:shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-600 font-medium">{title}</div>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-800">{value}</div>
    </div>
  );
}

function UsageBar({ label, percent, color }) {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    purple: "bg-purple-600"
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="text-sm font-medium text-gray-700">{label}</div>
        <div className="text-sm text-gray-500">{percent}%</div>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className={`${colors[color] || "bg-blue-600"} h-2 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}

function ClientRow({ name, plan, users, status, expectedStartDate }) {
  const statusStyles = {
    Active: "text-green-800 bg-green-100",
    Suspended: "text-red-800 bg-red-100",
    Pending: "text-yellow-800 bg-yellow-100"
  };

  const planColors = {
    Free: "text-gray-600",
    Basic: "text-blue-600",
    Premium: "text-purple-600"
  };

  const formattedDate = expectedStartDate ?
    new Date(expectedStartDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'Not set';

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">{name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`font-medium ${planColors[plan] || planColors.Free}`}>{plan}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-gray-900">{users}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || "text-gray-800 bg-gray-100"}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="text-gray-900">{formattedDate}</div>
      </td>
    </tr>
  );
}