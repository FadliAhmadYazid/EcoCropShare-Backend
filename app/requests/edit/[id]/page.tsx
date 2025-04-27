'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';

interface EditRequestPageProps {
  params: {
    id: string;
  };
}

const EditRequestPage = ({ params }: EditRequestPageProps) => {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    plantName: '',
    location: '',
    reason: '',
    category: 'buah',
    quantity: '1',
    status: 'open' as 'open' | 'fulfilled',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (status === 'authenticated') {
        try {
          setIsLoading(true);

          const response = await fetch(`/api/requests/${id}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch request details');
          }

          // Check if user is the author
          const requestUserId = typeof data.request.userId === 'object'
            ? (data.request.userId._id?.toString() || data.request.userId.id)
            : data.request.userId.toString();

          if (session.user.id !== requestUserId) {
            router.push('/requests');
            return;
          }

          // Set form data from request details
          setFormData({
            plantName: data.request.plantName || '',
            location: data.request.location || '',
            reason: data.request.reason || '',
            category: data.request.category || 'buah',
            quantity: data.request.quantity || '1',
            status: data.request.status || 'open',
          });
        } catch (err: any) {
          setSubmitError(err.message || 'Failed to load request details');
          console.error('Error fetching request details:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (status !== 'loading') {
      fetchRequestDetails();
    }
  }, [id, status, session, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.plantName.trim()) {
      newErrors.plantName = 'Nama tanaman harus diisi';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi harus diisi';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Alasan permintaan harus diisi';
    } else if (formData.reason.length < 10) {
      newErrors.reason = 'Alasan terlalu singkat (min. 10 karakter)';
    }

    if (!formData.quantity.trim() || parseInt(formData.quantity) < 1) {
      newErrors.quantity = 'Jumlah harus diisi dengan nilai minimal 1';
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
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update request');
      }

      router.push(`/requests/${id}`);
    } catch (error: any) {
      setSubmitError(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
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

  if (status === 'unauthenticated') {
    router.push('/auth');
    return null;
  }

  const plantCategories = [
    { value: 'buah', label: 'Tanaman Buah' },
    { value: 'sayur', label: 'Tanaman Sayur' },
    { value: 'hias', label: 'Tanaman Hias' },
    { value: 'obat', label: 'Tanaman Obat' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Permintaan</h1>

        <div className="mb-6">
          <Link href={`/requests/${id}`} className="text-primary hover:text-primary-dark flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Detail Permintaan
          </Link>
        </div>

        <Card>
          <div className="p-6">
            {submitError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                {submitError}
              </div>
            )}

            {/* Status Badge */}
            <div className="mb-6 flex justify-end">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${formData.status === 'open'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                }`}>
                {formData.status === 'open' ? 'Aktif' : 'Terpenuhi'}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-6">Detail Permintaan Tanaman</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Input
                      label="Nama Tanaman"
                      id="plantName"
                      name="plantName"
                      type="text"
                      placeholder="Contoh: Bibit Tomat, Cabai Rawit, dll."
                      value={formData.plantName}
                      onChange={handleChange}
                      error={errors.plantName}
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori Tanaman
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {plantCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Input
                      label="Lokasi"
                      id="location"
                      name="location"
                      type="text"
                      placeholder="Kota/Kecamatan Anda"
                      value={formData.location}
                      onChange={handleChange}
                      error={errors.location}
                    />
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah yang Dibutuhkan
                    </label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      placeholder="Masukkan jumlah"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.quantity}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Alasan Permintaan
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={6}
                    placeholder="Jelaskan mengapa Anda membutuhkan tanaman ini"
                    value={formData.reason}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  ></textarea>
                  {errors.reason && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.reason}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Minimal 10 karakter.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link href={`/requests/${id}`}>
                    <Button variant="text">
                      Batal
                    </Button>
                  </Link>

                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Memproses...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default EditRequestPage;