// src/components/inventory/TransactionsTable.tsx
import React from 'react';
import { TransactionResponse, TransactionType } from '@/types/api/types';
import { ArrowDown, ArrowUp, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TransactionsTableProps {
  transactions: TransactionResponse[];
  isLoading?: boolean;
  onViewDetails?: (transaction: TransactionResponse) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isLoading,
  onViewDetails
}) => {
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.IN:
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case TransactionType.OUT:
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.IN:
        return 'text-green-700 bg-green-50';
      case TransactionType.OUT:
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded mb-2" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No stock transactions have been recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reason
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="font-medium">
                  {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                </div>
                <div className="text-gray-500">
                  {format(new Date(transaction.createdAt), 'HH:mm')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {transaction.item.name}
                </div>
                {transaction.item.description && (
                  <div className="text-sm text-gray-500">
                    {transaction.item.description}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getTransactionIcon(transaction.transactionType)}
                  <span className={cn(
                    "ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium",
                    getTransactionColor(transaction.transactionType)
                  )}>
                    {transaction.transactionType}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {transaction.quantity} units
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {transaction.location.name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 max-w-xs truncate">
                  {transaction.reason || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onViewDetails?.(transaction)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;