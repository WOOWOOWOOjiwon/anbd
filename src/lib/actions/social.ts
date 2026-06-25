"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// 좋아요(찜) 켜고 끄기 — 이미 눌렀으면 취소, 아니면 추가
export async function toggleLike(formData: FormData) {
  const productId = formData.get("product_id") as string;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: existing } = await supabase
    .from("product_likes")
    .select("product_id")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("product_likes")
      .delete()
      .eq("product_id", productId)
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("product_likes")
      .insert({ product_id: productId, user_id: user.id });
  }

  revalidatePath(`/products/${productId}`);
  revalidatePath("/products");
}

// 댓글 달기
export async function addComment(formData: FormData) {
  const productId = formData.get("product_id") as string;
  const content = ((formData.get("content") as string) ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!content) {
    redirect(
      `/products/${productId}?error=${encodeURIComponent("댓글 내용을 입력해 주세요.")}`
    );
  }

  const nickname =
    (user.user_metadata?.nickname as string) || user.email || "익명";

  const { error } = await supabase.from("product_comments").insert({
    product_id: productId,
    user_id: user.id,
    author_nickname: nickname,
    content,
  });

  if (error) {
    redirect(
      `/products/${productId}?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath(`/products/${productId}`);
  revalidatePath("/products");
}

// 내 댓글 지우기
export async function deleteComment(formData: FormData) {
  const commentId = formData.get("comment_id") as string;
  const productId = formData.get("product_id") as string;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("product_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  revalidatePath(`/products/${productId}`);
  revalidatePath("/products");
}
