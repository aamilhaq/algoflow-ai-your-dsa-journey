export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          slug: string
          title: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          slug: string
          title: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          slug?: string
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      problems: {
        Row: {
          company_tags: string[]
          constraints: string | null
          created_at: string
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          examples: Json
          hints: string[]
          id: string
          order: number
          slug: string
          solution: string | null
          starter_code: Json
          title: string
          topic_id: string | null
        }
        Insert: {
          company_tags?: string[]
          constraints?: string | null
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          examples?: Json
          hints?: string[]
          id?: string
          order?: number
          slug: string
          solution?: string | null
          starter_code?: Json
          title: string
          topic_id?: string | null
        }
        Update: {
          company_tags?: string[]
          constraints?: string | null
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          examples?: Json
          hints?: string[]
          id?: string
          order?: number
          slug?: string
          solution?: string | null
          starter_code?: Json
          title?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problems_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_level: number
          email: string | null
          id: string
          last_active_date: string | null
          name: string | null
          streak: number
          updated_at: string
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_level?: number
          email?: string | null
          id: string
          last_active_date?: string | null
          name?: string | null
          streak?: number
          updated_at?: string
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_level?: number
          email?: string | null
          id?: string
          last_active_date?: string | null
          name?: string | null
          streak?: number
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      revisions: {
        Row: {
          completed: boolean
          created_at: string
          due_date: string
          id: string
          stage: number
          topic_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          due_date: string
          id?: string
          stage?: number
          topic_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          due_date?: string
          id?: string
          stage?: number
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revisions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          code: string
          id: string
          language: string
          problem_id: string
          runtime_ms: number | null
          status: Database["public"]["Enums"]["submission_status"]
          submitted_at: string
          user_id: string
        }
        Insert: {
          code: string
          id?: string
          language?: string
          problem_id: string
          runtime_ms?: number | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string
          user_id: string
        }
        Update: {
          code?: string
          id?: string
          language?: string
          problem_id?: string
          runtime_ms?: number | null
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          estimated_hours: number
          icon: string | null
          id: string
          name: string
          order: number
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          estimated_hours?: number
          icon?: string | null
          id?: string
          name: string
          order?: number
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          estimated_hours?: number
          icon?: string | null
          id?: string
          name?: string
          order?: number
          slug?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completion_percentage: number
          id: string
          last_accessed: string
          questions_solved: number
          topic_id: string
          user_id: string
        }
        Insert: {
          completion_percentage?: number
          id?: string
          last_accessed?: string
          questions_solved?: number
          topic_id: string
          user_id: string
        }
        Update: {
          completion_percentage?: number
          id?: string
          last_accessed?: string
          questions_solved?: number
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          avatar_url: string | null
          current_level: number | null
          id: string | null
          name: string | null
          streak: number | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          current_level?: number | null
          id?: string | null
          name?: string | null
          streak?: number | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          current_level?: number | null
          id?: string | null
          name?: string | null
          streak?: number | null
          xp?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty_level: "Easy" | "Medium" | "Hard"
      submission_status:
        | "Accepted"
        | "Wrong Answer"
        | "Time Limit Exceeded"
        | "Runtime Error"
        | "Pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      difficulty_level: ["Easy", "Medium", "Hard"],
      submission_status: [
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Runtime Error",
        "Pending",
      ],
    },
  },
} as const
