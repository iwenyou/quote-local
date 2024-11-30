import React, { useEffect } from 'react';
import { X, Building2, Phone, Mail, Globe } from 'lucide-react';
import { Order, ReceiptTemplate } from '../../types/order';
import { format, addDays } from 'date-fns';

interface ReceiptPreviewProps {
  order: Order;
  receiptId: string;
  template: ReceiptTemplate;
  onClose: () => void;
}

export function ReceiptPreview({ order, receiptId, template, onClose }: ReceiptPreviewProps) {
  const receipt = order.receipts?.find(r => r.id === receiptId);

  if (!receipt) {
    return null;
  }

  const dueDate = addDays(new Date(receipt.createdAt), 14);

  const formatDimensions = (item: any) => {
    return `${item.height}"H x ${item.width}"W x ${item.depth}"D`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="relative bg-white rounded-lg max-w-4xl w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-4">
                    {template.businessInfo.name}
                  </h1>
                  <div className="space-y-2 text-white/90">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 opacity-75" />
                      <span className="whitespace-pre-line">{template.businessInfo.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 opacity-75" />
                      <span>{template.businessInfo.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 opacity-75" />
                      <span>{template.businessInfo.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 opacity-75" />
                      <span>{template.businessInfo.website}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                    <h2 className="text-xl font-semibold">RECEIPT</h2>
                    <p className="text-sm opacity-90">#{receipt.id.slice(0, 8)}</p>
                  </div>
                  <div className="mt-4 text-sm text-white/90">
                    <p>Date: {format(new Date(receipt.createdAt), 'MMMM d, yyyy')}</p>
                    <p>Due Date: {format(dueDate, 'MMMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="p-8 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 gap-12">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                    Bill To
                  </h2>
                  <div className="text-gray-600">
                    <p className="font-medium text-gray-900 text-lg">{order.clientName}</p>
                    <p className="whitespace-pre-line mt-2">{order.installationAddress}</p>
                    <p className="mt-2">{order.phone}</p>
                    <p>{order.email}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    Project Details
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium text-gray-900">{order.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Project Name:</span>
                      <span className="font-medium text-gray-900">{order.projectName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className="font-medium text-indigo-600">{receipt.status.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="p-8">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4 px-4">
                        <p className="text-gray-900 font-medium">Payment ({receipt.paymentPercentage}% of total order)</p>
                        <p className="text-sm text-gray-600 mt-1">Project: {order.projectName}</p>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-gray-900">
                        ${receipt.amount.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200 bg-gray-50">
                      <td className="py-4 px-4 text-right font-medium text-gray-900">Total Amount</td>
                      <td className="py-4 px-4 text-right text-lg font-bold text-indigo-600">
                        ${receipt.amount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-gray-50">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                    Terms & Conditions
                  </h3>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="whitespace-pre-line text-gray-600 text-sm leading-relaxed">
                      {template.footer.termsAndConditions}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                    <p className="text-gray-600 italic text-sm">
                      {template.footer.notes}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}