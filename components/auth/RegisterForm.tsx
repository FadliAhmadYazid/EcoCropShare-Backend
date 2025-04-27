'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    favoritePlants: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  
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
    
    // Clear registration error when user changes input
    if (registerError) {
      setRegisterError('');
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi harus diisi';
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
    setRegisterError('');
    
    try {
      // Process favorite plants as array
      const favoritePlantsArray = formData.favoritePlants
        .split(',')
        .map((plant) => plant.trim())
        .filter((plant) => plant !== '');
      
      // Send registration request to backend
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          location: formData.location,
          favoritePlants: favoritePlantsArray,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Sign in the user after successful registration
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      setRegisterError(error.message || 'Email sudah digunakan');
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {registerError && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {registerError}
          </div>
        )}

        {/* Name Input */}
        <div className="mb-4">
          <Input
            id="name"
            name="name"
            type="text"
            label="Nama Lengkap"
            value={formData.name}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap"
            error={errors.name}
          />
        </div>

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

        {/* Password Fields */}
        <div className="mb-4">
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimal 6 karakter"
            error={errors.password}
          />
        </div>

        <div className="mb-4">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Konfirmasi Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Ulangi password"
            error={errors.confirmPassword}
          />
        </div>

        {/* Location Input */}
        <div className="mb-4">
          <Input
            id="location"
            name="location"
            type="text"
            label="Lokasi"
            value={formData.location}
            onChange={handleChange}
            placeholder="Kota/Kecamatan tempat tinggal"
            error={errors.location}
          />
        </div>

        {/* Favorite Plants Input */}
        <div className="mb-4">
          <Input
            id="favoritePlants"
            name="favoritePlants"
            type="text"
            label="Tanaman Favorit (opsional)"
            value={formData.favoritePlants}
            onChange={handleChange}
            placeholder="Contoh: Tomat, Cabai, Bayam"
            helperText="Pisahkan dengan koma untuk beberapa tanaman"
          />
        </div>

        {/* Register Button */}
        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            isFullWidth
            isLoading={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Daftar'}
          </Button>
        </div>

        {/* Benefits Card */}
        <div className="mt-6 bg-green-50 p-4 rounded-md">
          <h3 className="text-green-800 font-medium mb-2">
            Kenapa bergabung dengan EcoCropShare?
          </h3>
          <ul className="text-green-700 text-sm">
            <li className="mb-1">• Berbagi hasil panen dengan tetangga sekitar</li>
            <li className="mb-1">• Mendapatkan bibit tanaman dari sesama petani</li>
            <li className="mb-1">• Berbagi tips dan trik berkebun dengan komunitas</li>
            <li className="mb-1">• Mengurangi limbah makanan dan membantu lingkungan</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;