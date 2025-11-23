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
  X,
  ChevronDown,
  ChevronUp,
  Zap
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
  const [buyerSubscriptionDetails, setBuyerSubscriptionDetails] = useState(null);
  const [loadingBuyerSubscription, setLoadingBuyerSubscription] = useState(false);
  const [expandedBuyerId, setExpandedBuyerId] = useState(null);
  const [buyerSubscriptions, setBuyerSubscriptions] = useState({});

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

  const handleViewDetails = async (buyer) => {
    setSelectedBuyer(buyer);
    setShowDetailsModal(true);
    await fetchBuyerSubscriptionDetails(buyer.userId);
  };

  const handleManageCredits = (buyer) => {
    setSelectedBuyer(buyer);
    setShowCreditModal(true);
    setCreditOperation('add');
    setCreditAmount('');
    setCreditReason('');
  };

  const fetchBuyerSubscriptionDetails = async (userId) => {
    setLoadingBuyerSubscription(true);
    setBuyerSubscriptionDetails(null);
    try {
      const response = await fetch(`/api/admin/buyers/subscription?userId=${userId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setBuyerSubscriptionDetails(data);
      }
    } catch (error) {
      console.error('Failed to fetch buyer subscription:', error);
    } finally {
      setLoadingBuyerSubscription(false);
    }
  };

  const toggleBuyerSubscription = async (buyer) => {
    if (expandedBuyerId === buyer._id) {
      // Collapse if already expanded
      setExpandedBuyerId(null);
    } else {
      // Expand and fetch subscription details if not already loaded
      setExpandedBuyerId(buyer._id);
      if (!buyerSubscriptions[buyer._id]) {
        try {
          const response = await fetch(`/api/admin/buyers/subscription?userId=${buyer.userId}`, {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            setBuyerSubscriptions(prev => ({
              ...prev,
              [buyer._id]: data
            }));
          }
        } catch (error) {
          console.error('Failed to fetch buyer subscription:', error);
        }
      }
    }
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBuyers.map((buyer) => (
                <>
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
                          onClick={() => toggleBuyerSubscription(buyer)}
                          className="inline-flex items-center justify-center px-3 py-2 border border-purple-300 text-sm leading-4 font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          {expandedBuyerId === buyer._id ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-1" />
                              Hide Plans
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-1" />
                              View Plans
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleViewDetails(buyer)}
                          className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Full Details
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
                  
                  {/* Expandable Subscription Cards Row */}
                  {expandedBuyerId === buyer._id && (
                    <tr key={`${buyer._id}-subscription`}>
                      <td colSpan="4" className="px-6 py-6 bg-gray-50">
                        {buyerSubscriptions[buyer._id] ? (
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Subscriptions & Credits</h4>
                            
                            {buyerSubscriptions[buyer._id].subscription?.allSubscriptions?.length > 0 || buyerSubscriptions[buyer._id].subscription?.adminCredits ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Admin Credits Card */}
                                {buyerSubscriptions[buyer._id].subscription?.adminCredits && buyerSubscriptions[buyer._id].subscription.adminCredits.remaining > 0 && (
                                  <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-lg p-4 text-white shadow-md border border-emerald-300">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center space-x-2">
                                        <Zap className="h-5 w-5" />
                                        <div>
                                          <h5 className="font-bold text-sm">Admin Credits</h5>
                                          <p className="text-emerald-100 text-xs">Bonus Credits</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-2xl font-bold">{buyerSubscriptions[buyer._id].subscription.adminCredits.remaining}</p>
                                        <p className="text-xs text-emerald-100">Available</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                      <div>
                                        <p className="text-emerald-100">Total</p>
                                        <p className="font-semibold">{buyerSubscriptions[buyer._id].subscription.adminCredits.total}</p>
                                      </div>
                                      <div>
                                        <p className="text-emerald-100">Used</p>
                                        <p className="font-semibold">{buyerSubscriptions[buyer._id].subscription.adminCredits.used}</p>
                                      </div>
                                      <div>
                                        <p className="text-emerald-100">Status</p>
                                        <p className="font-semibold capitalize">{buyerSubscriptions[buyer._id].subscription.adminCredits.status}</p>
                                      </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-white/20">
                                      <div className="flex items-center justify-between mb-1.5">
                                        <p className="text-xs text-emerald-100 font-medium">Progress</p>
                                        <p className="text-xs text-emerald-100 font-semibold">
                                          {Math.round((buyerSubscriptions[buyer._id].subscription.adminCredits.remaining / buyerSubscriptions[buyer._id].subscription.adminCredits.total) * 100)}%
                                        </p>
                                      </div>
                                      <div className="bg-white/10 backdrop-blur-sm rounded-full h-1.5 overflow-hidden">
                                        <div
                                          className="bg-gradient-to-r from-white to-emerald-100 h-full transition-all duration-700 ease-out rounded-full shadow-lg"
                                          style={{ width: `${(buyerSubscriptions[buyer._id].subscription.adminCredits.remaining / buyerSubscriptions[buyer._id].subscription.adminCredits.total) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Subscription Plan Cards */}
                                {buyerSubscriptions[buyer._id].subscription?.allSubscriptions
                                  ?.sort((a, b) => {
                                    const order = { basic: 1, premium: 2, elite: 3 };
                                    return (order[a.planId] || 99) - (order[b.planId] || 99);
                                  })
                                  .map((sub) => {
                                    const planColors = {
                                      basic: { gradient: 'from-pink-500 to-pink-600', text: 'text-pink-100' },
                                      premium: { gradient: 'from-blue-500 to-blue-600', text: 'text-blue-100' },
                                      elite: { gradient: 'from-purple-500 to-purple-600', text: 'text-purple-100' }
                                    };
                                    const colors = planColors[sub.planId] || planColors.premium;
                                    const daysRemaining = Math.ceil((new Date(sub.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

                                    return (
                                      <div key={sub.id} className={`bg-gradient-to-r ${colors.gradient} rounded-lg p-4 text-white shadow-md`}>
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center space-x-2">
                                            <CreditCard className="h-5 w-5" />
                                            <div>
                                              <h5 className="font-bold text-sm">{sub.planName}</h5>
                                              <p className={`${colors.text} text-xs`}>Active Plan</p>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-2xl font-bold">{sub.creditsRemaining}</p>
                                            <p className={`text-xs ${colors.text}`}>Available</p>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                                          <div>
                                            <p className={colors.text}>Total</p>
                                            <p className="font-semibold">{sub.creditsTotal}</p>
                                          </div>
                                          <div>
                                            <p className={colors.text}>Used</p>
                                            <p className="font-semibold">{sub.creditsUsed}</p>
                                          </div>
                                          <div>
                                            <p className={colors.text}>Expires</p>
                                            <p className="font-semibold">{daysRemaining}d</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center justify-between mb-1.5">
                                          <p className={`text-xs ${colors.text} font-medium`}>Progress</p>
                                          <p className={`text-xs ${colors.text} font-semibold`}>
                                            {Math.round((sub.creditsRemaining / sub.creditsTotal) * 100)}%
                                          </p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-full h-1.5 overflow-hidden">
                                          <div
                                            className={`bg-gradient-to-r from-white ${sub.planId === 'basic' ? 'to-pink-100' : sub.planId === 'premium' ? 'to-blue-100' : 'to-purple-100'} h-full transition-all duration-700 ease-out rounded-full shadow-lg`}
                                            style={{ width: `${(sub.creditsRemaining / sub.creditsTotal) * 100}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            ) : (
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                                <CreditCard className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">No active subscriptions</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-500">Loading subscription details...</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
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

                {/* Subscription Cards - Full Width */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                    Active Subscriptions & Credits
                  </h3>

                  {loadingBuyerSubscription ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Loading subscription details...</p>
                    </div>
                  ) : buyerSubscriptionDetails && (buyerSubscriptionDetails.subscription?.allSubscriptions?.length > 0 || buyerSubscriptionDetails.subscription?.adminCredits) ? (
                    <div className="space-y-4">
                      {/* Admin Credits Card - Emerald Green */}
                      {buyerSubscriptionDetails.subscription?.adminCredits && buyerSubscriptionDetails.subscription.adminCredits.remaining > 0 && (
                        <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-xl p-5 text-white shadow-lg border-2 border-emerald-300">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                <Calendar className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold">Admin Credits</h4>
                                <p className="text-emerald-100 text-xs">Bonus Credits Added</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                                <p className="text-2xl font-bold">{buyerSubscriptionDetails.subscription.adminCredits.remaining}</p>
                                <p className="text-xs text-emerald-100">Available</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/20">
                            <div>
                              <p className="text-emerald-100 text-xs mb-1">Total</p>
                              <p className="text-base font-semibold">{buyerSubscriptionDetails.subscription.adminCredits.total}</p>
                            </div>
                            <div>
                              <p className="text-emerald-100 text-xs mb-1">Used</p>
                              <p className="text-base font-semibold">{buyerSubscriptionDetails.subscription.adminCredits.used}</p>
                            </div>
                            <div>
                              <p className="text-emerald-100 text-xs mb-1">Status</p>
                              <p className="text-base font-semibold capitalize">{buyerSubscriptionDetails.subscription.adminCredits.status}</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs text-emerald-100 font-medium">Progress</p>
                              <p className="text-xs text-emerald-100 font-semibold">
                                {Math.round((buyerSubscriptionDetails.subscription.adminCredits.remaining / buyerSubscriptionDetails.subscription.adminCredits.total) * 100)}%
                              </p>
                            </div>
                            <div className="relative">
                              <div className="bg-white/10 backdrop-blur-sm rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-white to-emerald-100 h-full transition-all duration-700 ease-out rounded-full shadow-lg"
                                  style={{
                                    width: `${(buyerSubscriptionDetails.subscription.adminCredits.remaining / buyerSubscriptionDetails.subscription.adminCredits.total) * 100}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sort subscriptions by plan order: basic, premium, elite */}
                      {buyerSubscriptionDetails.subscription?.allSubscriptions
                        ?.sort((a, b) => {
                          const order = { basic: 1, premium: 2, elite: 3 };
                          return (order[a.planId] || 99) - (order[b.planId] || 99);
                        })
                        .map((sub) => {
                          const planColors = {
                            basic: { gradient: 'from-pink-500 via-rose-500 to-pink-600', border: 'border-pink-300', text: 'text-pink-100' },
                            premium: { gradient: 'from-blue-500 via-indigo-500 to-blue-600', border: 'border-blue-300', text: 'text-blue-100' },
                            elite: { gradient: 'from-purple-500 via-violet-500 to-purple-600', border: 'border-purple-300', text: 'text-purple-100' }
                          };
                          const colors = planColors[sub.planId] || planColors.premium;
                          const daysRemaining = Math.ceil((new Date(sub.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

                          return (
                            <div key={sub.id} className={`bg-gradient-to-r ${colors.gradient} rounded-xl p-5 text-white shadow-lg border-2 ${colors.border}`}>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                    <Calendar className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-bold">{sub.planName} Plan</h4>
                                    <p className={`${colors.text} text-xs`}>Active Subscription</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                                    <p className="text-2xl font-bold">{sub.creditsRemaining}</p>
                                    <p className={`text-xs ${colors.text}`}>Available</p>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/20">
                                <div>
                                  <p className={`${colors.text} text-xs mb-1`}>Total Credits</p>
                                  <p className="text-base font-semibold">{sub.creditsTotal}</p>
                                </div>
                                <div>
                                  <p className={`${colors.text} text-xs mb-1`}>Used</p>
                                  <p className="text-base font-semibold">{sub.creditsUsed}</p>
                                </div>
                                <div>
                                  <p className={`${colors.text} text-xs mb-1 flex items-center`}>
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Expires in
                                  </p>
                                  <p className="text-base font-semibold">{daysRemaining} days</p>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t border-white/20">
                                <div className="flex items-center justify-between mb-2">
                                  <p className={`text-xs ${colors.text} font-medium`}>Progress</p>
                                  <p className={`text-xs ${colors.text} font-semibold`}>
                                    {Math.round((sub.creditsRemaining / sub.creditsTotal) * 100)}%
                                  </p>
                                </div>
                                <div className="relative">
                                  <div className="bg-white/10 backdrop-blur-sm rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className={`bg-gradient-to-r from-white ${sub.planId === 'basic' ? 'to-pink-100' : sub.planId === 'premium' ? 'to-blue-100' : 'to-purple-100'} h-full transition-all duration-700 ease-out rounded-full shadow-lg`}
                                      style={{
                                        width: `${(sub.creditsRemaining / sub.creditsTotal) * 100}%`
                                      }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs">
                                  <p className={colors.text}>Payment: ₹{sub.amountPaid?.toLocaleString()} • ID: {sub.paymentId?.slice(-8)}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-5 shadow-lg border-2 border-orange-200">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="bg-orange-500 rounded-full p-3">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-center">
                          <h4 className="text-lg font-bold text-gray-900">No Active Subscription</h4>
                          <p className="text-gray-600 text-sm">This buyer has no active subscriptions or credits</p>
                        </div>
                      </div>
                    </div>
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
                {/* <p className="text-sm text-gray-600">Current Credits: <span className="font-bold text-green-600">{selectedBuyer?.subscription?.creditsRemaining || 0}</span></p> */}
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
