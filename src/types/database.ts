export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Supabase JS v2가 기대하는 스키마 형태(GenericSchema)와 맞추기 위해
// Views / Functions / Enums / CompositeTypes / Relationships를 포함합니다.
export type Database = {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          text: string;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          text: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          text?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

/** DB Row 타입 - Supabase에서 조회한 원본 */
export type TodoRow = Database["public"]["Tables"]["todos"]["Row"];

/** 클라이언트에서 사용하는 Todo 타입 (createdAt을 Date로 변환) */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}
