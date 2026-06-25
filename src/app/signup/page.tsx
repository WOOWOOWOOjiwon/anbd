import Link from "next/link";
import { signup } from "@/lib/actions/auth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="pixel-card w-full max-w-sm p-6">
        <h1 className="text-lg mb-6 text-center">🎒 회원가입</h1>

        {error && (
          <p className="pixel-border bg-pixel-pink/20 text-xs p-2 mb-4 text-center">
            {error}
          </p>
        )}

        <form action={signup} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-xs">
            닉네임
            <input
              type="text"
              name="nickname"
              required
              maxLength={20}
              className="pixel-input px-3 py-2 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            이메일
            <input
              type="email"
              name="email"
              required
              className="pixel-input px-3 py-2 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            비밀번호 (6자 이상)
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="pixel-input px-3 py-2 text-sm"
            />
          </label>

          <button
            type="submit"
            className="pixel-btn bg-pixel-orange text-white py-2 mt-2"
          >
            가입하기
          </button>
        </form>

        <p className="text-xs text-center mt-6">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
