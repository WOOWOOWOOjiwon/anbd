import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateProduct } from "@/lib/actions/products";
import { createClient } from "@/lib/supabase/server";
import { publicImageUrl } from "@/lib/storage";
import PixelEmoji from "@/components/PixelEmoji";
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
        <h1 className="text-lg mb-6 text-center flex items-center justify-center gap-2">
          <PixelEmoji name="fire" size={22} />
          매물 손보기
        </h1>

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

          {product.image_paths.length > 0 && (
            <div className="flex flex-col gap-1 text-xs">
              현재 사진 (지우려면 체크하세요)
              <div className="grid grid-cols-3 gap-2">
                {product.image_paths.map((path) => (
                  <label
                    key={path}
                    className="flex flex-col gap-1 text-[10px] cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={publicImageUrl(path)}
                      alt=""
                      className="product-photo w-full aspect-square object-cover pixel-border"
                    />
                    <span className="flex items-center justify-center gap-1">
                      <input type="checkbox" name="remove_images" value={path} />
                      삭제
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <label className="flex flex-col gap-1 text-xs">
            사진 추가 (최대 5장, 한 장당 5MB까지)
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              className="pixel-input px-3 py-2 text-xs file:mr-3 file:border-2 file:border-pixel-black file:bg-pixel-cream file:px-2 file:py-1 file:text-xs file:cursor-pointer"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            상태
            <select
              name="status"
              defaultValue={product.status}
              className="pixel-input px-3 py-2 text-sm"
            >
              <option value="selling">팔리는 중</option>
              <option value="sold">처분완료</option>
            </select>
          </label>

          <div className="flex gap-2 mt-2">
            <Link
              href={`/products/${product.id}`}
              className="pixel-btn bg-pixel-cream px-3 py-2 text-xs flex-1 text-center"
            >
              관두기
            </Link>
            <button
              type="submit"
              className="pixel-btn bg-pixel-blue text-white py-2 text-sm flex-1"
            >
              다시 걸기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
