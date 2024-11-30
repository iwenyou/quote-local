import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Save, Eye, Package, Building2, Truck, Clock, CheckCircle2, Plus, Trash2, Phone, Mail, Ruler } from 'lucide-react';
import { OrderStatusTemplateType, OrderStatusStep } from '../types/orderTemplate';
import { getOrderTemplate, saveOrderTemplate } from '../services/orderTemplateService';
import { OrderStatusProgress } from '../components/orders/OrderStatusProgress';
import { format, addBusinessDays } from 'date-fns';

const demoOrder = {
  id: 'DEMO-001',
  clientName: 'John Smith',
  email: 'john@example.com',
  phone: '(555) 123-4567',
  installationAddress: '123 Demo Street\nAnytown, ST 12345',
  status: 'manufacturing',
  createdAt: new Date().toISOString(),
  items: [
    {
      id: '1',
      spaceName: 'Kitchen',
      productId: 'Base Cabinet',
      material: 'Solid Wood',
      width: 30,
      height: 36,
      depth: 24,
      price: 599.99
    }
  ],
  total: 599.99
};

const iconComponents = {
  package: Package,
  building: Building2,
  truck: Truck,
  clock: Clock,
  check: CheckCircle2
};

export function OrderStatusTemplatePage() {
  const [template, setTemplate] = useState<OrderStatusTemplateType>(getOrderTemplate());
  const [activeTab, setActiveTab] = useState('steps');
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  const previewSteps = template.steps.map(step => ({
    id: step.id,
    label: step.label,
    icon: iconComponents[step.icon]
  }));

  const handleSave = () => {
    saveOrderTemplate(template);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(template.steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reorderedSteps = items.map((step, index) => ({
      ...step,
      order: index + 1
    }));

    setTemplate({ ...template, steps: reorderedSteps });
  };

  const handleAddStep = () => {
    const newStep: OrderStatusStep = {
      id: crypto.randomUUID(),
      label: 'New Status',
      estimatedDays: 1,
      icon: 'package',
      order: template.steps.length + 1
    };

    setTemplate({
      ...template,
      steps: [...template.steps, newStep]
    });
  };

  const handleRemoveStep = (id: string) => {
    setTemplate({
      ...template,
      steps: template.steps.filter(step => step.id !== id)
    });
  };

  const handleUpdateStep = (id: string, updates: Partial<OrderStatusStep>) => {
    setTemplate({
      ...template,
      steps: template.steps.map(step =>
        step.id === id ? { ...step, ...updates } : step
      )
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Status Template</h1>
          <p className="mt-2 text-gray-600">
            Customize how the client order status page looks and behaves
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('steps')}
              className={`${
                activeTab === 'steps'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Status Steps
            </button>
            <button
              onClick={() => setActiveTab('display')}
              className={`${
                activeTab === 'display'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Display Options
            </button>
            <button
              onClick={() => setActiveTab('styling')}
              className={`${
                activeTab === 'styling'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Styling
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'steps' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Order Status Steps</h2>
                <button
                  onClick={handleAddStep}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Step
                </button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="steps">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {template.steps.map((step, index) => (
                        <Draggable
                          key={step.id}
                          draggableId={step.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                            >
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Label
                                  </label>
                                  <input
                                    type="text"
                                    value={step.label}
                                    onChange={(e) =>
                                      handleUpdateStep(step.id, {
                                        label: e.target.value,
                                      })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Estimated Days
                                  </label>
                                  <input
                                    type="number"
                                    value={step.estimatedDays}
                                    onChange={(e) =>
                                      handleUpdateStep(step.id, {
                                        estimatedDays: Number(e.target.value),
                                      })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Icon
                                  </label>
                                  <select
                                    value={step.icon}
                                    onChange={(e) =>
                                      handleUpdateStep(step.id, {
                                        icon: e.target.value as any,
                                      })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  >
                                    <option value="package">Package</option>
                                    <option value="building">Building</option>
                                    <option value="truck">Truck</option>
                                    <option value="clock">Clock</option>
                                    <option value="check">Check</option>
                                  </select>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveStep(step.id)}
                                className="mt-2 text-sm text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4 inline-block mr-1" />
                                Remove
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Display Options</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.showEstimatedDelivery}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        showEstimatedDelivery: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Show Estimated Delivery Date
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.showOrderDetails}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        showOrderDetails: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Show Order Details
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.showContactSupport}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        showContactSupport: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Show Contact Support Button
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Custom Labels
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(template.customLabels).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          setTemplate({
                            ...template,
                            customLabels: {
                              ...template.customLabels,
                              [key]: e.target.value,
                            },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'styling' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Styling Options</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Completed Step Color
                  </label>
                  <input
                    type="color"
                    value={template.styling.completedColor}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        styling: {
                          ...template.styling,
                          completedColor: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Active Step Color
                  </label>
                  <input
                    type="color"
                    value={template.styling.activeColor}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        styling: {
                          ...template.styling,
                          activeColor: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upcoming Step Color
                  </label>
                  <input
                    type="color"
                    value={template.styling.upcomingColor}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        styling: {
                          ...template.styling,
                          upcomingColor: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Font Family
                  </label>
                  <select
                    value={template.styling.fontFamily}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        styling: {
                          ...template.styling,
                          fontFamily: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Font Size
                  </label>
                  <select
                    value={template.styling.fontSize}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        styling: {
                          ...template.styling,
                          fontSize: e.target.value as any,
                        },
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="sm">Small</option>
                    <option value="base">Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {saved && (
            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <p className="text-sm text-green-700">
                Template saved successfully!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowPreview(false)}></div>
            </div>
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowPreview(false)}></div>
            <div className="relative bg-white min-h-screen w-full">
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
                        <p className="mt-1 font-medium">{demoOrder.id}</p>
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-wide text-white/70">Order Date</p>
                        <p className="mt-1 font-medium">{format(new Date(demoOrder.createdAt), 'MMMM d, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-wide text-white/70">Estimated Delivery</p>
                        <p className="mt-1 font-medium">{format(addBusinessDays(new Date(demoOrder.createdAt), 90), 'MMMM d, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {/* Status Progress */}
                  <div className="bg-white shadow-xl rounded-xl p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-8">Order Progress</h2>
                    <OrderStatusProgress steps={previewSteps} currentStep={1} />
                    <div className="mt-8 text-center">
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Estimated delivery by {format(addBusinessDays(new Date(), 90), 'MMMM d, yyyy')}</span>
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
                          <p className="mt-1 text-gray-900 whitespace-pre-line">{demoOrder.installationAddress}</p>
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
                            <p className="text-gray-900">{demoOrder.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-900">{demoOrder.email}</p>
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
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dimensions</th>
                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {demoOrder.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-3 py-4 text-sm text-gray-900">{item.productId}</td>
                              <td className="px-3 py-4 text-sm text-gray-900">{item.material}</td>
                              <td className="px-3 py-4 text-sm text-gray-900">{`${item.height}"H x ${item.width}"W x ${item.depth}"D`}</td>
                              <td className="px-3 py-4 text-sm text-gray-900 text-right">${item.price.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-8 border-t border-gray-200 pt-8">
                      <div className="flex justify-end">
                        <dl className="w-64 space-y-3">
                          <div className="flex justify-between text-sm">
                            <dt className="font-medium text-gray-500">Total</dt>
                            <dd className="text-2xl font-bold text-indigo-600">${demoOrder.total.toFixed(2)}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="fixed top-4 right-4 bg-white rounded-full p-2 shadow-lg text-gray-400 hover:text-gray-500"
              >
                <Trash2 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}