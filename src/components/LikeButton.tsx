"use client";

import { toggleLike } from "@/lib/actions/social";
import PixelEmoji from "@/components/PixelEmoji";

export default function LikeButton({
  productId,
  liked,
  count,
}: {
  productId: string;
  liked: boolean;
  count: number;
}) {
  return (
    <form action={toggleLike}>
      <input type="hidden" name="product_id" value={productId} />
      <button
        type="submit"
        className={`pixel-btn px-4 py-2 text-xs flex items-center gap-2 ${
          liked ? "bg-pixel-pink text-white" : "bg-white"
        }`}
      >
        <PixelEmoji name="heart" size={18} />
        {liked ? "찜했어요" : "찜하기"} {count}
      </button>
    </form>
  );
}
