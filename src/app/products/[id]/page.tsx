import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { publicImageUrl } from "@/lib/storage";
import DeleteButton from "@/components/DeleteButton";
import type { Product } from "@/lib/types";

export default async function ProductDetailPage({
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

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle<Product>();

  if (!product) {
    notFound();
  }

  const isOwner = user?.id === product.user_id;

  return (
    <div className="px-4 py-10 max-w-2xl mx-auto">
      <Link href="/products" className="text-xs underline">
        ← 목록으로
      </Link>

      {error && (
        <p className="pixel-border bg-pixel-pink/20 text-xs p-2 mt-4 text-center">
          {error}
        </p>
      )}

      <div className="pixel-card p-6 mt-4 flex flex-col gap-4">
        {product.image_paths.length > 0 && (
          <div className="flex flex-col gap-3">
            {product.image_paths.map((path) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={path}
                src={publicImageUrl(path)}
                alt={product.title}
                className="product-photo w-full pixel-border"
              />
            ))}
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <h1 className="text-lg sm:text-xl break-keep">{product.title}</h1>
          {product.status === "sold" && (
            <span className="pixel-border bg-pixel-black text-white text-[10px] px-2 py-1 shrink-0">
              판매완료
            </span>
          )}
        </div>

        <p className="text-2xl text-pixel-orange">
          {product.price.toLocaleString("ko-KR")}원
        </p>

        <p className="text-[11px] text-pixel-black/60">
          판매자 {product.seller_nickname} ·{" "}
          {new Date(product.created_at).toLocaleDateString("ko-KR")}
        </p>

        {product.description && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap border-t-4 border-pixel-black/10 pt-4">
            {product.description}
          </p>
        )}

        {isOwner && (
          <div className="flex gap-2 border-t-4 border-pixel-black/10 pt-4">
            <Link
              href={`/products/${product.id}/edit`}
              className="pixel-btn bg-pixel-blue px-4 py-2 text-white text-xs"
            >
              수정
            </Link>
            <DeleteButton id={product.id} />
          </div>
        )}
      </div>
    </div>
  );
}
