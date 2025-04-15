export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string
          author_id: string
          created_at: string
          updated_at: string
          published: boolean
          featured_image: string | null
          category_id: string | null
          view_count: number
          tags: string[] | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt: string
          author_id: string
          created_at?: string
          updated_at?: string
          published?: boolean
          featured_image?: string | null
          category_id?: string | null
          view_count?: number
          tags?: string[] | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          author_id?: string
          created_at?: string
          updated_at?: string
          published?: boolean
          featured_image?: string | null
          category_id?: string | null
          view_count?: number
          tags?: string[] | null
        }
      }
      authors: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          bio: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar_url?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          bio?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_post_view: {
        Args: {
          post_id: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}