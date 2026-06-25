"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  MAX_IMAGES,
  PRODUCT_IMAGE_BUCKET,
  uploadProductImages,
} from "@/lib/storage";

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

  // 첨부한 사진 파일들 (빈 칸은 거름)
  const files = formData
    .getAll("images")
    .filter((f): f is File => typeof f !== "string" && f.size > 0);

  let imagePaths: string[] = [];
  if (files.length > 0) {
    const result = await uploadProductImages(supabase, user.id, files);
    if (!result.ok) {
      redirect(`/products/new?error=${encodeURIComponent(result.error)}`);
    }
    imagePaths = result.paths;
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
      image_paths: imagePaths,
    })
    .select("id")
    .single();

  if (error) {
    // 글 저장에 실패하면 방금 올린 사진은 사진첩에서 지운다.
    if (imagePaths.length > 0) {
      await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(imagePaths);
    }
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

  // 글쓴이 확인 + 현재 사진 목록 가져오기
  const { data: existing } = await supabase
    .from("products")
    .select("image_paths, user_id")
    .eq("id", id)
    .maybeSingle<{ image_paths: string[]; user_id: string }>();

  if (!existing || existing.user_id !== user.id) {
    redirect(`/products/${id}`);
  }

  // 사용자가 "삭제" 체크한 기존 사진은 빼고, 나머지는 유지
  const removePaths = formData
    .getAll("remove_images")
    .filter((v): v is string => typeof v === "string");
  const keptPaths = existing.image_paths.filter(
    (p) => !removePaths.includes(p)
  );

  // 새로 첨부한 사진
  const newFiles = formData
    .getAll("images")
    .filter((f): f is File => typeof f !== "string" && f.size > 0);

  if (keptPaths.length + newFiles.length > MAX_IMAGES) {
    redirect(
      `/products/${id}/edit?error=${encodeURIComponent(`사진은 최대 ${MAX_IMAGES}장까지 올릴 수 있어요.`)}`
    );
  }

  let newPaths: string[] = [];
  if (newFiles.length > 0) {
    const result = await uploadProductImages(supabase, user.id, newFiles);
    if (!result.ok) {
      redirect(`/products/${id}/edit?error=${encodeURIComponent(result.error)}`);
    }
    newPaths = result.paths;
  }

  const finalPaths = [...keptPaths, ...newPaths];

  const { error } = await supabase
    .from("products")
    .update({
      title,
      description,
      price: Math.floor(price),
      status,
      image_paths: finalPaths,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    // 수정 실패 시 방금 올린 새 사진은 정리
    if (newPaths.length > 0) {
      await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(newPaths);
    }
    redirect(`/products/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  // 수정이 끝났으면 삭제 표시한 기존 사진을 사진첩에서도 정리
  if (removePaths.length > 0) {
    await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(removePaths);
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

  // 글을 지우기 전에 사진 위치를 먼저 확보 (지운 뒤엔 알 수 없으므로)
  const { data: existing } = await supabase
    .from("products")
    .select("image_paths")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle<{ image_paths: string[] }>();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect(`/products/${id}?error=${encodeURIComponent(error.message)}`);
  }

  // 글이 지워졌으면 사진첩의 사진도 함께 정리
  if (existing?.image_paths?.length) {
    await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .remove(existing.image_paths);
  }

  revalidatePath("/products");
  redirect("/products");
}
