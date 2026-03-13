interface BadgeProps {
  label: string;
  color?: string;
  className?: string;
}

export function Badge({ label, color, className = '' }: BadgeProps) {
  const colorClass = color ?? 'bg-gray-100 text-gray-800 border border-gray-300';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass} ${className}`}
    >
      {label}
    </span>
  );
}
