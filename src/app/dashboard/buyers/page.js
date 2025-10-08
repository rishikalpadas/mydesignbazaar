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
  Package
} from 'lucide-react';
import DashboardPageWrapper from '../../../components/dashboard/DashboardPageWrapper';

const BuyersContent = () => {
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
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
                      <p className="text-sm text-gray-500">{buyer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{buyer.mobileNumber}</span>
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
                    <button
                      onClick={() => handleManageCredits(buyer)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      Manage Credits
                    </button>
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

export default AdminBuyersPage;
