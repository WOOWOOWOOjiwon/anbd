import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export default async function ProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (products as Product[]) ?? [];

  return (
    <div className="px-4 py-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg sm:text-xl">🛒 판매글 목록</h1>
        <Link
          href="/products/new"
          className="pixel-btn bg-pixel-green px-3 py-2 text-white text-xs"
        >
          ✏️ 글쓰기
        </Link>
      </div>

      {!user && (
        <p className="pixel-border bg-pixel-blue/20 text-xs p-3 mb-6 text-center">
          글을 쓰려면 로그인이 필요해요.
        </p>
      )}

      {list.length === 0 ? (
        <div className="pixel-card p-8 text-center text-xs">
          아직 올라온 판매글이 없어요. 첫 번째 물건을 올려보세요!
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.id}`}
                className="pixel-card p-4 flex flex-col gap-2 h-full hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm break-keep">{product.title}</h2>
                  {product.status === "sold" && (
                    <span className="pixel-border bg-pixel-black text-white text-[10px] px-2 py-1 shrink-0">
                      판매완료
                    </span>
                  )}
                </div>
                <p className="text-base text-pixel-orange">
                  {product.price.toLocaleString("ko-KR")}원
                </p>
                <p className="text-[11px] text-pixel-black/60 mt-auto">
                  {product.seller_nickname} ·{" "}
                  {new Date(product.created_at).toLocaleDateString("ko-KR")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
