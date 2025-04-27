'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Navigation from './Navigation';

const Header = () => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl">🌿</span>
              <span className="ml-2 font-semibold text-lg">EcoCropShare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <Navigation />
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:block">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                    {session.user?.profileImage ? (
                      <img
                        src={session.user.profileImage}
                        alt={session.user.name}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <span>{session.user?.name?.charAt(0)}</span>
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{session.user?.name}</span>
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/auth' })}
                  className="text-sm text-gray-700 hover:text-primary"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link href="/auth" className="text-sm font-medium text-primary hover:text-primary-dark">
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <span className="block h-6 w-6 text-center">✕</span>
              ) : (
                <span className="block h-6 w-6 text-center">☰</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Navigation isMobile={true} closeMobileMenu={() => setMobileMenuOpen(false)} />
          </div>
          
          {session ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                  {session.user?.profileImage ? (
                    <img
                      src={session.user.profileImage}
                      alt={session.user.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <span>{session.user?.name?.charAt(0)}</span>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{session.user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{session.user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                >
                  Profil Saya
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/auth' });
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                >
                  Keluar
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-2">
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary"
                >
                  Masuk / Daftar
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;