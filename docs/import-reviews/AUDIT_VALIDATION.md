# 本次文档审查验证记录

日期：2026-10-22；工作分支 `feature/hexgl-original-review`；基线 `55c857e3f037a85eb477af8a5961e312bb39f6bf`。首次检查工作区干净，无用户未提交改动。

| 检查 | 本次真实结果 |
| --- | --- |
| `node scripts/verify-hexgl-upstream.mjs` | PASS，退出码 0：198 文件齐全，197 字节一致，只有原版 index.html 为已知接入补丁，无缺失 |
| `python ../validate_import_audit.py`（工作目录外的审查校验器） | PASS，退出码 0：198 原文件行 + 9 接入文件行；无重复/漏项；哈希与 manifest 一致；9 核心 NC 行全部 BLOCKED；MIT 副本字节一致；6 仓库固定 SHA/证据格式、9 工作流状态及本地 Markdown 链接通过；仅改 docs/import-reviews |
| `git diff --check` / 暂存后 `git diff --cached --check` | PASS，退出码 0；未重排原版文件 |
| 默认关闭 gate 与源码范围检查 | PASS（静态）：`src/proxy.ts` 仅显式 flag=1 放行，入口/详情/深层资源匹配规则保留；本次源文件无改动，不声称重新做了 HTTP 验证 |
| 官方候选取证 | 6 个固定版本仓库的元数据、目录和所列原文已读取，内容哈希见 CANDIDATE_EVIDENCE.json；未执行候选安装脚本 |
| 生产构建 / Playwright / 完整人手玩法 | **本次未重跑**（仅文档改动）；历史 build 和 Playwright 3/3 见 HEXGL.md 和原维护记录，不算本次新测试；人工三圈等仍未验收 |

台账条目计数：LICENSE_VERIFIED 36，UNKNOWN 161，BLOCKED 10（九个顶层核心文件及含 NC 核心的 package.zip）。这些是条目结论，不是整款游戏或商业发布通过率；归档内文件没有冒充已逐项清权。

校验器检查 CSV 集合与 `docs/hexgl/upstream-manifest.json` 完全一致、全部路径存在、证据字段和许可条件非空、NC 头部存在、MIT 字节相等、候选 URL 包含固定 SHA、所有本地 Markdown 链接目标存在、工作流枚举齐全、分支和文档改动范围。校验器未作为游戏源码加入仓库；交付归档保留其副本，便于复核。

没有修改其他游戏、公开注册表、HexGL 运行文件、广告/SEO/sitemap 或默认 gate；没有合并 main、公开发布或部署生产。外部权利人尚未联系，许可证结论仍是商业发布 BLOCKED。
