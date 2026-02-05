import React from 'react';
import { CheckCircle, Calendar } from 'lucide-react';


interface ActionCardProps {
  action: {
    type: string;
    action: string;
    data: {
      startDate: string;
      endDate: string;
      reason: string;
    };
  };
  onConfirm: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ action, onConfirm }) => {
  if (action.action !== 'APPLY_LEAVE') return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm max-w-sm">
      <div className="flex items-center gap-2 mb-3 text-emerald-600 font-semibold">
        <CheckCircle size={20} />
        <span>Leave Request Ready</span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium text-gray-500">Dates:</span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {action.data.startDate} to {action.data.endDate}
          </span>
        </div>
        <div className="flex justify-between">
            <span className="font-medium text-gray-500">Reason:</span>
            <span>{action.data.reason}</span>
        </div>
      </div>

      <button 
        onClick={onConfirm}
        className="mt-4 w-full py-2 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 transition"
      >
        Confirm & Apply
      </button>
    </div>
  );
};

