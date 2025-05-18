'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { RequestType, CommentType, UserType } from '@/types';
import { formatDate, compareIds } from '@/lib/utils';

interface RequestDetailPageProps {
  params: {
    id: string;
  };
}

const RequestDetailPage = ({ params }: RequestDetailPageProps) => {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [request, setRequest] = useState<RequestType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFulfilledModal, setShowFulfilledModal] = useState(false);
  const [partnerId, setPartnerId] = useState('');
  const [notes, setNotes] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Add this before the return statement
  const filteredUsers = users
    .filter(user => user.id !== session?.user.id) // Exclude the current user
    .filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Also add a click handler to close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // First useEffect - Load request details
  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (status === 'authenticated') {
        try {
          setIsLoading(true);

          console.log(`Fetching request from: /api/requests/${id}`);

          const response = await fetch(`/api/requests/${id}`);

          console.log(`Response status: ${response.status}`);

          const data = await response.json();

          console.log('Response data:', data);

          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch request details');
          }

          if (!data.request) {
            throw new Error('Request data is missing from response');
          }

          setRequest(data.request);
          setComments(data.comments || []);
        } catch (err: any) {
          console.error('Error details:', err);
          setError(err.message || 'Failed to load request details');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (status !== 'loading') {
      fetchRequestDetails();
    }
  }, [id, status]);

  // Second useEffect - Load users when modal opens
  useEffect(() => {
    const fetchUsers = async () => {
      if (showFulfilledModal) {
        try {
          setIsLoadingUsers(true);
          console.log('Fetching users...');
          const response = await fetch('/api/users');

          console.log('User response status:', response.status);
          const data = await response.json();
          console.log('User data:', data);

          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }

          setUsers(data.users || []);
          console.log('Set users:', data.users);
        } catch (err: any) {
          console.error('Error fetching users:', err);
        } finally {
          setIsLoadingUsers(false);
        }
      }
    };

    fetchUsers();
  }, [showFulfilledModal]);

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
          parentType: 'request',
          content: commentText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add comment');
      }

      setComments([...comments, data.comment]);
      setCommentText('');
    } catch (err: any) {
      alert('Error adding comment: ' + err.message);
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fix isAuthor check with proper ID comparison
  const isAuthor = session && request ? compareIds(session.user.id, request.userId) : false;

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
      // First, mark the request as fulfilled
      const updateResponse = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'fulfilled',
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || 'Failed to update request status');
      }

      // Then, create a history entry
      const historyResponse = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: id,
          partnerId: partnerId, // Use the user ID, not name
          plantName: request?.plantName || '',
          notes: notes,
          type: 'request',
        }),
      });

      if (!historyResponse.ok) {
        const errorData = await historyResponse.json();
        throw new Error(errorData.message || 'Failed to create history entry');
      }

      // Refresh the request data
      setRequest({
        ...request!,
        status: 'fulfilled',
      });

      setShowFulfilledModal(false);
      router.push('/history');
    } catch (err: any) {
      alert('Error marking as fulfilled: ' + err.message);
      console.error('Error marking as fulfilled:', err);
    }
  };

  const handleDeleteRequest = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus permintaan ini?')) {
      try {
        const response = await fetch(`/api/requests/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete request');
        }

        router.push('/requests');
      } catch (err: any) {
        alert('Error deleting request: ' + err.message);
        console.error('Error deleting request:', err);
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

  if (error || !request) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Permintaan Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-6">
              Permintaan yang Anda cari tidak ditemukan atau telah dihapus.
            </p>
            <div className="flex justify-center">
              <Link href="/requests">
                <Button>
                  Kembali ke Daftar Permintaan
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/requests" className="text-primary hover:text-primary-dark flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Daftar
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="mb-8">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold">{request.plantName}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === 'open'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {request.status === 'open' ? 'Aktif' : 'Terpenuhi'}
                  </span>
                </div>

                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-800 inline-block mb-6">
                  {request.location}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Alasan Permintaan:</h3>
                  <p className="text-gray-700 whitespace-pre-line">{request.reason}</p>
                </div>

                {request.category && (
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-1">Kategori:</div>
                    <div className="font-medium">
                      {request.category === 'buah' ? 'Tanaman Buah' :
                        request.category === 'sayur' ? 'Tanaman Sayur' :
                          request.category === 'hias' ? 'Tanaman Hias' :
                            request.category === 'obat' ? 'Tanaman Obat' : 'Lainnya'}
                    </div>
                  </div>
                )}

                {request.quantity && (
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-1">Jumlah yang Dibutuhkan:</div>
                    <div className="font-medium">{request.quantity}</div>
                  </div>
                )}
              </div>
            </Card>

            {/* Comments Section */}
            <Card>
              <h2 className="text-xl font-semibold mb-6 p-6 pb-0">Komentar ({comments.length})</h2>

              {comments.length > 0 ? (
                <div className="divide-y divide-gray-100 mb-8">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-6">
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
                <div className="text-center py-8 bg-gray-50 rounded-lg mx-6 mb-6">
                  <p className="text-gray-500">Belum ada komentar</p>
                </div>
              )}

              {/* Comment Form */}
              {session && request.status === 'open' && (
                <div className="p-6 pt-0">
                  <h3 className="text-lg font-medium mb-4">Tambah Komentar</h3>
                  <form onSubmit={handleCommentSubmit}>
                    <div className="mb-4">
                      <textarea
                        rows={3}
                        placeholder={isAuthor ? "Tambahkan informasi..." : "Tulis jika Anda bisa membantu..."}
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
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Informasi Peminta</h3>
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    {(request.userId as any)?.profileImage ? (
                      <img
                        src={(request.userId as any).profileImage}
                        alt={(request.userId as any)?.name || 'User'}
                        className="h-12 w-12 rounded-full"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-medium">
                        {(request.userId as any)?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{(request.userId as any)?.name || 'User'}</h4>
                    <p className="text-sm text-gray-600">{(request.userId as any)?.location || ''}</p>
                  </div>
                </div>

                {(request.userId as any)?.favoritePlants && (request.userId as any).favoritePlants.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Tanaman Favorit:</div>
                    <div>{(request.userId as any).favoritePlants.join(', ')}</div>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  <span>Dibuat pada:</span>
                  <span className="ml-2">{formatDate(request.createdAt)}</span>
                </div>
              </div>
            </Card>

            {/* Bagian Kelola Permintaan (hanya untuk pemilik) */}
            {isAuthor && request && request.status === 'open' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Kelola Permintaan</h3>
                <div className="space-y-3">
                  <Link href={`/requests/edit/${request.id}`}>
                    <Button variant="outline" isFullWidth>
                      Edit Permintaan
                    </Button>
                  </Link>

                  <Button
                    variant="primary"
                    isFullWidth
                    onClick={() => setShowFulfilledModal(true)}
                  >
                    Tandai Terpenuhi
                  </Button>

                  <Button
                    variant="danger"
                    isFullWidth
                    onClick={handleDeleteRequest}
                  >
                    Hapus Permintaan
                  </Button>
                </div>
              </div>
            )}

            {/* Bagian Tawarkan Bantuan (hanya untuk non-pemilik) */}
            {!isAuthor && request.status === 'open' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Bisa Membantu?</h3>
                <p className="text-gray-700 mb-4">
                  Jika Anda memiliki tanaman yang diminta, silakan hubungi langsung peminta.
                </p>
                <Button
                  isFullWidth
                  onClick={() => router.push(`/messages?userId=${typeof request.userId === 'object'
                      ? (request.userId as any)._id || (request.userId as any).id
                      : request.userId
                    }`)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  Kirim Pesan
                </Button>
              </div>
            )}

            {/* Bagian Permintaan Terpenuhi (jika status fulfilled) */}
            {request.status === 'fulfilled' && (
              <div className="bg-green-50 rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-medium text-green-800">Permintaan Terpenuhi</h3>
                </div>
                <p className="text-green-700">
                  Permintaan ini sudah terpenuhi dan tidak aktif lagi.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fulfilled Modal */}
        {showFulfilledModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Tandai Permintaan Terpenuhi</h3>

                <form onSubmit={handleMarkAsFulfilled}>
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
                          type="text"
                          placeholder="Cari berdasarkan email atau nama..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowDropdown(true);
                          }}
                          onFocus={() => setShowDropdown(true)}
                        />

                        {showDropdown && (
                          <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                            {filteredUsers.length > 0 ? (
                              filteredUsers.map(user => (
                                <div
                                  key={user.id}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
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
                              <div className="px-4 py-2 text-gray-500">Tidak ada pengguna yang cocok</div>
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

export default RequestDetailPage;