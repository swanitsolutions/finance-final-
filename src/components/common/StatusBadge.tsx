import React from 'react';

export type StatusVariant =
  | 'paid'
  | 'pending'
  | 'overdue'
  | 'active'
  | 'completed'
  | 'rejected'
  | 'approved'
  | 'failed';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = status.toLowerCase();

  let bg = 'bg-gray-100';
  let text = 'text-gray-700';
  let dot = 'bg-gray-400';
  let label = status;

  switch (norm) {
    case 'paid':
    case 'completed':
    case 'approved':
      bg = 'bg-[#E7F7F0]';
      text = 'text-[#159A78]';
      dot = 'bg-[#159A78]';
      label = norm === 'paid' ? 'Paid' : norm === 'completed' ? 'Completed' : 'Approved';
      break;

    case 'active':
      bg = 'bg-[#E7F7F0]';
      text = 'text-[#159A78]';
      dot = 'bg-[#159A78]';
      label = 'Active';
      break;

    case 'pending':
      bg = 'bg-[#FFF5DF]';
      text = 'text-[#E7A23B]';
      dot = 'bg-[#E7A23B]';
      label = 'Pending';
      break;

    case 'overdue':
    case 'rejected':
    case 'failed':
      bg = 'bg-[#FFF0F1]';
      text = 'text-[#DC5263]';
      dot = 'bg-[#DC5263]';
      label = norm === 'overdue' ? 'Overdue' : norm === 'rejected' ? 'Rejected' : 'Failed';
      break;

    default:
      label = status;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${bg} ${text} ${sizeClasses} select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{label}</span>
    </span>
  );
};
