/**
 * 停用词：JD 和简历里高频但对匹配没有信息量的词。
 * 包括中文虚词、JD 套话动词（熟悉 / 掌握 / 负责）、英文功能词。
 */
const zh = `
的 了 和 是 在 有 及 与 或 等 等等 我们 你 我 他 她 它 这 那 这些 那些 以及 对 为 以 并 将 从 到 上 下 中 内 外
能 会 要 可 可以 需要 需 具备 具有 拥有 熟悉 了解 掌握 精通 熟练 负责 参与 主导 相关 经验 能力 工作 岗位 职责 要求 任职
优先 以上 以下 年 者 及其 其 各 该 本 进行 通过 使用 完成 实现 提供 支持 包括 包含 但 不限于 不 无 非 很 更 最 较 也 都 还
就 才 又 而 且 如 若 则 因 所以 因此 于 由 向 给 被 把 让 用 做 人 名 位 个 项 种 类 些 每 各种 良好 较强 优秀 强 好 高
大 小 多 少 新 老 快 慢 一定 相应 一 二 三 四 五 六 七 八 九 十 两 第 及时 积极 主动 认真 细致 严谨 责任心 沟通 学习 团队
合作 协作 意识 精神 热情 抗压 压力 加分 优先考虑 本科 硕士 博士 学历 专业 计算机 毕业 全日制 公司 业务 产品 项目 系统
用户 客户 需求 方案 问题 场景 领域 方向 技术 开发 设计 研发 工程师 工程 平台 服务 应用 功能 模块 流程
过程 结果 效果 质量 效率 性能 稳定 优化 提升 改进 推动 推进 落地 交付 上线 部署 维护 迭代 持续 建设 构建 搭建 编写 撰写
输出 制定 协助 配合 跟进 对接 分析 处理 解决 保证 确保 达成 目标 计划 阶段 内容 方式 方法 工具 资源 信息 情况 关系
以及其 或者 并且 同时 另外 此外 其中 其他 其它 例如 比如 如何 什么 怎么 为什么 是否 能够 应该 必须 可能 已经 正在 曾经
独立 背景 定义 共同 管理 类似 面对 深入 生产 验收 转化 进度 高度 定期 版本 科技 有限公司 集团 密切 相应 一定 及以上`;

const en = `
the a an and or of to in for with on at by is are be as we you our your will can ability abilities experience experienced
skills skill required require requirements preferred plus strong good excellent great years year etc including include
including but not limited responsible responsibility responsibilities work working team teams knowledge familiar familiarity
proficient proficiency understanding understand build building develop developing development design designing
`;

export const STOPWORDS = new Set<string>(
  [...zh.split(/\s+/), ...en.split(/\s+/)].map((w) => w.trim().toLowerCase()).filter(Boolean),
);
