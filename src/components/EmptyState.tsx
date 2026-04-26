import { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-24 h-24 rounded-full bg-accent-emerald-light flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="font-display font-bold text-2xl text-text-primary">{title}</h3>
      {description && (
        <p className="font-body text-[15px] text-text-secondary max-w-sm mt-2">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
