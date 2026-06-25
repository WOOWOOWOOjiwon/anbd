"use client";

import { logout } from "@/lib/actions/auth";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="pixel-btn bg-pixel-pink px-3 py-2 text-white"
      >
        로그아웃
      </button>
    </form>
  );
}
