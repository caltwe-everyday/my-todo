# My Todo

Next.js 14 App Router와 Tailwind CSS, Supabase를 사용한 깔끔한 다크 모드 할 일 관리 앱입니다.

## 기술 스택

- **Next.js 14** - App Router
- **Tailwind CSS** - 스타일링
- **Lucide React** - 아이콘
- **Supabase** - 데이터베이스
- **TypeScript**

## Supabase 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. **SQL Editor**에서 `supabase/migrations/001_create_todos_table.sql` 내용 실행
3. **Settings > API**에서 Project URL과 `anon` `public` 키 확인
4. 프로젝트 루트에 `.env.local` 생성:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 기능

- 할 일 추가
- 할 일 완료/미완료 토글
- 할 일 삭제
- 진행률 표시
- 다크 모드 UI
