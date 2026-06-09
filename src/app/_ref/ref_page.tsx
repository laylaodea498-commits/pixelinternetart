'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ReferralCapture() {
  const params = useParams();
  const router = useRouter();
  const { code } = params;

  useEffect(() => {
    if (code) {
      // Store referral code in localStorage
      localStorage.setItem('pixelwall_ref', code as string);
      console.log('Referral code captured:', code);
    }
    // Redirect to homepage
    router.push('/');
  }, [code, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-400 font-medium">Applying referral code...</p>
      </div>
    </div>
  );
}
