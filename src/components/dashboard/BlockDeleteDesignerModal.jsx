"use client";
import { useState } from "react";
import { X, AlertTriangle, Ban, Trash2 } from "lucide-react";

/**
 * Modal for blocking or deleting a designer account
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.designer - Designer to block/delete
 * @param {string} props.actionType - 'block' or 'delete'
 * @param {Function} props.onSuccess - Success callback
 */
const BlockDeleteDesignerModal = ({
  isOpen,
  onClose,
  designer,
  actionType = "block",
  onSuccess,
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !designer) return null;

  const isBlock = actionType === "block";
  const title = isBlock ? "Block Designer Account" : "Delete Designer Account";
  const actionText = isBlock ? "Block Account" : "Delete Account";
  const Icon = isBlock ? Ban : Trash2;
  const colorClass = isBlock ? "red" : "orange";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError("Please provide a reason for this action");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = isBlock
        ? "/api/admin/designers/block"
        : "/api/admin/designers/delete";

      const method = "POST"; // Use POST for both for consistency

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: designer._id,
          [isBlock ? "blockReason" : "deleteReason"]: reason.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${actionType} designer`);
      }

      // Success - call onSuccess callback
      if (onSuccess) {
        onSuccess(data);
      }

      // Close modal
      onClose();

      // Reset form
      setReason("");
    } catch (err) {
      console.error(`Error ${actionType}ing designer:`, err);
      setError(err.message || `Failed to ${actionType} designer account`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReason("");
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl">
          {/* Header */}
          <div
            className={isBlock 
              ? "flex items-center justify-between p-6 border-b border-gray-200 bg-red-50"
              : "flex items-center justify-between p-6 border-b border-gray-200 bg-orange-50"
            }
          >
            <div className="flex items-center space-x-3">
              <div className={isBlock ? "bg-red-100 rounded-lg p-2" : "bg-orange-100 rounded-lg p-2"}>
                <Icon className={isBlock ? "w-6 h-6 text-red-600" : "w-6 h-6 text-orange-600"} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Designer Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Designer Information
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {designer.profile?.fullName ||
                    designer.profile?.displayName ||
                    "N/A"}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {designer.email}
                </p>
                {designer.profile?.mobileNumber && (
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {designer.profile.mobileNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Warning Box */}
            <div
              className={isBlock
                ? "bg-red-50 border-l-4 border-red-400 p-4 mb-6"
                : "bg-orange-50 border-l-4 border-orange-400 p-4 mb-6"
              }
            >
              <div className="flex">
                <AlertTriangle
                  className={isBlock
                    ? "w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5"
                    : "w-5 h-5 text-orange-600 mr-3 flex-shrink-0 mt-0.5"
                  }
                />
                <div className="text-sm">
                  <p className={isBlock
                    ? "font-semibold text-red-800 mb-2"
                    : "font-semibold text-orange-800 mb-2"
                  }>
                    Warning: This action will:
                  </p>
                  <ul className={isBlock
                    ? "list-disc list-inside text-red-700 space-y-1"
                    : "list-disc list-inside text-orange-700 space-y-1"
                  }>
                    {isBlock ? (
                      <>
                        <li>Permanently block all designer credentials (email, phone, Aadhaar, PAN)</li>
                        <li>Delete all uploaded designs from the platform</li>
                        <li>Prevent the designer from creating new accounts with these credentials</li>
                        <li>Send an email notification to the designer</li>
                        <li>
                          <strong>Cannot be undone</strong> - credentials will be permanently blocked
                        </li>
                      </>
                    ) : (
                      <>
                        <li>Permanently delete the designer account and profile</li>
                        <li>Delete all uploaded designs from the platform</li>
                        <li>Remove all designer documents and files</li>
                        <li>Allow the designer to re-register with the same credentials</li>
                        <li>Send an email notification to the designer</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Reason Input */}
            <div className="mb-6">
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reason for {isBlock ? "Blocking" : "Deletion"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Provide a detailed reason for ${
                  isBlock ? "blocking" : "deleting"
                } this designer account. This will be sent to the designer via email.`}
                rows="5"
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum 10 characters required. Be specific and professional.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !reason.trim() || reason.trim().length < 10}
                className={isBlock
                  ? "px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  : "px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                }
              >
                {loading ? (
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
                    <Icon className="w-4 h-4 mr-2" />
                    {actionText}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlockDeleteDesignerModal;
