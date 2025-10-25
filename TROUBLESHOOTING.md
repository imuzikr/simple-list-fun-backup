# 트러블슈팅 가이드 (Troubleshooting Guide)

이 문서는 할 일 관리 앱(Todo List App) 개발 및 배포 중 발생할 수 있는 일반적인 문제와 해결 방법을 다룹니다.

## 목차

- [환경 변수 관련](#환경-변수-관련)
- [Supabase 연결 문제](#supabase-연결-문제)
- [인증 관련 문제](#인증-관련-문제)
- [빌드 및 배포 문제](#빌드-및-배포-문제)
- [로컬 개발 환경 문제](#로컬-개발-환경-문제)
- [데이터베이스 문제](#데이터베이스-문제)

---

## 환경 변수 관련

### ❌ 문제: "Supabase URL and Anon Key must be provided in environment variables"

**원인:** `.env` 파일이 없거나 환경 변수가 제대로 설정되지 않았습니다.

**해결 방법:**

1. 프로젝트 루트에 `.env` 파일 생성:
```bash
touch .env
```

2. 다음 내용 추가:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Supabase 대시보드에서 값 확인:
   - [Supabase Dashboard](https://app.supabase.com) → Project Settings → API

4. 개발 서버 재시작:
```bash
npm run dev
```

### ❌ 문제: 환경 변수가 업데이트되지 않음

**원인:** Vite는 서버 시작 시 환경 변수를 로드합니다.

**해결 방법:**

1. 개발 서버 종료 (Ctrl + C)
2. 서버 재시작: `npm run dev`

---

## Supabase 연결 문제

### ❌ 문제: "Failed to fetch" 또는 네트워크 오류

**원인:** Supabase URL이 잘못되었거나 네트워크 연결 문제입니다.

**해결 방법:**

1. **Supabase URL 확인:**
   - 올바른 형식: `https://[project-ref].supabase.co`
   - 슬래시(`/`) 없이 입력

2. **네트워크 연결 확인:**
```bash
ping your-project.supabase.co
```

3. **브라우저 콘솔 확인:**
   - F12 → Console 탭
   - 오류 메시지 확인

### ❌ 문제: "Invalid API key" 또는 401 오류

**원인:** Anon Key가 잘못되었거나 만료되었습니다.

**해결 방법:**

1. Supabase 대시보드에서 최신 키 복사
2. `.env` 파일 업데이트
3. 개발 서버 재시작

---

## 인증 관련 문제

### ❌ 문제: 로그인 후에도 로그인 페이지로 리디렉션됨

**원인:** 세션이 제대로 저장되지 않았거나 토큰이 만료되었습니다.

**해결 방법:**

1. **브라우저 콘솔 확인:**
```javascript
// 브라우저 콘솔에서 실행
localStorage.getItem('sb-[project-ref]-auth-token')
```

2. **로컬 스토리지 초기화:**
   - F12 → Application → Local Storage
   - 모든 항목 삭제
   - 페이지 새로고침

3. **다시 로그인 시도**

### ❌ 문제: "User already registered" 오류

**원인:** 해당 이메일로 이미 계정이 존재합니다.

**해결 방법:**

1. 로그인 탭으로 전환하여 로그인
2. 또는 비밀번호 재설정 기능 사용 (구현 시)

### ❌ 문제: 이메일 확인 메일이 오지 않음

**원인:** Supabase에서 이메일 확인이 활성화되어 있습니다.

**해결 방법:**

1. **개발 중에는 이메일 확인 비활성화:**
   - Supabase Dashboard → Authentication → Settings
   - "Enable email confirmations" 체크 해제

2. **프로덕션에서는 이메일 설정:**
   - SMTP 설정 또는 SendGrid/Resend 연동

---

## 빌드 및 배포 문제

### ❌ 문제: Netlify에서 "Secrets scanning found secrets in build" 오류

**원인:** Netlify가 빌드 파일에서 환경 변수를 감지했습니다.

**해결 방법:**

이미 `netlify.toml`에 해결책이 적용되어 있습니다:
```toml
[build.environment]
  SECRETS_SCAN_ENABLED = "false"
```

Supabase Anon Key는 클라이언트용이므로 공개되어도 안전합니다 (RLS로 보호됨).

### ❌ 문제: Netlify 배포 후 404 오류

**원인:** SPA 라우팅이 제대로 설정되지 않았습니다.

**해결 방법:**

`netlify.toml` 확인:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### ❌ 문제: Netlify에서 환경 변수가 작동하지 않음

**해결 방법:**

1. Netlify Dashboard → Site settings → Environment variables
2. 다음 변수 추가:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **중요:** `VITE_` 접두사 필수!
4. "Trigger deploy" → "Deploy site" 클릭

---

## 로컬 개발 환경 문제

### ❌ 문제: "Port 8080 is in use"

**원인:** 해당 포트가 이미 사용 중입니다.

**해결 방법:**

Vite가 자동으로 다른 포트를 찾습니다 (8081, 8082 등).
또는 특정 포트 지정:

```bash
npm run dev -- --port 3000
```

### ❌ 문제: "vite는 내부 또는 외부 명령이 아닙니다"

**원인:** node_modules가 설치되지 않았습니다.

**해결 방법:**

```bash
npm install
npm run dev
```

### ❌ 문제: Hot Module Replacement (HMR)가 작동하지 않음

**해결 방법:**

1. **개발 서버 재시작**
2. **브라우저 캐시 삭제:** Ctrl + Shift + R (강력 새로고침)
3. **node_modules 재설치:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 데이터베이스 문제

### ❌ 문제: "permission denied for table todos"

**원인:** RLS 정책이 제대로 설정되지 않았습니다.

**해결 방법:**

1. **Supabase SQL Editor에서 확인:**
```sql
-- RLS 활성화 확인
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'todos';

-- 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'todos';
```

2. **RLS 정책 재생성:**
```sql
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON public.todos;

-- 정책 재생성
CREATE POLICY "Users can view their own todos" ON public.todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" ON public.todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" ON public.todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" ON public.todos
  FOR DELETE USING (auth.uid() = user_id);
```

### ❌ 문제: 다른 사용자의 할 일이 보임

**원인:** RLS 정책이 제대로 적용되지 않았거나 user_id가 null입니다.

**해결 방법:**

1. **user_id 확인:**
```sql
SELECT id, text, user_id FROM todos;
```

2. **null user_id 데이터 삭제:**
```sql
DELETE FROM todos WHERE user_id IS NULL;
```

3. **user_id NOT NULL 제약 추가:**
```sql
ALTER TABLE todos ALTER COLUMN user_id SET NOT NULL;
```

### ❌ 문제: 실시간 동기화가 작동하지 않음

**원인:** Realtime이 활성화되지 않았거나 구독이 실패했습니다.

**해결 방법:**

1. **Supabase에서 Realtime 활성화:**
   - Database → Replication → Enable for `todos` table

2. **브라우저 콘솔에서 확인:**
```javascript
// 연결 상태 확인
console.log('Realtime connection:', supabase.channel('todos_changes').state)
```

---

## TypeScript 오류

### ❌ 문제: "Cannot find module '@/lib/supabase'" 또는 경로 오류

**원인:** TypeScript 경로 매핑이 제대로 설정되지 않았습니다.

**해결 방법:**

`tsconfig.json` 확인:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### ❌ 문제: "Type 'Database' does not satisfy the constraint"

**원인:** 데이터베이스 타입이 최신이 아닙니다.

**해결 방법:**

Supabase CLI로 타입 재생성 또는 `src/types/database.types.ts`를 수동으로 업데이트하세요.

---

## 일반적인 디버깅 팁

### 🔍 브라우저 개발자 도구 사용

```javascript
// 현재 사용자 확인
console.log('User:', supabase.auth.getUser())

// 세션 확인
console.log('Session:', supabase.auth.getSession())

// 모든 todos 조회 (RLS 무시하고 확인용)
```

### 🔍 Supabase 로그 확인

1. Supabase Dashboard → Logs
2. API logs, Auth logs 확인
3. 오류 메시지 및 요청 상태 확인

### 🔍 네트워크 탭 확인

1. F12 → Network 탭
2. 실패한 요청 확인
3. Status code 및 Response 확인

---

## 추가 도움이 필요하신가요?

- [Supabase 공식 문서](https://supabase.com/docs)
- [Vite 공식 문서](https://vitejs.dev/)
- [Netlify 공식 문서](https://docs.netlify.com/)
- [프로젝트 GitHub Issues](https://github.com/your-repo/issues)

---

## 자주 묻는 질문 (FAQ)

### Q: Supabase Anon Key를 노출해도 안전한가요?

A: 네, 안전합니다. Anon Key는 클라이언트에서 사용하도록 설계되었으며 Row Level Security (RLS)로 보호됩니다. 절대 노출하면 안 되는 것은 **Service Role Key**입니다.

### Q: 배포 후 로그인이 안 되는데요?

A: Netlify에 환경 변수(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)가 제대로 설정되었는지 확인하고, 재배포하세요.

### Q: 로컬에서는 되는데 배포 후 오류가 납니다

A: 
1. 환경 변수 확인 (Netlify Dashboard)
2. 빌드 로그 확인 (Netlify Deploy log)
3. 브라우저 콘솔 확인 (F12)

### Q: 이메일 확인 없이 바로 로그인하고 싶어요

A: Supabase Dashboard → Authentication → Settings → "Enable email confirmations" 체크 해제

---

**마지막 업데이트:** 2025년 1월

