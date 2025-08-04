import React from 'react';
import { X } from 'lucide-react';
import AuthPage from './AuthPage'; // Import your auth page component

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header with close button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <AuthPage />
        </div>
      </div>
    </div>
  );
};

export default AuthModal;