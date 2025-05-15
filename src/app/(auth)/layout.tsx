import type { ReactNode } from 'react';
import { Logo } from '@/components/icons/logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Logo className="h-8 text-primary" />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
