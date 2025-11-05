"use client"
import { useEffect } from "react"

const DesignerPrintView = ({ designer, user, onClose }) => {
  useEffect(() => {
    // Auto-trigger print dialog after a short delay
    const timer = setTimeout(() => {
      window.print()
      // Close after printing or canceling
      setTimeout(onClose, 100)
    }, 500)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!designer || !user) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
        }
      `}</style>

      <div className="print-content bg-white p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Designer Registration Details</h1>
          <p className="text-sm text-gray-600 mt-1">Generated on {formatDate(new Date())}</p>
        </div>

        {/* Personal Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
            Personal Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium">{designer.fullName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="font-medium">{designer.phoneNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-medium">{designer.dob || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-medium">{designer.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Registration Date</p>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
            Address Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Street Address</p>
              <p className="font-medium">{designer.address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">City</p>
              <p className="font-medium">{designer.city || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">State</p>
              <p className="font-medium">{designer.state || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PIN Code</p>
              <p className="font-medium">{designer.pincode || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Country</p>
              <p className="font-medium">{designer.country || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
            Professional Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Specialization</p>
              <p className="font-medium">{designer.specialization || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Years of Experience</p>
              <p className="font-medium">{designer.yearsOfExperience || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Portfolio URL</p>
              <p className="font-medium break-all">{designer.portfolioUrl || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Bio</p>
              <p className="font-medium whitespace-pre-wrap">{designer.bio || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        {designer.bankAccountNumber && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
              Bank Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Account Holder Name</p>
                <p className="font-medium">{designer.bankAccountHolderName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Number</p>
                <p className="font-medium">{designer.bankAccountNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">IFSC Code</p>
                <p className="font-medium">{designer.bankIFSCCode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bank Name</p>
                <p className="font-medium">{designer.bankName || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* GST Information */}
        {designer.gstNumber && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
              GST Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">GST Number</p>
                <p className="font-medium">{designer.gstNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Business Name</p>
                <p className="font-medium">{designer.businessName || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Business Address</p>
                <p className="font-medium">{designer.businessAddress || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Document Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
            Documents Submitted
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Aadhaar Card</p>
              <p className="font-medium">{designer.aadhaarCard ? '✓ Uploaded' : '✗ Not Uploaded'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PAN Card</p>
              <p className="font-medium">{designer.panCard ? '✓ Uploaded' : '✗ Not Uploaded'}</p>
            </div>
            {designer.gstCertificate && (
              <div>
                <p className="text-sm text-gray-600">GST Certificate</p>
                <p className="font-medium">✓ Uploaded</p>
              </div>
            )}
            {designer.cancelledCheque && (
              <div>
                <p className="text-sm text-gray-600">Cancelled Cheque</p>
                <p className="font-medium">✓ Uploaded</p>
              </div>
            )}
            {designer.portfolioSamples && designer.portfolioSamples.length > 0 && (
              <div>
                <p className="text-sm text-gray-600">Portfolio Samples</p>
                <p className="font-medium">✓ {designer.portfolioSamples.length} file(s)</p>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
            Status
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Approval Status</p>
              <p className="font-medium">
                {designer.isApproved === true && '✓ Approved'}
                {designer.isApproved === false && '✗ Rejected'}
                {designer.isApproved === null && '⏳ Pending'}
              </p>
            </div>
            {designer.rejectionReason && (
              <div>
                <p className="text-sm text-gray-600">Rejection Reason</p>
                <p className="font-medium">{designer.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          <p>MyDesignBazaar - Designer Registration Report</p>
          <p>This document is for internal use only and contains confidential information.</p>
        </div>
      </div>
    </>
  )
}

export default DesignerPrintView
