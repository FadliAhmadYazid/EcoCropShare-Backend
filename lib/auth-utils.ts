import { redirect } from 'next/navigation';
import { Session } from 'next-auth';

/**
 * Redirects to the authentication page if the user is not authenticated
 * @param session The user's session
 */
export const requireAuth = (session: Session | null) => {
  if (!session) {
    redirect('/auth');
  }
};

/**
 * Checks if the user is authenticated
 * @param session The user's session
 * @returns True if authenticated, false otherwise
 */
export const isAuthenticated = (session: Session | null): boolean => {
  return !!session;
};