'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import AuthRequired from '@/components/auth/AuthRequired';
import { PostType } from '@/types';

const PostsPage = () => {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'seed' | 'harvest'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'available' | 'completed'>('available');
  const [selectedExchangeType, setSelectedExchangeType] = useState<'all' | 'barter' | 'free'>('all');

  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        if (selectedStatus !== 'all') {
          params.append('status', selectedStatus);
        }

        const response = await fetch(`/api/posts?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch posts');
        }

        setPosts(data.posts || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load posts');
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [selectedStatus]);

  // Filter posts client-side for search and other filters
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || post.type === selectedType;

    const matchesExchangeType = selectedExchangeType === 'all' || post.exchangeType === selectedExchangeType;

    return matchesSearch && matchesType && matchesExchangeType;
  });

  // Sort posts by creation date (newest first)
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

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
          <h1 className="text-3xl font-bold mb-4">Temukan Bibit & Hasil Panen</h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Cari berdasarkan nama tanaman, lokasi..."
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
              <AuthRequired>
                <Link href="/posts/create">
                  <Button>
                    Tambah Post
                  </Button>
                </Link>
              </AuthRequired>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-shrink-0">
                <span className="font-medium text-gray-700">Jenis:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${selectedType === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedType('seed')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${selectedType === 'seed'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Bibit
                </button>
                <button
                  onClick={() => setSelectedType('harvest')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${selectedType === 'harvest'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Hasil Panen
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-shrink-0">
                <span className="font-medium text-gray-700">Status:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${selectedStatus === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedStatus('available')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${selectedStatus === 'available'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Tersedia
                </button>
                <button
                  onClick={() => setSelectedStatus('completed')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${selectedStatus === 'completed'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Selesai
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-shrink-0">
                <span className="font-medium text-gray-700">Tipe Penukaran:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedExchangeType('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${selectedExchangeType === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedExchangeType('barter')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${selectedExchangeType === 'barter'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Barter
                </button>
                <button
                  onClick={() => setSelectedExchangeType('free')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${selectedExchangeType === 'free'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Gratis
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Menampilkan <span className="font-medium text-gray-900">{sortedPosts.length}</span> hasil
            </div>
            <div>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                defaultValue="newest"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="az">A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="relative h-48 w-full mb-4">
                  <img
                    src={post.images?.[0] || 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1000'}
                    alt={post.title}
                    className="h-full w-full object-cover rounded-t-lg"
                  />

                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.type === 'seed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {post.type === 'seed' ? 'Bibit' : 'Hasil Panen'}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.status === 'available'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {post.status === 'available' ? 'Tersedia' : 'Selesai'}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.exchangeType === 'barter'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                      }`}>
                      {post.exchangeType === 'barter' ? 'Barter' : 'Gratis'}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2">
                    <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
                      {post.location}
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 pt-0 flex flex-col">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-semibold line-clamp-1">{post.title}</h3>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500">{post.comments?.length || 0}</span>
                      <svg className="h-4 w-4 text-gray-400 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm flex-1">{post.description}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">
                        {(post.userId as any)?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-xs text-gray-600 ml-2">
                        {(post.userId as any)?.name || 'User'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(post.createdAt)}
                    </div>
                  </div>

                  <Link href={`/posts/${post._id}`} className="mt-4">
                    <Button isFullWidth>
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Tidak ada postingan</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedType !== 'all' || selectedExchangeType !== 'all'
                ? 'Tidak ada hasil yang cocok dengan pencarian Anda.'
                : 'Belum ada bibit atau hasil panen yang dibagikan.'}
            </p>
            <Link href="/posts/create">
              <Button>
                Tambah Post Baru
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default PostsPage;