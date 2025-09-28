// FIX: Removed self-import of 'User' type which was causing a conflict with its own declaration.

export interface User {
  id: string;
  username: string;
  profilePicture: string;
  following: string[];
  followers: string[];
  socialLinks?: {
    google?: string;
    facebook?: string;
  }
}

export interface Rating {
  userId: string;
  score: number; // 1 to 10
}

export interface Story {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  authorId: string;
  ratings: Rating[];
  likes: string[]; // Array of user IDs
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  authorId: string;
  likes: string[]; // Array of user IDs
}