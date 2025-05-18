'use client';

import React, { useState, useEffect } from 'react';
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
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread messages count
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUnreadCount = async () => {
        try {
          const response = await fetch('/api/messages/unread-count');
          const data = await response.json();
          
          if (response.ok && data.success) {
            setUnreadCount(data.count);
          }
        } catch (error) {
          console.error('Failed to fetch unread messages count:', error);
        }
      };

      fetchUnreadCount();

      // Set up polling to check for new messages every 30 seconds
      const intervalId = setInterval(fetchUnreadCount, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

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
    <nav className={isMobile ? "space-y-1" : "flex items-center space-x-4"}>
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

      {/* Messages Icon with Notification Badge */}
      {isAuthenticated && (
        <Link
          href="/messages"
          onClick={handleClick}
          className={`
            ${isMobile ? "block px-3 py-2 rounded-md text-base font-medium" : ""}
            ${pathname === '/messages' ? "text-primary" : "text-gray-700 hover:text-primary"}
            relative
          `}
          aria-label="Messages"
        >
          {isMobile ? (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <span>Pesan</span>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center ml-2 px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </Link>
      )}
    </nav>
  );
};

export default Navigation;