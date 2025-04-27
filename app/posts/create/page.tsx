'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';

const CreatePostPage = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const { data: session, status } = useSession();
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'seed' as 'seed' | 'harvest',
    exchangeType: 'barter' as 'barter' | 'free',
    quantity: 1,
    location: '',
    description: '',
    images: [] as string[],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Set default location if available from user profile
  React.useEffect(() => {
    if (session?.user?.location) {
      setFormData(prev => ({
        ...prev,
        location: session.user.location
      }));
    }
  }, [session]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    
    if (submitError) {
      setSubmitError('');
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      try {
        // Tampilkan loading state
        setIsUploading(true);
        
        // Buat FormData untuk upload
        const formData = new FormData();
        formData.append('file', files[0]);
        
        // Upload gambar ke API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to upload image');
        }
        
        // Tambahkan URL gambar ke state
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, data.imageUrl],
        }));
        
      } catch (error: any) {
        alert('Error uploading image: ' + error.message);
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Judul harus diisi';
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Jumlah harus lebih dari 0';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi harus diisi';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi harus diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || !session) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }
      
      router.push('/posts');
    } catch (error: any) {
      setSubmitError(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (status === 'loading') {
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
    router.push('/auth');
    return null;
  }
  
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/posts" className="text-primary hover:text-primary-dark flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Kembali
            </Link>
            <h1 className="text-2xl font-bold mt-2">
              Bagikan Tanaman Baru
            </h1>
          </div>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            {submitError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                {submitError}
              </div>
            )}
            
            {/* Type Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Apa yang ingin Anda bagikan?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                  formData.type === 'seed' 
                    ? 'border-primary bg-primary bg-opacity-5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="seed"
                    className="hidden"
                    checked={formData.type === 'seed'}
                    onChange={() => setFormData(prev => ({ ...prev, type: 'seed' }))}
                  />
                  <div className="ml-2">
                    <div className="font-medium">Bibit Tanaman</div>
                    <div className="text-sm text-gray-500">Bibit yang siap ditanam</div>
                  </div>
                </label>
                
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                  formData.type === 'harvest' 
                    ? 'border-primary bg-primary bg-opacity-5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="harvest"
                    className="hidden"
                    checked={formData.type === 'harvest'}
                    onChange={() => setFormData(prev => ({ ...prev, type: 'harvest' }))}
                  />
                  <div className="ml-2">
                    <div className="font-medium">Hasil Panen</div>
                    <div className="text-sm text-gray-500">Sayur, buah, atau hasil kebun lainnya</div>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Informasi Dasar
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <Input
                    label="Judul *"
                    id="title"
                    name="title"
                    type="text"
                    placeholder={formData.type === 'seed' ? "Contoh: Bibit Tomat Cherry" : "Contoh: Bayam Organik Segar"}
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                  />
                </div>
                
                <div>
                  <Input
                    label="Lokasi *"
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Kota/Kecamatan Anda"
                    value={formData.location}
                    onChange={handleChange}
                    error={errors.location}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah *
                  </label>
                  <div className="flex rounded-md">
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                      {formData.type === 'seed' ? 'bibit/pot' : 'kg/ikat'}
                    </span>
                  </div>
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.quantity}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="exchangeType" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipe Penukaran
                  </label>
                  <select
                    id="exchangeType"
                    name="exchangeType"
                    value={formData.exchangeType}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="barter">Barter (tukar dengan tanaman lain)</option>
                    <option value="free">Gratis</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Deskripsi
              </h3>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder={formData.type === 'seed'
                    ? "Jelaskan tentang bibit yang Anda bagikan (jenis, usia, cara perawatan, dll)"
                    : "Jelaskan tentang hasil panen yang Anda bagikan (varietas, kualitas, kapan dipanen, dll)"
                  }
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
            
            {/* Photos */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                Foto (opsional)
              </h3>
              
              {formData.images.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Gambar ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }));
                          }}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                {/* Upload Button */}
                <label
                  htmlFor="image-upload"
                  className={`flex justify-center items-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isUploading ? 'opacity-50' : ''}`}
                >
                  <div className="text-center">
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                        <span className="mt-2 block text-sm font-medium text-gray-700">
                          Mengunggah...
                        </span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="mt-2 block text-sm font-medium text-gray-700">
                          Tambahkan foto
                        </span>
                      </>
                    )}
                    <span className="mt-1 block text-xs text-gray-500">
                      PNG, JPG, WEBP (maks. 5MB)
                    </span>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
            
            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <Link href="/posts">
                <Button variant="text">
                  Batal
                </Button>
              </Link>
              
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : 'Publikasikan'}
              </Button>
            </div>
          </form>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default CreatePostPage;