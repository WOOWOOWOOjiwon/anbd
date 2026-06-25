import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { publicImageUrl } from "@/lib/storage";
import { addComment } from "@/lib/actions/social";
import DeleteButton from "@/components/DeleteButton";
import DeleteCommentButton from "@/components/DeleteCommentButton";
import LikeButton from "@/components/LikeButton";
import PixelEmoji from "@/components/PixelEmoji";
import type { Comment, Product } from "@/lib/types";

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

  // 좋아요 개수
  const { count: likeCount } = await supabase
    .from("product_likes")
    .select("*", { count: "exact", head: true })
    .eq("product_id", id);

  // 내가 이미 찜했는지
  let userLiked = false;
  if (user) {
    const { data: likeRow } = await supabase
      .from("product_likes")
      .select("product_id")
      .eq("product_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    userLiked = !!likeRow;
  }

  // 댓글 목록 (오래된 순)
  const { data: comments } = await supabase
    .from("product_comments")
    .select("*")
    .eq("product_id", id)
    .order("created_at", { ascending: true });
  const commentList = (comments as Comment[]) ?? [];

  return (
    <div className="px-4 py-10 max-w-2xl mx-auto">
      <Link href="/products" className="text-xs underline">
        ← 줍줍 목록으로
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
              처분완료
            </span>
          )}
        </div>

        <p className="text-2xl text-pixel-orange flex items-center gap-2">
          <PixelEmoji name="coin" size={24} />
          {product.price.toLocaleString("ko-KR")}원
        </p>

        <p className="text-[11px] text-pixel-black/60">
          주인장 {product.seller_nickname} ·{" "}
          {new Date(product.created_at).toLocaleDateString("ko-KR")}
        </p>

        {product.description && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap border-t-4 border-pixel-black/10 pt-4">
            {product.description}
          </p>
        )}

        {/* 좋아요 / 댓글 수 */}
        <div className="flex items-center gap-3 border-t-4 border-pixel-black/10 pt-4">
          <LikeButton
            productId={product.id}
            liked={userLiked}
            count={likeCount ?? 0}
          />
          <span className="text-xs flex items-center gap-1 text-pixel-black/60">
            <PixelEmoji name="comment" size={18} />
            댓글 {commentList.length}
          </span>
        </div>

        {isOwner && (
          <div className="flex gap-2 border-t-4 border-pixel-black/10 pt-4">
            <Link
              href={`/products/${product.id}/edit`}
              className="pixel-btn bg-pixel-blue px-4 py-2 text-white text-xs"
            >
              손보기
            </Link>
            <DeleteButton id={product.id} />
          </div>
        )}
      </div>

      {/* 댓글 섹션 */}
      <div className="pixel-card p-6 mt-4 flex flex-col gap-4">
        <h2 className="text-sm flex items-center gap-2">
          <PixelEmoji name="comment" size={20} />
          댓글 {commentList.length}
        </h2>

        {user ? (
          <form action={addComment} className="flex flex-col gap-2">
            <input type="hidden" name="product_id" value={product.id} />
            <textarea
              name="content"
              required
              rows={2}
              maxLength={500}
              placeholder="한 마디 거들어 보세요. (예: 더 안 깎아주세요?)"
              className="pixel-input px-3 py-2 text-sm resize-none"
            />
            <button
              type="submit"
              className="pixel-btn bg-pixel-green text-white py-2 text-xs self-end px-4"
            >
              댓글 달기
            </button>
          </form>
        ) : (
          <p className="text-xs text-pixel-black/60">
            댓글을 달려면{" "}
            <Link href="/login" className="underline">
              로그인
            </Link>{" "}
            하세요.
          </p>
        )}

        {commentList.length === 0 ? (
          <p className="text-xs text-pixel-black/40 text-center py-2">
            아직 댓글이 없어요. 첫 참견을 남겨보세요!
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {commentList.map((c) => (
              <li
                key={c.id}
                className="border-t-4 border-pixel-black/10 pt-3 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-pixel-black/60">
                    {c.author_nickname} ·{" "}
                    {new Date(c.created_at).toLocaleDateString("ko-KR")}
                  </span>
                  {user?.id === c.user_id && (
                    <DeleteCommentButton commentId={c.id} productId={product.id} />
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap break-words">
                  {c.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
