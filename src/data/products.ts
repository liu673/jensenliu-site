/**
 * Lab 产品登记表 —— 网站只负责"登记和展示"产品，产品本身各自独立部署。
 *
 * 加一个产品 = 在下面数组里加一条记录，列表页和详情页自动生成。
 */

export type ProductType = "web" | "download" | "api";
export type ProductStatus = "idea" | "building" | "live";

export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  web: "在线使用",
  download: "下载",
  api: "接口",
};

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  live: "已上线",
  building: "开发中",
  idea: "构思中",
};

export interface Product {
  /** URL 里的标识：/lab/{slug}，只用小写字母、数字和连字符 */
  slug: string;
  name: string;
  /** 一句话：它是什么、给谁用 */
  tagline: string;
  type: ProductType;
  status: ProductStatus;
  /** 最近一次更新，YYYY-MM-DD */
  updated: string;
  stack: string[];
  links?: {
    /** 在线使用的地址（可以是子域名，也可以是站内路径） */
    use?: string;
    /** 下载地址，通常是 GitHub Releases */
    download?: string;
    github?: string;
  };
  /** 为什么做它：动机、要解决的问题 */
  why: string;
  /** 做的过程中学到的、踩的坑，可以随时追加 */
  notes?: string[];
}

export const products: Product[] = [
  // 第一个产品定下来后写在这里
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

/** 展示顺序：已上线 → 开发中 → 构思中，同状态内按更新时间倒序 */
export function sortedProducts() {
  const rank: Record<ProductStatus, number> = { live: 0, building: 1, idea: 2 };
  return [...products].sort(
    (a, b) => rank[a.status] - rank[b.status] || b.updated.localeCompare(a.updated),
  );
}
