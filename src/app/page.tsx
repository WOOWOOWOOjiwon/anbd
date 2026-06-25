import Link from "next/link";
import PixelFace from "@/components/PixelFace";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center gap-6">
      <h1 className="text-2xl sm:text-3xl flex items-center justify-center gap-3">
        <PixelFace size={40} />
        아나바다 마켓
      </h1>
      <p className="text-xs sm:text-sm max-w-md leading-relaxed">
        아껴쓰고, 나눠쓰고, 바꿔쓰고, 다시쓰는
        <br />
        우리 동네 중고거래 마켓이에요.
        <br />
        회원가입 후 물건을 올리고 거래해보세요!
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Link
          href="/products"
          className="pixel-btn bg-pixel-blue px-6 py-3 text-white text-sm"
        >
          🛒 물건 구경하기
        </Link>
        <Link
          href="/products/new"
          className="pixel-btn bg-pixel-green px-6 py-3 text-white text-sm"
        >
          ✏️ 물건 팔기
        </Link>
      </div>
    </div>
  );
}
