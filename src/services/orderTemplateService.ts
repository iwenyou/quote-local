import { OrderStatusTemplateType } from '../types/orderTemplate';

const defaultTemplate: OrderStatusTemplateType = {
  steps: [
    { id: 'order_placed', label: 'Order Placed', estimatedDays: 1, icon: 'package', order: 1 },
    { id: 'manufacturing', label: 'Manufacturing', estimatedDays: 7, icon: 'building', order: 2 },
    { id: 'in_transit', label: 'In Transit', estimatedDays: 3, icon: 'truck', order: 3 },
    { id: 'ready_delivery', label: 'Ready for Delivery', estimatedDays: 2, icon: 'clock', order: 4 },
    { id: 'delivered', label: 'Delivered', estimatedDays: 0, icon: 'check', order: 5 }
  ],
  showEstimatedDelivery: true,
  showOrderDetails: true,
  showContactSupport: true,
  customLabels: {
    orderId: 'Order ID',
    orderDate: 'Order Date',
    clientName: 'Client Name',
    estimatedDelivery: 'Estimated Delivery',
    contactSupport: 'Contact Support'
  },
  styling: {
    completedColor: '#4F46E5',
    activeColor: '#6366F1',
    upcomingColor: '#E5E7EB',
    fontFamily: 'Inter',
    fontSize: 'base'
  }
};

export function getOrderTemplate(): OrderStatusTemplateType {
  const stored = localStorage.getItem('orderTemplate');
  if (!stored) {
    localStorage.setItem('orderTemplate', JSON.stringify(defaultTemplate));
    return defaultTemplate;
  }
  return JSON.parse(stored);
}

export function saveOrderTemplate(template: OrderStatusTemplateType): void {
  localStorage.setItem('orderTemplate', JSON.stringify(template));
}