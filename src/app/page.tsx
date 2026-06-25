import Link from "next/link";
import PixelFace from "@/components/PixelFace";
import PixelEmoji from "@/components/PixelEmoji";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center gap-6">
      <div className="flex items-center justify-center gap-2">
        <PixelEmoji name="coin" size={28} />
        <PixelEmoji name="moneyFly" size={28} />
        <PixelEmoji name="ramen" size={28} />
      </div>

      <h1 className="text-2xl sm:text-3xl flex items-center justify-center gap-3">
        <PixelFace size={40} />
        아나바다 마켓
      </h1>

      <p className="pixel-border bg-pixel-orange/20 text-[11px] sm:text-xs px-3 py-1">
        💸 잔고는 텅텅, 살림은 알뜰알뜰 거지의 성지 💸
      </p>

      <p className="text-xs sm:text-sm max-w-md leading-relaxed">
        안 쓰는 물건은 한 푼이라도 챙기고,
        <br />
        텅 빈 지갑은 알뜰살뜰 채우는
        <br />
        우리 동네 거지... 아니, <b>알뜰</b> 마켓이에요.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Link
          href="/products"
          className="pixel-btn bg-pixel-blue px-6 py-3 text-white text-sm flex items-center justify-center gap-2"
        >
          <PixelEmoji name="coin" size={20} />
          줍줍하러 가기
        </Link>
        <Link
          href="/products/new"
          className="pixel-btn bg-pixel-green px-6 py-3 text-white text-sm flex items-center justify-center gap-2"
        >
          <PixelEmoji name="moneyFly" size={20} />
          한 푼이라도 벌기
        </Link>
      </div>

      <p className="text-[10px] text-pixel-black/50 mt-2">
        티끌 모아 티끌이라도... 일단 모아봅시다
      </p>
    </div>
  );
}
