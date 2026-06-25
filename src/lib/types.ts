export type ProductStatus = "selling" | "sold";

export type Product = {
  id: string;
  user_id: string;
  seller_nickname: string;
  title: string;
  description: string;
  price: number;
  status: ProductStatus;
  image_paths: string[];
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  product_id: string;
  user_id: string;
  author_nickname: string;
  content: string;
  created_at: string;
};
