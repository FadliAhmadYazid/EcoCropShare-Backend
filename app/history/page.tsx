'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { HistoryType } from '@/types';
import { formatDate, getRelativeTime } from '@/lib/utils';

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
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Riwayat Tukar</h1>
            <p className="text-gray-600">
              Catatan kronologis semua pertukaran bibit dan panen yang telah Anda selesaikan.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">Dibagikan</span>
              <span className="block text-xl font-bold text-green-700">
                {historyItems.filter(h => h.userId === session?.user?.id).length}
              </span>
            </div>

            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">Diterima</span>
              <span className="block text-xl font-bold text-blue-700">
                {historyItems.filter(h => h.partnerId === session?.user?.id).length}
              </span>
            </div>

            <div className="bg-gray-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">Total Transaksi</span>
              <span className="block text-xl font-bold text-gray-700">
                {historyItems.length}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${filterType === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterType('post')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${filterType === 'post'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  Dari Posting
                </button>
                <button
                  onClick={() => setFilterType('request')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${filterType === 'request'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  Dari Permintaan
                </button>
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Peran Anda</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterRole('all')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${filterRole === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterRole('giver')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${filterRole === 'giver'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  Pemberi
                </button>
                <button
                  onClick={() => setFilterRole('receiver')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${filterRole === 'receiver'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  Penerima
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* History Content */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {sortedHistory.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedHistory).map(([monthYear, historyItems]) => (
              <div key={monthYear}>
                <div className="flex items-center mb-4">
                  <span className="text-lg font-medium text-gray-800">
                    {monthYear}
                  </span>
                  <div className="ml-3 flex-grow border-t border-gray-200"></div>
                </div>

                <div className="space-y-4">
                  {historyItems.map((history) => (
                    <Card key={history.id} className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center">
                        {/* Exchange Direction Visualization */}
                        <div className="mb-4 md:mb-0 md:mr-6">
                          <div className="flex items-center">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-700">
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
                                <span>
                                  {history.userId === session?.user?.id ?
                                    session?.user?.name?.charAt(0).toUpperCase() :
                                    (history.userId as any)?.name?.charAt(0).toUpperCase() || "U"
                                  }
                                </span>
                              )}
                            </div>

                            <div className="mx-2 text-gray-500">→</div>

                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-700">
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
                                <span>
                                  {history.partnerId === session?.user?.id ?
                                    session?.user?.name?.charAt(0).toUpperCase() :
                                    (history.partnerId as any)?.name?.charAt(0).toUpperCase() || "U"
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="flex-1 mb-4 md:mb-0">
                          <div className="flex items-center mb-1">
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2">
                              {history.type === 'post' ? 'Dari Posting' : 'Dari Permintaan'}
                            </span>
                            <span className="text-sm text-gray-500">{getRelativeTime(history.date)}</span>
                          </div>

                          <h3 className="text-lg font-medium mb-1">{history.plantName}</h3>

                          <div className="text-gray-700">
                            {history.userId === session?.user?.id ? (
                              <p>
                                Anda berbagi dengan <span className="font-medium">
                                  {(history.partnerId as any)?.name || 'Pengguna'}
                                </span>
                              </p>
                            ) : (
                              <p>
                                Anda menerima dari <span className="font-medium">
                                  {(history.userId as any)?.name || 'Pengguna'}
                                </span>
                              </p>
                            )}

                            {history.notes && (
                              <div className="mt-2 bg-gray-50 p-2 rounded-md">
                                <p className="text-sm text-gray-600">
                                  <span className="italic">{history.notes}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Date and Action */}
                        <div className="flex flex-col items-end">
                          <div className="text-sm text-gray-500 mb-2">
                            {formatDate(history.date)}
                          </div>
                          <Link href={`/history/${history.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              Lihat Detail
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Belum Ada Riwayat</h3>
            <p className="text-gray-600 mb-6">
              {filterType !== 'all' || filterRole !== 'all'
                ? 'Tidak ada hasil yang cocok dengan filter yang dipilih. Coba ubah kriteria filter Anda.'
                : 'Anda belum memiliki catatan pertukaran bibit atau hasil panen. Riwayat akan muncul setelah Anda melakukan pertukaran.'}
            </p>

            <div className="flex justify-center flex-wrap gap-4">
              {filterType !== 'all' || filterRole !== 'all' ? (
                <Button
                  onClick={() => { setFilterType('all'); setFilterRole('all'); }}
                >
                  Reset Filter
                </Button>
              ) : (
                <>
                  <Link href="/posts">
                    <Button>
                      Jelajahi Posting
                    </Button>
                  </Link>

                  <Link href="/posts/create">
                    <Button variant="outline">
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