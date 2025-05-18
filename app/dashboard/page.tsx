'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import AuthRequired from '@/components/auth/AuthRequired';
import { PostType, RequestType, ArticleType } from '@/types';
import { formatDate } from '@/lib/utils';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch latest posts
        const postsResponse = await fetch('/api/posts?limit=3');
        const postsData = await postsResponse.json();
        if (postsResponse.ok) {
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
  
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {session ? `Selamat Datang, ${session.user?.name}!` : 'Selamat Datang di EcoCropShare!'}
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Platform untuk berbagi bibit dan hasil panen berlebih dengan komunitas sekitar.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/posts">
              <Button>
                Jelajahi Bibit & Hasil Panen
              </Button>
            </Link>
            
            <AuthRequired fallback={
              <Link href="/auth">
                <Button variant="outline">
                  Masuk / Daftar
                </Button>
              </Link>
            }>
              <Link href="/posts/create">
                <Button variant="outline">
                  Tambah Post Baru
                </Button>
              </Link>
            </AuthRequired>
          </div>
        </div>
      </section>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Latest Posts Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Bibit & Hasil Panen Terbaru</h2>
              <Link href="/posts" className="text-primary hover:text-primary-dark">
                Lihat Semua
              </Link>
            </div>
            
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <Link href={`/posts/${post.id}`}>
                      <div className="relative h-48 w-full mb-4">
                        <img
                          src={post.images?.[0] || 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1000'}
                          alt={post.title}
                          className="h-full w-full object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.type === 'seed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.type === 'seed' ? 'Bibit' : 'Hasil Panen'}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="p-4 pt-0">
                      <h3 className="font-semibold mb-2">{post.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{(post.userId as any)?.name || 'User'}</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600">Belum ada bibit atau hasil panen yang dibagikan.</p>
              </div>
            )}
          </section>
          
          {/* Latest Requests Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Permintaan Terbaru</h2>
              <Link href="/requests" className="text-primary hover:text-primary-dark">
                Lihat Semua
              </Link>
            </div>
            
            {requests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {requests.map((request) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{request.plantName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'open' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status === 'open' ? 'Aktif' : 'Terpenuhi'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{request.reason}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{(request.userId as any)?.name || 'User'}</span>
                        <Link href={`/requests/${request._id || request.id}`}>
                          <Button variant="outline" size="sm">
                            Detail
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600">Belum ada permintaan bibit atau hasil panen.</p>
              </div>
            )}
          </section>
          
          {/* Latest Articles Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Artikel Edukasi Terbaru</h2>
              <Link href="/articles" className="text-primary hover:text-primary-dark">
                Lihat Semua
              </Link>
            </div>
            
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
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
                        <h3 className="font-semibold mb-2">{article.title}</h3>
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
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600">Belum ada artikel edukasi yang ditulis.</p>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
};

export default Dashboard;