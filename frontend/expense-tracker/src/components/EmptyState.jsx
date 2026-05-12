import { LuInbox } from "react-icons/lu";

const EmptyState = ({
  message = "No data yet",
  subMessage = "",
  action,
  actionLabel,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 flex items-center justify-center bg-purple-50 rounded-full mb-4">
        <LuInbox className="text-3xl text-primary" />
      </div>
      <p className="text-gray-700 font-medium">{message}</p>
      {subMessage && <p className="text-gray-400 text-sm mt-1">{subMessage}</p>}
      {action && actionLabel && (
        <button onClick={action} className="mt-4 add-btn add-btn-fill">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
