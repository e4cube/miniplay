# 万朝原创网页版：GameVado 中英双语接入

2026-10-24。以 miniplay 远程主分支为基础，独立工作目录 D:/GameDev/WanchaoGamevado；保留 D:/GameDev/WanchaoRTS 原工程及其未提交内容，未将 OpenRA 代码或素材复制入门户。

入口：`/games/wanchao`（英文介绍）、`/zh/games/wanchao`（中文介绍）、`/play/wanchao/index.html?lang=en` / `?lang=zh`（完整游戏）。游戏内右上角语言按钮切换并记忆选择，URL同步当前语言，不重置战局。

原版包含十一文明、五种模式、六章剧情、供能/科技/工程师/超武等已有机制。中文原文保持为数据源，本地英文词库翻译菜单、说明、剧情、HUD、提示和画布标签；不重写模拟状态、不修改存档ID。修正了原菜单仍写“三章”的过期说明，实际六章任务不变。

翻译源：scripts/wanchao-strings.json 与 wanchao-en.json；运行 `node scripts/build-wanchao-i18n.cjs` 重建客户端词库。已有493条映射；以后新增中文文案必须补入词库并验证，不能依赖机器联网翻译。图片沿用旧版原图，不重新绘制。

验证：

- `node scripts/wanchao-engine-smoke.cjs`：42项原版模拟检查通过。
- `node scripts/test-wanchao.cjs`：Chrome无头验证11文明、5模式、6章；中英文菜单、英文剧情、军令、帮助、存档；暂停战局切换两次语言后序列化完全相同；检查英文无残留中文文案（语言切换按钮除外）及无未翻译辅助属性；中英文门户入口可访问。
- `node node_modules/typescript/bin/tsc --noEmit` 与修改的TS/TSX文件ESLint检查通过。
- Next生产构建通过。隔离目录node_modules为本机依赖联接，因此本地用 `next build --webpack`，避免Turbopack的外部联接限制；线上使用正常依赖安装。

桌面键鼠为完整操作，触屏保留旧版能力，不宣称手机小竖屏已达到同等体验。没有新增联网功能；旧域名存档不自动迁移。英文文本为本地人工整理词库，不代表已逐关人工通关或全部屏幕尺寸验收。
