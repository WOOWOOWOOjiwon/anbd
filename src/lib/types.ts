export type ProductStatus = "selling" | "sold";

export type Product = {
  id: string;
  user_id: string;
  seller_nickname: string;
  title: string;
  description: string;
  price: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
};
