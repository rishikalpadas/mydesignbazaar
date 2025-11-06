"use client"
import { useEffect } from "react"

const DesignerPrintView = ({ designer, user, onClose }) => {
  // Check props early before any hooks
  if (!designer || !user) {
    console.error('DesignerPrintView: Missing required props', { designer, user })
    return null
  }

  useEffect(() => {
    // Debug the data structure
    console.log('DesignerPrintView received:', { designer, user })

    // Auto-trigger print dialog after a short delay
    const timer = setTimeout(() => {
      window.print()
      // Close after printing or canceling
      setTimeout(onClose, 100)
    }, 500)

    return () => clearTimeout(timer)
  }, [onClose, designer, user])

  // Safely extract designer data with fallbacks
  const designerData = {
    fullName: designer.fullName || designer.profile?.fullName || 'N/A',
    phoneNumber: designer.phoneNumber || designer.profile?.phoneNumber || 'N/A',
    dob: designer.dob || designer.profile?.dob || 'N/A',
    gender: designer.gender || designer.profile?.gender || 'N/A',
    address: designer.address || designer.profile?.address || 'N/A',
    city: designer.city || designer.profile?.city || 'N/A',
    state: designer.state || designer.profile?.state || 'N/A',
    pincode: designer.pincode || designer.profile?.pincode || 'N/A',
    country: designer.country || designer.profile?.country || 'N/A',
    specialization: designer.specialization || designer.profile?.specialization || 'N/A',
    yearsOfExperience: designer.yearsOfExperience || designer.profile?.yearsOfExperience || 'N/A',
    portfolioUrl: designer.portfolioUrl || designer.profile?.portfolioUrl || 'N/A',
    bio: designer.bio || designer.profile?.bio || 'N/A',
    bankAccountHolderName: designer.bankAccountHolderName || designer.profile?.bankAccountHolderName || null,
    bankAccountNumber: designer.bankAccountNumber || designer.profile?.bankAccountNumber || null,
    bankIFSCCode: designer.bankIFSCCode || designer.profile?.bankIFSCCode || null,
    bankName: designer.bankName || designer.profile?.bankName || null,
    gstNumber: designer.gstNumber || designer.profile?.gstNumber || null,
    businessName: designer.businessName || designer.profile?.businessName || null,
    businessAddress: designer.businessAddress || designer.profile?.businessAddress || null,
    aadhaarCard: designer.aadhaarCard || designer.profile?.aadhaarCard || null,
    panCard: designer.panCard || designer.profile?.panCard || null,
    gstCertificate: designer.gstCertificate || designer.profile?.gstCertificate || null,
    cancelledCheque: designer.cancelledCheque || designer.profile?.cancelledCheque || null,
    portfolioSamples: designer.portfolioSamples || designer.profile?.portfolioSamples || [],
    isApproved: designer.isApproved !== undefined ? designer.isApproved : (designer.profile?.isApproved !== undefined ? designer.profile.isApproved : null),
    rejectionReason: designer.rejectionReason || designer.profile?.rejectionReason || null
  }

  const userData = {
    email: user.email || designer.email || 'N/A',
    createdAt: user.createdAt || designer.createdAt || new Date()
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    } catch (error) {
      return 'Invalid Date'
    }
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
              <p className="font-medium">{designerData.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="font-medium">{designerData.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-medium">{designerData.dob}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-medium">{designerData.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Registration Date</p>
              <p className="font-medium">{formatDate(userData.createdAt)}</p>
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
              <p className="font-medium">{designerData.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">City</p>
              <p className="font-medium">{designerData.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">State</p>
              <p className="font-medium">{designerData.state}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PIN Code</p>
              <p className="font-medium">{designerData.pincode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Country</p>
              <p className="font-medium">{designerData.country}</p>
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
              <p className="font-medium">{designerData.specialization}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Years of Experience</p>
              <p className="font-medium">{designerData.yearsOfExperience}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Portfolio URL</p>
              <p className="font-medium break-all">{designerData.portfolioUrl}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Bio</p>
              <p className="font-medium whitespace-pre-wrap">{designerData.bio}</p>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        {designerData.bankAccountNumber && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
              Bank Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Account Holder Name</p>
                <p className="font-medium">{designerData.bankAccountHolderName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Number</p>
                <p className="font-medium">{designerData.bankAccountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">IFSC Code</p>
                <p className="font-medium">{designerData.bankIFSCCode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bank Name</p>
                <p className="font-medium">{designerData.bankName || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* GST Information */}
        {designerData.gstNumber && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
              GST Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">GST Number</p>
                <p className="font-medium">{designerData.gstNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Business Name</p>
                <p className="font-medium">{designerData.businessName || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Business Address</p>
                <p className="font-medium">{designerData.businessAddress || 'N/A'}</p>
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
              <p className="font-medium">{designerData.aadhaarCard ? '✓ Uploaded' : '✗ Not Uploaded'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PAN Card</p>
              <p className="font-medium">{designerData.panCard ? '✓ Uploaded' : '✗ Not Uploaded'}</p>
            </div>
            {designerData.gstCertificate && (
              <div>
                <p className="text-sm text-gray-600">GST Certificate</p>
                <p className="font-medium">✓ Uploaded</p>
              </div>
            )}
            {designerData.cancelledCheque && (
              <div>
                <p className="text-sm text-gray-600">Cancelled Cheque</p>
                <p className="font-medium">✓ Uploaded</p>
              </div>
            )}
            {designerData.portfolioSamples && designerData.portfolioSamples.length > 0 && (
              <div>
                <p className="text-sm text-gray-600">Portfolio Samples</p>
                <p className="font-medium">✓ {designerData.portfolioSamples.length} file(s)</p>
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
                {designerData.isApproved === true && '✓ Approved'}
                {designerData.isApproved === false && '✗ Rejected'}
                {designerData.isApproved === null && '⏳ Pending'}
              </p>
            </div>
            {designerData.rejectionReason && (
              <div>
                <p className="text-sm text-gray-600">Rejection Reason</p>
                <p className="font-medium">{designerData.rejectionReason}</p>
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
