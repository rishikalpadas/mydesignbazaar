'use client';
import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  CreditCard,
  Plus,
  Minus,
  Edit,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  TrendingUp,
  Package,
  Eye,
  MapPin,
  FileText,
  DollarSign,
  CheckCircle,
  XCircle,
  Tag,
  ShoppingBag,
  X
} from 'lucide-react';
import DashboardPageWrapper from '../../../components/dashboard/DashboardPageWrapper';

const BuyersContent = () => {
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [creditOperation, setCreditOperation] = useState('add');
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchBuyers();
  }, []);

  useEffect(() => {
    // Filter buyers based on search term
    if (searchTerm) {
      const filtered = buyers.filter(buyer =>
        buyer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.mobileNumber?.includes(searchTerm)
      );
      setFilteredBuyers(filtered);
    } else {
      setFilteredBuyers(buyers);
    }
  }, [searchTerm, buyers]);

  const fetchBuyers = async () => {
    try {
      const response = await fetch('/api/admin/buyers', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setBuyers(data.buyers);
        setFilteredBuyers(data.buyers);
      }
    } catch (error) {
      console.error('Failed to fetch buyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (buyer) => {
    setSelectedBuyer(buyer);
    setShowDetailsModal(true);
  };

  const handleManageCredits = (buyer) => {
    setSelectedBuyer(buyer);
    setShowCreditModal(true);
    setCreditOperation('add');
    setCreditAmount('');
    setCreditReason('');
  };

  const handleSubmitCredits = async () => {
    if (!creditAmount || creditAmount <= 0) {
      alert('Please enter a valid credit amount');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('/api/admin/buyers/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          buyerId: selectedBuyer.userId,
          credits: parseInt(creditAmount),
          reason: creditReason,
          operation: creditOperation
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setShowCreditModal(false);
        fetchBuyers(); // Refresh the list
      } else {
        alert(data.error || 'Failed to manage credits');
      }
    } catch (error) {
      console.error('Credit management error:', error);
      alert('Failed to manage credits');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading buyers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Buyer Management</h1>
            <p className="text-blue-100">Manage buyer accounts and credits</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-sm text-blue-100">Total Buyers</p>
            <p className="text-3xl font-bold">{buyers.length}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search buyers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Buyers List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBuyers.map((buyer) => (
                <tr key={buyer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{buyer.fullName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-500">{buyer.email}</p>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-500">{buyer.mobileNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 capitalize">{buyer.businessType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {buyer.subscription ? (
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {buyer.subscription.planName}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{buyer.subscription.daysRemaining} days left</p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No subscription
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {buyer.subscription ? (
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{buyer.subscription.creditsRemaining}</p>
                        <p className="text-xs text-gray-500">of {buyer.subscription.creditsTotal}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Package className="w-4 h-4" />
                        <span>{buyer.totalPurchases} purchases</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>₹{buyer.totalSpent}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleViewDetails(buyer)}
                        className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleManageCredits(buyer)}
                        className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        <CreditCard className="w-4 h-4 mr-1" />
                        Manage Credits
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBuyers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No buyers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search' : 'No buyers registered yet'}
            </p>
          </div>
        )}
      </div>

      {/* Buyer Details Modal */}
      {showDetailsModal && selectedBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-xl text-white relative">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <Users className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{selectedBuyer.fullName}</h2>
                  <p className="text-blue-100 text-sm">Complete Buyer Profile</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      selectedBuyer.isVerified ? 'bg-green-400 text-green-900' : 'bg-yellow-400 text-yellow-900'
                    }`}>
                      {selectedBuyer.isVerified ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Not Verified
                        </>
                      )}
                    </span>
                    <span className="text-xs text-blue-100">
                      Joined: {new Date(selectedBuyer.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Email</p>
                      <p className="text-sm font-medium text-gray-900">{selectedBuyer.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Mobile Number</p>
                      <p className="text-sm font-medium text-gray-900">{selectedBuyer.mobileNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                    Business Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Business Type</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{selectedBuyer.businessType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Purchase Frequency</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {selectedBuyer.purchaseFrequency || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-red-600" />
                    Address
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    {selectedBuyer.address?.street && <p>{selectedBuyer.address.street}</p>}
                    {selectedBuyer.address?.city && (
                      <p>
                        {selectedBuyer.address.city}
                        {selectedBuyer.address.state && `, ${selectedBuyer.address.state}`}
                        {selectedBuyer.address.postalCode && ` - ${selectedBuyer.address.postalCode}`}
                      </p>
                    )}
                    {selectedBuyer.address?.country && <p className="font-medium">{selectedBuyer.address.country}</p>}
                    {selectedBuyer.address?.gstNumber && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 uppercase">GST Number</p>
                        <p className="font-medium">{selectedBuyer.address.gstNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment & Billing */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Payment & Billing
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Billing Currency</p>
                      <p className="text-sm font-medium text-gray-900">{selectedBuyer.billingCurrency}</p>
                    </div>
                    {selectedBuyer.paymentMethods && selectedBuyer.paymentMethods.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Payment Methods</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedBuyer.paymentMethods.map((method, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 capitalize"
                            >
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interested Categories */}
                {selectedBuyer.interestedCategories && selectedBuyer.interestedCategories.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-orange-600" />
                      Interested Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedBuyer.interestedCategories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 capitalize"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Purchase Statistics */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-orange-600" />
                    Purchase Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase mb-1">Total Purchases</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedBuyer.totalPurchases}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase mb-1">Total Spent</p>
                      <p className="text-2xl font-bold text-green-600">₹{selectedBuyer.totalSpent}</p>
                    </div>
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                    Subscription Details
                  </h3>
                  {selectedBuyer.subscription ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase mb-1">Plan</p>
                        <p className="text-lg font-bold text-gray-900">{selectedBuyer.subscription.planName}</p>
                        <p className={`text-xs mt-1 ${
                          selectedBuyer.subscription.daysRemaining > 7 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {selectedBuyer.subscription.daysRemaining} days remaining
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase mb-1">Credits Remaining</p>
                        <p className="text-2xl font-bold text-blue-600">{selectedBuyer.subscription.creditsRemaining}</p>
                        <p className="text-xs text-gray-500 mt-1">of {selectedBuyer.subscription.creditsTotal}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase mb-1">Credits Used</p>
                        <p className="text-2xl font-bold text-orange-600">{selectedBuyer.subscription.creditsUsed}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedBuyer.subscription.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedBuyer.subscription.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-2">
                          Expires: {new Date(selectedBuyer.subscription.expiryDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-6 text-center">
                      <p className="text-gray-500">No active subscription</p>
                    </div>
                  )}
                  {selectedBuyer.subscriptionCount > 0 && (
                    <p className="text-xs text-gray-600 mt-3">
                      Total subscriptions: {selectedBuyer.subscriptionCount}
                    </p>
                  )}
                </div>

                {/* Agreements Status */}
                {selectedBuyer.agreements && Object.keys(selectedBuyer.agreements).length > 0 && (
                  <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-600" />
                      Agreement Terms
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(selectedBuyer.agreements).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2 text-sm">
                          {value ? (
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          )}
                          <span className="text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleManageCredits(selectedBuyer);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors flex items-center"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Credits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credit Management Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Manage Credits</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Buyer: <span className="font-medium text-gray-900">{selectedBuyer?.fullName}</span></p>
                <p className="text-sm text-gray-600">Current Credits: <span className="font-bold text-green-600">{selectedBuyer?.subscription?.creditsRemaining || 0}</span></p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setCreditOperation('add')}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center ${
                      creditOperation === 'add'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </button>
                  <button
                    onClick={() => setCreditOperation('set')}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center ${
                      creditOperation === 'set'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Set
                  </button>
                  <button
                    onClick={() => setCreditOperation('deduct')}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center ${
                      creditOperation === 'deduct'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Minus className="w-4 h-4 mr-1" />
                    Deduct
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credit Amount</label>
                <input
                  type="number"
                  min="1"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                <textarea
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  placeholder="e.g., Promotional credits, Issue resolution..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreditModal(false)}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitCredits}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:bg-gray-400"
              >
                {processing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminBuyersPage = () => {
  return (
    <DashboardPageWrapper requiredUserType="admin">
      <BuyersContent />
    </DashboardPageWrapper>
  );
};

// Disable static generation for this page since it requires authentication
export const dynamic = 'force-dynamic';

export default AdminBuyersPage;
