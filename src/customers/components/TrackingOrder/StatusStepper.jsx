import { getActiveStep, steps } from "../../util/statusConfig";
import { icons } from "./icons";

const StatusStepper = ({ orderStatus }) => {
  const activeStepIndex = getActiveStep(orderStatus);

  return (
    <div className="relative flex items-center justify-between px-2 py-4">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2 -z-10"></div>
      <div
        className="absolute top-1/2 left-0 h-0.5 bg-[#00b14f] transform -translate-y-1/2 -z-10 transition-all duration-500"
        style={{ width: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
      ></div>

      {steps.map((step, i) => {
        const isDone = i < activeStepIndex;
        const isNow = i === activeStepIndex;
        let bg = "bg-gray-400",
          label = "text-gray-500",
          iconColor = "text-white";
        if (isDone) {
          bg = "bg-[#00b14f]";
          label = "text-[#00b14f] font-semibold";
        }
        if (isNow) {
          bg = "bg-[#00b14f]";
          label = "text-[#00b14f] font-bold";
        }

        return (
          <div key={step.status} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${bg} ${
                isNow ? "animate-pulse-green" : ""
              }`}
            >
              <div className={`w-5 h-5 ${iconColor}`}>{icons[step.status]}</div>
            </div>
            <div
              className={`mt-2 text-xs sm:text-sm text-center whitespace-nowrap ${label}`}
            >
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusStepper; 


