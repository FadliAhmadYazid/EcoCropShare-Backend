'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { ArticleType } from '@/types';
import { formatDate } from '@/lib/utils';

interface ArticleDetailPageProps {
  params: {
    id: string;
  };
}

const ArticleDetailPage = ({ params }: ArticleDetailPageProps) => {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchArticleDetails = async () => {
      if (status === 'authenticated') {
        try {
          setIsLoading(true);
          
          const response = await fetch(`/api/articles/${id}`);
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch article details');
          }
          
          setArticle(data.article);
          setRelatedArticles(data.relatedArticles || []);
        } catch (err: any) {
          setError(err.message || 'Failed to load article details');
          console.error('Error fetching article details:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    if (status !== 'loading') {
      fetchArticleDetails();
    }
  }, [id, status]);
  
  const handleDeleteArticle = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      try {
        const response = await fetch(`/api/articles/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete article');
        }
        
        router.push('/articles');
      } catch (err: any) {
        alert('Error deleting article: ' + err.message);
        console.error('Error deleting article:', err);
      }
    }
  };
  
  const formatContent = (content: string): React.ReactNode => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph}
      </p>
    ));
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
  
  if (error || !article) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Artikel Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-6">
              Artikel yang Anda cari tidak ditemukan atau telah dihapus.
            </p>
            <div className="flex justify-center">
              <Link href="/articles">
                <Button>
                  Kembali ke Daftar Artikel
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  const isAuthor = session?.user?.id === article.userId?.toString() || 
  session?.user?.id === (article.userId as any)._id?.toString() ||
  session?.user?.id === (article.userId as any)?.id;
  const author = (article.userId as any);
  
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back link */}
        <div className="mb-6">
          <Link href="/articles" className="text-primary hover:text-primary-dark flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Daftar Artikel
          </Link>
        </div>
        
        {/* Article Hero */}
        <div className="relative rounded-lg overflow-hidden mb-8 h-64 md:h-80 lg:h-96">
          <img 
            src={article.image || 'https://via.placeholder.com/1200x600?text=Artikel'} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Category Badge */}
          {article.category && (
            <div className="absolute top-4 left-4">
              <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                {article.category}
              </span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              {/* Article Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-700 mr-2">
                      {author?.profileImage ? (
                        <img
                          src={author.profileImage}
                          alt={author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{author?.name?.charAt(0).toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <span>{author?.name || 'Pengguna'}</span>
                  </div>
                  
                  <span>•</span>
                  
                  <div>
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                  
                  {article.updatedAt > article.createdAt && (
                    <>
                      <span>•</span>
                      <div>
                        Diperbarui: {formatDate(article.updatedAt)}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Article Content */}
              <article className="prose max-w-none mb-8">
                {formatContent(article.content)}
              </article>
              
              {/* Share Section */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Bagikan artikel ini:</h4>
                    <div className="flex space-x-3">
                      <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">FB</button>
                      <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">Twitter</button>
                      <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">LinkedIn</button>
                      <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">WhatsApp</button>
                    </div>
                  </div>
                  
                  {isAuthor && (
                    <div className="flex space-x-3">
                      <Link href={`/articles/edit/${article.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleDeleteArticle}
                      >
                        Hapus
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            {/* Author Card */}
            <Card className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Tentang Penulis</h3>
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  {author?.profileImage ? (
                    <img
                      src={author.profileImage}
                      alt={author.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-medium">
                      {author?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{author?.name || 'Pengguna'}</h4>
                  <p className="text-sm text-gray-600">{author?.location || ''}</p>
                </div>
              </div>
              
              {author?.favoritePlants && author.favoritePlants.length > 0 && (
                <div>
                  <div className="text-sm text-gray-700 mb-2">Tanaman Favorit:</div>
                  <div className="flex flex-wrap gap-2">
                    {author.favoritePlants.map((plant: string, index: number) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {plant}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
            
            {/* Related Articles */}
            <Card className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Artikel Terkait</h3>
              
              {relatedArticles.length > 0 ? (
                <div className="space-y-4">
                  {relatedArticles.map(relatedArticle => (
                    <Link 
                      key={relatedArticle.id} 
                      href={`/articles/${relatedArticle.id}`}
                      className="block hover:bg-gray-50 rounded-md p-2 transition-colors"
                    >
                      <div className="flex">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-3">
                          <img 
                            src={relatedArticle.image || 'https://via.placeholder.com/64?text=Artikel'} 
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm line-clamp-2">
                            {relatedArticle.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(relatedArticle.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Tidak ada artikel terkait</p>
              )}
            </Card>
            
            {/* Tags Cloud */}
            {article.tags && article.tags.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ArticleDetailPage;