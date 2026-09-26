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
  {
    slug: "jd-match",
    name: "JD 匹配器",
    tagline: "把招聘要求和简历放在一起，看关键词对上了多少、缺了什么、哪些可以删。",
    type: "web",
    status: "live",
    updated: "2026-09-26",
    stack: ["Next.js", "TypeScript", "Intl.Segmenter 中文分词", "纯前端，无后端"],
    links: {
      use: "/tools/jd-match",
      github: "https://github.com/liu673/jensenliu-site/tree/main/src/lib/jd-match",
    },
    why: "我自己在改简历的时候，总是凭感觉判断和 JD 对不对得上。做这个工具是想把这件事变成能看见的东西：JD 在意的词，简历里到底有没有。它只算关键词覆盖率，不假装能预测录用结果——但改完再贴一次，看数字有没有变，这个反馈回路本身就很有用。",
    notes: [
      "中文分词用浏览器自带的 Intl.Segmenter，零依赖；但它会把“知识图谱”切成“知识”和“图谱”，所以先用一个术语词典把技术词整体抠出来，再分词。",
      "词典还负责同义词归并：大模型 / LLM、微调 / fine-tuning、知识图谱 / KG 算同一个词。",
      "第一版把“JavaScript”的别名“js”命中了“Next.js”里的“.js”，改成全局最长匹配优先才解决。",
      "所有计算都在浏览器里完成，简历内容不会离开你的设备。这不是技术选择，是这类工具的底线。",
    ],
  },
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
