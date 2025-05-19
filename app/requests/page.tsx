'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import AuthRequired from '@/components/auth/AuthRequired';
import { RequestType } from '@/types';
import { formatDate } from '@/lib/utils';

const RequestsPage = () => {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'open' | 'fulfilled'>('open');

  const [requests, setRequests] = useState<RequestType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        if (selectedStatus !== 'all') {
          params.append('status', selectedStatus);
        }

        const response = await fetch(`/api/requests?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch requests');
        }

        setRequests(data.requests || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load requests');
        console.error('Error fetching requests:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [selectedStatus]);


  // Filter requests client-side for search
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      (request.plantName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (request.reason?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (request.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Sort requests by creation date (newest first)
  const sortedRequests = [...filteredRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h2 className="text-2xl font-bold mb-2">Temukan Permintaan</h2>
                <p className="text-gray-600">
                  Lihat permintaan dari pengguna lain atau buat permintaan baru untuk tanaman yang Anda cari.
                </p>
              </div>

              <div>
                <AuthRequired>
                  <Link href="/requests/create">
                    <Button variant="primary">
                      Buat Permintaan
                    </Button>
                  </Link>
                </AuthRequired>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  type="search"
                  placeholder="Cari permintaan tanaman..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  }
                />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="whitespace-nowrap">Status:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedStatus('all')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedStatus === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setSelectedStatus('open')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center ${selectedStatus === 'open'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                      Aktif
                    </button>
                    <button
                      onClick={() => setSelectedStatus('fulfilled')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center ${selectedStatus === 'fulfilled'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-1.5"></div>
                      Terpenuhi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              Menampilkan <span className="font-medium text-gray-900">{sortedRequests.length}</span> permintaan
            </div>

            <div className="text-sm text-gray-600">
              Diurutkan dari terbaru
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {sortedRequests.length > 0 ? (
          <div className="space-y-4">
            {sortedRequests.map((request) => (
              <div
                key={String(request.id || request._id)}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {request.plantName}
                      </h3>
                      <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full inline-block">
                        {request.location}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {request.status === 'open' ? 'Aktif' : 'Terpenuhi'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700">{request.reason}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center mb-3 sm:mb-0">
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-2">
                        {(request.userId as any)?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{(request.userId as any)?.name || 'Pengguna'}</span>
                        <span className="text-xs text-gray-500">{formatDate(request.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end">
                      <div className="text-sm text-gray-500 mr-4">
                        {request.comments?.length || 0} komentar
                      </div>

                      <Link href={`/requests/${request._id || request.id}`}>
                        <Button variant="outline" size="sm">
                          Lihat Detail
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Tidak ada permintaan</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Tidak ada hasil yang cocok dengan pencarian Anda. Coba ubah filter atau kata kunci pencarian.'
                : 'Belum ada permintaan bibit atau hasil panen. Jadilah yang pertama membuat permintaan!'}
            </p>
            <Link href="/requests/create">
              <Button>
                Buat Permintaan Baru
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default RequestsPage;