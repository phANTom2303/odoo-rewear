import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          points: number
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          points?: number
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          points?: number
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          type: string
          size: string
          condition: "new" | "like_new" | "good" | "fair" | "worn"
          tags: string[] | null
          images: string[] | null
          points_value: number
          status: "pending" | "approved" | "rejected" | "swapped"
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          type: string
          size: string
          condition: "new" | "like_new" | "good" | "fair" | "worn"
          tags?: string[] | null
          images?: string[] | null
          points_value?: number
          status?: "pending" | "approved" | "rejected" | "swapped"
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          type?: string
          size?: string
          condition?: "new" | "like_new" | "good" | "fair" | "worn"
          tags?: string[] | null
          images?: string[] | null
          points_value?: number
          status?: "pending" | "approved" | "rejected" | "swapped"
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      swaps: {
        Row: {
          id: string
          requester_id: string
          owner_id: string
          item_id: string
          status: "pending" | "accepted" | "declined" | "completed"
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          owner_id: string
          item_id: string
          status?: "pending" | "accepted" | "declined" | "completed"
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          owner_id?: string
          item_id?: string
          status?: "pending" | "accepted" | "declined" | "completed"
          message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
