'use client';

import React, { useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
// Helper function to format currency
const formatCurrency = (amount: number, currency = 'BDT') => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Payment history interface
export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'Paid' | 'Pending' | 'Failed';
  transactionId: string;
}

interface PaymentHistoryProps {
  payments?: PaymentRecord[];
  showViewAllButton?: boolean;
  onViewAll?: () => void;
  maxDisplayCount?: number;
}

const mockPaymentHistory: PaymentRecord[] = [
  { id: '1', date: '2024-02-15', amount: 1500.00, method: 'bKash', status: 'Paid', transactionId: 'TRX123456' },
  { id: '2', date: '2024-01-15', amount: 1500.00, method: 'Nagad', status: 'Paid', transactionId: 'TRX123455' },
  { id: '3', date: '2023-12-15', amount: 1500.00, method: 'Rocket', status: 'Paid', transactionId: 'TRX123454' },
  { id: '4', date: '2023-11-15', amount: 1500.00, method: 'Bank', status: 'Paid', transactionId: 'TRX123453' },
  { id: '5', date: '2023-10-15', amount: 1500.00, method: 'bKash', status: 'Pending', transactionId: 'TRX123452' },
];

export default function PaymentHistory({ 
  payments = mockPaymentHistory, 
  showViewAllButton = true,
  onViewAll,
  maxDisplayCount = 4 
}: PaymentHistoryProps) {
  const [showAllPayments, setShowAllPayments] = useState(false);

  const getStatusColor = (status: PaymentRecord['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const displayedPayments = showAllPayments ? payments : payments.slice(0, maxDisplayCount);

  const handleViewAll = () => {
    if (showAllPayments) {
      setShowAllPayments(false);
    } else {
      setShowAllPayments(true);
    }
    onViewAll?.();
  };

  return (
    <ProtectedRoute allowedRoles={['customer']}>
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
          <p className="text-sm text-gray-500 mt-1">Your recent transaction history</p>
        </div>
        {showViewAllButton && payments.length > maxDisplayCount && (
          <button
            onClick={handleViewAll}
            className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            {showAllPayments ? 'Show Less' : 'View All'}
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(payment.date).toLocaleDateString('en-BD')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {payment.method}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {payment.transactionId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {payments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>No payment history available.</p>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}