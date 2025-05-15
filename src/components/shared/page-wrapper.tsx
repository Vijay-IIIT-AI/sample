import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ title, description, actions, children, className }: PageWrapperProps) {
  return (
    <div className={cn("flex flex-col flex-1 p-4 md:p-6 lg:p-8 space-y-6", className)}>
      {(title || description || actions) && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            {title && <h1 className="text-2xl font-semibold md:text-3xl text-foreground">{title}</h1>}
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
          {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}
