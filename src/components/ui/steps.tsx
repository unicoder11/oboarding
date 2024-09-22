import React from 'react'
import { Check } from 'lucide-react'

interface Step {
  title: string
  description: string
}

interface StepsProps {
  steps: Step[]
  currentStep: number
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="flex justify-between">
      {steps.map((step, index) => (
        <div key={step.title} className="flex flex-col items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              index <= currentStep
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-gray-300'
            }`}
          >
            {index < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          <div className="mt-2 text-center">
            <div className="text-sm font-medium">{step.title}</div>
            <div className="text-xs text-muted-foreground">{step.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}