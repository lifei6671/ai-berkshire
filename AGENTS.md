# AI Berkshire — Codex 项目指令

## 项目概述

AI Berkshire 是基于 Codex Skills 的价值投资研究框架。核心方法论来自巴菲特、芒格、段永平、李录四个视角，输出用于投资研究、财报分析、行业筛选、组合管理和买入后跟踪。

## 目录结构

```text
skills/          Codex Skill 目录，每个 Skill 使用 skills/<name>/SKILL.md
tools/           原始辅助工具脚本
reports/         投资研究报告输出
assets/          图片等静态资源
bin/             Codex Skill 一键安装器
package.json     npm/npx 包入口，bin 命令为 ai-berkshire
```

## Codex Skill 规则

- 每个 Skill 必须是目录式结构：`skills/<skill-name>/SKILL.md`。
- `SKILL.md` 必须包含 `name` 和 `description` frontmatter。
- 共享财务验算脚本位于：
  - `skills/financial-data/scripts/financial_rigor.py`
  - `skills/financial-data/scripts/report_audit.py`
- 涉及最新股价、财报、监管、新闻、管理层信息时，必须联网核验并标注来源日期和口径。
- 需要并行研究时，按无写冲突原则派发 Codex 子任务；单轮最多 5 个并行子任务，子任务返回结构化 Markdown，由主代理汇总。

## 报告目录与命名

公司报告按公司名建目录；行业、主题和组合报告可放 `reports/` 根目录。

```text
reports/{公司名}/
├── README.md
├── 01-商业模式分析-段永平视角.md
├── 02-财务估值分析-巴菲特视角.md
├── 03-行业竞争分析-芒格视角.md
├── 04-风险管理层评估-李录视角.md
└── 最终报告.md
```

## 投研分析原则

- 客观优先：事实用数据支撑，观点必须明确标注为观点或推测。
- 不预设看多或看空：先摆数据，再推逻辑，最后给结论。
- 关键数据至少两个独立来源交叉验证；误差超过 1% 必须说明。
- 涉及市值、PE、ROE、DCF、三情景估值时，使用 `financial_rigor.py` 精确计算，禁止心算。
- 不确定就写不确定；不要用推测填充确定性。

## 语言与风格

- 根据用户输入自动选择语言：含中文则输出中文；纯英文输入可输出英文。
- 风格直接、清晰、结论明确。
- 评分使用 1-5 星，不使用半星。
- 报告必须包含反面论据、风险清单和证伪条件。
