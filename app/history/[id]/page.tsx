'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { HistoryType, PartialUserType } from '@/types';
import { formatDate } from '@/lib/utils';

interface HistoryDetailPageProps {
  params: {
    id: string;
  };
}

const HistoryDetailPage = ({ params }: HistoryDetailPageProps) => {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [history, setHistory] = useState<HistoryType | null>(null);
  const [giver, setGiver] = useState<PartialUserType | null>(null);
  const [receiver, setReceiver] = useState<PartialUserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Helper functions to safely get user properties
  const getUserName = (user: any): string => {
    if (!user) return 'Pengguna';
    if (typeof user === 'string') return 'Pengguna';
    if (typeof user === 'object') {
      return user.name || 'Pengguna';
    }
    return 'Pengguna';
  };
  
  const getUserLocation = (user: any): string => {
    if (!user) return '';
    if (typeof user === 'string') return '';
    if (typeof user === 'object') {
      return user.location || '';
    }
    return '';
  };
  
  const getUserProfileImage = (user: any): string => {
    if (!user) return '';
    if (typeof user === 'string') return '';
    if (typeof user === 'object') {
      return user.profileImage || '';
    }
    return '';
  };
  
  // Define functions to convert types
  const convertSessionUserToUserType = (sessionUser: any): PartialUserType => {
    return {
      _id: sessionUser.id, // Use id as _id
      id: sessionUser.id,
      name: sessionUser.name || '',
      email: sessionUser.email || '',
      location: sessionUser.location || '',
      favoritePlants: sessionUser.favoritePlants || [],
      profileImage: sessionUser.profileImage,
      createdAt: new Date() // Use current date as fallback
    };
  };
  
  useEffect(() => {
    const fetchHistoryDetail = async () => {
      if (status === 'authenticated') {
        try {
          setIsLoading(true);
          
          const response = await fetch(`/api/history/${id}`);
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch history detail');
          }
          
          setHistory(data.history);
          
          // Set giver and receiver - safely compare user IDs
          const userId = data.history.userId;
          const userIdString = typeof userId === 'object' && userId._id 
            ? userId._id.toString()
            : typeof userId === 'object' && userId.id
              ? userId.id.toString()
              : userId.toString();
              
          if (userIdString === session.user.id) {
            setGiver(convertSessionUserToUserType(session.user));
            setReceiver(data.history.partnerId);
          } else {
            setGiver(data.history.userId);
            setReceiver(convertSessionUserToUserType(session.user));
          }
          
        } catch (err: any) {
          setError(err.message || 'Failed to load history detail');
          console.error('Error fetching history detail:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    if (status !== 'loading' && id) {
      fetchHistoryDetail();
    }
  }, [id, status, session]);
  
  if (status === 'loading' || isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error || !history) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Data Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-6">
              Riwayat yang Anda cari tidak ditemukan atau telah dihapus.
            </p>
            <div className="flex justify-center">
              <Link href="/history">
                <Button>
                  Kembali ke Riwayat
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // Check if current user is the giver by comparing IDs safely
  const isUserGiver = session?.user?.id === (
    // If userId is an object with _id
    typeof history.userId === 'object' && history.userId._id 
      ? history.userId._id.toString()
      // If userId is an object with id
      : typeof history.userId === 'object' && history.userId.id
        ? history.userId.id.toString()
        // If userId is a string
        : history.userId.toString()
  );
                      
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/history" className="text-primary hover:text-primary-dark flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Riwayat
          </Link>
          <h1 className="text-2xl font-bold mt-2">
            Detail Pertukaran
          </h1>
        </div>
        
        <Card className="mb-6">
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center mb-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                history.type === 'post' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {history.type === 'post' ? 'Dari Posting' : 'Dari Permintaan'}
              </div>
              <div className="ml-auto text-sm text-gray-500">
                {formatDate(history.date)}
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-2">{history.plantName}</h2>
            
            <div className="text-gray-700">
              {isUserGiver ? (
                <p>
                  Anda telah berbagi tanaman ini dengan{' '}
                  <span className="font-medium">{getUserName(history.partnerId)}</span>
                </p>
              ) : (
                <p>
                  Anda telah menerima tanaman ini dari{' '}
                  <span className="font-medium">{getUserName(history.userId)}</span>
                </p>
              )}
            </div>
          </div>
          
          {/* Transaction Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Detail Transaksi</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Tanggal</div>
                <div>{formatDate(history.date, true)}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">ID Transaksi</div>
                <div className="font-mono text-sm">{history.id}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Tipe</div>
                <div>{history.type === 'post' ? 'Dari Posting' : 'Dari Permintaan'}</div>
              </div>
              
              {history.postId && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">ID Posting</div>
                  <div className="font-mono text-sm">{history.postId.toString()}</div>
                </div>
              )}
              
              {history.requestId && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">ID Permintaan</div>
                  <div className="font-mono text-sm">{history.requestId.toString()}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Exchange Visualization */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Pertukaran Antara</h3>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-center py-4">
              {/* Giver */}
              <div className="flex flex-col items-center mb-4 md:mb-0 md:mr-8">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-2">
                  {getUserProfileImage(history.userId) ? (
                    <img 
                      src={getUserProfileImage(history.userId)} 
                      alt={getUserName(history.userId)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl font-medium">
                      {getUserName(history.userId).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="font-medium text-center">{getUserName(history.userId)}</div>
                <div className="text-sm text-gray-600 text-center">{getUserLocation(history.userId)}</div>
                {isUserGiver && (
                  <div className="mt-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Anda
                  </div>
                )}
              </div>
              
              {/* Arrow */}
              <div className="flex flex-row md:flex-col items-center justify-center mb-4 md:mb-0">
                <div className="h-px md:h-auto md:w-px bg-gray-300 w-12 md:h-12"></div>
                <div className="mx-2 md:my-2 text-gray-400 transform md:rotate-90">→</div>
                <div className="h-px md:h-auto md:w-px bg-gray-300 w-12 md:h-12"></div>
              </div>
              
              {/* Receiver */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-2">
                  {getUserProfileImage(history.partnerId) ? (
                    <img 
                      src={getUserProfileImage(history.partnerId)} 
                      alt={getUserName(history.partnerId)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xl font-medium">
                      {getUserName(history.partnerId).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="font-medium text-center">{getUserName(history.partnerId)}</div>
                <div className="text-sm text-gray-600 text-center">{getUserLocation(history.partnerId)}</div>
                {!isUserGiver && (
                  <div className="mt-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Anda
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Notes */}
          {history.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Catatan</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700 whitespace-pre-line">{history.notes}</p>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 border-t pt-4">
            {/* View Original Post/Request */}
            {history.postId && (
              <Link href={`/posts/${history.postId}`}>
                <Button variant="outline">
                  Lihat Posting Asli
                </Button>
              </Link>
            )}
            
            {history.requestId && (
              <Link href={`/requests/${history.requestId}`}>
                <Button variant="outline">
                  Lihat Permintaan Asli
                </Button>
              </Link>
            )}
            
            {/* Message User - in a real app, this would link to messaging */}
            <Button
              onClick={() => {
                alert('Fitur pesan belum tersedia');
              }}
            >
              {isUserGiver ? 'Kirim Pesan ke Penerima' : 'Kirim Pesan ke Pemberi'}
            </Button>
          </div>
        </Card>
        
        {/* Related Posts Suggestion (this would be populated in a real app) */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Mungkin Anda Tertarik</h3>
          <p className="text-gray-600 mb-4">Tanaman serupa yang tersedia saat ini:</p>
          
          <div className="flex justify-center">
            <Link href="/posts">
              <Button>
                Jelajahi Semua Posting
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HistoryDetailPage;