import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import PixelFace from "@/components/PixelFace";

export default async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <header className="border-b-4 border-pixel-black bg-pixel-cream px-4 py-3 flex items-center justify-between">
      <Link
        href="/"
        className="text-base sm:text-lg tracking-tight flex items-center gap-2"
      >
        <PixelFace size={24} />
        아나바다
      </Link>

      <nav className="flex items-center gap-3 text-xs sm:text-sm">
        <Link href="/products" className="underline underline-offset-4">
          둘러보기
        </Link>
        {user ? (
          <>
            <span className="hidden sm:inline">
              {(user.user_metadata?.nickname as string) || user.email} 님
            </span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="pixel-btn bg-pixel-blue px-3 py-2 text-white"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="pixel-btn bg-pixel-orange px-3 py-2 text-white"
            >
              회원가입
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
