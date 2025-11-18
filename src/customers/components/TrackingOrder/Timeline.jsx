import {
  getActiveStep,
  steps,
  timelineDescriptions,
} from "../../util/statusConfig";
import { icons } from "./icons";

const Timeline = ({ order }) => {
  const active = getActiveStep(order.status);

  return (
    <div className="mt-6 space-y-4">
      {steps.map((step, i) => {
        if (i > active || (i === 5 && order.status !== "DELIVERED"))
          return null;
        const isNow = i === active;
        const isDone = i < active;
        const bg = isDone
          ? "bg-[#00b14f]"
          : isNow
          ? "bg-[#00b14f]"
          : "bg-gray-400";
        const time = isNow
          ? new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        return (
          <div key={i} className="flex items-start space-x-3">
            <div className="relative">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md ${bg} ${
                  isNow && order.status === "DELIVERING"
                    ? "animate-pulse-red"
                    : ""
                }`}
              >
                <div className="w-5 h-5 text-white">{icons[step.status]}</div>
              </div>
              {i < 5 && (
                <div
                  className={`absolute top-9 left-1/2 transform -translate-x-1/2 w-0.5 h-12 -z-10 ${
                    isDone ? "bg-[#00b14f]" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex justify-between items-center">
                <p className="font-bold text-gray-800">{step.label}</p>
                <p className="text-xs text-gray-500">{time}</p>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {timelineDescriptions[i]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline; // ← THÊM
