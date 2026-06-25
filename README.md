# 아나바다 마켓

귀여운 픽셀 아트 스타일의 중고거래 마켓 웹 서비스. Next.js + Supabase로 단계적으로 개발 중입니다.

## 현재 구현된 기능

- 회원가입 (이메일/비밀번호, 닉네임)
- 이메일 인증 (Supabase Auth)
- 로그인 / 로그아웃
- 픽셀 아트 디자인 (Galmuri 폰트)

## 시작하기

```bash
npm install
cp .env.local.example .env.local # Supabase URL/Key 입력
npm run dev
```

## 환경 변수

`.env.local`에 아래 값을 채워주세요 (Supabase 프로젝트 설정 > API 에서 확인):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 기술 스택

- Next.js (App Router)
- Supabase (Auth)
- Tailwind CSS
