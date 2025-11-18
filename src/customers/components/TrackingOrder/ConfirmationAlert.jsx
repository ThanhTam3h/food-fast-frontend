import { getActiveStep } from "../../util/statusConfig";

const ConfirmationAlert = ({ ui, confirm }) => {
  if (getActiveStep(ui.orderStatus) !== 4 || ui.orderStatus === "DELIVERED")
    return null;

  return (
    <div
      className={`${
        ui.hasArrived ? "bg-[#00b14f]" : "bg-[#1e88e5]"
      } text-white mt-4 p-4 rounded-xl shadow-xl`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <p className="font-bold text-lg">
            {ui.hasArrived ? "Drone đã tới!" : "Đơn hàng đang giao"}
          </p>
          <p className="text-sm">Vui lòng kiểm tra và xác nhận đã nhận hàng.</p>
          {ui.confirmError && (
            <p className="text-sm text-red-200 mt-1">{ui.confirmError}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!ui.canConfirm && (
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-md">
              Chờ 3s
            </span>
          )}
          <button
            onClick={() => confirm(false)}
            disabled={ui.confirming || !ui.canConfirm}
            className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center shadow-md transition ${
              ui.confirming || !ui.canConfirm
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {ui.confirming ? (
              <>
                Đang xác nhận...{" "}
                <svg className="animate-spin ml-2 h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </>
            ) : (
              <>Xác nhận nhận hàng</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationAlert;
