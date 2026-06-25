import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 사진 업로드를 위해 서버 액션 본문 크기 제한을 늘립니다. (기본 1MB)
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
