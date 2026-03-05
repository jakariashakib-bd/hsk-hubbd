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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      dialogues: {
        Row: {
          chinese: string
          english: string
          id: string
          lesson_id: string
          pinyin: string
          sort_order: number
          speaker: string
        }
        Insert: {
          chinese: string
          english: string
          id?: string
          lesson_id: string
          pinyin: string
          sort_order?: number
          speaker: string
        }
        Update: {
          chinese?: string
          english?: string
          id?: string
          lesson_id?: string
          pinyin?: string
          sort_order?: number
          speaker?: string
        }
        Relationships: [
          {
            foreignKeyName: "dialogues_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "hsk_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          correct_answer: string
          exercise_type: string
          id: string
          lesson_id: string
          options: Json | null
          question: string
          sort_order: number
        }
        Insert: {
          correct_answer: string
          exercise_type: string
          id?: string
          lesson_id: string
          options?: Json | null
          question: string
          sort_order?: number
        }
        Update: {
          correct_answer?: string
          exercise_type?: string
          id?: string
          lesson_id?: string
          options?: Json | null
          question?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "exercises_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "hsk_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      grammar_points: {
        Row: {
          example_chinese: string
          example_english: string
          example_pinyin: string
          explanation: string
          id: string
          lesson_id: string
          sort_order: number
          structure: string
        }
        Insert: {
          example_chinese: string
          example_english: string
          example_pinyin: string
          explanation: string
          id?: string
          lesson_id: string
          sort_order?: number
          structure: string
        }
        Update: {
          example_chinese?: string
          example_english?: string
          example_pinyin?: string
          explanation?: string
          id?: string
          lesson_id?: string
          sort_order?: number
          structure?: string
        }
        Relationships: [
          {
            foreignKeyName: "grammar_points_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "hsk_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      hsk_lessons: {
        Row: {
          created_at: string
          id: string
          lesson_number: number
          level: number
          title_chinese: string
          title_english: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_number: number
          level: number
          title_chinese: string
          title_english: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_number?: number
          level?: number
          title_chinese?: string
          title_english?: string
        }
        Relationships: []
      }
      mock_test_questions: {
        Row: {
          chinese_text: string | null
          correct_answer: string
          created_at: string
          explanation: string | null
          id: string
          level: number
          options: Json | null
          part: string
          passage: string | null
          pinyin_text: string | null
          question: string
          question_number: number
          question_type: string
          section: string
          sort_order: number
          test_number: number
        }
        Insert: {
          chinese_text?: string | null
          correct_answer: string
          created_at?: string
          explanation?: string | null
          id?: string
          level: number
          options?: Json | null
          part: string
          passage?: string | null
          pinyin_text?: string | null
          question: string
          question_number: number
          question_type: string
          section: string
          sort_order?: number
          test_number?: number
        }
        Update: {
          chinese_text?: string | null
          correct_answer?: string
          created_at?: string
          explanation?: string | null
          id?: string
          level?: number
          options?: Json | null
          part?: string
          passage?: string | null
          pinyin_text?: string | null
          question?: string
          question_number?: number
          question_type?: string
          section?: string
          sort_order?: number
          test_number?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_practice: {
        Row: {
          chinese: string
          english: string
          id: string
          lesson_id: string
          pinyin: string
        }
        Insert: {
          chinese: string
          english: string
          id?: string
          lesson_id: string
          pinyin: string
        }
        Update: {
          chinese?: string
          english?: string
          id?: string
          lesson_id?: string
          pinyin?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_practice_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "hsk_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vocabulary: {
        Row: {
          chinese: string
          english: string
          id: string
          lesson_id: string
          pinyin: string
          sort_order: number
          word_type: string
        }
        Insert: {
          chinese: string
          english: string
          id?: string
          lesson_id: string
          pinyin: string
          sort_order?: number
          word_type?: string
        }
        Update: {
          chinese?: string
          english?: string
          id?: string
          lesson_id?: string
          pinyin?: string
          sort_order?: number
          word_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "hsk_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
