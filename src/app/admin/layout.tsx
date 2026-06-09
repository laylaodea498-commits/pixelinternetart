'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Mock authentication check
    // In a real application, this would verify the user's role from a session or Supabase auth
    const checkAdmin = async () => {
      // Simulate a small delay for the check
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For mock purposes, we'll assume the user is an admin
      // You could change this to false to test the redirect
      const userIsAdmin = true; 
      
      setIsAdmin(userIsAdmin);
      
      if (!userIsAdmin) {
        router.push('/');
      }
    };

    checkAdmin();
  }, [router]);

  if (isAdmin === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400 font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
