export interface User {
  id: string;
  username: string;
  profilePicture: string;
  bio: string;
  following: string[]; 
  followers: string[];
  ratings: Rating[];
}

export interface Rating {
  userId: string;
  value: number; // 1-10
}

export interface Story {
  id: string;
  authorId: string;
  title: string;
  content: string;
  coverImage: string;
  likes: string[]; // array of userIds
  ratings: Rating[];
  createdAt: Date;
}

export type View =
  | { page: 'home' }
  | { page: 'story'; storyId: string }
  | { page: 'profile'; userId: string }
  | { page: 'write'; storyId?: string };