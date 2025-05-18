import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Button from '@/components/common/Button';

interface AuthRequiredProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  message?: string;
}

/**
 * A component wrapper that conditionally renders its children based on authentication status
 * For authenticated users: renders the children
 * For unauthenticated users: renders the fallback message/content with a login button
 */
const AuthRequired: React.FC<AuthRequiredProps> = ({ 
  children, 
  fallback,
  message = "Anda perlu login untuk melakukan tindakan ini."
}) => {
  const { data: session } = useSession();

  if (session) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 my-4 text-center">
      <p className="text-gray-700 mb-3">{message}</p>
      <Link href="/auth">
        <Button>
          Masuk / Daftar
        </Button>
      </Link>
    </div>
  );
};

export default AuthRequired;