export type FactionGroup = 'Imperium' | 'Chaos' | 'Xenos';
export type CommentType = 'comment' | 'used';
export type MatchResult = 'win' | 'loss' | 'draw';
export type NotificationType = 'like' | 'comment' | 'follow';

export const POINT_OPTIONS = [500, 1000, 1500, 2000, 3000] as const;
export type Points = (typeof POINT_OPTIONS)[number];

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export interface Faction {
  id: string;
  name: string;
  group: FactionGroup;
}

export interface Post {
  id: string;
  user_id: string;
  faction_id: string;
  points: number;
  title: string;
  concept: string | null;
  roster_text: string;
  photo_url: string | null;
  win: number;
  loss: number;
  draw: number;
  created_at: string;
  updated_at: string;
  // joined
  profiles?: Profile;
  factions?: Faction;
  likes_count?: number;
  comments_count?: number;
  used_count?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  type: CommentType;
  body: string | null;
  photo_url: string | null;
  result: MatchResult | null;
  opponent_faction_id: string | null;
  created_at: string;
  // joined
  profiles?: Profile;
  factions?: Faction;
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  actor_id: string;
  post_id: string | null;
  comment_id: string | null;
  read: boolean;
  created_at: string;
  // joined
  actor?: Profile;
  post?: Pick<Post, 'id' | 'title'>;
}

// --- Supabase Database types ---

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      factions: {
        Row: Faction;
        Insert: Omit<Faction, 'id'>;
        Update: Partial<Omit<Faction, 'id'>>;
      };
      posts: {
        Row: Omit<Post, 'profiles' | 'factions' | 'likes_count' | 'comments_count' | 'used_count'>;
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'profiles' | 'factions' | 'likes_count' | 'comments_count' | 'used_count'>;
        Update: Partial<Omit<Post, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'profiles' | 'factions' | 'likes_count' | 'comments_count' | 'used_count'>>;
      };
      comments: {
        Row: Omit<Comment, 'profiles' | 'factions'>;
        Insert: Omit<Comment, 'id' | 'created_at' | 'profiles' | 'factions'>;
        Update: Partial<Omit<Comment, 'id' | 'post_id' | 'user_id' | 'created_at' | 'profiles' | 'factions'>>;
      };
      likes: {
        Row: Like;
        Insert: Omit<Like, 'id' | 'created_at'>;
        Update: never;
      };
      follows: {
        Row: Follow;
        Insert: Omit<Follow, 'id' | 'created_at'>;
        Update: never;
      };
      notifications: {
        Row: Omit<Notification, 'actor' | 'post'>;
        Insert: Omit<Notification, 'id' | 'created_at' | 'actor' | 'post'>;
        Update: Partial<Pick<Notification, 'read'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
