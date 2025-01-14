'use client'

import { useState, useEffect } from 'react'
import { getAuth, signOut } from "firebase/auth";
import Link from 'next/link'
import { Mail, Smartphone, Shield, User, CreditCard, ThumbsUp, BookOpen, Network, MessageSquare, HelpCircle, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', icon: Mail, href: '/dashboard' },
  { name: 'Receive Number', icon: Smartphone, href: '/numbers' },
  { name: 'Receive SMS', icon: Shield, href: '/sms' },
  { name: 'Profile', icon: User, href: '/profile' },
  { name: 'Top up your balance', icon: CreditCard, href: '/top-up' },
  { name: 'Earn money on SMS', icon: ThumbsUp, href: '/earn' },
  { name: 'Instructions', icon: BookOpen, href: '/instructions' },
  { name: 'Feedback', icon: MessageSquare, href: '/feedback' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      router.push("/login"); // Redirect to the home page or login page
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsOpen(true)
      }
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className={`fixed bg-white top-1 z-50 transition-all duration-300 ${
            isOpen ? 'left-[200px]' : 'left-2'
          }`}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[20%] min-w-[250px] bg-[#e3f0ff] transform transition-transform duration-300 ease-in-out ${
          isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-500">SMSIFY</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => isMobile && setIsOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5 text-[#088aff]" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="border-t p-4">
            <Link
              href="/help"
              className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => isMobile && setIsOpen(false)}
            >
              <HelpCircle className="mr-3 h-5 w-5 text-[#088aff]" />
              <span>Help</span>
            </Link>
            <button onClick={handleLogout} className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600">
              <LogOut className="mr-3 h-5 w-5 text-[#088aff]" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  )
}

