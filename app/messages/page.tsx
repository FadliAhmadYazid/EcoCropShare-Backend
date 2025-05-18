'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';

interface User {
    _id: string;
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    location?: string;
}

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: string;
}

interface Conversation {
    id: string;
    participants: User[];
    lastMessage: string;
    lastMessageDate: string;
    unreadCount: Map<string, number>;
    createdAt: string;
    updatedAt: string;
}

const MessagesPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch conversations on first load
    useEffect(() => {
        if (status === 'authenticated') {
            fetchConversations();
        }
    }, [status]);

    // If userId is provided in the URL, load that conversation
    useEffect(() => {
        if (status === 'authenticated' && userId) {
            loadConversationWithUser(userId);
        }
    }, [userId, status]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Set up polling for new messages
    useEffect(() => {
        if (status === 'authenticated') {
            // Refresh conversations every 10 seconds
            const intervalId = setInterval(() => {
                fetchConversations(false);

                // Also refresh the current conversation if one is selected
                if (selectedUser) {
                    fetchMessages(selectedUser.id, false);
                }
            }, 10000);

            return () => clearInterval(intervalId);
        }
    }, [status, selectedUser]);

    const fetchConversations = async (showLoading = true) => {
        if (showLoading) {
            setIsLoading(true);
        }

        try {
            const response = await fetch('/api/messages');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch conversations');
            }

            setConversations(data.conversations || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load conversations');
            console.error('Error fetching conversations:', err);
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    };

    const fetchMessages = async (userId: string, showLoading = true) => {
        if (showLoading) {
            setIsLoading(true);
        }

        try {
            const response = await fetch(`/api/messages?userId=${userId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch messages');
            }

            setMessages(data.messages || []);

            // If there's conversation data, update it
            if (data.conversation) {
                setSelectedConversation(data.conversation);
            }

            // Update the conversations list to reflect read status
            fetchConversations(false);
        } catch (err: any) {
            setError(err.message || 'Failed to load messages');
            console.error('Error fetching messages:', err);
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    };

    const loadConversationWithUser = async (userId: string) => {
        setIsLoading(true);

        try {
            // First, get user details
            const userResponse = await fetch(`/api/users/${userId}`);
            const userData = await userResponse.json();

            if (!userResponse.ok) {
                throw new Error(userData.message || 'Failed to fetch user');
            }

            setSelectedUser(userData.user);

            // Then fetch messages
            await fetchMessages(userId);

        } catch (err: any) {
            setError(err.message || 'Failed to load conversation');
            console.error('Error loading conversation:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedUser || isSending) {
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
                    content: newMessage,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send message');
            }

            // Add the new message to the list
            setMessages([...messages, data.message]);
            setNewMessage('');

            // Update conversations list
            fetchConversations(false);
        } catch (err: any) {
            setError(err.message || 'Failed to send message');
            console.error('Error sending message:', err);
        } finally {
            setIsSending(false);
        }
    };

    const selectConversation = (conversation: Conversation) => {
        const otherUser = conversation.participants.find(
            user => user.id !== session?.user.id
        );

        if (otherUser) {
            setSelectedUser(otherUser);
            setSelectedConversation(conversation);
            fetchMessages(otherUser.id);

            // Update URL
            router.push(`/messages?userId=${otherUser.id}`);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hari ini';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Kemarin';
        } else {
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        }
    };

    if (status === 'loading' || (isLoading && !selectedUser)) {
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
                <h1 className="text-3xl font-bold mb-6">Pesan</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <div className="md:col-span-1">
                        <Card className="mb-4 md:mb-0 h-[calc(100vh-200px)] flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Percakapan</h2>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/messages/new')}
                                    size="sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Pesan Baru
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {conversations.length > 0 ? (
                                    <div className="space-y-2">
                                        {conversations.map((conversation) => {
                                            const otherUser = conversation.participants.find(
                                                user => user.id !== session?.user?.id
                                            );

                                            // Safely access unreadCount with proper type handling
                                            let unreadCount = 0;
                                            if (conversation.unreadCount && session?.user?.id) {
                                                // Handle both Map and object representations
                                                if (conversation.unreadCount instanceof Map) {
                                                    unreadCount = conversation.unreadCount.get(session.user.id) || 0;
                                                } else if (typeof conversation.unreadCount === 'object') {
                                                    // Handle object format from API response
                                                    unreadCount = (conversation.unreadCount as Record<string, number>)[session.user.id] || 0;
                                                }
                                            }

                                            const isSelected = selectedConversation?.id === conversation.id;

                                            return otherUser ? (
                                                <button
                                                    key={conversation.id}
                                                    onClick={() => selectConversation(conversation)}
                                                    className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${isSelected ? 'bg-gray-100' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-center">
                                                        <div className="mr-3 flex-shrink-0">
                                                            {otherUser.profileImage ? (
                                                                <img
                                                                    src={otherUser.profileImage}
                                                                    alt={otherUser.name}
                                                                    className="h-12 w-12 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                                                                    {otherUser.name?.charAt(0) || '?'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between">
                                                                <h3 className="font-medium truncate">{otherUser.name}</h3>
                                                                <span className="text-xs text-gray-500">
                                                                    {formatDate(conversation.lastMessageDate) === 'Hari ini'
                                                                        ? formatTime(conversation.lastMessageDate)
                                                                        : formatDate(conversation.lastMessageDate)}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                                                                {unreadCount > 0 && (
                                                                    <span className="inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-primary rounded-full ml-2">
                                                                        {unreadCount}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ) : null;
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">Belum ada percakapan</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Message Content */}
                    <div className="md:col-span-2">
                        <Card className="h-[calc(100vh-200px)] flex flex-col">
                            {selectedUser ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="flex items-center p-4 border-b">
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

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4">
                                        {isLoading ? (
                                            <div className="flex justify-center items-center h-full">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                            </div>
                                        ) : messages.length > 0 ? (
                                            <div className="space-y-4">
                                                {messages.map((message, index) => {
                                                    const isSentByMe = message.senderId === session?.user.id;
                                                    const showDate = index === 0 ||
                                                        new Date(message.createdAt).toDateString() !==
                                                        new Date(messages[index - 1].createdAt).toDateString();

                                                    return (
                                                        <React.Fragment key={message.id}>
                                                            {showDate && (
                                                                <div className="text-center my-4">
                                                                    <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                                                                        {formatDate(message.createdAt)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                                                                <div className={`max-w-[70%] px-4 py-2 rounded-lg ${isSentByMe
                                                                        ? 'bg-primary text-white rounded-br-none'
                                                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                                                    }`}>
                                                                    <p className="break-words">{message.content}</p>
                                                                    <div className={`text-xs mt-1 ${isSentByMe ? 'text-primary-lightest' : 'text-gray-500'}`}>
                                                                        {formatTime(message.createdAt)}
                                                                        {isSentByMe && (
                                                                            <span className="ml-1">
                                                                                {message.read ? '✓✓' : '✓'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    );
                                                })}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        ) : (
                                            <div className="flex justify-center items-center h-full">
                                                <div className="text-center">
                                                    <p className="text-gray-500 mb-2">Belum ada pesan</p>
                                                    <p className="text-gray-400 text-sm">Mulai percakapan dengan {selectedUser.name}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-4 border-t">
                                        <form onSubmit={handleSendMessage} className="flex items-center">
                                            <Input
                                                type="text"
                                                placeholder="Ketik pesan..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                className="flex-1 mr-2"
                                            />
                                            <Button
                                                type="submit"
                                                disabled={isSending || !newMessage.trim()}
                                                isLoading={isSending}
                                            >
                                                Kirim
                                            </Button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-center px-4">
                                        <div className="text-5xl mb-4">💬</div>
                                        <h2 className="text-xl font-semibold mb-2">Pesan EcoCropShare</h2>
                                        <p className="text-gray-600 mb-6">
                                            Pilih percakapan atau mulai pesan baru dengan pengguna lain untuk berbagi bibit atau hasil panen.
                                        </p>
                                        <Button
                                            onClick={() => router.push('/messages/new')}
                                        >
                                            Mulai Percakapan Baru
                                        </Button>
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

export default MessagesPage;