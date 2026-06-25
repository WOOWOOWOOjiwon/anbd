"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// 판매글 만들기
export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = ((formData.get("title") as string) ?? "").trim();
  const description = ((formData.get("description") as string) ?? "").trim();
  const price = Number(formData.get("price"));

  if (!title) {
    redirect(`/products/new?error=${encodeURIComponent("제목을 입력해 주세요.")}`);
  }
  if (!Number.isFinite(price) || price < 0) {
    redirect(
      `/products/new?error=${encodeURIComponent("가격을 0원 이상의 숫자로 입력해 주세요.")}`
    );
  }

  const nickname =
    (user.user_metadata?.nickname as string) || user.email || "익명";

  const { data, error } = await supabase
    .from("products")
    .insert({
      user_id: user.id,
      seller_nickname: nickname,
      title,
      description,
      price: Math.floor(price),
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/products/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/products");
  redirect(`/products/${data.id}`);
}

// 판매글 수정하기
export async function updateProduct(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id") as string;
  const title = ((formData.get("title") as string) ?? "").trim();
  const description = ((formData.get("description") as string) ?? "").trim();
  const price = Number(formData.get("price"));
  const status = formData.get("status") === "sold" ? "sold" : "selling";

  if (!title) {
    redirect(
      `/products/${id}/edit?error=${encodeURIComponent("제목을 입력해 주세요.")}`
    );
  }
  if (!Number.isFinite(price) || price < 0) {
    redirect(
      `/products/${id}/edit?error=${encodeURIComponent("가격을 0원 이상의 숫자로 입력해 주세요.")}`
    );
  }

  // .eq("user_id", ...) 로 자기 글만 수정되게 한 번 더 막아둡니다. (보안 규칙도 함께 막아줌)
  const { error } = await supabase
    .from("products")
    .update({
      title,
      description,
      price: Math.floor(price),
      status,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect(`/products/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect(`/products/${id}`);
}

// 판매글 삭제하기
export async function deleteProduct(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect(`/products/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/products");
  redirect("/products");
}
