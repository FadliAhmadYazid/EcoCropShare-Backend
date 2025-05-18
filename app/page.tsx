import { redirect } from 'next/navigation';

export default function Home() {
  // Always redirect to dashboard, regardless of authentication status
  redirect('/dashboard');
  
  // This won't be reached due to redirect
  return null;
}