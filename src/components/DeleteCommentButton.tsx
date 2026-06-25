"use client";

import { deleteComment } from "@/lib/actions/social";

export default function DeleteCommentButton({
  commentId,
  productId,
}: {
  commentId: string;
  productId: string;
}) {
  return (
    <form
      action={deleteComment}
      onSubmit={(e) => {
        if (!confirm("이 댓글을 지울까요?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="comment_id" value={commentId} />
      <input type="hidden" name="product_id" value={productId} />
      <button
        type="submit"
        className="text-[10px] underline text-pixel-black/50"
      >
        지우기
      </button>
    </form>
  );
}
