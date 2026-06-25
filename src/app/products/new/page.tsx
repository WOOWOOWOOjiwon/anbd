import Link from "next/link";
import { redirect } from "next/navigation";
import { createProduct } from "@/lib/actions/products";
import { createClient } from "@/lib/supabase/server";

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
        <h1 className="text-lg mb-6 text-center">✏️ 판매글 쓰기</h1>

        {error && (
          <p className="pixel-border bg-pixel-pink/20 text-xs p-2 mb-4 text-center">
            {error}
          </p>
        )}

        <form action={createProduct} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-xs">
            제목
            <input
              type="text"
              name="title"
              required
              maxLength={50}
              placeholder="예) 거의 새것 자전거 팔아요"
              className="pixel-input px-3 py-2 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            가격 (원)
            <input
              type="number"
              name="price"
              required
              min={0}
              step={1}
              placeholder="0"
              className="pixel-input px-3 py-2 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            설명
            <textarea
              name="description"
              rows={5}
              maxLength={1000}
              placeholder="물건 상태, 거래 방법 등을 적어주세요."
              className="pixel-input px-3 py-2 text-sm resize-none"
            />
          </label>

          <div className="flex gap-2 mt-2">
            <Link
              href="/products"
              className="pixel-btn bg-pixel-cream px-3 py-2 text-xs flex-1 text-center"
            >
              취소
            </Link>
            <button
              type="submit"
              className="pixel-btn bg-pixel-green text-white py-2 text-sm flex-1"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
