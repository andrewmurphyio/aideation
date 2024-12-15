// types/index.ts
export interface Idea {
    id: number;
    text: string;
    status: 'pending' | 'liked' | 'disliked' | 'superliked';
  }