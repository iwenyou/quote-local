import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, Mail, Clock, Package, Truck, CheckCircle2, Building2, Ruler } from 'lucide-react';
import { getOrderById } from '../services/orderService';
import { Order } from '../types/order';
import { OrderStatusProgress } from '../components/orders/OrderStatusProgress';
import { OrderItemsTable } from '../components/orders/OrderItemsTable';
import { format, addBusinessDays } from 'date-fns';

const DEFAULT_BUSINESS_DAYS = 90;

const statusSteps = [
  { id: 'order_placed', label: 'Order Placed', icon: Package },
  { id: 'manufacturing', label: 'Manufacturing', icon: Building2 },
  { id: 'in_transit', label: 'In Transit', icon: Truck },
  { id: 'ready_delivery', label: 'Ready for Delivery', icon: Clock },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2 }
];

export function ClientOrderStatus() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      const orderData = getOrderById(id);
      if (orderData) {
        setOrder(orderData);
      }
    }
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
          <p className="mt-2 text-gray-600">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const currentStep = statusSteps.findIndex(step => step.id === order.status);
  const estimatedDeliveryDate = order.estimatedDeliveryDate 
    ? new Date(order.estimatedDeliveryDate)
    : addBusinessDays(new Date(order.createdAt), DEFAULT_BUSINESS_DAYS);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Ruler className="h-10 w-10 text-white/90" />
              <div>
                <h1 className="text-3xl font-bold">Order Status</h1>
                <p className="text-white/80 mt-1">Track your order progress</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-white/90">
            <div>
              <p className="text-sm uppercase tracking-wide text-white/70">Order ID</p>
              <p className="mt-1 font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-white/70">Order Date</p>
              <p className="mt-1 font-medium">{format(new Date(order.createdAt), 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-white/70">Estimated Delivery</p>
              <p className="mt-1 font-medium">{format(estimatedDeliveryDate, 'MMMM d, yyyy')}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Progress */}
        <div className="bg-white shadow-xl rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-8">Order Progress</h2>
          <OrderStatusProgress steps={statusSteps} currentStep={currentStep} />
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700">
              <Clock className="h-4 w-4 mr-2" />
              <span>Estimated delivery by {format(estimatedDeliveryDate, 'MMMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow-xl rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              Delivery Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Installation Address</p>
                <p className="mt-1 text-gray-900 whitespace-pre-line">{order.installationAddress}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-xl rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{order.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{order.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Order Details
          </h2>
          <OrderItemsTable items={order.items} />
          
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex justify-end">
              <dl className="w-64 space-y-3">
                <div className="flex justify-between text-sm">
                  <dt className="font-medium text-gray-500">Subtotal</dt>
                  <dd className="text-gray-900">${order.total.toFixed(2)}</dd>
                </div>
                {order.adjustmentType && (
                  <div className="flex justify-between text-sm">
                    <dt className="font-medium text-gray-500">
                      {order.adjustmentType === 'discount' ? 'Discount' : 'Surcharge'} 
                      ({order.adjustmentPercentage}%)
                    </dt>
                    <dd className="text-gray-900">
                      ${Math.abs(order.total - (order.adjustedTotal || order.total)).toFixed(2)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium">
                  <dt className="text-gray-900">Total</dt>
                  <dd className="text-2xl font-bold text-indigo-600">
                    ${(order.adjustedTotal || order.total).toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}