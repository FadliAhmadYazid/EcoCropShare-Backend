import { ObjectId } from "mongoose";

// Extend the next-auth session type
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      location: string;
      favoritePlants: string[];
      profileImage?: string;
    };
  }
  
  interface User {
    id: string;
    name?: string;
    email?: string;
    location?: string;
    favoritePlants?: string[];
    profileImage?: string;
  }
}

export interface UserType {
  _id: ObjectId;
  id: string;
  name: string;
  email: string;
  location: string;
  favoritePlants: string[];
  profileImage?: string;
  createdAt: Date;
}

export interface PostType {
  _id: ObjectId;
  id: string;
  userId: string | ObjectId;
  title: string;
  type: 'seed' | 'harvest';
  exchangeType: 'barter' | 'free';
  quantity: number;
  location: string;
  images: string[];
  description: string;
  status: 'available' | 'completed';
  comments?: CommentType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestType {
  _id: ObjectId;
  id: string;
  userId: string | ObjectId | UserType;
  plantName: string;
  location: string;
  reason: string;
  category?: string;
  quantity?: string;
  status: 'open' | 'fulfilled';
  createdAt: Date;
  updatedAt: Date;
  comments?: CommentType[];
}

export interface ArticleType {
  _id: ObjectId;
  id: string;
  userId: string | ObjectId;
  title: string;
  content: string;
  image?: string;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentType {
  _id: ObjectId;
  id: string;
  userId: string | ObjectId;
  parentId: string | ObjectId;
  parentType: 'post' | 'request';
  content: string;
  createdAt: Date;
}

export interface HistoryType {
  _id: ObjectId;
  id: string;
  postId?: string | ObjectId;
  requestId?: string | ObjectId;
  userId: string | ObjectId;
  partnerId: string | ObjectId;
  plantName: string;
  date: Date;
  notes: string;
  type: 'post' | 'request';
}

export interface MessageType {
  _id: ObjectId;
  id: string;
  senderId: string | ObjectId | UserType;
  receiverId: string | ObjectId | UserType;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface ConversationType {
  _id: ObjectId;
  id: string;
  participants: (string | ObjectId | UserType)[];
  lastMessage: string;
  lastMessageDate: Date;
  unreadCount: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

// Frontend form data types
export interface LoginFormData {
  email: string;
  password: string;
}

// Add this helper to safely extract user ID as string from any user object
export const getUserId = (user: any): string => {
  if (!user) return '';
  if (typeof user === 'string') return user;
  
  if (typeof user === 'object') {
    if (user._id) return typeof user._id === 'object' ? user._id.toString() : user._id;
    if (user.id) return user.id;
  }
  
  return '';
};