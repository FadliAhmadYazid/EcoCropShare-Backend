'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm: React.FC = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    
    // Clear login error when user changes input
    if (loginError) {
      setLoginError('');
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsLoading(true);
    setLoginError('');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      
      if (result?.error) {
        setLoginError('Email atau password tidak valid');
        setIsLoading(false);
        return;
      }
      
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setLoginError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {loginError && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {loginError}
          </div>
        )}

        {/* Email Input */}
        <div className="mb-4">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="nama@email.com"
            error={errors.email}
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Masukkan password"
            error={errors.password}
          />
        </div>

        {/* Login Button */}
        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            isFullWidth
            isLoading={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;