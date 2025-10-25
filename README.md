# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5f4b960d-ae73-4694-8746-2791758e91d6

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5f4b960d-ae73-4694-8746-2791758e91d6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend & Database)

## Features

✅ **사용자 인증 (Authentication)**
- 이메일/비밀번호 회원가입 및 로그인
- 보호된 라우트 (Protected Routes)
- 사용자별 데이터 격리
- 자동 세션 관리

✅ **할 일 관리 (Todo Management)**
- 할 일 추가, 완료, 삭제 기능
- 전체/활성/완료 필터링
- 실시간 동기화 (여러 탭/디바이스 간 자동 동기화)
- 사용자별 개인 할 일 목록

✅ **Supabase 백엔드**
- PostgreSQL 데이터베이스
- Supabase Auth 인증
- 실시간 Realtime 구독
- Row Level Security (RLS) 적용
- 자동 updated_at 타임스탬프

## Environment Variables

이 프로젝트를 실행하려면 `.env` 파일에 다음 환경 변수가 필요합니다:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How can I deploy this project?

### Option 1: Netlify (추천)

1. **GitHub에 푸시**
```sh
git push origin main
```

2. **Netlify에 배포**
- [Netlify](https://app.netlify.com)에 로그인
- "New site from Git" 클릭
- GitHub 저장소 선택
- Build settings는 자동으로 감지됩니다 (netlify.toml 사용)
- "Deploy site" 클릭

3. **환경 변수 설정**
- Netlify 대시보드에서 "Site settings" → "Environment variables" 이동
- 다음 환경 변수 추가:
  - `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
  - `VITE_SUPABASE_ANON_KEY`: Supabase anon key
- "Redeploy" 클릭

**참고:** Supabase anon key는 클라이언트에서 사용하도록 설계되었으며 Row Level Security로 보호됩니다. `netlify.toml`에서 시크릿 스캐닝을 비활성화했습니다.

### Option 2: Lovable

Simply open [Lovable](https://lovable.dev/projects/5f4b960d-ae73-4694-8746-2791758e91d6) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
