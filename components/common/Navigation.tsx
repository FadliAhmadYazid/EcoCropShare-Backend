'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface NavigationProps {
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false, closeMobileMenu }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAuthenticated = !!session;

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { name: 'Bibit & Hasil Panen', path: '/posts', requiresAuth: true },
    { name: 'Permintaan', path: '/requests', requiresAuth: true },
    { name: 'Artikel Edukasi', path: '/articles', requiresAuth: true },
    { name: 'Riwayat Tukar', path: '/history', requiresAuth: true },
  ];

  const handleClick = () => {
    if (isMobile && closeMobileMenu) {
      closeMobileMenu();
    }
  };

  // Link classes
  const linkClasses = isMobile ? 
    "block px-3 py-2 rounded-md text-base font-medium" : 
    "px-3 py-2 rounded-md text-sm font-medium";
  
  const activeLinkClasses = "bg-primary bg-opacity-10 text-primary";
  const inactiveLinkClasses = "text-gray-700 hover:bg-gray-100 hover:text-primary";

  return (
    <nav className={isMobile ? "space-y-1" : "flex space-x-4"}>
      {navigationItems.map((item) => (
        (item.requiresAuth && isAuthenticated) || !item.requiresAuth ? (
          <Link
            key={item.path}
            href={item.path}
            onClick={handleClick}
            className={`
              ${linkClasses}
              ${pathname === item.path ? activeLinkClasses : inactiveLinkClasses}
            `}
          >
            {item.name}
          </Link>
        ) : null
      ))}
    </nav>
  );
};

export default Navigation;