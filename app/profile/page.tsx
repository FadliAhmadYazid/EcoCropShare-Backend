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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
              <div className="mb-4 sm:mb-0 sm:mr-8">
                <ProfileImage
                  src={formData.profileImage}
                  alt={formData.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{formData.name}</h1>
                <p className="text-gray-600 mb-1">{formData.email}</p>
                <p className="text-gray-700 mb-2">{formData.location}</p>

                {formData.favoritePlants && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.favoritePlants.split(',').map((plant, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {plant.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 sm:mt-0 sm:ml-auto">
                {!isEditing && !showPasswordForm && (
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                      setShowPasswordForm(false);
                    }}
                  >
                    Edit Profil
                  </Button>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="border-t border-gray-200 pt-6">
                <form onSubmit={handleUpdateProfile}>
                  <h3 className="text-xl font-semibold mb-4">Edit Profil</h3>

                  {submitError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                      {submitError}
                    </div>
                  )}

                  <div className="mb-4 flex items-center">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt={formData.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mr-4">
                        {formData.name.charAt(0)}
                      </div>
                    )}

                    <label htmlFor="profile-upload" className="cursor-pointer text-primary hover:text-primary-dark">
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

                  <div className="mb-4">
                    <Input
                      label="Nama Lengkap"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                    />
                  </div>

                  <div className="mb-4">
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">Email tidak dapat diubah</p>
                  </div>

                  <div className="mb-4">
                    <Input
                      label="Lokasi"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      error={errors.location}
                    />
                  </div>

                  <div className="mb-4">
                    <Input
                      label="Tanaman Favorit"
                      name="favoritePlants"
                      value={formData.favoritePlants}
                      onChange={handleInputChange}
                      helperText="Pisahkan dengan koma"
                    />
                  </div>

                  <div className="flex justify-end mt-6 space-x-3">
                    <Button
                      type="button"
                      variant="text"
                      onClick={() => setIsEditing(false)}
                    >
                      Batal
                    </Button>

                    <Button
                      type="submit"
                      isLoading={isLoading}
                    >
                      Simpan
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {showPasswordForm && (
              <div className="border-t border-gray-200 pt-6">
                <form onSubmit={handleUpdatePassword}>
                  <h3 className="text-xl font-semibold mb-4">Ubah Password</h3>

                  {submitError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                      {submitError}
                    </div>
                  )}

                  <div className="mb-4">
                    <Input
                      label="Password Saat Ini"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      error={passwordErrors.currentPassword}
                    />
                  </div>

                  <div className="mb-4">
                    <Input
                      label="Password Baru"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      error={passwordErrors.newPassword}
                    />
                  </div>

                  <div className="mb-4">
                    <Input
                      label="Konfirmasi Password"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      error={passwordErrors.confirmPassword}
                    />
                  </div>

                  <div className="flex justify-end mt-6 space-x-3">
                    <Button
                      type="button"
                      variant="text"
                      onClick={() => setShowPasswordForm(false)}
                    >
                      Batal
                    </Button>

                    <Button
                      type="submit"
                      isLoading={isLoading}
                    >
                      Simpan
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {!isEditing && !showPasswordForm && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Menu Pengaturan</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                      setShowPasswordForm(false);
                    }}
                    variant="outline"
                    className="justify-start"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Profil
                  </Button>

                  <Button
                    onClick={() => {
                      setShowPasswordForm(true);
                      setIsEditing(false);
                    }}
                    variant="outline"
                    className="justify-start"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Ubah Password
                  </Button>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Tanaman Favorit</h3>
                  {formData.favoritePlants ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.favoritePlants.split(',').map((plant, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full"
                        >
                          {plant.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-500 mb-4">Belum ada tanaman favorit</p>
                      <Button
                        onClick={() => {
                          setIsEditing(true);
                          setShowPasswordForm(false);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        + Tambahkan Tanaman Favorit
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
    </>
  );
};

export default ProfilePage;