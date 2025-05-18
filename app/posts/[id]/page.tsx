'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { PostType, CommentType, UserType } from '@/types';
import { formatDate } from '@/lib/utils';

interface PostDetailPageProps {
  params: {
    id: string;
  };
}

const PostDetailPage = ({ params }: PostDetailPageProps) => {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFulfilledModal, setShowFulfilledModal] = useState(false);

  // New state variables for user selection
  const [partnerId, setPartnerId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [notes, setNotes] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (status === 'authenticated') {
        try {
          setIsLoading(true);

          const response = await fetch(`/api/posts/${id}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch post details');
          }

          setPost(data.post);
          setComments(data.comments || []);
        } catch (err: any) {
          setError(err.message || 'Failed to load post details');
          console.error('Error fetching post details:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (status !== 'loading' && id) {
      fetchPostDetails();
    }
  }, [id, status]);

  // Fetch users when the modal is opened
  useEffect(() => {
    const fetchUsers = async () => {
      if (showFulfilledModal) {
        try {
          setIsLoadingUsers(true);
          setSearchTerm('');
          setPartnerId('');

          const response = await fetch('/api/users');
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch users');
          }

          // Make sure we're getting the right format
          if (Array.isArray(data.users)) {
            setUsers(data.users);
          } else {
            console.error('Expected users array but got:', data);
            setUsers([]);
          }
        } catch (err: any) {
          console.error('Error fetching users:', err);
          alert('Gagal memuat daftar pengguna: ' + (err.message || 'Terjadi kesalahan'));
        } finally {
          setIsLoadingUsers(false);
        }
      }
    };

    fetchUsers();
  }, [showFulfilledModal]);

  // Add click handler to close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown');
      const searchInput = document.getElementById('user-search');

      if (
        dropdown &&
        searchInput &&
        !dropdown.contains(event.target as Node) &&
        !searchInput.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter users, excluding current user
  const filteredUsers = users
    .filter(user => user.id !== session?.user?.id) // Exclude the current user
    .filter(user =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim() || !session) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentId: id,
          parentType: 'post',
          content: commentText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add comment');
      }

      // Add the new comment to the list
      setComments([...comments, data.comment]);
      setCommentText('');
    } catch (err: any) {
      alert('Error adding comment: ' + err.message);
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      try {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete comment');
        }

        // Remove the deleted comment from the list
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (err: any) {
        alert('Error deleting comment: ' + err.message);
        console.error('Error deleting comment:', err);
      }
    }
  };

  const handleMarkAsFulfilled = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!partnerId) {
      return;
    }

    try {
      // First, mark the post as completed
      const updateResponse = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || 'Failed to update post status');
      }

      // Then, create a history entry
      const historyResponse = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: id,
          partnerId: partnerId, // Now using user ID
          plantName: post?.title || '',
          notes: notes,
          type: 'post',
        }),
      });

      if (!historyResponse.ok) {
        const errorData = await historyResponse.json();
        throw new Error(errorData.message || 'Failed to create history entry');
      }

      // Refresh the post data
      setPost({
        ...post!,
        status: 'completed',
      });

      setShowFulfilledModal(false);
      router.push('/history');
    } catch (err: any) {
      alert('Error marking as fulfilled: ' + err.message);
      console.error('Error marking as fulfilled:', err);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus post ini?')) {
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete post');
        }

        router.push('/posts');
      } catch (err: any) {
        alert('Error deleting post: ' + err.message);
        console.error('Error deleting post:', err);
      }
    }
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

  if (error || !post) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Post Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-6">
              Post yang Anda cari tidak ditemukan atau telah dihapus.
            </p>
            <div className="flex justify-center">
              <Link href="/posts">
                <Button>
                  Kembali ke Daftar Post
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Check if current user is the author of this post
  const isAuthor = session?.user?.id === post.userId?.toString() ||
    session?.user?.id === (post.userId as any)._id?.toString() ||
    session?.user?.id === (post.userId as any)?.id;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/posts" className="text-primary hover:text-primary-dark flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Daftar
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="mb-8">
              <div className="relative rounded-lg overflow-hidden mb-6 h-64 md:h-96">
                <img
                  src={post.images?.[0] || 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1000'}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${post.type === 'seed'
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-500 text-white'
                    }`}>
                    {post.type === 'seed' ? 'Bibit' : 'Hasil Panen'}
                  </span>

                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${post.status === 'available'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-500 text-white'
                    }`}>
                    {post.status === 'available' ? 'Tersedia' : 'Selesai'}
                  </span>

                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${post.exchangeType === 'barter'
                    ? 'bg-purple-500 text-white'
                    : 'bg-green-500 text-white'
                    }`}>
                    {post.exchangeType === 'barter' ? 'Barter' : 'Gratis'}
                  </span>
                </div>

                {/* Image gallery navigation if multiple images */}
                {post.images && post.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex space-x-1">
                    {post.images.map((_, index) => (
                      <button
                        key={index}
                        className="w-2 h-2 rounded-full bg-white opacity-50 focus:opacity-100"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold">{post.title}</h1>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                    {post.location}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="mb-2 font-medium">Detail Posting:</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Jumlah</div>
                      <div>{post.quantity} {post.type === 'seed' ? 'bibit/pot' : 'kg/ikat'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Jenis Penukaran</div>
                      <div>{post.exchangeType === 'barter' ? 'Barter' : 'Gratis'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Tanggal Posting</div>
                      <div>{formatDate(post.createdAt)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <div>{post.status === 'available' ? 'Tersedia' : 'Selesai'}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="mb-2 font-medium">Deskripsi:</div>
                  <p className="text-gray-700 whitespace-pre-line">{post.description}</p>
                </div>
              </div>
            </Card>

            {/* Comments Section */}
            <Card>
              <h2 className="text-xl font-semibold mb-6">Komentar ({comments.length})</h2>

              {comments.length > 0 ? (
                <div className="space-y-6 mb-8">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex">
                        <div className="mr-3 flex-shrink-0">
                          {(comment.userId as any)?.profileImage ? (
                            <img
                              src={(comment.userId as any).profileImage}
                              alt={(comment.userId as any)?.name || 'User'}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                              {(comment.userId as any)?.name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium text-gray-900">{(comment.userId as any)?.name || 'Pengguna'}</h4>
                            <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>

                          {session?.user?.id === (comment.userId as any)?._id && (
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-sm text-red-600 hover:text-red-800"
                              >
                                Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
                  <p className="text-gray-500">Belum ada komentar</p>
                </div>
              )}

              {/* Comment Form - for both authors and non-authors */}
              {session && post.status === 'available' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Tambah Komentar</h3>
                  <form onSubmit={handleCommentSubmit}>
                    <div className="mb-4">
                      <textarea
                        rows={3}
                        placeholder={isAuthor ? "Tambahkan informasi tambahan..." : "Tulis jika Anda tertarik dengan tanaman ini..."}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        disabled={isSubmitting || !commentText.trim()}
                      >
                        Kirim Komentar
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </Card>
          </div>

          <div className="md:col-span-1">
            {/* Author Information */}
            <Card className="mb-6">
              <h3 className="text-lg font-medium mb-4">Informasi Pemilik</h3>
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  {(post.userId as any)?.profileImage ? (
                    <img
                      src={(post.userId as any).profileImage}
                      alt={(post.userId as any)?.name || 'User'}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-medium">
                      {(post.userId as any)?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{(post.userId as any)?.name || 'User'}</h4>
                  <p className="text-sm text-gray-600">{(post.userId as any)?.location || ''}</p>
                </div>
              </div>

              {(post.userId as any)?.favoritePlants && (post.userId as any).favoritePlants.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Tanaman Favorit:</div>
                  <div className="flex flex-wrap gap-2">
                    {(post.userId as any).favoritePlants.map((plant: string, index: number) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {plant}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Post Management (for author) */}
            {isAuthor && post.status === 'available' && (
              <Card className="mb-6">
                <h3 className="text-lg font-medium mb-4">Kelola Post</h3>
                <div className="space-y-3">
                  <Link href={`/posts/edit/${post.id}`} className="block w-full">
                    <Button variant="outline" isFullWidth>
                      Edit Post
                    </Button>
                  </Link>

                  <Button
                    variant="primary"
                    isFullWidth
                    onClick={() => setShowFulfilledModal(true)}
                  >
                    Tandai Selesai
                  </Button>

                  <Button
                    variant="danger"
                    isFullWidth
                    onClick={handleDeletePost}
                  >
                    Hapus Post
                  </Button>
                </div>
              </Card>
            )}

            {/* Contact Info (for non-author) */}
            {!isAuthor && post.status === 'available' && (
              <Card>
                <h3 className="text-lg font-medium mb-4">Tertarik?</h3>
                <p className="text-gray-700 mb-4">
                  Hubungi langsung pemilik untuk mendiskusikan lebih lanjut tentang tanaman ini.
                </p>
                <Button
                  isFullWidth
                  onClick={() => router.push(`/messages?userId=${
                    typeof post.userId === 'object'
                      ? (post.userId as any)._id || (post.userId as any).id
                      : post.userId
                  }`)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  Kirim Pesan
                </Button>
              </Card>
            )}

            {/* Completed Notice */}
            {post.status === 'completed' && (
              <Card className="bg-gray-50">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium">Post Selesai</h3>
                </div>
                <p className="text-gray-700">
                  Tanaman ini telah berhasil dibagikan dan tidak tersedia lagi.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Fulfilled Modal */}
        {showFulfilledModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Tandai Post Selesai</h3>

                <form onSubmit={handleMarkAsFulfilled}>
                  {/* User Selection with Autocomplete */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Pengguna
                    </label>
                    {isLoadingUsers ? (
                      <div className="flex items-center justify-center py-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                        <span className="ml-2 text-gray-500">Memuat pengguna...</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          id="user-search"
                          type="text"
                          placeholder="Cari berdasarkan email atau nama..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowDropdown(true);
                          }}
                          onFocus={() => setShowDropdown(true)}
                          onClick={(e) => e.stopPropagation()}
                        />

                        {showDropdown && (
                          <div
                            id="user-dropdown"
                            className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
                          >
                            {filteredUsers.length > 0 ? (
                              filteredUsers.map(user => (
                                <div
                                  key={user.id}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPartnerId(user.id);
                                    setSearchTerm(`${user.name} (${user.email})`);
                                    setShowDropdown(false);
                                  }}
                                >
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-gray-600">{user.email}</div>
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-gray-500">
                                {searchTerm.length > 0
                                  ? 'Tidak ada pengguna yang cocok'
                                  : 'Ketik untuk mencari pengguna'}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Hidden input to store the actual selected ID */}
                        <input type="hidden" value={partnerId} />
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan (opsional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tambahkan catatan tentang pertukaran ini"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="text"
                      onClick={() => setShowFulfilledModal(false)}
                    >
                      Batal
                    </Button>

                    <Button
                      type="submit"
                      disabled={!partnerId}
                    >
                      Konfirmasi
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default PostDetailPage;