import Link from "next/link";
import { login } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="pixel-card w-full max-w-sm p-6">
        <h1 className="text-lg mb-6 text-center">🔑 로그인</h1>

        {error && (
          <p className="pixel-border bg-pixel-pink/20 text-xs p-2 mb-4 text-center">
            {error}
          </p>
        )}

        <form action={login} className="flex flex-col gap-4">
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
            비밀번호
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
            className="pixel-btn bg-pixel-blue text-white py-2 mt-2"
          >
            로그인
          </button>
        </form>

        <p className="text-xs text-center mt-6">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
