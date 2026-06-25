export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center gap-6">
      <h1 className="text-2xl sm:text-3xl">🥕 아나바다 마켓</h1>
      <p className="text-xs sm:text-sm max-w-md leading-relaxed">
        아껴쓰고, 나눠쓰고, 바꿔쓰고, 다시쓰는 우리 동네 중고거래 마켓이에요.
        <br />
        회원가입 후 물건을 올리고 거래해보세요!
      </p>

      <div className="pixel-card px-8 py-6 mt-4">
        <p className="text-xs">🛠️ 상품 등록 기능은 곧 추가될 예정이에요</p>
      </div>
    </div>
  );
}
