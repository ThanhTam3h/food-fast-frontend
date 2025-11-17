import { Bell, XCircle } from "lucide-react";
const ToastNotification = ({ message, onClose }) => {
	return (
		<div className="fixed top-20 right-4 z-[100] w-full max-w-sm bg-orange-600 text-white p-4 rounded-lg shadow-xl flex items-start space-x-3 animate-slideIn transition-all duration-300">
			<Bell className="w-6 h-6 flex-shrink-0 mt-0.5" />
			<div className="flex-1">
				<p className="font-semibold text-sm">{message}</p>
				<p className="text-xs opacity-80 mt-1">
					Vui lòng chấp nhận đơn hàng trong vòng 30 giây.
				</p>
			</div>
			<button
				onClick={onClose}
				className="p-1 rounded-full text-white opacity-70 hover:opacity-100">
				<XCircle className="w-5 h-5" />
			</button>
		</div>
	);
};

export default ToastNotification;
