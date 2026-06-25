"use client";

import { deleteProduct } from "@/lib/actions/products";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm("정말 이 판매글을 삭제할까요?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="pixel-btn bg-pixel-pink px-4 py-2 text-white text-xs"
      >
        삭제
      </button>
    </form>
  );
}
