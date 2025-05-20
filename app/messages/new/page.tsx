// app/messages/new/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';

interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profileImage?: string;
}

const NewMessagePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status]);

  useEffect(() => {
    if (users.length > 0) {
      filterUsers();
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      
      // Filter out current user
      const otherUsers = data.users.filter((user: User) => user.id !== session?.user.id);
      setUsers(otherUsers);
      setFilteredUsers(otherUsers);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.location && user.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredUsers(filtered);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedUser || isSending) {
      return;
    }
    
    setIsSending(true);
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedUser.id,
          content: message,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }
      
      // Redirect to conversation
      router.push(`/messages?userId=${selectedUser.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      console.error('Error sending message:', err);
      setIsSending(false);
    }
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
  };

  if (status === 'loading' || isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 min-h-screen">
          <Card className="max-w-md mx-auto shadow-lg">
            <div className="text-center py-10 px-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Login Diperlukan</h2>
              <p className="text-gray-600 mb-8">
                Anda perlu login untuk mengakses fitur pesan EcoCropShare dan mulai berbagi dengan komunitas.
              </p>
              <Button onClick={() => router.push('/auth')} className="w-full py-3">
                Login / Daftar
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.push('/messages')}
              className="mr-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600 transition-colors"
              aria-label="Kembali ke pesan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">Pesan Baru</h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm border border-red-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Users List */}
            <div className="md:col-span-1">
              <Card className="mb-4 md:mb-0 max-h-[80vh] h-auto flex flex-col shadow-lg overflow-hidden">
                <div className="p-4 border-b">
                  <Input
                    type="search"
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-100 border-0 focus:ring-primary focus:bg-white transition-colors"
                    leftIcon={
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    }
                  />
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 message-container" style={{ maxHeight: '60vh' }}>
                  {filteredUsers.length > 0 ? (
                    <div className="space-y-1.5">
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => selectUser(user)}
                          className={`w-full text-left p-3 rounded-lg transition-all hover:shadow-md ${
                            selectedUser?.id === user.id 
                              ? 'bg-primary/10 border-l-4 border-primary shadow-sm' 
                              : 'hover:bg-gray-50 border-l-4 border-transparent'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="mr-3 flex-shrink-0 relative">
                              {user.profileImage ? (
                                <img
                                  src={user.profileImage}
                                  alt={user.name}
                                  className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white flex items-center justify-center font-medium shadow-sm">
                                  {user.name?.charAt(0) || '?'}
                                </div>
                              )}
                              
                              {/* Location indicator */}
                              {user.location && (
                                <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full border border-white">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{user.name}</h3>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                {user.location ? (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="truncate">{user.location}</span>
                                  </>
                                ) : (
                                  <span className="truncate text-gray-500">{user.email}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4">
                      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-gray-700 font-medium mb-2">Tidak ada pengguna</p>
                      <p className="text-gray-500 text-sm">
                        {searchTerm 
                          ? `Tidak dapat menemukan pengguna dengan kata kunci "${searchTerm}"`
                          : "Tidak ada pengguna yang tersedia"}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Message Form */}
            <div className="md:col-span-2">
              <Card className="max-h-[80vh] h-auto flex flex-col shadow-lg overflow-hidden">
                {selectedUser ? (
                  <>
                    <div className="p-4 border-b bg-white shadow-sm">
                      <div className="flex items-center">
                        <div className="mr-3 flex-shrink-0 relative">
                          {selectedUser.profileImage ? (
                            <img
                              src={selectedUser.profileImage}
                              alt={selectedUser.name}
                              className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white flex items-center justify-center font-medium shadow-sm">
                              {selectedUser.name?.charAt(0) || '?'}
                            </div>
                          )}
                          
                          {/* Location indicator */}
                          {selectedUser.location && (
                            <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full border border-white">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            {selectedUser.location && (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {selectedUser.location}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 bg-gray-50">
                      <form onSubmit={handleSendMessage} className="h-full flex flex-col">
                        <div className="mb-4 flex-1">
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Pesan
                          </label>
                          <textarea
                            id="message"
                            rows={8}
                            placeholder={`Tulis pesan ke ${selectedUser.name}...`}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm resize-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                          ></textarea>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <button 
                              type="button"
                              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                              title="Tambah lampiran"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                            </button>
                            <button 
                              type="button"
                              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                              title="Tambah emoji"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </div>
                          
                          <Button
                            type="submit"
                            disabled={isSending || !message.trim()}
                            isLoading={isSending}
                            className="px-6"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Kirim Pesan
                          </Button>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center items-center h-full bg-gray-50">
                    <div className="text-center px-4 max-w-md">
                      <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">Pilih Pengguna</h2>
                      <p className="text-gray-600 mb-2">
                        Pilih pengguna dari daftar untuk memulai percakapan.
                      </p>
                      <p className="text-gray-500 text-sm">
                        Mulai dengan mengeklik pada salah satu pengguna di panel kiri.
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NewMessagePage;