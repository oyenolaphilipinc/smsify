import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import ProtectedLayout from '@/components/ProtectedLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SMSify - Dashboard',
  description:
    'Enterprise-grade SMS platform for businesses. Send bulk messages, automate communications, and engage customers effectively.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>
    {children}
    <Toaster />
    </ProtectedLayout>;
}
