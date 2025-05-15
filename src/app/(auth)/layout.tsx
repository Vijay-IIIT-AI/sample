'use client';

import { motion } from 'framer-motion';
import { Logo } from '@/components/icons/logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <div className="mb-8">
              <Logo className="h-8 text-primary" />
            </div>
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
