export interface OrderStatusStep {
  id: string;
  label: string;
  estimatedDays: number;
  icon: 'package' | 'building' | 'truck' | 'clock' | 'check';
  order: number;
}

export interface OrderStatusTemplateType {
  steps: OrderStatusStep[];
  showEstimatedDelivery: boolean;
  showOrderDetails: boolean;
  showContactSupport: boolean;
  customLabels: {
    orderId: string;
    orderDate: string;
    clientName: string;
    estimatedDelivery: string;
    contactSupport: string;
  };
  styling: {
    completedColor: string;
    activeColor: string;
    upcomingColor: string;
    fontFamily: string;
    fontSize: 'sm' | 'base' | 'lg';
  };
}