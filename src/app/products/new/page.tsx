import Link from "next/link";
import { redirect } from "next/navigation";
import { createProduct } from "@/lib/actions/products";
import { createClient } from "@/lib/supabase/server";
import PixelEmoji from "@/components/PixelEmoji";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="pixel-card w-full max-w-md p-6">
        <h1 className="text-lg mb-6 text-center flex items-center justify-center gap-2">
          <PixelEmoji name="moneyFly" size={22} />
          내다 팔기
        </h1>

        {error && (
          <p className="pixel-border bg-pixel-pink/20 text-xs p-2 mb-4 text-center">
            {error}
          </p>
        )}

        <form action={createProduct} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-xs">
            뭐 팔아요?
            <input
              type="text"
              name="title"
              required
              maxLength={50}
              placeholder="예) 안 쓰는 거 눈물의 처분합니다"
              className="pixel-input px-3 py-2 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            얼마 받게요? (원)
            <input
              type="number"
              name="price"
              required
              min={0}
              step={1}
              placeholder="0 (거의 거저면 더 잘 팔려요)"
              className="pixel-input px-3 py-2 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            구구절절 사연
            <textarea
              name="description"
              rows={5}
              maxLength={1000}
              placeholder="상태, 거래 방법, 눈물의 사연을 적어주세요."
              className="pixel-input px-3 py-2 text-sm resize-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            물건 자랑 사진 (최대 5장, 한 장당 5MB까지)
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              className="pixel-input px-3 py-2 text-xs file:mr-3 file:border-2 file:border-pixel-black file:bg-pixel-cream file:px-2 file:py-1 file:text-xs file:cursor-pointer"
            />
          </label>

          <div className="flex gap-2 mt-2">
            <Link
              href="/products"
              className="pixel-btn bg-pixel-cream px-3 py-2 text-xs flex-1 text-center"
            >
              관두기
            </Link>
            <button
              type="submit"
              className="pixel-btn bg-pixel-green text-white py-2 text-sm flex-1"
            >
              팔아치우기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
