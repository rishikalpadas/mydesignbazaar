"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import DashboardPageWrapper from "../../../../components/dashboard/DashboardPageWrapper";

const SkeletonCard = () => (
  <div className="bg-white shadow-md rounded-2xl p-6 animate-pulse">
    <div className="h-6 w-1/3 bg-gray-300 rounded mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
      <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
      <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const DesignerPage = () => {
  const { id } = useParams();
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDesignerById = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/designers-list/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setDesigner(data?.data);
    } catch (error) {
      console.error("Failed to fetch designer", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDesignerById();
    }
  }, [id, fetchDesignerById]);

  if (loading) {
    return (
      <div className="p-6 grid gap-6 md:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="p-6 text-red-500 font-medium">
        ❌ Designer not found
      </div>
    );
  }

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2">
      {/* Profile Info */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">👤 Profile Info</h2>
        <p><span className="font-medium">Full Name:</span> {designer.fullName}</p>
        <p><span className="font-medium">Display Name:</span> {designer.displayName}</p>
        <p><span className="font-medium">Mobile:</span> {designer.mobileNumber}</p>
        <p><span className="font-medium">PAN:</span> {designer.panNumber}</p>
        <p><span className="font-medium">GST:</span> {designer.gstNumber || "N/A"}</p>
      </div>

      {/* Address */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">📍 Address</h2>
        <p>{designer.address.street},</p>
        <p>{designer.address.city}, {designer.address.state}</p>
        <p>{designer.address.postalCode}, {designer.address.country}</p>
      </div>

      {/* Bank Details */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">🏦 Bank Details</h2>
        <p><span className="font-medium">Account Holder:</span> {designer.bankDetails.accountHolderName}</p>
        <p><span className="font-medium">Account Number:</span> {designer.bankDetails.accountNumber}</p>
        <p><span className="font-medium">Bank Name:</span> {designer.bankDetails.bankName}</p>
        <p><span className="font-medium">IFSC:</span> {designer.bankDetails.ifscCode}</p>
      </div>

      {/* Agreements */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">📑 Agreements</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(designer.agreements).map(([key, value]) => (
            <span
              key={key}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                value ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
              }`}
            >
              {key.replace(/([A-Z])/g, " $1")}
            </span>
          ))}
        </div>
      </div>

      {/* Specializations */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">🎨 Specializations</h2>
        <div className="flex flex-wrap gap-2">
          {designer.specializations.map((spec, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full bg-teal-600 text-white text-sm"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Statistics</h2>
        <p><span className="font-medium">Total Designs:</span> {designer.totalDesigns}</p>
        <p><span className="font-medium">Approved Designs:</span> {designer.approvedDesigns}</p>
        <p><span className="font-medium">Total Earnings:</span> ₹{designer.totalEarnings}</p>
      </div>
    </div>
  );
};

const DesignersId = () => {
  return (
    <DashboardPageWrapper requiredUserType="admin">
      <DesignerPage />
    </DashboardPageWrapper>
  );
};


// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic'

export default DesignersId;
