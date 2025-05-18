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

  if (status === 'unauthenticated') {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Card>
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Login Diperlukan</h2>
              <p className="text-gray-600 mb-6">
                Anda perlu login untuk mengakses fitur pesan.
              </p>
              <Button onClick={() => router.push('/auth')}>
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => router.push('/messages')}
            className="mr-4 text-primary hover:text-primary-dark"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold">Pesan Baru</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="md:col-span-1">
            <Card className="mb-4 md:mb-0 h-[calc(100vh-200px)] flex flex-col">
              <div className="mb-4">
                <Input
                  type="search"
                  placeholder="Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  }
                />
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => selectUser(user)}
                        className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                          selectedUser?.id === user.id ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="mr-3 flex-shrink-0">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.name}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                                {user.name?.charAt(0) || '?'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{user.name}</h3>
                            <p className="text-sm text-gray-600 truncate">{user.location || user.email}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Tidak ada pengguna yang ditemukan</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Message Form */}
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              {selectedUser ? (
                <>
                  <div className="p-4 border-b">
                    <div className="flex items-center">
                      <div className="mr-3 flex-shrink-0">
                        {selectedUser.profileImage ? (
                          <img
                            src={selectedUser.profileImage}
                            alt={selectedUser.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                            {selectedUser.name?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{selectedUser.name}</h3>
                        <p className="text-sm text-gray-600">{selectedUser.location || ''}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4">
                    <form onSubmit={handleSendMessage} className="h-full flex flex-col">
                      <div className="mb-4 flex-1">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Pesan
                        </label>
                        <textarea
                          id="message"
                          rows={8}
                          placeholder={`Tulis pesan ke ${selectedUser.name}...`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isSending || !message.trim()}
                          isLoading={isSending}
                        >
                          Kirim Pesan
                        </Button>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center px-4">
                    <div className="text-5xl mb-4">👋</div>
                    <h2 className="text-xl font-semibold mb-2">Pilih Pengguna</h2>
                    <p className="text-gray-600">
                      Pilih pengguna dari daftar untuk memulai percakapan.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NewMessagePage;