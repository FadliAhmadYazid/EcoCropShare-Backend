'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import AuthRequired from '@/components/auth/AuthRequired';
import { ArticleType } from '@/types';
import { formatDate, getExcerpt } from '@/lib/utils';

const ArticlesPage = () => {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);

        // Build query parameters for filtered articles
        const params = new URLSearchParams();
        if (selectedCategory) {
          params.append('category', selectedCategory);
        }

        // Fetch the filtered articles
        const response = await fetch(`/api/articles?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch articles');
        }

        setArticles(data.articles || []);

        // If we don't have all categories yet or we have a selected category,
        // fetch all articles to get all available categories
        if (allCategories.length === 0) {
          const allArticlesResponse = await fetch('/api/articles');
          const allArticlesData = await allArticlesResponse.json();

          if (allArticlesResponse.ok) {
            // Extract all unique categories
            const categories = Array.from(
              new Set(allArticlesData.articles
                .filter((a: ArticleType) => a.category)
                .map((a: ArticleType) => a.category as string))
            );
            setAllCategories(categories as string[]);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load articles');
        console.error('Error fetching articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory, allCategories.length]);

  // Filter articles based on search term
  const filteredArticles = articles.filter((article) => {
    return (
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.tags && article.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  });

  // Sort articles by creation date (newest first)
  const sortedArticles = [...filteredArticles].sort(
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
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Artikel Edukasi</h1>
          <p className="text-gray-600 mb-6">Temukan artikel menarik tentang berbagai topik pendidikan</p>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="md:flex-1">
              <Input
                type="search"
                placeholder="Cari artikel, topik, atau tag..."
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
                <Link href="/articles/create">
                  <Button>
                    Tulis Artikel
                  </Button>
                </Link>
              </AuthRequired>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${selectedCategory === null
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
            >
              Semua Artikel
            </button>

            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Featured Article */}
        {sortedArticles.length > 0 && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/3">
                  <img
                    src={sortedArticles[0].image || 'https://via.placeholder.com/1200x600?text=Artikel'}
                    alt={sortedArticles[0].title}
                    className="w-full h-full object-cover"
                  />
                  {sortedArticles[0].category && (
                    <span className="absolute top-4 left-4 bg-primary text-white text-xs px-2 py-1 rounded">
                      {sortedArticles[0].category}
                    </span>
                  )}
                </div>

                <div className="p-6 md:p-8 md:flex-1">
                  <h2 className="text-2xl font-bold mb-2">{sortedArticles[0].title}</h2>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>{(sortedArticles[0].userId as any)?.name || 'Pengguna'}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(sortedArticles[0].createdAt)}</span>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {getExcerpt(sortedArticles[0].content, 180)}
                  </p>

                  <Link href={`/articles/${sortedArticles[0].id}`}>
                    <Button>
                      Baca Selengkapnya
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        {sortedArticles.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Artikel Terbaru</h3>
            <div className="text-sm text-gray-500">
              Diurutkan dari terbaru
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {sortedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skip the first article if more than one (it's featured) */}
            {(sortedArticles.length > 1 ? sortedArticles.slice(1) : []).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Tidak ada artikel</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory
                ? 'Tidak ada hasil yang cocok dengan pencarian atau filter Anda'
                : 'Belum ada artikel edukasi yang ditulis'}
            </p>
            <Link href="/articles/create">
              <Button>
                Tulis Artikel Baru
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

interface ArticleCardProps {
  article: ArticleType;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      {/* Card Image */}
      {article.image && (
        <Link href={`/articles/${article.id}`} className="block">
          <div className="relative h-48 w-full">
            <img
              src={article.image || 'https://via.placeholder.com/400x300?text=Artikel'}
              alt={article.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
            {article.category && (
              <span className="absolute bottom-2 left-2 bg-white bg-opacity-90 text-gray-800 text-xs px-2 py-1 rounded">
                {article.category}
              </span>
            )}
          </div>
        </Link>
      )}

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        <Link href={`/articles/${article.id}`} className="block mb-2">
          <h3 className="text-lg font-semibold">
            {article.title}
          </h3>
        </Link>

        <div className="flex items-center mb-3 text-sm text-gray-500">
          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">
            {(article.userId as any)?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span>{(article.userId as any)?.name || 'Pengguna'}</span>
          <span className="mx-1">•</span>
          <span>
            {formatDate(article.createdAt)}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-1">
          {getExcerpt(article.content, 120)}
        </p>

        {/* Card Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs text-gray-500">
                  #{tag}
                </span>
              ))}
              {article.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{article.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <Link href={`/articles/${article.id}`}>
            <Button variant="outline" size="sm">
              <span>
                Baca selengkapnya →
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ArticlesPage;