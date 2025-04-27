import React, { useState } from 'react';

interface ProfileImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  className = "w-16 h-16 rounded-full object-cover",
  fallbackClassName = "w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold"
}) => {
  const [imageError, setImageError] = useState(false);
  
  // If no src or previous error, show fallback
  if (!src || imageError) {
    return (
      <div className={fallbackClassName}>
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        console.error(`Failed to load image from: ${src}`);
        setImageError(true);
      }}
    />
  );
};

export default ProfileImage;