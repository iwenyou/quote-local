import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface OrderStatusProgressProps {
  steps: Step[];
  currentStep: number;
}

export function OrderStatusProgress({ steps, currentStep }: OrderStatusProgressProps) {
  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
        <div
          className="absolute h-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                index === steps.length - 1 ? '' : 'flex-1'
              }`}
            >
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    isCompleted
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }
                  ${
                    isCurrent
                      ? 'ring-4 ring-indigo-100'
                      : ''
                  }
                `}
              >
                <StepIcon className="w-5 h-5" />
              </div>
              <div className="mt-2 text-center">
                <div
                  className={`text-sm font-medium ${
                    isCompleted ? 'text-indigo-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </div>
                {isCurrent && (
                  <div className="text-xs text-gray-500 mt-1">Current Status</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}