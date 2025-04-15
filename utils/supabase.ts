import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  featured_image?: string;
  category_id?: string;
  view_count: number;
  tags?: string[];
};

export type Author = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};
