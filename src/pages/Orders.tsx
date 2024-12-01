import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2, ShoppingBag } from 'lucide-react';
import { Order } from '../types/order';
import { getAllOrders, deleteOrder, updateOrder } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';
import { OrderFilters } from '../components/orders/OrderFilters';
import { OrderStatusBadge } from '../components/orders/OrderStatusBadge';

const statusOptions = [
  { value: 'order_placed', label: 'Order Placed', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'manufacturing', label: 'Manufacturing', color: 'bg-blue-100 text-blue-800' },
  { value: 'in_transit', label: 'In Transit', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'ready_delivery', label: 'Ready for Delivery', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' }
];

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setOrders(getAllOrders());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        deleteOrder(id);
        setOrders(getAllOrders());
      } catch (error) {
        alert('Failed to delete order. Please try again.');
      }
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    try {
      const order = orders.find(o => o.id === id);
      if (order) {
        updateOrder(id, { status: newStatus as Order['status'] });
        setOrders(getAllOrders());
      }
    } catch (error) {
      alert('Failed to update order status. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-2 text-gray-600">
            Manage and track all orders
          </p>
        </div>
      </div>

      <OrderFilters />

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user?.role === 'admin' || user?.role === 'sales' ? (
                      <select
                        value={order.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(order.status)} border-none focus:ring-2 focus:ring-indigo-500`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <OrderStatusBadge status={order.status} />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.adjustedTotal?.toFixed(2) || order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/orders/${order.id}`);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/orders/${order.id}/edit`);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  return statusOptions.find(opt => opt.value === status)?.color || 'bg-gray-100 text-gray-800';
}