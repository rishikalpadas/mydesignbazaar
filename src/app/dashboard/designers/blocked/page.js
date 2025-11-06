"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Ban,
  ShieldAlert,
  Mail,
  User,
  Calendar,
  UnlockKeyhole,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import DashboardPageWrapper from "../../../../components/dashboard/DashboardPageWrapper";
import { useRouter } from "next/navigation";

const BlockedDesignersContent = () => {
  const [loading, setLoading] = useState(true);
  const [designers, setDesigners] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const router = useRouter();
  const [unblockModalOpen, setUnblockModalOpen] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const [unblockReason, setUnblockReason] = useState("");
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBlockedDesigners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/admin/designers/blocked-list`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setDesigners(data.designers || []);
    } catch (e) {
      console.error("Error fetching blocked designers:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUnblockClick = (designer) => {
    setSelectedDesigner(designer);
    setUnblockModalOpen(true);
  };

  const handleUnblock = async () => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/admin/designers/unblock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: selectedDesigner._id,
          unblockRemarks: unblockReason.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to unblock designer");
      }

      setActionSuccess("Designer account unblocked successfully");
      setUnblockModalOpen(false);
      setUnblockReason("");
      setSelectedDesigner(null);
      fetchBlockedDesigners();

      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err) {
      console.error("Error unblocking designer:", err);
      alert(err.message || "Failed to unblock designer account");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedDesigners();
  }, [fetchBlockedDesigners]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredDesigners = designers.filter((designer) =>
    (
      designer.profile?.displayName ||
      designer.profile?.fullName ||
      designer.email
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const BlockedDesignersSkeleton = () => (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-gray-50 rounded-lg border border-gray-200 p-6 animate-pulse"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-gray-300 rounded-full h-12 w-12"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="space-x-2 flex">
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blocked Designers</h1>
            <p className="text-red-100">
              Designers with blocked accounts and credentials
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <ShieldAlert className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-green-700">
              <strong>Success:</strong> {actionSuccess}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Blocked Designers
              </p>
              <p className="text-2xl font-bold text-red-600">
                {designers.length}
              </p>
            </div>
            <div className="bg-red-100 rounded-lg p-3">
              <Ban className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blocked designers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="newest">Blocked Recently</option>
            <option value="oldest">Blocked Long Ago</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {loading && <BlockedDesignersSkeleton />}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">Error: {error}</p>
            </div>
          </div>
        )}

        {!loading && filteredDesigners.length === 0 && !error && (
          <div className="text-center py-12">
            <Ban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No blocked designers
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "No blocked designers match your search criteria."
                : "There are currently no blocked designers."}
            </p>
          </div>
        )}

        {!loading && filteredDesigners.length > 0 && (
          <div className="grid gap-4">
            {filteredDesigners.map((designer) => (
              <div
                key={designer._id}
                className="bg-red-50 rounded-lg border-2 border-red-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-red-600 rounded-full p-3">
                      <Ban className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {designer.profile?.displayName ||
                            designer.profile?.fullName ||
                            designer.email}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <Ban className="w-3 h-3 mr-1" />
                          Blocked
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="truncate">{designer.email}</span>
                      </div>

                      {designer.profile?.blockedAt && (
                        <div className="flex items-center text-sm text-red-600 mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            Blocked on {formatDate(designer.profile.blockedAt)}
                          </span>
                        </div>
                      )}

                      {designer.profile?.blockReason && (
                        <div className="bg-white border border-red-200 rounded-lg p-3 mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Block Reason:
                          </p>
                          <p className="text-sm text-gray-600">
                            {designer.profile.blockReason}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleUnblockClick(designer)}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors cursor-pointer"
                        title="Unblock this designer"
                      >
                        <UnlockKeyhole className="w-4 h-4 mr-2" />
                        Unblock
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unblock Modal */}
      {unblockModalOpen && selectedDesigner && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => !actionLoading && setUnblockModalOpen(false)}
          />

          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-lg p-2">
                    <UnlockKeyhole className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Unblock Designer Account
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Designer Information
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedDesigner.profile?.fullName ||
                        selectedDesigner.profile?.displayName ||
                        "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedDesigner.email}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                  <div className="flex">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-800 mb-2">
                        This action will:
                      </p>
                      <ul className="list-disc list-inside text-green-700 space-y-1">
                        <li>Reactivate the designer account</li>
                        <li>Remove all credentials from the blocklist</li>
                        <li>Allow the designer to log in again</li>
                        <li>
                          Enable the designer to upload new designs (if
                          approved)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="unblockReason"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Remarks (Optional)
                  </label>
                  <textarea
                    id="unblockReason"
                    value={unblockReason}
                    onChange={(e) => setUnblockReason(e.target.value)}
                    placeholder="Optional: Add any remarks or context for unblocking this designer account..."
                    rows="4"                    
                    disabled={actionLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    If provided, these remarks will be included in the unblock notification email.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUnblockModalOpen(false);
                      setUnblockReason("");
                    }}
                    disabled={actionLoading}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUnblock}
                    disabled={actionLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {actionLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <UnlockKeyhole className="w-4 h-4 mr-2" />
                        Unblock Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BlockedDesignersPage = () => {
  return (
    <DashboardPageWrapper requiredUserType="admin">
      <BlockedDesignersContent />
    </DashboardPageWrapper>
  );
};


// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic'

export default BlockedDesignersPage;
