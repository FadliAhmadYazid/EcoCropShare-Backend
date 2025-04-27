import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // Redirect authenticated users to dashboard, unauthenticated to auth page
  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/auth');
  }
  
  // This won't be reached due to redirects
  return null;
}