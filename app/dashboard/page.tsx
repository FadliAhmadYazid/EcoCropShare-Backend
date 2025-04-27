'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

const sliderImages = [
  'https://media.istockphoto.com/id/2152987531/photo/urban-farming.webp?a=1&b=1&s=612x612&w=0&k=20&c=jYjoPEfYDxzMHU7nSmnANO-zlSObLZfu6aUoC8yQrf0=',
  'https://media.istockphoto.com/id/2184469012/id/foto/kaca-globe-di-hutan-hijau-dengan-sinar-matahari-konsep-lingkungan-konsep-netral-karbon-target.jpg?s=612x612&w=0&k=20&c=BCVKybxgShntPQZKvdS0AOL6qc7UI2jL6BksBcKICkM=',
  'https://images.unsplash.com/photo-1543418219-44e30b057fea?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1623302485960-d61687113a11?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D'
];

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [userPosts, setUserPosts] = useState([]);
  const [activePosts, setActivePosts] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [activeRequests, setActiveRequests] = useState([]);
  const [userArticles, setUserArticles] = useState([]);
  const [userHistory, setUserHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      if (status === 'authenticated') {
        try {
          setIsLoading(true);
          
          // Here we would make actual API calls to our backend
          // For now, we'll simulate empty data
          setUserPosts([]);
          setActivePosts([]);
          setUserRequests([]);
          setActiveRequests([]);
          setUserArticles([]);
          setUserHistory([]);
          
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchDashboardData();
  }, [status]);
  
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Banner Slider */}
      <div className="relative rounded-lg overflow-hidden mb-8 h-48 md:h-64">
        <Image 
          src={sliderImages[currentSlide]} 
          alt="Welcome banner"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Selamat datang, {session?.user?.name}!</h2>
      <p className="text-gray-600 mb-6">EcoCropShare membantu Anda berbagi dan mendapatkan bibit atau hasil panen dengan mudah.</p>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <Link href="/posts/create">
          <Button>Tambah Post Baru</Button>
        </Link>
        <Link href="/requests/create">
          <Button variant="outline">Buat Permintaan</Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="font-semibold text-lg mb-1">Posting Saya</h3>
          <p className="text-2xl font-bold text-primary">{userPosts.length}</p>
          <p className="text-gray-600 mb-4">Bibit & hasil panen yang Anda bagikan</p>
          <Link href="/posts" className="text-primary hover:text-primary-dark">Lihat semua</Link>
        </Card>
        
        <Card>
          <h3 className="font-semibold text-lg mb-1">Permintaan Saya</h3>
          <p className="text-2xl font-bold text-primary">{userRequests.length}</p>
          <p className="text-gray-600 mb-4">Tanaman yang Anda cari</p>
          <Link href="/requests" className="text-primary hover:text-primary-dark">Lihat semua</Link>
        </Card>
        
        <Card>
          <h3 className="font-semibold text-lg mb-1">Artikel Saya</h3>
          <p className="text-2xl font-bold text-primary">{userArticles.length}</p>
          <p className="text-gray-600 mb-4">Artikel yang Anda bagikan</p>
          <Link href="/articles" className="text-primary hover:text-primary-dark">Lihat semua</Link>
        </Card>
        
        <Card>
          <h3 className="font-semibold text-lg mb-1">Riwayat Tukar</h3>
          <p className="text-2xl font-bold text-primary">{userHistory.length}</p>
          <p className="text-gray-600 mb-4">Catatan pertukaran yang telah selesai</p>
          <Link href="/history" className="text-primary hover:text-primary-dark">Lihat semua</Link>
        </Card>
      </div>
      
      {/* Latest Posts & Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Posting Terbaru</h3>
            <Link href="/posts" className="text-primary hover:text-primary-dark">Lihat semua</Link>
          </div>
          
          {activePosts.length > 0 ? (
            <div className="space-y-4">
              {activePosts.slice(0, 3).map((post: any) => (
                <Card key={post.id} className="flex items-center p-4">
                  <Link href={`/posts/${post.id}`} className="flex w-full">
                    <div className="flex">
                      {post.images?.length > 0 && (
                        <div className="w-20 h-20 mr-4 relative">
                          <Image
                            src={post.images[0] || 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=100'}
                            alt={post.title}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium">{post.title}</h4>
                        <div className="flex space-x-2 text-sm text-gray-500 mb-1">
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                            {post.type === 'seed' ? 'Bibit' : 'Hasil Panen'}
                          </span>
                          <span>{post.location}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{post.description}</p>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500 mb-4">Belum ada posting tersedia</p>
              <div className="flex justify-center">
                <Link href="/posts/create">
                  <Button>Tambah Post Baru</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Permintaan Terbaru</h3>
            <Link href="/requests" className="text-primary hover:text-primary-dark">Lihat semua</Link>
          </div>
          
          {activeRequests.length > 0 ? (
            <div className="space-y-4">
              {activeRequests.slice(0, 3).map((request: any) => (
                <Card key={request.id} className="p-4">
                  <Link href={`/requests/${request.id}`}>
                    <div>
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{request.plantName}</h4>
                        <div>
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                            {request.location}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{request.reason}</p>
                      <div className="text-xs text-gray-500">
                        <span>{request.comments?.length || 0} komentar</span>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500 mb-4">Belum ada permintaan aktif</p>
              <div className="flex justify-center">
                <Link href="/requests/create">
                  <Button>Buat Permintaan</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <h3 className="text-xl font-bold mb-4">Aksi Cepat</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link href="/posts/create">
          <Card className="p-4 text-center h-full hover:shadow-md transition-shadow">
            <div className="bg-green-100 text-green-800 w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-3">+</div>
            <h4 className="font-medium mb-1">Tambah Post</h4>
            <p className="text-gray-600 text-sm">Bagikan bibit atau hasil panen</p>
          </Card>
        </Link>
        
        <Link href="/requests/create">
          <Card className="p-4 text-center h-full hover:shadow-md transition-shadow">
            <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-3">?</div>
            <h4 className="font-medium mb-1">Buat Permintaan</h4>
            <p className="text-gray-600 text-sm">Cari bibit atau hasil panen</p>
          </Card>
        </Link>
        
        <Link href="/articles/create">
          <Card className="p-4 text-center h-full hover:shadow-md transition-shadow">
            <div className="bg-yellow-100 text-yellow-800 w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-3">📝</div>
            <h4 className="font-medium mb-1">Tulis Artikel</h4>
            <p className="text-gray-600 text-sm">Bagikan pengetahuan</p>
          </Card>
        </Link>
        
        <Link href="/profile">
          <Card className="p-4 text-center h-full hover:shadow-md transition-shadow">
            <div className="bg-purple-100 text-purple-800 w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-3">👤</div>
            <h4 className="font-medium mb-1">Profil Saya</h4>
            <p className="text-gray-600 text-sm">Lihat aktivitas saya</p>
          </Card>
        </Link>
      </div>
      
      {/* Community Tips Section */}
      <div className="bg-green-50 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold mb-2">Tips Komunitas EcoCropShare</h3>
          <p className="text-gray-700">
            Bagikan tanaman Anda, tingkatkan pengetahuan, dan kembangkan komunitas petani urban yang berkelanjutan.
          </p>
        </div>
        <div>
          <Link href="/articles">
            <Button>Jelajahi Artikel</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;