import React from 'react';

interface OrderStatusBadgeProps {
  status: string;
}

const statusColors = {
  order_placed: 'bg-yellow-100 text-yellow-800',
  manufacturing: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-indigo-100 text-indigo-800',
  ready_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800'
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const color = statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
      {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  );
}