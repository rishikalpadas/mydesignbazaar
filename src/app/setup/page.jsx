"use client"
import React, { useState } from 'react';
import { Database, Key, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const SetupPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSetup = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/setup/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setupKey: 'dev-setup-key' // Use this for development
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setResults(data);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch('/api/setup/database', {
        method: 'GET',
      });
      const data = await response.json();
      console.log('Connection test:', data);
      alert(`Connection test: ${data.mongoUri}`);
    } catch (err) {
      alert('Connection test failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">MyDesignBazaar Database Setup</h1>
            <p className="text-gray-600 mt-2">Initialize your database with admin accounts</p>
          </div>

          {!results && !error && (
            <div className="text-center">
              <p className="text-gray-700 mb-6">
                This will create the following admin accounts in your database:
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Super Admin</h3>
                  <p className="text-sm text-gray-600">admin@mydesignbazaar.com</p>
                  <p className="text-xs text-gray-500 mt-1">Full system access</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Designer Admin</h3>
                  <p className="text-sm text-gray-600">designer@mydesignbazaar.com</p>
                  <p className="text-xs text-gray-500 mt-1">Manage designers & designs</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Buyer Admin</h3>
                  <p className="text-sm text-gray-600">buyer@mydesignbazaar.com</p>
                  <p className="text-xs text-gray-500 mt-1">Manage buyers & orders</p>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={testConnection}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Test Connection
                </button>
                
                <button
                  onClick={handleSetup}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Setting up database...
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5 mr-2" />
                      Setup Database
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="font-medium text-red-900">Setup Failed</h3>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={() => setError('')}
                className="mt-3 text-red-600 hover:text-red-800 font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {results && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="font-semibold text-green-900">Setup Completed Successfully!</h3>
              </div>
              
              <div className="space-y-4">
                {results.results.map((result, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{result.email}</h4>
                        <p className="text-sm text-gray-600">Role: {result.role}</p>
                      </div>
                      <div className="text-right">
                        {result.status === 'created' ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            Created
                          </span>
                        ) : result.status === 'already_exists' ? (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                            Already Exists
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                            Error
                          </span>
                        )}
                      </div>
                    </div>
                    {result.password && (
                      <div className="mt-2 p-2 bg-gray-100 rounded">
                        <p className="text-sm font-mono text-gray-800">
                          Password: {result.password}
                        </p>
                      </div>
                    )}
                    {result.error && (
                      <div className="mt-2 p-2 bg-red-100 rounded">
                        <p className="text-sm text-red-800">
                          Error: {result.error}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">⚠️ Important Security Notes:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Please change these default passwords immediately after first login</li>
                  <li>• Store these credentials securely</li>
                  <li>• These passwords are shown only once during setup</li>
                  <li>• Delete this setup page in production</li>
                </ul>
              </div>

              <div className="mt-4 text-center">
                <a
                  href="/admin/login"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                >
                  Go to Admin Login
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupPage;