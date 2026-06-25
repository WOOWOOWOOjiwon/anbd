import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateProduct } from "@/lib/actions/products";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle<Product>();

  if (!product) {
    notFound();
  }

  // 글쓴이가 아니면 자세히 보기로 돌려보냅니다.
  if (product.user_id !== user.id) {
    redirect(`/products/${id}`);
  }

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="pixel-card w-full max-w-md p-6">
        <h1 className="text-lg mb-6 text-center">🛠️ 판매글 수정</h1>

        {error && (
          <p className="pixel-border bg-pixel-pink/20 text-xs p-2 mb-4 text-center">
            {error}
          </p>
        )}

        <form action={updateProduct} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={product.id} />

          <label className="flex flex-col gap-1 text-xs">
            제목
            <input
              type="text"
              name="title"
              required
              maxLength={50}
              defaultValue={product.title}
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
              defaultValue={product.price}
              className="pixel-input px-3 py-2 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            설명
            <textarea
              name="description"
              rows={5}
              maxLength={1000}
              defaultValue={product.description}
              className="pixel-input px-3 py-2 text-sm resize-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            상태
            <select
              name="status"
              defaultValue={product.status}
              className="pixel-input px-3 py-2 text-sm"
            >
              <option value="selling">판매중</option>
              <option value="sold">판매완료</option>
            </select>
          </label>

          <div className="flex gap-2 mt-2">
            <Link
              href={`/products/${product.id}`}
              className="pixel-btn bg-pixel-cream px-3 py-2 text-xs flex-1 text-center"
            >
              취소
            </Link>
            <button
              type="submit"
              className="pixel-btn bg-pixel-blue text-white py-2 text-sm flex-1"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
