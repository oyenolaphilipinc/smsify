import Link from 'next/link';
import { Mail, Smartphone, Shield, User, CreditCard, ThumbsUp, BookOpen, Network, MessageSquare, HelpCircle, LogOut } from 'lucide-react';

const navigation = [
  { name: 'Receive SMS', icon: Mail, href: '/dashboard' },
  { name: 'Rent', icon: Smartphone, href: '/rent' },
  { name: 'Proxy', icon: Shield, href: '/proxy' },
  { name: 'Profile', icon: User, href: '/profile' },
  { name: 'Top up your balance', icon: CreditCard, href: '/top-up' },
  { name: 'Earn money on SMS', icon: ThumbsUp, href: '/earn' },
  { name: 'Instructions', icon: BookOpen, href: '/instructions' },
  { name: 'API connection', icon: Network, href: '/api' },
  { name: 'Feedback', icon: MessageSquare, href: '/feedback' },
];

export function Sidebar() {
  return (
    <div className="inset-y-0 left-0 z-50 w-12 bg-[#e3f0ff] lg:w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center px-4 lg:justify-start">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-500 lg:inline hidden md:flex">SMSIFY</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center justify-center rounded-lg px-2 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 lg:justify-start lg:px-3"
            >
              <item.icon className="h-6 w-6 text-[#088aff] lg:mr-3 lg:h-5 lg:w-5" />
              <span className="hidden lg:inline">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <Link
            href="/help"
            className="group flex items-center justify-center rounded-lg px-2 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 lg:justify-start lg:px-3"
          >
            <HelpCircle className="h-6 w-6 lg:mr-3 lg:h-5 lg:w-5" />
            <span className="hidden lg:inline">Help</span>
          </Link>
          <button className="group flex w-full items-center justify-center rounded-lg px-2 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 lg:justify-start lg:px-3">
            <LogOut className="h-6 w-6 lg:mr-3 lg:h-5 lg:w-5" />
            <span className="hidden lg:inline">Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

