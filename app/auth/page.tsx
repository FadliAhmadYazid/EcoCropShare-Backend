'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { getGreeting } from '@/lib/utils';

const AuthPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  if (status === 'loading') {
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
    <div className="min-h-screen flex">
      {/* Background Image - Hidden on mobile */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image 
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
          alt="Background" 
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Content */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Left Column - Welcome & Branding (shown on larger screens) */}
          <div className="hidden md:flex md:w-1/2 bg-green-50 p-8 flex-col justify-between">
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-green-700">{getGreeting()}</p>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isLogin ? 'Masuk ke Akun Anda' : 'Bergabung dengan EcoCropShare'}
                </h1>
                <p className="text-gray-600">
                  Platform untuk berbagi bibit tanaman dan hasil panen berlebih dengan komunitas sekitar
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌿</span>
                <span className="text-xl font-semibold">EcoCropShare</span>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Siklus Berkesinambungan</h3>
                <div className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <span>🌱</span>
                    </div>
                    <span className="text-sm">Tanam</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <span>🌾</span>
                    </div>
                    <span className="text-sm">Panen</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <span>🤝</span>
                    </div>
                    <span className="text-sm">Bagikan</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Satu platform untuk seluruh kebutuhan berkebun Anda
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Berbagi Hasil Panen
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Tukar Bibit
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Tips Berkebun
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Komunitas Peduli
              </span>
            </div>
          </div>
          
          {/* Right Column - Authentication Form */}
          <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col">
            <div className="max-w-sm mx-auto w-full">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 font-medium text-center ${
                    isLogin 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Masuk
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 font-medium text-center ${
                    !isLogin 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Daftar
                </button>
              </div>
              
              {/* Form Container */}
              <div>
                {isLogin ? <LoginForm /> : <RegisterForm />}
              </div>
            </div>
            
            {/* Mobile Features - Only shown on mobile */}
            <div className="md:hidden mt-12 bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Fitur Utama</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-green-700">✓</span>
                  <span className="text-sm">Berbagi Panen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-700">✓</span>
                  <span className="text-sm">Tukar Bibit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-700">✓</span>
                  <span className="text-sm">Tips Berkebun</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-700">✓</span>
                  <span className="text-sm">Komunitas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-4 px-6 bg-white border-t border-gray-200 text-center text-gray-500 text-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} EcoCropShare. Semua hak dilindungi.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-gray-700">FB</a>
              <a href="#" className="hover:text-gray-700">Twitter</a>
              <a href="#" className="hover:text-gray-700">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AuthPage;