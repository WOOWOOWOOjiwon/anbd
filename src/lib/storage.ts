import type { SupabaseClient } from "@supabase/supabase-js";

// 사진을 보관하는 사진첩(Storage 버킷) 이름
export const PRODUCT_IMAGE_BUCKET = "product-images";

// 한 글에 올릴 수 있는 사진 수와 한 장당 최대 용량
export const MAX_IMAGES = 5;
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

// 사진첩에 저장된 위치(path)로 누구나 볼 수 있는 공개 주소를 만든다.
export function publicImageUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/${path}`;
}

type UploadResult =
  | { ok: true; paths: string[] }
  | { ok: false; error: string };

// 사진 파일들을 사진첩에 올리고, 저장된 위치 목록을 돌려준다.
// 중간에 실패하면 이미 올린 것들을 되돌린다(rollback).
export async function uploadProductImages(
  supabase: SupabaseClient,
  userId: string,
  files: File[]
): Promise<UploadResult> {
  if (files.length > MAX_IMAGES) {
    return { ok: false, error: `사진은 최대 ${MAX_IMAGES}장까지 올릴 수 있어요.` };
  }

  const paths: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      await rollback(supabase, paths);
      return { ok: false, error: "이미지 파일만 올릴 수 있어요." };
    }
    if (file.size > MAX_BYTES) {
      await rollback(supabase, paths);
      return { ok: false, error: "사진 한 장은 5MB 이하여야 해요." };
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    // 보안 규칙상 반드시 본인 user_id 폴더 아래에 저장해야 한다.
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(path, file, { contentType: file.type });

    if (error) {
      await rollback(supabase, paths);
      return { ok: false, error: error.message };
    }
    paths.push(path);
  }

  return { ok: true, paths };
}

async function rollback(supabase: SupabaseClient, paths: string[]) {
  if (paths.length > 0) {
    await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(paths);
  }
}
