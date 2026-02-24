-- My Todo 앱 - todos 테이블 생성
-- Supabase SQL Editor에서 실행하거나, Supabase CLI로 마이그레이션 적용

-- todos 테이블
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- created_at 기준 내림차순 인덱스 (최신순 정렬용)
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON public.todos (created_at DESC);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_todos_updated_at ON public.todos;
CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON public.todos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS(Row Level Security) 활성화 - 추후 인증 연동 시 사용
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 익명 읽기/쓰기 정책 (개발용 - 프로덕션에서는 인증 기반 정책으로 교체)
DROP POLICY IF EXISTS "Allow all access for todos" ON public.todos;
CREATE POLICY "Allow all access for todos" ON public.todos
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 테이블 코멘트
COMMENT ON TABLE public.todos IS '할 일 목록';
COMMENT ON COLUMN public.todos.id IS '고유 식별자 (UUID)';
COMMENT ON COLUMN public.todos.text IS '할 일 내용';
COMMENT ON COLUMN public.todos.completed IS '완료 여부';
COMMENT ON COLUMN public.todos.created_at IS '생성 시각';
COMMENT ON COLUMN public.todos.updated_at IS '수정 시각';
