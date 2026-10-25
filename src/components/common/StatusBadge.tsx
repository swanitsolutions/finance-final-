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
    case 'active':
      bg = 'bg-[#E6F4EE]';
      text = 'text-[#218568]';
      dot = 'bg-[#218568]';
      label =
        norm === 'paid'
          ? 'Paid'
          : norm === 'completed'
          ? 'Completed'
          : norm === 'approved'
          ? 'Approved'
          : 'Active';
      break;

    case 'pending':
      bg = 'bg-[#FFF4D9]';
      text = 'text-[#C28A20]';
      dot = 'bg-[#C28A20]';
      label = 'Pending';
      break;

    case 'overdue':
    case 'rejected':
    case 'failed':
      bg = 'bg-[#FCEBED]';
      text = 'text-[#C9414D]';
      dot = 'bg-[#C9414D]';
      label = norm === 'overdue' ? 'Overdue' : norm === 'rejected' ? 'Rejected' : 'Failed';
      break;

    default:
      bg = 'bg-[#E9F2FA]';
      text = 'text-[#2879B9]';
      dot = 'bg-[#2879B9]';
      label = status;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${bg} ${text} ${sizeClasses} select-none border border-transparent`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{label}</span>
    </span>
  );
};
