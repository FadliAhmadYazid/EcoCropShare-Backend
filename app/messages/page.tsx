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
    const [showSidebar, setShowSidebar] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

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

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Adjust sidebar visibility on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setShowSidebar(!selectedUser);
            } else {
                setShowSidebar(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [selectedUser]);

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

            // On mobile, hide sidebar when conversation is loaded
            if (window.innerWidth < 768) {
                setShowSidebar(false);
            }
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
            
            // On mobile, hide sidebar when conversation is selected
            if (window.innerWidth < 768) {
                setShowSidebar(false);
            }
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
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
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold">Pesan</h1>
                        {selectedUser && !showSidebar && (
                            <button 
                                onClick={toggleSidebar}
                                className="md:hidden bg-white p-2 rounded-lg shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        )}
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
                        {/* Conversations List */}
                        {(showSidebar || window.innerWidth >= 768) && (
                            <div className="md:col-span-1">
                                <Card className="mb-4 md:mb-0 max-h-[80vh] h-auto flex flex-col shadow-lg overflow-hidden">
                                    <div className="flex justify-between items-center p-4 border-b">
                                        <h2 className="text-lg font-semibold">Percakapan</h2>
                                        <Button
                                            variant="outline"
                                            onClick={() => router.push('/messages/new')}
                                            size="sm"
                                            className="group flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary group-hover:text-white transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Pesan Baru
                                        </Button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-2 message-container" style={{ maxHeight: '60vh' }}>
                                        {conversations.length > 0 ? (
                                            <div className="space-y-1.5">
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
                                                            className={`w-full text-left p-3 rounded-lg transition-all hover:shadow-md ${isSelected 
                                                                ? 'bg-primary/10 border-l-4 border-primary shadow-sm' 
                                                                : 'hover:bg-gray-50 border-l-4 border-transparent'
                                                            }`}
                                                        >
                                                            <div className="flex items-center">
                                                                <div className="mr-3 flex-shrink-0 relative">
                                                                    {otherUser.profileImage ? (
                                                                        <img
                                                                            src={otherUser.profileImage}
                                                                            alt={otherUser.name}
                                                                            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                                                                        />
                                                                    ) : (
                                                                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white flex items-center justify-center font-medium shadow-sm">
                                                                            {otherUser.name?.charAt(0) || '?'}
                                                                        </div>
                                                                    )}
                                                                    
                                                                    {/* Online indicator (placeholder) */}
                                                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex justify-between">
                                                                        <h3 className={`font-semibold truncate ${unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>{otherUser.name}</h3>
                                                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                                                                            {formatDate(conversation.lastMessageDate) === 'Hari ini'
                                                                                ? formatTime(conversation.lastMessageDate)
                                                                                : formatDate(conversation.lastMessageDate)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center mt-1">
                                                                        <p className={`text-sm truncate ${unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{conversation.lastMessage}</p>
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
                                            <div className="text-center py-12 px-4">
                                                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 mb-2">Belum ada percakapan</p>
                                                <p className="text-gray-400 text-sm mb-6">Mulai percakapan baru untuk berbagi bibit atau hasil panen</p>
                                                <Button 
                                                    onClick={() => router.push('/messages/new')}
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    Mulai Percakapan
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* Message Content */}
                        <div className={`${showSidebar ? 'hidden md:block' : 'block'} md:col-span-2`}>
                            <Card className="max-h-[80vh] h-auto flex flex-col shadow-lg overflow-hidden">
                                {selectedUser ? (
                                    <>
                                        {/* Chat Header */}
                                        <div className="flex items-center p-4 border-b bg-white shadow-sm z-10">
                                            <button 
                                                onClick={toggleSidebar}
                                                className="md:hidden mr-2 text-gray-500 hover:text-gray-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
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
                                                {/* Online indicator (placeholder) */}
                                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                                                <p className="text-sm text-gray-600">{selectedUser.location || ''}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                    </svg>
                                                </button>
                                                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 message-container" ref={chatContainerRef} style={{ maxHeight: '60vh' }}>
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
                                                                        <span className="inline-block bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full shadow-sm">
                                                                            {formatDate(message.createdAt)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                                                                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${isSentByMe
                                                                            ? 'bg-gradient-to-r from-primary to-primary-dark text-white rounded-br-none'
                                                                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                                                        }`}>
                                                                        <p className="break-words">{message.content}</p>
                                                                        <div className={`text-xs mt-1 flex items-center justify-end ${isSentByMe ? 'text-primary-lightest' : 'text-gray-500'}`}>
                                                                            {formatTime(message.createdAt)}
                                                                            {isSentByMe && (
                                                                                <span className="ml-1">
                                                                                    {message.read ? 
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                                        </svg> : 
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                                                                        </svg>
                                                                                    }
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
                                                    <div className="text-center max-w-md">
                                                        <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-gray-700 font-medium mb-2">Belum ada pesan</p>
                                                        <p className="text-gray-500 text-sm mb-6">Mulai percakapan dengan {selectedUser.name} sekarang</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Optional manual scroll button */}
                                        {messages.length > 10 && (
                                            <div className="absolute bottom-24 right-8">
                                                <button
                                                    onClick={scrollToBottom}
                                                    className="bg-white text-primary rounded-full p-3 shadow-lg hover:bg-primary hover:text-white transition-colors"
                                                    title="Scroll ke pesan terbaru"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}

                                        {/* Message Input */}
                                        <div className="p-4 border-t bg-white">
                                            <form onSubmit={handleSendMessage} className="flex items-center">
                                                <button
                                                    type="button"
                                                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 mr-2"
                                                    title="Tambah lampiran"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                    </svg>
                                                </button>
                                                <Input
                                                    type="text"
                                                    placeholder="Ketik pesan..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    className="flex-1 rounded-full bg-gray-100 border-0 focus:ring-primary focus:bg-white transition-colors shadow-sm"
                                                />
                                                <Button
                                                    type="submit"
                                                    disabled={isSending || !newMessage.trim()}
                                                    isLoading={isSending}
                                                    className="ml-2 rounded-full"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </Button>
                                            </form>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-center items-center h-full bg-gray-50">
                                        <div className="text-center px-4 max-w-md">
                                            <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>
                                            </div>
                                            <h2 className="text-2xl font-bold mb-4">Pesan EcoCropShare</h2>
                                            <p className="text-gray-600 mb-8">
                                                Pilih percakapan atau mulai pesan baru dengan pengguna lain untuk berbagi bibit atau hasil panen.
                                            </p>
                                            <Button
                                                onClick={() => router.push('/messages/new')}
                                                className="px-6 py-3"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                </svg>
                                                Mulai Percakapan Baru
                                            </Button>
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

export default MessagesPage;