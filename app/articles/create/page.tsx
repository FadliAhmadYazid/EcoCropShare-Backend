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
import { getCategoryImage, formatTags } from '@/lib/utils';

const articleCategories = [
  { id: 'Cara Menanam', name: 'Cara Menanam', icon: 'M6 13.5V6.75m0 0l-3-3m3 3h2.25A8.25 8.25 0 0118 12v0m-12.75 3.75h9.75m-9.75 0l-3 3m3-3v2.25a8.25 8.25 0 0118 0v-2.25' },
  { id: 'Pupuk & Nutrisi', name: 'Pupuk & Nutrisi', icon: 'M3.75 7.5l16.5-4.125M12 6.75c-2.708 0-5.363.224-7.948.655C2.999 7.58 2.25 8.507 2.25 9.574v9.176A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.8-2.169A48.329 48.329 0 0012 6.75zm-1.5 3.75a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm6.75.75a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V11.25z' },
  { id: 'Hama & Penyakit', name: 'Hama & Penyakit', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
  { id: 'Panen & Pascapanen', name: 'Panen & Pascapanen', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' },
  { id: 'Edukasi Lainnya', name: 'Edukasi Lainnya', icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5' }
];

const CreateArticlePage = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: 'planting',
    featuredImage: '',
    tags: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    if (!formData.featuredImage) {
      setPreviewImage(getCategoryImage(formData.categoryId));
    }
  }, [formData.categoryId, formData.featuredImage]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      try {
        // Tampilkan loading state
        setIsUploading(true);

        // Buat FormData untuk upload
        const uploadData = new FormData();  // Renamed this variable
        uploadData.append('file', files[0]);

        // Upload gambar ke API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,  // Use the renamed variable
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to upload image');
        }

        // Update form data with the image URL
        setFormData((prev) => ({
          ...prev,
          featuredImage: data.imageUrl,
        }));

        // Also update the preview image
        setPreviewImage(data.imageUrl);

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
      newErrors.title = 'Judul artikel harus diisi';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Konten artikel harus diisi';
    } else if (formData.content.length < 100) {
      newErrors.content = 'Konten terlalu singkat (min. 100 karakter)';
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
      const tags = formatTags(formData.tags);

      const articleData = {
        title: formData.title,
        content: formData.content,
        image: previewImage,
        category: formData.categoryId,
        tags,
      };

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create article');
      }

      router.push('/articles');
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tulis Artikel Baru</h1>
          </div>

          <Link href="/articles" className="text-primary hover:text-primary-dark">
            Kembali
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit}>
                {submitError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                    {submitError}
                  </div>
                )}

                <div className="mb-6">
                  <Input
                    label="Judul Artikel"
                    name="title"
                    type="text"
                    placeholder="Masukkan judul artikel"
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {articleCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Input
                      label="Tag Artikel"
                      name="tags"
                      type="text"
                      placeholder="Pisahkan dengan koma"
                      value={formData.tags}
                      onChange={handleChange}
                      helperText="Contoh: berkebun, organik, hidroponik"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konten Artikel
                  </label>
                  <div>
                    <textarea
                      name="content"
                      rows={15}
                      placeholder="Tulis artikel di sini"
                      value={formData.content}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    ></textarea>
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.content}
                      </p>
                    )}
                    <div className="mt-1 text-sm text-gray-500 text-right">
                      {formData.content.length} karakter
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link href="/articles">
                    <Button variant="text">
                      Batal
                    </Button>
                  </Link>

                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Terbitkan Artikel
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {/* Image upload card */}
            <Card className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Gambar Artikel
                </h3>
              </div>

              <div className="mb-4">
                <div className="aspect-video w-full rounded-lg overflow-hidden mb-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1585059895524-72359e06133a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>

                <div className="text-sm text-gray-500 text-center">
                  <span>
                    {formData.featuredImage
                      ? 'Gambar diunggah'
                      : `Gambar default ${articleCategories.find(c => c.id === formData.categoryId)?.name}`}
                  </span>
                </div>
              </div>

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
            </Card>

            {/* Preview card */}
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  Pratinjau
                </h3>
              </div>

              <div>
                <div className="relative rounded-lg overflow-hidden mb-4 aspect-video w-full">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1585059895524-72359e06133a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  {formData.categoryId && (
                    <div className="absolute bottom-2 left-2">
                      <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                        {articleCategories.find(c => c.id === formData.categoryId)?.name}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-lg mb-2">
                    {formData.title || 'Judul Artikel'}
                  </h4>

                  <div className="flex items-center mb-3 text-sm text-gray-500">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">
                      {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <span>{session?.user?.name || 'Nama Penulis'}</span>
                    <span className="mx-1">•</span>
                    <span>
                      Baru saja
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {formData.content || 'Konten artikel akan muncul di sini...'}
                  </p>

                  {formData.tags && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {formatTags(formData.tags).slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs text-gray-500">
                          #{tag}
                        </span>
                      ))}
                      {formatTags(formData.tags).length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{formatTags(formData.tags).length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CreateArticlePage;