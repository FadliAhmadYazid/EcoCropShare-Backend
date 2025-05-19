'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import AuthRequired from '@/components/auth/AuthRequired';
import { PostType, RequestType, ArticleType } from '@/types';
import { formatDate } from '@/lib/utils';

// Image URLs for the slider
const sliderImages = [
  'https://media.istockphoto.com/id/2152987531/photo/urban-farming.webp?a=1&b=1&s=612x612&w=0&k=20&c=jYjoPEfYDxzMHU7nSmnANO-zlSObLZfu6aUoC8yQrf0=',
  'https://media.istockphoto.com/id/2184469012/id/foto/kaca-globe-di-hutan-hijau-dengan-sinar-matahari-konsep-lingkungan-konsep-netral-karbon-target.jpg?s=612x612&w=0&k=20&c=BCVKybxgShntPQZKvdS0AOL6qc7UI2jL6BksBcKICkM=',
  'https://images.unsplash.com/photo-1543418219-44e30b057fea?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1623302485960-d61687113a11?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D',
];

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0)

  // Add colorful state
  const [colorful, setColorful] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch latest posts
        const postsResponse = await fetch('/api/posts?limit=3');
        const postsData = await postsResponse.json();
        if (postsResponse.ok) {
          setColorful(true); // Corrected line
          setPosts(postsData.posts || []);
        }

        // Fetch latest requests
        const requestsResponse = await fetch('/api/requests?limit=3');
        const requestsData = await requestsResponse.json();
        if (requestsResponse.ok) {
          setRequests(requestsData.requests || []);
        }

        // Fetch latest articles
        const articlesResponse = await fetch('/api/articles?limit=3');
        const articlesData = await articlesResponse.json();
        if (articlesResponse.ok) {
          setArticles(articlesData.articles || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Auto-advance slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mock user stats (replace with actual API calls if available)
  const userPostsCount = posts.filter((post) => post.userId === session?.user?.id).length;
  const userRequestsCount = requests.filter((request) => request.userId === session?.user?.id).length;
  const userArticlesCount = articles.filter((article) => article.userId === session?.user?.id).length;
  const userHistoryCount = 0; // Placeholder, as history data is not fetched

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Welcome Section with Image Slider */}
      <div className="relative -mt-8 mb-12 rounded-xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-black/20">
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <img
                src={image}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1000';
                }}
              />
            </div>
          ))}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="py-20 px-8 relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">
              {session ? `Selamat Datang, ${session.user?.name}!` : 'Selamat Datang di EcoCropShare!'}
            </h1>
            <p className="text-lg mb-8 drop-shadow-md">
              Platform untuk berbagi bibit dan hasil panen berlebih dengan komunitas sekitar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/posts/create">
                <Button
                  className="bg-primary bg-opacity-90 hover:bg-opacity-100 shadow-lg hover:shadow-xl transition-all duration-300"
                  leftIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                >
                  Tambah Post Baru
                </Button>
              </Link>
              <Link href="/requests/create">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:!text-black transition-colors duration-300"
                >
                  Buat Permintaan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Activity Feeds */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="w-2 h-6 bg-primary rounded-full mr-2 block"></span>
                  Bibit & Hasil Panen Terbaru
                </h2>
                <Link href="/posts" className="text-sm text-primary flex items-center hover:text-primary-dark">
                  <span>Lihat semua</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card
                      key={post.id}
                      className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300"
                      hoverable
                    >
                      <Link href={`/posts/${post.id}`} className="block">
                        <div className="flex items-start space-x-4 p-6">
                          {post.images?.[0] && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 shadow-inner">
                              <img
                                src={
                                  post.images[0] ||
                                  'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=100'
                                }
                                alt={post.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=100';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-lg mb-1">{post.title}</h4>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  post.type === 'seed'
                                    ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
                                    : 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800'
                                }`}
                              >
                                {post.type === 'seed' ? 'Bibit' : 'Hasil Panen'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-1">{post.description}</p>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border border-gray-100 bg-gray-50 shadow-sm">
                  <div className="text-center py-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 mx-auto text-gray-400 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500">Belum ada posting tersedia</p>
                    <div className="mt-4">
                      <Link href="/posts/create">
                        <Button variant="primary" size="sm">
                          Tambah Post Baru
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )}
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="w-2 h-6 bg-yellow-500 rounded-full mr-2 block"></span>
                  Permintaan Terbaru
                </h2>
                <Link href="/requests" className="text-sm text-primary flex items-center hover:text-primary-dark">
                  <span>Lihat semua</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              {requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <Card
                      key={request.id}
                      className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300"
                      hoverable
                    >
                      <Link href={`/requests/${request._id || request.id}`} className="block">
                        <div className="p-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-yellow-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <h4 className="font-semibold text-gray-800 text-lg">{request.plantName}</h4>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-2">{request.reason}</p>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-gray-500">
                              {(request.userId as any)?.name || 'User'}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                request.status === 'open'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {request.status === 'open' ? 'Aktif' : 'Terpenuhi'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border border-gray-100 bg-gray-50 shadow-sm">
                  <div className="text-center py-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 mx-auto text-gray-400 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-500">Belum ada permintaan aktif</p>
                    <div className="mt-4">
                      <Link href="/requests/create">
                        <Button variant="primary" size="sm">
                          Buat Permintaan
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="w-2 h-6 bg-blue-500 rounded-full mr-2 block"></span>
                Aksi Cepat
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <Link href="/posts/create" className="block">
                  <Card className="text-center p-6 border-none shadow-md hover:shadow-lg bg-gradient-to-br from-white to-green-50">
                    <div className="rounded-full bg-primary bg-opacity-10 w-14 h-14 mx-auto flex items-center justify-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-800">Tambah Post</h4>
                    <p className="text-sm text-gray-500 mt-1">Bagikan bibit atau hasil panen</p>
                  </Card>
                </Link>
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <Link href="/requests/create" className="block">
                  <Card className="text-center p-6 border-none shadow-md hover:shadow-lg bg-gradient-to-br from-white to-yellow-50">
                    <div className="rounded-full bg-yellow-400 bg-opacity-10 w-14 h-14 mx-auto flex items-center justify-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-yellow-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-800">Buat Permintaan</h4>
                    <p className="text-sm text-gray-500 mt-1">Cari bibit atau hasil panen</p>
                  </Card>
                </Link>
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <Link href="/articles/create" className="block">
                  <Card className="text-center p-6 border-none shadow-md hover:shadow-lg bg-gradient-to-br from-white to-blue-50">
                    <div className="rounded-full bg-blue-400 bg-opacity-10 w-14 h-14 mx-auto flex items-center justify-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-800">Tulis Artikel</h4>
                    <p className="text-sm text-gray-500 mt-1">Bagikan pengetahuan</p>
                  </Card>
                </Link>
              </div>
              
            </div>
          </div>

          {/* Community Tips Section */}
          <div className="mb-8 bg-gradient-to-r from-green-100 to-primary-light rounded-xl p-6 shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Tips Komunitas EcoCropShare</h3>
                <p className="text-gray-700">
                  Bagikan tanaman Anda, tingkatkan pengetahuan, dan kembangkan komunitas petani urban yang
                  berkelanjutan.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href="/articles">
                  <Button className="bg-white !text-black hover:bg-gray-100 shadow-sm">
                    Jelajahi Artikel
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Articles Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="w-2 h-6 bg-blue-500 rounded-full mr-2 block"></span>
                Artikel Edukasi Terbaru
              </h2>
              <Link href="/articles" className="text-sm text-primary flex items-center hover:text-primary-dark">
                <span>Lihat semua</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300"
                    hoverable
                  >
                    {article.image && (
                      <Link href={`/articles/${article.id}`}>
                        <div className="h-48 w-full">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="h-full w-full object-cover rounded-t-lg"
                          />
                        </div>
                      </Link>
                    )}
                    <div className="p-5">
                      <Link href={`/articles/${article.id}`}>
                        <h3 className="font-semibold text-gray-800 text-lg mb-2">{article.title}</h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.content}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{(article.userId as any)?.name || 'User'}</span>
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border border-gray-100 bg-gray-50 shadow-sm">
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 mx-auto text-gray-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-500">Belum ada artikel edukasi yang ditulis</p>
                  <div className="mt-4">
                    <Link href="/articles/create">
                      <Button variant="primary" size="sm">
                        Tulis Artikel
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}
          </section>
        </>
      )}
    </main>
  );
};

export default Dashboard;