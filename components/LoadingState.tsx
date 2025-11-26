import React, { useEffect, useState } from 'react';
import { Icons } from './ui/Icons';

export const LoadingState: React.FC = () => {
  const steps = [
    { text: "Parsing git diff...", icon: Icons.File },
    { text: "Security Agent analyzing vulnerabilities...", icon: Icons.Security },
    { text: "Logic Agent checking for bugs...", icon: Icons.Logic },
    { text: "Performance Agent optimizing code...", icon: Icons.Performance },
    { text: "Synthesizing final review report...", icon: Icons.Success },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000); // Simulate time per step
      return () => clearTimeout(timeout);
    }
  }, [currentStep, steps.length]);

  return (
    <div className="w-full max-w-md mx-auto mt-20 text-center">
      <div className="relative w-24 h-24 mx-auto mb-10">
        <div className="absolute inset-0 border-4 border-brand-yellow/10 rounded-full"></div>
        <div className="absolute inset-0 border-t-4 border-brand-yellow rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center animate-pulse-slow">
           <Icons.PR className="w-8 h-8 text-brand-yellow" />
        </div>
      </div>

      <div className="space-y-4 text-left glass-card p-8 rounded-2xl">
        {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
                <div key={index} className={`flex items-center gap-4 transition-all duration-500 ${
                    index > currentStep ? 'opacity-20 blur-[1px]' : 'opacity-100'
                }`}>
                    {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                            <Icons.Success className="w-3.5 h-3.5 text-green-500" />
                        </div>
                    ) : isActive ? (
                        <div className="w-6 h-6 rounded-full bg-brand-yellow/20 flex items-center justify-center border border-brand-yellow/30 animate-pulse">
                            <Icons.Loading className="w-3.5 h-3.5 text-brand-yellow animate-spin" />
                        </div>
                    ) : (
                        <div className="w-6 h-6 rounded-full border border-gray-700 flex-shrink-0" />
                    )}
                    
                    <span className={`text-sm tracking-wide ${isActive ? 'text-white font-semibold' : 'text-gray-400'}`}>
                        {step.text}
                    </span>
                </div>
            )
        })}
      </div>
    </div>
  );
};