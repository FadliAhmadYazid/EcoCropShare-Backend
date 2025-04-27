// Format date with optional time parameter
export const formatDate = (date: Date | string, includeTime = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Date(date).toLocaleDateString('id-ID', options);
};
  
  // Text excerpt utility
  export function getExcerpt(content: string, maxLength = 150): string {
    if (content.length <= maxLength) {
      return content;
    }
    
    return content.substring(0, maxLength) + '...';
  }
  
  // Time-based greeting
  export function getGreeting(): string {
    const hours = new Date().getHours();
    if (hours < 12) return "Selamat Pagi";
    if (hours < 15) return "Selamat Siang";
    if (hours < 19) return "Selamat Sore";
    return "Selamat Malam";
  }
  
  // Gets a default image based on category
  export function getCategoryImage(categoryId: string): string {
    switch (categoryId) {
      case 'planting':
        return 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      case 'fertilizer':
        return 'https://images.unsplash.com/photo-1584284867610-bf8330eeb4c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      case 'pest':
        return 'https://images.unsplash.com/photo-1634138237256-84deb5d3d999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      case 'harvest':
        return 'https://images.unsplash.com/photo-1598512358669-ef567ef1d6cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      default:
        return 'https://images.unsplash.com/photo-1585059895524-72359e06133a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }
  }
  
  // Format tag strings to array
  export function formatTags(tagsString: string): string[] {
    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
  }
  
  // Get relative time
  export function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Hari ini';
    } else if (diffInDays === 1) {
      return 'Kemarin';
    } else if (diffInDays < 7) {
      return `${diffInDays} hari yang lalu`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} minggu yang lalu`;
    } else {
      return formatDate(date);
    }
  }

// ID comparison utility for MongoDB/Mongoose IDs
export function compareIds(id1: any, id2: any): boolean {
  if (!id1 || !id2) return false;
  
  // Convert to string if id is an object
  const stringId1 = typeof id1 === 'object' ? 
    (id1._id?.toString() || id1.id?.toString()) : 
    id1.toString();
    
  const stringId2 = typeof id2 === 'object' ? 
    (id2._id?.toString() || id2.id?.toString()) : 
    id2.toString();
    
  return stringId1 === stringId2;
}

// Add this utility function to safely convert any object ID to string format

import { ObjectId } from 'mongoose';

/**
 * Safely converts any type of ID (string, ObjectId, or object with _id or id) to a string
 * @param id - The ID to convert (can be string, ObjectId, or object)
 * @returns A string representation of the ID
 */
export const getIdString = (id: string | ObjectId | { _id?: ObjectId | string, id?: string } | any): string => {
  if (!id) return '';
  
  if (typeof id === 'string') {
    return id;
  }
  
  if (typeof id === 'object') {
    // Check for _id property (Mongoose common pattern)
    if (id._id) {
      return typeof id._id === 'object' ? id._id.toString() : id._id;
    }
    
    // Check for id property (often used in serialized objects)
    if (id.id) {
      return id.id;
    }
    
    // If it's likely an ObjectId itself
    if (id.toString && typeof id.toString === 'function') {
      return id.toString();
    }
  }
  
  // Fallback - return an empty string if no valid ID format is found
  return '';
};