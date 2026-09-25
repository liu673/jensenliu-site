        /**
 * 简历数据 —— 全站唯一的简历数据源。
 *
 * 三个视角（engineer / product / story）读的是同一份数据，只是各取所需：
 *   - engineer：技术栈、架构、难点 → 给后端/算法面试官
 *   - product ：问题 → 方案 → 结果 → 指标 → 给 FDE/产品面试官
 *   - story   ：一句话叙事 + 时间线 → 给 HR 或想了解"这个人"的人
 *
 * 改简历只改这个文件，页面自动更新。
 */

export type ViewMode = "engineer" | "product" | "story";

export const VIEW_MODES: { id: ViewMode; label: string; hint: string }[] = [
  { id: "engineer", label: "工程师视角", hint: "技术栈、架构、难点" },
  { id: "product", label: "产品视角", hint: "问题、方案、结果" },
  { id: "story", label: "故事视角", hint: "时间线与转折点" },
];

/* ---------- 类型定义 ---------- */

export interface Profile {
  name: string;
  nameEn: string;
  /** 一句话定位，每个视角一版 */
  headline: Record<ViewMode, string>;
  /** 两三句自我介绍，每个视角一版 */
  summary: Record<ViewMode, string>;
  location: string;
  links: { github: string; site: string };
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  start: string; // YYYY
  end: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start: string; // YYYY-MM
  end: string | null; // null = 至今
  /** 故事视角：这段经历在职业路径里意味着什么，一两句 */
  story: string;
  engineer: {
    stack: string[];
    highlights: string[];
  };
  product: {
    problem: string;
    approach: string;
    outcomes: string[];
  };
  /** 关联的项目 id */
  projects: string[];
}

export interface Metric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  name: string;
  nameEn?: string;
  /** 主推项目在三个视角里都完整展示；非主推折叠 */
  featured: boolean;
  company: string;
  period: string;
  links?: { github?: string; demo?: string };
  /** 一句话，三个视角共用 */
  tagline: string;
  story: string;
  engineer: {
    stack: string[];
    architecture: string;
    challenges: string[];
  };
  product: {
    problem: string;
    solution: string;
    outcomes: string[];
    metrics?: Metric[];
  };
}

export interface SkillGroup {
  name: string;
  items: string[];
}

/** 故事视角的时间线节点：经历之外的转折点 */
export interface Milestone {
  date: string; // YYYY-MM
  title: string;
  note: string;
}

/* ---------- 数据 ---------- */

export const profile: Profile = {
  name: "刘全生",
  nameEn: "Jensen Liu",
  headline: {
    engineer: "NLP / 知识图谱方向的后端工程师，四年算法工程化与交付经验",
    product: "把 NLP 与大模型能力做成可交付产品的工程师，正走向 FDE 与产品方向",
    story: "从算法工程师出发，正在成为能独立把想法做成产品并交付到用户手里的人",
  },
  summary: {
    engineer:
      "四年 NLP 与知识图谱工程经验，覆盖 OCR 与信息抽取、实体识别与关系抽取、对话系统、图数据库建模与图算法。习惯把模型从实验推到生产：数据管线、服务化、性能调优与上线交付。",
    product:
      "在两家公司经历了从需求拆解到交付上线的完整闭环：与安全专家、产品经理、前后端协作，把模糊的业务需求转化为可落地的算法方案，并对交付结果负责。现在正把这种能力延伸到大模型应用与产品设计。",
    story:
      "2020 年入行做 NLP，四年里做过智能审核、安全知识图谱、金融客服机器人、航路规划。越做越发现自己最享受的不是调模型，而是把一个东西从想法推到别人手里能用的那一刻。现在正沿着这个方向重新出发。",
  },
  location: "中国",
  links: {
    github: "https://github.com/liu673",
    site: "https://jensenliu.dev",
  },
};

export const education: Education[] = [
  {
    school: "长治学院",
    degree: "本科",
    major: "计算机科学与技术",
    start: "2016",
    end: "2020",
  },
];

export const experiences: Experience[] = [
  {
    id: "anjihui",
    company: "北京安技汇科技有限公司",
    role: "NLP 算法工程师",
    start: "2022-03",
    end: "2024-11",
    story:
      "在这里从“做模型的人”变成了“对交付负责的人”：负责需求沟通与技术拆解，全链路推进项目落地，也是我第一次参与开源项目的建设与运营。",
    engineer: {
      stack: ["Python", "PyTorch", "Neo4j", "MySQL", "MITRE ATT&CK", "图算法"],
      highlights: [
        "网络安全文本的情感分析、关键词提取、文本分类与长文本信息抽取",
        "构建公司垂直领域知识图谱：Schema 设计、多源异构数据融合、Neo4j 存储与索引优化",
        "核心算法工程化：服务化部署、性能优化，按节点完成算法交付与代码上线",
      ],
    },
    product: {
      problem:
        "安全分析师面对海量日志、流量与情报文本，依赖人工关联分析，威胁发现慢、攻击链难以还原。",
      approach:
        "以知识图谱为底座整合多源数据，用图算法自动发现攻击路径；同时负责需求拆解与跨团队推进，确保方案能落进现有系统。",
      outcomes: [
        "复杂攻击行为识别率提升至 0.8，实现全天候监控与即时告警",
        "主导开源项目“白泽安全图谱”，沉淀为可复用的安全图谱运营平台",
        "与前后端、产品经理协作，多个项目按节点交付上线",
      ],
    },
    projects: ["whitepond", "traffic-kg"],
  },
  {
    id: "zhongbing",
    company: "北京中兵数字科技集团有限公司",
    role: "NLP 算法工程师",
    start: "2020-08",
    end: "2022-01",
    story:
      "入行的第一站。什么都做了一遍：实体识别、文本分类、对话机器人、知识图谱，甚至还有航路规划。是在这里建立了“数据 → 模型 → 系统”的完整认知。",
    engineer: {
      stack: ["Python", "TensorFlow", "PyTorch", "RASA", "Neo4j", "OCR", "BERT / Transformer"],
      highlights: [
        "非结构化数据到结构化数据的处理管线设计与实现",
        "实体识别、文本挖掘、文本分类、Chatbot、文本摘要、知识图谱等 NLP 应用研发",
        "深度学习模型的选型、训练、性能测试与调优",
        "南方航空路径规划算法实现（地形数据处理、单发离场、高空航路优化）",
      ],
    },
    product: {
      problem:
        "多个 B 端客户（国网、南航、金融机构）各有一套依赖人工的信息处理流程：专家资质审核、企业信息查询、航路规划。",
      approach:
        "针对每个场景把 NLP 能力封装成可集成的模块：OCR + 信息抽取做审核，RASA 做客服对话，知识图谱做企业关系分析。",
      outcomes: [
        "评标专家智能核查系统上线，审核周期缩短，获得用户高度评价",
        "FinBuff 客服机器人意图与实体识别准确率 0.85，实现秒级响应",
        "金融企业知识图谱平台实现大规模数据下的快速查询与可视化",
      ],
    },
    projects: ["expert-review", "finbuff", "finance-kg", "flight-route"],
  },
];

export const projects: Project[] = [
  {
    id: "whitepond",
    name: "白泽安全图谱",
    nameEn: "WhitePondSecurityKG",
    featured: true,
    company: "北京安技汇科技有限公司",
    period: "2022 – 2024",
    links: { github: "https://github.com/AJH-SEC/WhitePondSecurityKG" },
    tagline: "基于 MITRE ATT&CK 的开源网络安全知识图谱运营平台",
    story:
      "我参与过的唯一一个开源项目，也是第一次体会“用户反馈驱动迭代”是什么感觉——写文档、回 issue、发版本，这些事让我开始对产品本身产生兴趣。",
    engineer: {
      stack: ["Python", "Neo4j", "MITRE ATT&CK", "社区发现算法", "图查询优化"],
      architecture:
        "ATT&CK 数据 + 日志 / 流量记录 → 多源异构数据清洗与融合 → 图谱 Schema（战术 / 技术 / 攻击组织 / 资产）→ Neo4j 存储 → 图算法推理（社区发现、路径分析）→ 攻击点命中与溯源",
      challenges: [
        "围绕 ATT&CK 设计能同时承载静态知识与动态流量的 Schema，并定义命中规则",
        "多源数据的实体对齐与去重，保证图谱在持续写入下的一致性",
        "大规模图数据下的查询性能：索引策略与查询路径优化",
      ],
    },
    product: {
      problem:
        "安全团队做 APT 监测和攻击溯源时，ATT&CK 知识和实际流量数据是割裂的，分析靠人脑关联。",
      solution:
        "把 ATT&CK 框架和真实流量数据融合进同一个图谱，用社区发现算法自动揭示攻击链中的隐藏关系，并开源为可运营的基础平台。",
      outcomes: [
        "构建结构化的网络安全知识图谱，显著提升复杂攻击行为的识别能力",
        "参与前端页面设计，形成直观易用的分析界面",
        "持续更新文档与版本、响应社区反馈，积累了一批稳定用户",
      ],
      metrics: [{ label: "开源", value: "GitHub 公开" }],
    },
  },
  {
    id: "expert-review",
    name: "评标专家智能核查系统",
    featured: true,
    company: "北京中兵数字科技集团有限公司",
    period: "2020 – 2022",
    tagline: "OCR + 信息抽取 + 自动评分，让专家入库审核从人工走向智能",
    story:
      "第一个完整跟完“需求 → 模型 → 集成 → 上线 → 用户反馈”的项目，也是我第一次意识到模型准确率和用户满意度之间隔着一整套工程。",
    engineer: {
      stack: ["Python", "OCR", "信息抽取模型", "语义理解", "规则引擎", "系统集成"],
      architecture:
        "多格式文档（DOC / PDF / 图像）→ OCR 与预处理 → 深度学习信息抽取（年龄 / 职称 / 学历 / 专业类别）→ 语义理解与分类匹配 → 按国网审核标准的综合评分 → 审核结果与人工复核",
      challenges: [
        "文档格式与质量参差不齐，OCR 预处理直接决定后续抽取效果",
        "信息填报不规范、分类口径不统一，需要抽取模型与语义模块配合消歧",
        "把专家审核标准转化为可计算的评分体系，兼顾透明与公正",
      ],
    },
    product: {
      problem:
        "电子商务平台 ECP2.0 缺乏自动审核能力，专家库快速膨胀，人工审核既慢又难以保持一致。",
      solution:
        "构建覆盖 OCR、信息抽取、资质评分到系统集成的智能核查系统，自动化完成专家入库审核与日常信息维护。",
      outcomes: [
        "支持 DOC、PDF、图像等多种文档格式的自动化信息提取",
        "解决填报不规范与分类不准的问题，提升审核可靠性与一致性",
        "缩短审核周期，提高入库与评审的透明度，交付后获用户高度评价",
      ],
    },
  },
  {
    id: "traffic-kg",
    name: "智能流量检测分析系统",
    featured: true,
    company: "北京安技汇科技有限公司",
    period: "2022 – 2024",
    tagline: "用知识图谱在网络流量中发现攻击链",
    story:
      "第一次从需求分析做起、和领域专家一起定义 Schema。学会了一件事：在安全这种专业领域，工程师的价值一半在于把专家脑子里的东西翻译成数据模型。",
    engineer: {
      stack: ["Python", "Neo4j", "图算法（社区发现 / 最短路径）", "多源数据抽取", "实时告警"],
      architecture:
        "日志 / 流量 / 情报 / 文本报告 → 多源抽取与清洗 → 知识图谱（实体 + 关系 + 索引）→ 图算法推理 → 攻击模式与路径识别 → 集成至现有系统，实时更新与自动告警",
      challenges: [
        "与安全专家共同定义覆盖全部关键实体关系的 Schema，兼顾实用性与扩展性",
        "多源异构数据的质量与一致性治理",
        "大规模数据下图谱的高效存储、索引与查询",
      ],
    },
    product: {
      problem: "网络流量中的异常行为隐蔽且关联复杂，传统规则检测难以识别完整攻击链。",
      solution:
        "构建以知识图谱为核心的流量分析系统，用图算法揭示攻击路径，并集成到现有系统实现全天候监控与告警。",
      outcomes: [
        "复杂攻击行为识别率达到 0.8",
        "实现数据实时更新与自动化告警，提升告警准确性",
        "形成详尽的需求文档与架构设计，支撑后续扩展",
      ],
      metrics: [{ label: "攻击识别率", value: "0.8" }],
    },
  },
  {
    id: "finbuff",
    name: "FinBuff 金融客服机器人",
    featured: true,
    company: "北京中兵数字科技集团有限公司",
    period: "2020 – 2022",
    tagline: "基于 RASA 的多轮对话机器人，秒级检索企业信息",
    story:
      "做对话系统让我第一次直面“用户到底想问什么”这个问题。意图识别的准确率只是起点，会话流程设计才是用户体验的关键。",
    engineer: {
      stack: ["Python", "RASA", "实体识别", "意图识别", "上下文跟踪", "记忆槽"],
      architecture:
        "多源数据（企业内部 / 互联网采集 / 第三方）→ 语料库构建 → NLU（意图识别 + 实体识别）→ 对话管理（会话流程、记忆槽、上下文跟踪）→ 闲聊与多轮问答 → 用户反馈闭环",
      challenges: [
        "复杂文本中的关键实体（姓名 / 日期 / 金额）精准抽取",
        "多轮对话中保持上下文一致性与连贯性",
        "覆盖 FAQ、产品推荐、交易查询等多类场景的会话流程设计",
      ],
    },
    product: {
      problem: "用户查企业信息要在多个系统间切换、手工整合，耗时且难以支撑风控决策。",
      solution:
        "整合多源数据，构建理解用户意图的对话机器人，让用户用自然语言秒级获取企业信息。",
      outcomes: [
        "意图与实体识别准确率 0.85，实现秒级响应",
        "引入上下文感知与记忆槽机制，多轮对话保持一致",
        "建立用户反馈机制，持续迭代会话流程",
      ],
      metrics: [{ label: "识别准确率", value: "0.85" }],
    },
  },
  {
    id: "finance-kg",
    name: "金融企业知识图谱",
    featured: false,
    company: "北京中兵数字科技集团有限公司",
    period: "2020 – 2022",
    tagline: "集采集、存储、分析、融合、应用于一体的金融知识平台",
    story: "第一次接触知识图谱，从三元组到 Neo4j 到可视化，走完了一整条链路。",
    engineer: {
      stack: ["Python", "关系抽取", "实体统一 / 指代消解", "Neo4j", "规则引擎"],
      architecture:
        "多源数据清洗与标准化 → 关系抽取 / 实体统一 / 指代消解 → 三元组 → Neo4j 存储与索引 → 图谱可视化与查询界面 → 日常维护与扩展",
      challenges: [
        "噪声、缺失与格式不一致的多源数据治理",
        "深度学习模型 + 规则引擎的高精度实体统一",
        "大规模数据集上的查询性能优化",
      ],
    },
    product: {
      problem: "金融公司信息分散在多种来源，查询与关联分析效率低，影响决策与风控。",
      solution: "构建多源数据融合的知识图谱平台，提供直观的可视化查询。",
      outcomes: ["捕捉大量隐含的金融关系", "实现大规模数据下的快速查询与分析"],
    },
  },
  {
    id: "flight-route",
    name: "南航路径规划",
    featured: false,
    company: "北京中兵数字科技集团有限公司",
    period: "2020 – 2022",
    tagline: "面向单发离场、客舱释压等特殊情况的智能航路规划",
    story: "和 NLP 无关的一个项目，但让我学会了怎么快速进入一个完全陌生的领域。",
    engineer: {
      stack: ["Python", "地理数据处理（TIF）", "高程分析", "路径规划算法", "转弯曲线模型"],
      architecture:
        "机场与航路地形数据（TIF）转换清洗 → 障碍物高程判断与绕障评估 → 单发离场程序 → 航路路径规划与转弯模型 → 客舱释压备降路径与飘降程序",
      challenges: [
        "地形数据的转换、清洗与筛选",
        "单发离场的障碍物高程自动判断与绕障能力评估",
        "全球经纬度与高程信息的精确记录与快速响应",
      ],
    },
    product: {
      problem: "特殊飞行条件下的航路规划依赖精细化计算，人工方式慢且易出错。",
      solution: "开发适应不同飞行条件的智能路径规划系统，为机组提供最优决策支持。",
      outcomes: ["主导单发离场程序设计与实现", "集成备降与飘降程序到路径规划系统"],
    },
  },
];

export const skills: SkillGroup[] = [
  {
    name: "语言与基础",
    items: ["Python", "NumPy / Pandas", "Matplotlib", "MySQL", "Neo4j"],
  },
  {
    name: "NLP 与深度学习",
    items: [
      "PyTorch / TensorFlow",
      "BERT / Transformer / Attention",
      "NER / 关系抽取 / 文本分类",
      "Seq2Seq / LSTM / CRF / HMM",
      "OCR / SER / RE 智能文档",
      "RASA 对话系统",
    ],
  },
  {
    name: "知识图谱",
    items: ["Schema 设计", "多源数据融合", "Neo4j 建模与优化", "图算法（社区发现 / 路径分析）"],
  },
  {
    // TODO: 等你描述 2025 年以来的大模型实践后填充
    name: "大模型应用",
    items: ["（待补充）"],
  },
  {
    name: "工程与交付",
    items: ["算法服务化与部署", "性能优化", "需求拆解与跨团队推进", "开源项目维护"],
  },
];

export const milestones: Milestone[] = [
  { date: "2020-06", title: "毕业", note: "长治学院 计算机科学与技术" },
  { date: "2020-08", title: "入行 NLP", note: "加入中兵数字，第一份算法工程师工作" },
  { date: "2022-03", title: "转向安全领域", note: "加入安技汇，开始负责知识图谱与项目交付" },
  { date: "2024-11", title: "阶段结束", note: "四年 NLP 工程经验告一段落" },
  // TODO: 2024-11 之后的节点等你确定后补充
];

export const resume = { profile, education, experiences, projects, skills, milestones };
