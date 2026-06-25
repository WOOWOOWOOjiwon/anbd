import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { publicImageUrl } from "@/lib/storage";
import PixelEmoji from "@/components/PixelEmoji";
import type { Product } from "@/lib/types";

// 목록에서는 좋아요/댓글 개수도 함께 가져온다.
type ProductListItem = Product & {
  product_likes: { count: number }[];
  product_comments: { count: number }[];
};

export default async function ProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products } = await supabase
    .from("products")
    .select("*, product_likes(count), product_comments(count)")
    .order("created_at", { ascending: false });

  const list = (products as ProductListItem[]) ?? [];

  return (
    <div className="px-4 py-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg sm:text-xl flex items-center gap-2">
          <PixelEmoji name="coin" size={24} />
          거지마켓 매물
        </h1>
        <Link
          href="/products/new"
          className="pixel-btn bg-pixel-green px-3 py-2 text-white text-xs flex items-center gap-1"
        >
          <PixelEmoji name="moneyFly" size={16} />
          내다팔기
        </Link>
      </div>

      {!user && (
        <p className="pixel-border bg-pixel-blue/20 text-xs p-3 mb-6 text-center">
          한 푼이라도 벌려면 로그인부터! (거지도 회원제예요)
        </p>
      )}

      {list.length === 0 ? (
        <div className="pixel-card p-8 text-center text-xs flex flex-col items-center gap-3">
          <PixelEmoji name="moneyFly" size={40} />
          매물이 텅 비었어요. 텅장처럼요.
          <br />첫 줍줍거리를 풀어주세요!
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((product) => {
            const likeCount = product.product_likes[0]?.count ?? 0;
            const commentCount = product.product_comments[0]?.count ?? 0;
            return (
              <li key={product.id}>
                <Link
                  href={`/products/${product.id}`}
                  className="pixel-card p-4 flex flex-col gap-2 h-full hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
                >
                {product.image_paths.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={publicImageUrl(product.image_paths[0])}
                    alt=""
                    className="product-photo w-full aspect-square object-cover pixel-border"
                  />
                ) : (
                  <div className="w-full aspect-square pixel-border bg-pixel-cream flex items-center justify-center text-[10px] text-pixel-black/40">
                    사진은 셀프 상상
                  </div>
                )}
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm break-keep">{product.title}</h2>
                  {product.status === "sold" && (
                    <span className="pixel-border bg-pixel-black text-white text-[10px] px-2 py-1 shrink-0">
                      처분완료
                    </span>
                  )}
                </div>
                <p className="text-base text-pixel-orange">
                  {product.price.toLocaleString("ko-KR")}원
                </p>
                <div className="flex items-center justify-between gap-2 mt-auto">
                  <p className="text-[11px] text-pixel-black/60">
                    {product.seller_nickname} ·{" "}
                    {new Date(product.created_at).toLocaleDateString("ko-KR")}
                  </p>
                  <span className="flex items-center gap-2 text-[11px] text-pixel-black/60 shrink-0">
                    <span className="flex items-center gap-0.5">
                      <PixelEmoji name="heart" size={14} />
                      {likeCount}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <PixelEmoji name="comment" size={14} />
                      {commentCount}
                    </span>
                  </span>
                </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
