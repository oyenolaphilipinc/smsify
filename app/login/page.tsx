'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Successfully signed in',
        description: 'Redirecting to Dashboard',
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: `${error}`,
        description: 'There was a problem with your request',
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Image Section - Hidden on mobile, full width of its section on desktop */}
        <div className="hidden md:block md:w-1/2 bg-gray-100">
          <div className="relative h-full">
            <Image
              src="/sms-web-form.svg?height=1080&width=1080"
              alt="Login background"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        </div>

        {/* Form Section - Full width on mobile, half width on desktop */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-white">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Welcome back
                </CardTitle>
                <CardDescription>
                  Please sign in to your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}