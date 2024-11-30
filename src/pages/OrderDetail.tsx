import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Eye, ExternalLink } from 'lucide-react';
import { Order } from '../types/order';
import { getOrderById, updateOrder } from '../services/orderService';
import { OrderItemsTable } from '../components/orders/OrderItemsTable';
import { OrderTotals } from '../components/orders/OrderTotals';
import { OrderAdjustmentForm } from '../components/orders/OrderAdjustmentForm';
import { ReceiptManager } from '../components/orders/ReceiptManager';
import { ClientInfo } from '../components/orders/ClientInfo';
import { OrderStatusProgress } from '../components/orders/OrderStatusProgress';
import { Package, Building2, Truck, Clock, CheckCircle2 } from 'lucide-react';

import { addBusinessDays, format } from 'date-fns';

const statusSteps = [
  { id: 'order_placed', label: 'Order Placed', icon: Package },
  { id: 'manufacturing', label: 'Manufacturing', icon: Building2 },
  { id: 'in_transit', label: 'In Transit', icon: Truck },
  { id: 'ready_delivery', label: 'Ready for Delivery', icon: Clock },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2 }
];

const DEFAULT_BUSINESS_DAYS = 90;

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<Date>(
    addBusinessDays(new Date(), DEFAULT_BUSINESS_DAYS)
  );
  const [isEditingDate, setIsEditingDate] = useState(false);

  useEffect(() => {
    if (id) {
      const orderData = getOrderById(id);
      if (orderData) {
        setOrder(orderData);
        if (orderData.estimatedDeliveryDate) {
          setEstimatedDeliveryDate(new Date(orderData.estimatedDeliveryDate));
        }
      } else {
        navigate('/orders');
      }
    }
  }, [id, navigate]);

  if (!order) return null;

  const handleStatusChange = (newStatus: string) => {
    const updatedOrder = updateOrder(order.id, { 
      status: newStatus,
      estimatedDeliveryDate: estimatedDeliveryDate.toISOString()
    });
    setOrder(updatedOrder);
  };

  const handleDateChange = (date: Date) => {
    setEstimatedDeliveryDate(date);
    const updatedOrder = updateOrder(order.id, {
      estimatedDeliveryDate: date.toISOString()
    });
    setOrder(updatedOrder);
    setIsEditingDate(false);
  };

  const currentStep = statusSteps.findIndex(step => step.id === order.status);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </button>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <div className="mt-2 text-gray-600 space-y-1">
            <p>Order ID: {order.id.slice(0, 8)}</p>
            <p>Created: {new Date(order.createdAt).toLocaleDateString()}</p>
            {order.quoteId && <p>Quote ID: {order.quoteId.slice(0, 8)}</p>}
          </div>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => navigate(`/orders/${order.id}/edit`)}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Order
          </button>
          <button
            onClick={() => window.open(`/client/order/${order.id}`, '_blank')}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Client View
          </button>
        </div>
      </div>

      {/* Order Status Progress */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h2>
        <OrderStatusProgress steps={statusSteps} currentStep={currentStep} />
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Current Status:</span>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="ml-2 text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            >
              {statusSteps.map((step) => (
                <option key={step.id} value={step.id}>
                  {step.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Estimated delivery by:{' '}
            {isEditingDate ? (
              <span className="inline-flex items-center">
                <input
                  type="date"
                  value={format(estimatedDeliveryDate, 'yyyy-MM-dd')}
                  onChange={(e) => handleDateChange(new Date(e.target.value))}
                  className="ml-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </span>
            ) : (
              <button
                onClick={() => setIsEditingDate(true)}
                className="ml-2 text-indigo-600 hover:text-indigo-500"
              >
                {format(estimatedDeliveryDate, 'MMMM d, yyyy')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Client Information */}
          <ClientInfo order={order} />

          {/* Order Items */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Items
              </h2>
              <OrderItemsTable items={order.items} />
            </div>
          </div>

          {/* Receipts */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <ReceiptManager order={order} onUpdate={setOrder} />
            </div>
          </div>
        </div>

        <div>
          {/* Order Totals */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>
              <OrderTotals
                subtotal={order.total}
                adjustmentType={order.adjustmentType}
                adjustmentPercentage={order.adjustmentPercentage}
                adjustedTotal={order.adjustedTotal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}