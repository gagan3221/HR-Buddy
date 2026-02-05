import React, { useState } from 'react';
import { CheckCircle, Calendar, Ticket, ExternalLink, Video } from 'lucide-react';

interface ActionCardProps {
  action: {
    type: string;
    action: string;
    data: any;
  };
  onConfirm: (data?: any) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ action, onConfirm }) => {
  // --- 1. LEAVE APPLICATION CARD ---
  if (action.action === 'APPLY_LEAVE') {
    const [formData, setFormData] = useState({
      startDate: action.data.startDate || '',
      endDate: action.data.endDate || '',
      reason: action.data.reason || ''
    });

    return (
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm max-w-sm">
        <div className="flex items-center gap-2 mb-3 text-emerald-600 font-semibold">
          <CheckCircle size={20} />
          <span>Leave Request Ready</span>
        </div>
        
        <div className="space-y-3 text-sm text-gray-700">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Start Date</label>
            <input 
              type="date"
              value={formData.startDate} 
              onChange={e => setFormData({...formData, startDate: e.target.value})}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          
           <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">End Date</label>
            <input 
              type="date"
              value={formData.endDate} 
              onChange={e => setFormData({...formData, endDate: e.target.value})}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
             <label className="text-xs font-medium text-gray-500">Reason</label>
             <input 
               type="text" 
               value={formData.reason}
               onChange={e => setFormData({...formData, reason: e.target.value})}
               className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-emerald-500"
             />
          </div>
        </div>

        <button 
          onClick={() => onConfirm({ ...action.data, ...formData, action: 'APPLY_LEAVE' })}
          className="mt-4 w-full py-2 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 transition"
        >
          Confirm & Apply
        </button>
      </div>
    );
  }

  // --- 2. SUPPORT TICKET CARD ---
  if (action.action === 'CREATE_TICKET') {
    const [ticketData, setTicketData] = useState({
        summary: action.data.summary || '',
        priority: action.data.priority || 'Medium'
    });

    return (
      <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg shadow-sm max-w-sm">
        <div className="flex items-center gap-2 mb-3 text-orange-600 font-semibold">
          <Ticket size={20} />
          <span>Create Support Ticket</span>
        </div>
        
        <div className="space-y-3 text-sm text-gray-700 mb-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Subject / Issue</label>
            <input 
                type="text"
                value={ticketData.summary}
                onChange={e => setTicketData({...ticketData, summary: e.target.value})}
                className="w-full p-2 border border-orange-200 rounded text-sm focus:outline-none focus:border-orange-500 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Priority</label>
            <select
                value={ticketData.priority}
                onChange={e => setTicketData({...ticketData, priority: e.target.value})}
                className="w-full p-2 border border-orange-200 rounded text-sm focus:outline-none focus:border-orange-500 bg-white"
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => onConfirm({ ...action.data, ...ticketData, action: 'CREATE_TICKET' })}
          className="w-full py-2 bg-orange-600 text-white font-medium rounded hover:bg-orange-700 transition"
        >
          Submit Ticket
        </button>
      </div>
    );
  }

  // --- 3. MEETING SCHEDULER CARD (Internal) ---
  if (action.action === 'SCHEDULE_MEETING') {
    const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);

    // Mock Next 3 Days
    const slots = [
      { day: 'Mon', date: '12', times: ['10:00', '14:00'] },
      { day: 'Tue', date: '13', times: ['11:30', '16:00'] },
      { day: 'Wed', date: '14', times: ['09:00', '15:00'] },
    ];

    return (
      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg shadow-sm max-w-sm">
        <div className="flex items-center gap-2 mb-3 text-purple-600 font-semibold">
          <Video size={20} />
          <span>Book HR Session</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
            Select a slot for: <b>{action.data.topic || 'General Discussion'}</b>
        </p>

        {/* Minimal Calendar Grid */}
        <div className="flex justify-between gap-2 mb-4">
            {slots.map((slot, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs font-bold text-gray-500 uppercase">{slot.day}</div>
                    <div className="text-sm font-bold text-gray-800">{slot.date}</div>
                    <div className="flex flex-col gap-1 w-full">
                        {slot.times.map(time => (
                            <button
                                key={time}
                                onClick={() => setSelectedSlot(`${slot.day} ${slot.date} @ ${time}`)}
                                className={`text-xs py-1 rounded border transition ${
                                    selectedSlot === `${slot.day} ${slot.date} @ ${time}`
                                    ? 'bg-purple-600 text-white border-purple-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                                }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        <button 
          onClick={() => {
              if(selectedSlot) onConfirm({ ...action.data, slot: selectedSlot, action: 'SCHEDULE_MEETING' });
          }} 
          disabled={!selectedSlot}
          className="w-full py-2 bg-purple-600 text-white font-medium rounded hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selectedSlot ? `Confirm: ${selectedSlot}` : 'Select a Slot'}
        </button>
      </div>
    );
  }

  return null;
};
