'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ProfileImage from '@/components/common/ProfileImage';

const ProfilePage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    favoritePlants: '',
    profileImage: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }

    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        location: session.user.location || '',
        favoritePlants: session.user.favoritePlants?.join(', ') || '',
        profileImage: session.user.profileImage || '',
      });
    }
  }, [status, session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateProfileForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Password saat ini harus diisi';
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'Password baru harus diisi';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password minimal 6 karakter';
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setIsLoading(true);
    setSubmitError('');
    
    try {
      const favoritePlantsArray = formData.favoritePlants
        .split(',')
        .map(plant => plant.trim())
        .filter(plant => plant.length > 0);
      
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          favoritePlants: favoritePlantsArray,
          profileImage: formData.profileImage,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const data = await response.json();
      console.log('Profile update response:', data);
      
      // Explicitly update the session with the new data
      const updateResult = await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          location: formData.location,
          favoritePlants: favoritePlantsArray,
          profileImage: formData.profileImage,
        },
      });
      
      console.log('Session update result:', updateResult);
      
      // Fetch the updated session to verify changes
      // This isn't normally needed but helps for debugging
      const updatedSession = await fetch('/api/auth/session');
      const sessionData = await updatedSession.json();
      console.log('Updated session data:', sessionData);
      
      // Force a session refresh by reloading the page
      // This is a bit hacky but ensures the UI reflects the changes
      window.location.reload();
      
      setIsEditing(false);
      alert('Profil berhasil diperbarui');
    } catch (error: any) {
      setSubmitError(error.message || 'Terjadi kesalahan');
      console.error('Update profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      setShowPasswordForm(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      alert('Password berhasil diubah');
    } catch (error: any) {
      setSubmitError(error.message || 'Terjadi kesalahan');
      console.error('Update password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      try {
        setIsLoading(true);

        // Create FormData for upload
        const formData = new FormData();
        formData.append('file', files[0]);

        // Upload image to API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload image');
        }

        const data = await response.json();
        console.log('Upload response:', data); // Debug log

        if (!data.imageUrl) {
          throw new Error('No image URL returned from server');
        }

        // Update state formData with new image URL
        setFormData(prev => ({
          ...prev,
          profileImage: data.imageUrl
        }));

        // Optional: Show success notification
        alert('Profile photo uploaded successfully!');

      } catch (error: any) {
        console.error('Profile image upload error:', error);
        setSubmitError('Failed to upload image: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="mt-6 text-emerald-700 font-medium">Sedang memuat profil Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Profile Header with Background */}
          <div className="h-32 bg-gradient-to-r from-emerald-400 to-green-500 relative"></div>
          
          <div className="p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start relative">
              {/* Profile Image - Positioned to overlap the header */}
              <div className="mb-6 sm:mb-0 sm:mr-8 -mt-20">
                {formData.profileImage ? (
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
                    <ProfileImage
                      src={formData.profileImage}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-emerald-500 to-green-400 text-white flex items-center justify-center text-3xl font-bold">
                    {formData.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-800">{formData.name}</h1>
                <p className="text-gray-500 text-lg mb-1">{formData.email}</p>
                <div className="flex items-center justify-center sm:justify-start text-gray-600 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{formData.location}</span>
                </div>

                {formData.favoritePlants && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                    {formData.favoritePlants.split(',').map((plant, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full shadow-sm border border-emerald-200 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        {plant.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 sm:mt-0 sm:ml-auto">
                {!isEditing && !showPasswordForm && (
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                      setShowPasswordForm(false);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 transition-colors duration-300 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Profil
                  </Button>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="border-t border-gray-200 pt-8 mt-8">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profil
                  </h3>

                  {submitError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm border border-red-200 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {submitError}
                    </div>
                  )}

                  <div className="mb-6 flex items-center">
                    {formData.profileImage ? (
                      <div className="w-20 h-20 rounded-full border-2 border-emerald-200 shadow-md overflow-hidden mr-6">
                        <img
                          src={formData.profileImage}
                          alt={formData.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full border-2 border-emerald-200 shadow-md bg-gradient-to-br from-emerald-500 to-green-400 text-white flex items-center justify-center text-2xl font-bold mr-6">
                        {formData.name.charAt(0)}
                      </div>
                    )}

                    <label htmlFor="profile-upload" className="cursor-pointer bg-white text-emerald-600 hover:text-emerald-700 border border-emerald-300 hover:border-emerald-400 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Ubah Foto
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Input
                        label="Nama Lengkap"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={errors.name}
                        className="rounded-lg bg-gray-50 focus:bg-white transition-colors duration-200 border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="rounded-lg bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-500 italic">Email tidak dapat diubah</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Input
                        label="Lokasi"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        error={errors.location}
                        className="rounded-lg bg-gray-50 focus:bg-white transition-colors duration-200 border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <Input
                        label="Tanaman Favorit"
                        name="favoritePlants"
                        value={formData.favoritePlants}
                        onChange={handleInputChange}
                        helperText="Pisahkan dengan koma"
                        className="rounded-lg bg-gray-50 focus:bg-white transition-colors duration-200 border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8 space-x-4">
                    <Button
                      type="button"
                      variant="text"
                      onClick={() => setIsEditing(false)}
                      className="text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-100 border border-gray-300 transition-colors duration-200 px-6 py-2 rounded-lg"
                    >
                      Batal
                    </Button>

                    <Button
                      type="submit"
                      isLoading={isLoading}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors duration-200 px-6 py-2 rounded-lg shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Simpan Perubahan
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {showPasswordForm && (
              <div className="border-t border-gray-200 pt-8 mt-8">
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Ubah Password
                  </h3>

                  {submitError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm border border-red-200 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {submitError}
                    </div>
                  )}

                  <div className="max-w-md mx-auto space-y-4">
                    <div className="space-y-1">
                      <Input
                        label="Password Saat Ini"
                        name="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        error={passwordErrors.currentPassword}
                        className="rounded-lg bg-gray-50 focus:bg-white transition-colors duration-200 border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <Input
                        label="Password Baru"
                        name="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        error={passwordErrors.newPassword}
                        className="rounded-lg bg-gray-50 focus:bg-white transition-colors duration-200 border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <Input
                        label="Konfirmasi Password"
                        name="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        error={passwordErrors.confirmPassword}
                        className="rounded-lg bg-gray-50 focus:bg-white transition-colors duration-200 border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                      />
                    </div>

                    <div className="pt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                      <div className="font-medium mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Tips untuk password yang kuat:
                      </div>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Minimal 8 karakter</li>
                        <li>Kombinasi huruf besar dan kecil</li>
                        <li>Sertakan angka dan simbol</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-center mt-8 space-x-4">
                    <Button
                      type="button"
                      variant="text"
                      onClick={() => setShowPasswordForm(false)}
                      className="text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-100 border border-gray-300 transition-colors duration-200 px-6 py-2 rounded-lg"
                    >
                      Batal
                    </Button>

                    <Button
                      type="submit"
                      isLoading={isLoading}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors duration-200 px-6 py-2 rounded-lg shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Perbarui Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {!isEditing && !showPasswordForm && (
              <div className="mt-12">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Menu Pengaturan
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    onClick={() => {
                      setIsEditing(true);
                      setShowPasswordForm(false);
                    }}
                    className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer flex items-center"
                  >
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">Edit Profil</h4>
                      <p className="text-gray-500 text-sm mt-1">Ubah nama, lokasi, dan tanaman favorit</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => {
                      setShowPasswordForm(true);
                      setIsEditing(false);
                    }}
                    className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer flex items-center"
                  >
                    <div className="bg-emerald-100 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">Ubah Password</h4>
                      <p className="text-gray-500 text-sm mt-1">Perbarui password akun Anda</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Tanaman Favorit
                    </span>
                  </h3>
                  
                  {formData.favoritePlants ? (
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
                      <div className="flex flex-wrap gap-3">
                        {formData.favoritePlants.split(',').map((plant, index) => (
                          <div
                            key={index}
                            className="bg-white text-emerald-700 px-4 py-2 rounded-lg shadow-sm border border-emerald-200 flex items-center transition-all duration-300 hover:shadow-md"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            {plant.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-4">Belum ada tanaman favorit</p>
                      <Button
                        onClick={() => {
                          setIsEditing(true);
                          setShowPasswordForm(false);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors duration-200 px-4 py-2 rounded-lg shadow-md hover:shadow-lg inline-flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Tambah Tanaman Favorit
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;