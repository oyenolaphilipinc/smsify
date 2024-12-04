import { Send, ChevronDown, User, LogOut } from 'lucide-react'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex flex-1 items-center justify-center gap-4 md:justify-start md:px-4">
        <div className="relative flex w-full max-w-lg items-center overflow-hidden rounded-lg border shadow-sm md:w-auto md:min-w-[400px]">
          <div className="hidden md:flex h-full items-center gap-2 border-r px-3 py-2">
            <Send className="h-5 w-5 text-blue-500" />
            <div className="flex flex-col">
              <div className="font-medium">Connect Telegram Bot</div>
              <div className="text-xs text-muted-foreground">Activate SMS without leaving the messenger!</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg border px-2 md:px-3 py-2">
          <span className="text-sm text-muted-foreground">Balance:</span>
          <span className="font-medium">0 ₦</span>
        </div>
        <Button className="bg-yellow-400 font-medium text-black hover:bg-yellow-500">Top up</Button>
        <Select>
          <SelectTrigger className="w-[44px] border-none p-0">
            <Avatar className="h-8 w-8">
              <AvatarFallback className='bg-blue-300'>U</AvatarFallback>
            </Avatar>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="profile">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </div>
            </SelectItem>
            <SelectItem value="logout">
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  )
}

