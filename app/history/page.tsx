'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { HistoryType } from '@/types';
import { formatDate, getRelativeTime, compareIds } from '@/lib/utils';

const HistoryPage = () => {
  const { data: session, status } = useSession();
  const [filterType, setFilterType] = useState<'all' | 'post' | 'request'>('all');
  const [filterRole, setFilterRole] = useState<'all' | 'giver' | 'receiver'>('all');

  const [historyItems, setHistoryItems] = useState<HistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (status === 'authenticated') {
        try {
          setIsLoading(true);

          // Build query parameters
          const params = new URLSearchParams();
          if (filterType !== 'all') {
            params.append('type', filterType);
          }
          if (filterRole !== 'all') {
            params.append('role', filterRole);
          }

          const response = await fetch(`/api/history?${params.toString()}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch history');
          }

          setHistoryItems(data.history || []);
        } catch (err: any) {
          setError(err.message || 'Failed to load history');
          console.error('Error fetching history:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchHistoryData();
  }, [status, filterType, filterRole]);

  // Sort and group history items by month/year
  const sortedHistory = [...historyItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const groupedHistory: Record<string, HistoryType[]> = {};

  sortedHistory.forEach((item) => {
    const date = new Date(item.date);
    const monthYear = date.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });

    if (!groupedHistory[monthYear]) {
      groupedHistory[monthYear] = [];
    }

    groupedHistory[monthYear].push(item);
  });

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

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header with gradient background */}
        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl p-6 mb-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-20 -mr-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -mb-16 -ml-16"></div>
          
          <div className="relative">
            <div className="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-2xl font-bold">Riwayat Tukar</h1>
            </div>
            
            <p className="text-cyan-100 max-w-2xl">
              Catatan kronologis semua pertukaran bibit dan panen yang telah Anda selesaikan.
              Lihat pertukaran masa lalu untuk meninjau pengalaman berbagi dan menerima dari komunitas.
            </p>
            
            <div className="flex flex-wrap gap-2 mt-5">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>{historyItems.filter(h => compareIds(h.userId, session?.user?.id)).length} Dibagikan</span>
              </div>
              
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{historyItems.filter(h => compareIds(h.partnerId, session?.user?.id)).length} Diterima</span>
              </div>
              
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{historyItems.length} Total Transaksi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                    filterType === 'all'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterType('post')}
                  className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors flex items-center ${
                    filterType === 'post'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full mr-1.5 bg-green-500"></div>
                  Dari Posting
                </button>
                <button
                  onClick={() => setFilterType('request')}
                  className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors flex items-center ${
                    filterType === 'request'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full mr-1.5 bg-blue-500"></div>
                  Dari Permintaan
                </button>
              </div>
            </div>
            
            {/* Role Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Peran Anda</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterRole('all')}
                  className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                    filterRole === 'all'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterRole('giver')}
                  className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                    filterRole === 'giver'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pemberi
                </button>
                <button
                  onClick={() => setFilterRole('receiver')}
                  className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                    filterRole === 'receiver'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Penerima
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* History Content */}
        {sortedHistory.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedHistory).map(([monthYear, historyItems]) => (
              <div key={monthYear} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-start">
                    <span className="bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 rounded-full">
                      {monthYear}
                    </span>
                  </div>
                </div>
                
                {historyItems.map((history) => (
                  <Card 
                    key={history.id} 
                    className={`border-l-4 transition-all hover:shadow-md ${
                      history.type === 'post' 
                        ? 'border-l-green-500 hover:border-l-green-600' 
                        : 'border-l-blue-500 hover:border-l-blue-600'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Left: Exchange Direction Visualization */}
                      <div className="flex-shrink-0 hidden md:block">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {(history.userId === session?.user?.id ?
                              session?.user?.profileImage :
                              (history.userId as any)?.profileImage) ? (
                              <img
                                src={history.userId === session?.user?.id ?
                                  session?.user?.profileImage :
                                  (history.userId as any)?.profileImage
                                }
                                alt={history.userId === session?.user?.id ?
                                  "You" :
                                  (history.userId as any)?.name || "User"
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-600 font-semibold">
                                {history.userId === session?.user?.id ?
                                  session?.user?.name?.charAt(0).toUpperCase() :
                                  (history.userId as any)?.name?.charAt(0).toUpperCase() || "U"
                                }
                              </span>
                            )}
                          </div>
                          
                          <div className="w-12 h-0.5 bg-gray-300 mx-2 relative">
                            <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${
                                history.type === 'post' ? 'text-green-500' : 'text-blue-500'
                              }`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {(history.partnerId === session?.user?.id ?
                              session?.user?.profileImage :
                              (history.partnerId as any)?.profileImage) ? (
                              <img
                                src={history.partnerId === session?.user?.id ?
                                  session?.user?.profileImage :
                                  (history.partnerId as any)?.profileImage
                                }
                                alt={history.partnerId === session?.user?.id ?
                                  "You" :
                                  (history.partnerId as any)?.name || "User"
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-600 font-semibold">
                                {history.partnerId === session?.user?.id ?
                                  session?.user?.name?.charAt(0).toUpperCase() :
                                  (history.partnerId as any)?.name?.charAt(0).toUpperCase() || "U"
                                }
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Middle: Transaction Details */}
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            history.type === 'post'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {history.type === 'post' ? 'Dari Posting' : 'Dari Permintaan'}
                          </span>
                          <span className="text-gray-400 text-xs ml-3">{getRelativeTime(history.date)}</span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{history.plantName}</h3>
                        
                        <div className="text-sm">
                          {history.userId === session?.user?.id ? (
                            <p className="text-gray-600 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                              Anda berbagi dengan <span className="font-medium text-amber-700">
                                {(history.partnerId as any)?.name || 'Pengguna'}
                              </span>
                            </p>
                          ) : (
                            <p className="text-gray-600 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                              </svg>
                              Anda menerima dari <span className="font-medium text-indigo-700">
                                {(history.userId as any)?.name || 'Pengguna'}
                              </span>
                            </p>
                          )}
                          
                          {history.notes && (
                            <div className="mt-2 bg-gray-50 p-2 rounded-md">
                              <p className="text-gray-700 flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <span className="italic">{history.notes}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Right: Action & Date */}
                      <div className="flex-shrink-0 flex flex-col items-end space-y-2">
                        <div className="text-sm text-gray-500">
                          {formatDate(history.date)}
                        </div>
                        
                        <Link href={`/history/${history.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-teal-700 border-teal-300 hover:bg-teal-50"
                          >
                            Lihat Detail
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-cyan-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-sm mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-cyan-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Riwayat</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filterType !== 'all' || filterRole !== 'all'
                ? 'Tidak ada hasil yang cocok dengan filter yang dipilih. Coba ubah kriteria filter Anda.'
                : 'Anda belum memiliki catatan pertukaran bibit atau hasil panen. Riwayat akan muncul setelah Anda melakukan pertukaran.'}
            </p>
            
            <div className="flex justify-center mt-6 flex-wrap gap-4">
              {filterType !== 'all' || filterRole !== 'all' ? (
                <Button 
                  onClick={() => { setFilterType('all'); setFilterRole('all'); }}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Reset Filter
                </Button>
              ) : (
                <>
                  <Link href="/posts">
                    <Button
                      className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-md"
                    >
                      Jelajahi Posting
                    </Button>
                  </Link>
                  
                  <Link href="/posts/create">
                    <Button
                      variant="outline"
                      className="border-cyan-600 text-cyan-700 hover:bg-cyan-50"
                    >
                      Buat Posting
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default HistoryPage;