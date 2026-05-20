"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
  steps?: { label: string; description?: string }[];
}

const DEFAULT_STEPS = [
  { label: "Upload", description: "Pilih foto gigi Anda" },
  { label: "Analisis", description: "AI sedang memproses" },
  { label: "Hasil", description: "Lihat hasil scan Anda" },
];

export function StepIndicator({
  currentStep,
  steps = DEFAULT_STEPS,
}: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 md:mb-6">
        {steps.map((step, i) => {
          const stepNum = (i + 1) as 1 | 2 | 3;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={step.label} className="flex-1">
              <div className="flex items-center gap-3 md:gap-4">
                <div
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-all",
                    isCurrent
                      ? "bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-lg shadow-cyan-500/20"
                      : isCompleted
                        ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{stepNum}</span>
                  )}
                </div>

                <div className="hidden sm:block">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isCurrent || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p
                      className={cn(
                        "text-xs transition-colors",
                        isCurrent || isCompleted
                          ? "text-muted-foreground"
                          : "text-muted-foreground/60"
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>

                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 transition-colors",
                      stepNum < currentStep
                        ? "bg-emerald-500/50"
                        : "bg-muted-foreground/20"
                    )}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
