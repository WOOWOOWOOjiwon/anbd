"use client";

import { deleteProduct } from "@/lib/actions/products";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm("정말 갖다 버릴까요? 한 번 버리면 못 주워요!")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="pixel-btn bg-pixel-pink px-4 py-2 text-white text-xs"
      >
        갖다버리기
      </button>
    </form>
  );
}
