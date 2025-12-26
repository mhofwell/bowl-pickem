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
      app_metadata: {
        Row: {
          key: string
          value: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value?: string | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: string | null
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          created_at?: string
        }
      }
      pools: {
        Row: {
          id: string
          name: string
          invite_code: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          invite_code?: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          invite_code?: string
          created_by?: string
          created_at?: string
        }
      }
      pool_members: {
        Row: {
          id: string
          pool_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          pool_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          pool_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      games: {
        Row: {
          id: string
          name: string
          team1: string
          team2: string
          game_time: string
          location: string | null
          tv_channel: string | null
          winner: string | null
          team1_score: number | null
          team2_score: number | null
          is_final: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          team1: string
          team2: string
          game_time: string
          location?: string | null
          tv_channel?: string | null
          winner?: string | null
          team1_score?: number | null
          team2_score?: number | null
          is_final?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          team1?: string
          team2?: string
          game_time?: string
          location?: string | null
          tv_channel?: string | null
          winner?: string | null
          team1_score?: number | null
          team2_score?: number | null
          is_final?: boolean
          created_at?: string
        }
      }
      picks: {
        Row: {
          id: string
          user_id: string
          game_id: string
          picked_team: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          picked_team: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          picked_team?: string
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      get_user_score: {
        Args: { p_user_id: string }
        Returns: number
      }
    }
    Enums: Record<string, never>
  }
}

export type AppMetadata = {
  key: string
  value: string | null
  updated_at: string
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Pool = Database['public']['Tables']['pools']['Row']
export type PoolMember = Database['public']['Tables']['pool_members']['Row']
export type Game = Database['public']['Tables']['games']['Row']
export type Pick = Database['public']['Tables']['picks']['Row']
