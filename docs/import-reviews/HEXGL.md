# HexGL 商业授权专项审查

审查日期：2026-10-22。用途：GameVado 带广告商业网站。结论 **C：暂停商业发布，优先取得权利人书面许可**。这是证据驱动的发布控制结论，不表示已获得律师或权利人确认。

| 项目 | 状态 / 事实 |
| --- | --- |
| 总体状态 | `BLOCKED` |
| 技术验收 | `TECH_VERIFIED`，沿用下述既有实测；仍有人工作业未完成 |
| 许可证验收 | `BLOCKED`；同时存在 `UNKNOWN` 素材、依赖和权属问题 |
| 商业发布 | **不允许批准**，未进入 `LICENSE_VERIFIED` / `READY_FOR_RELEASE` |
| 公开入口 | 保持默认关闭；不合并 main、不部署生产 |
| 官方仓库 / 分支 | https://github.com/BKcore/HexGL / master |
| 固定上游 SHA | `6addc95a2fce3bf05f4d751823cc054c61a16d68` |
| 移植基线 | GameVado `55c857e3f037a85eb477af8a5961e312bb39f6bf`，`feature/hexgl-original-review` |
| 本地路径 | `/play/hexgl/`，只在受控本地审核服务开启 |

## 审查范围与逐文件台账

[HEXGL_FILE_AUDIT.csv](HEXGL_FILE_AUDIT.csv) 对原版 **198 个文件逐行记录**路径、来源、原始 SHA-256、版权、许可证、商业使用/修改/再分发条件、署名、证据编号、结论和遗留问题；另列 9 个直接接入文件。原始完整性清单为 [upstream-manifest.json](../hexgl/upstream-manifest.json)。`UNKNOWN` 不是许可，`BLOCKED` 不是通过删除声明可以解除的问题。台账 `LICENSE_VERIFIED` 仅代表该条目在已识别权利范围内通过，不能推导整款游戏通过；文件哈希也不能证明权利链完整。

## E1：MIT 范围及历史

保留的 [上游 LICENSE](../../public/play/hexgl/LICENSE) 和 [逐字副本](licenses/HexGL-MIT.txt)：Copyright (c) 2015 Thibaut Despoulain，MIT，允许商业使用、修改、再分发，必须保留版权及完整许可/免责声明。该许可只涵盖许可人有权授予且没有文件级例外的部分，不自动覆盖他人的作品、商标和肖像。

[固定版本 README](https://github.com/BKcore/HexGL/blob/6addc95a2fce3bf05f4d751823cc054c61a16d68/README.md) 明确保留 “Unless specified in the file” 例外。[2015 年 MIT 更新提交](https://github.com/BKcore/HexGL/commit/2cb8b75c4331432b0b711a7443ff5bc038557b6a) 只修改 README，并未移除核心文件 NC 头部；[随后新增 LICENSE](https://github.com/BKcore/HexGL/commit/c8e65a6bd32233f3957c7cbb24d73421daf2b7e7)。不能用该历史替代明确的逐文件商业许可。无例外的 bkcore 工具、CoffeeScript/编译 JS、launch、CSS/配置等按仓库 MIT 授权记录；混入第三方的文件另列，非统一套用。

## E2–E3：核心 CC BY-NC 阻断

以下均为 `public/play/hexgl/` 下的实际路径，头部作者 Thibaut “BKcore” Despoulain，明确 CC BY-NC 3.0；原文和版权未改。

| 文件 | 作用 | 当前用途 |
| --- | --- | --- |
| `bkcore/hexgl/CameraChase.js` | 跟随相机 | BLOCKED |
| `bkcore/hexgl/Gameplay.js` | 对局/圈数/结束流程 | BLOCKED |
| `bkcore/hexgl/HUD.js` | 游戏 HUD | BLOCKED |
| `bkcore/hexgl/HexGL.js` | 场景和主控制 | BLOCKED |
| `bkcore/hexgl/Ladder.js` | 排行功能；当前入口未使用也仍随包提供 | BLOCKED |
| `bkcore/hexgl/RaceData.js` | 比赛数据/回放 | BLOCKED |
| `bkcore/hexgl/ShipControls.js` | 驾驶、碰撞和物理 | BLOCKED |
| `bkcore/hexgl/ShipEffects.js` | 载具特效 | BLOCKED |
| `bkcore/hexgl/tracks/Cityscape.js` | 赛道和资源装配 | BLOCKED |

E2 证据：[上游固定目录](https://github.com/BKcore/HexGL/tree/6addc95a2fce3bf05f4d751823cc054c61a16d68/bkcore/hexgl)，逐文件链接见 CSV。E3：[CC BY-NC 3.0 法律文本](https://creativecommons.org/licenses/by-nc/3.0/legalcode) 的非商业使用条件及署名要求。修改、复制和再分发仍受非商业条件约束；对当前广告商业网站按 **不满足许可条件** 处理。即使根 MIT 可能反映作者曾有改许可意图，也必须取得清楚覆盖这些文件/版本的确认，不能自行选择更宽松解释。

## E4–E6：声音、美术、模型和字体

| 范围 / 作者 | 已有许可证据 | 商用/修改/再分发与结论 |
| --- | --- | --- |
| `audio/boost.ogg`，IFartInUrGeneralDirection | [audio/LICENSE](../../public/play/hexgl/audio/LICENSE)：CC BY 3.0 | 条款允许上述用途，需署名及许可链接；录音原始链接/精确版本待补，UNKNOWN |
| `audio/wind.ogg`，kangaroovindaloo；Licson 调整 | 同上，CC BY 3.0 | 同上；保留调整记录，UNKNOWN |
| `audio/destroyed.ogg`，beman87；Licson 调整 | 同上，CC BY 3.0 | 同上，UNKNOWN |
| `audio/crash.ogg`，qubodup | 同上宣称 public domain | 按该声明可复用，但缺原始公有领域声明证据，UNKNOWN |
| `audio/bg.ogg`，mu6k；Licson 调整 | 同上宣称 public domain | 同上，UNKNOWN |
| 全部 OGG | baleboy 使用 VLC 转换 | 保留转换者记录，未替换/修改音频 |
| `geometries/ships/feisar/feisar.js` 及两套 ship 纹理 | 入口 credits：HexMKI base model by Charnel；仓库 MIT 声明 | 未找到逐模型来源许可/贡献授权；模型与命名映射及 feisar 名称/外观审查待补，UNKNOWN |
| `geometries/tracks/**`、bonus/booster 模型 | 仓库 MIT 声明 | 逐模型版权链/第三方来源缺失，UNKNOWN |
| `textures/**`、`textures.full/**` 全部两档贴图，包括 skybox/HUD/粒子/碰撞图 | 入口 credits：track texture by Nobiax；仓库 MIT 声明 | 未证明哪些具体文件属于 Nobiax 或其他作者及其授权，UNKNOWN |
| `css/*.png/jpg`、favicon、icons | 仓库 MIT 声明 | 缺独立美术来源记录，UNKNOWN；不把署名等同授权 |
| `css/BebasNeue-webfont.{eot,svg,ttf,woff}` | TTF v1.101，2010 Ryoichi Tsunekawa；SVG all rights reserved | 缺此二进制版本许可；TTF name 表无许可文本/URL；商业/修改/再分发 UNKNOWN，不以现代字体 OFL 推断 |

E4：[固定音频声明](https://github.com/BKcore/HexGL/blob/6addc95a2fce3bf05f4d751823cc054c61a16d68/audio/LICENSE)、[CC BY 3.0 条款](https://creativecommons.org/licenses/by/3.0/legalcode)。E5：本地 SVG `<metadata>` 与 TTF name 表；[固定字体目录](https://github.com/BKcore/HexGL/tree/6addc95a2fce3bf05f4d751823cc054c61a16d68/css)。E6：[原版入口 credits](https://github.com/BKcore/HexGL/blob/6addc95a2fce3bf05f4d751823cc054c61a16d68/index.html)；文件清单/哈希见 CSV。没有新增视频资源；不据此声称所有模型/图片均由仓库作者创作。

## E7–E10：依赖、附带工具和嵌套发行物

| 文件 / 组件 | 实际证据与义务 | 结论 |
| --- | --- | --- |
| `libs/Three.dev.js` REVISION 50dev、`Three.r53.js` | Three 历史 [r50 MIT](https://github.com/mrdoob/three.js/blob/r50/LICENSE)、[r53 MIT](https://github.com/mrdoob/three.js/blob/r53/LICENSE)，2010–2012 Three.js authors。商用/修改/再分发允许，须完整 MIT/版权；50dev 不是已证明与 r50 字节相同 | 历史许可已查；精确来源比对及发行通知包待补 UNKNOWN |
| `libs/Stats.js` r10 | [r10 MIT](https://github.com/mrdoob/stats.js/blob/r10/LICENSE)，2009–2012 Mr.doob；同样义务 | 历史许可已查；完整通知包/精确构建待补 UNKNOWN |
| `libs/postprocessing/*.js`、Detector、`bkcore/threejs/Shaders.js` | 各文件保留 mr.doob / alteredq / bkcore 等作者；须逐段追溯 Three 示例和复制算法 | UNKNOWN；无整体覆盖推断 |
| `libs/ShaderExtras.js` | Film 段约 147–161 行明确 CC BY 3.0，原算法 Pat “Hawthorne” Shearon，优化 Georg “Leviathan” Steinrohder；另保留 alteredq 头部 | Film 可商用/修改/再分发，需所有作者、许可链接及改动标记；其余段来源/完整许可包 UNKNOWN |
| `libs/DAT.GUI.min.js` | 2011 Data Arts Team, Google Creative Lab，Apache-2.0 头部 | 可商用/修改/再分发；需完整许可、现有 NOTICE、版权及修改声明；当前完整通知包待补 UNKNOWN |
| `libs/leap-0.4.1.min.js` | Browserify 包含 LeapJS 与 gl-matrix/underscore/events 等内容；未附完整组件许可；尝试历史 `leapmotion/leapjs/v0.4.1/LICENSE` 返回 404 | 精确组件/历史条款 UNKNOWN；不能以最新版许可代替 |
| `libs/Editor_files/{gamecore,class,pooled}.js` | 2012 Playcraft Labs，指向未随包提供的 `licence.txt` | UNKNOWN |
| `libs/Editor_files/kinetic.js` | 2012 Eric Rowell，MIT 或 GPLv2，内含 MIT 文本 | 该组件可选 MIT，保留完整头部；LICENSE_VERIFIED，不覆盖整套 Editor |
| `libs/Editor_files/jhashtable.js` | 2010 Tim Down，Apache-2.0 头部 | 条款允许商用等；完整许可/NOTICE 发行材料待补 UNKNOWN |
| `libs/Editor_files/jquery-1.8.js`，v1.8.2 | [历史 MIT](https://github.com/jquery/jquery/blob/1.8.2/MIT-LICENSE.txt)，2012 jQuery Foundation and contributors | 精确包/完整许可附带待补 UNKNOWN |
| Editor 中 Ace、mode-json、theme-monokai、其他 JS/CSS/HTML | 未建立精确版本/全部授权链；`font.css` 引用未随包提供的 Ubuntu Mono woff | UNKNOWN；不执行这些工具，也不把根 MIT 自动扩展至第三方 |
| `package.zip` | 静态列目录检查：161 项；含 9 个 NC 核心文件和仍写 NC 的旧 README，无 LICENSE/COPYING 文件 | BLOCKED；嵌套内容也属于可下载发行物，不能因不用而忽略 |

E7 为 zipfile 只读列目录和字符串检查，未解压执行；E8 为上述文件原始头部；E9 为已实际获取的历史官方许可证；E10 为本地附带文件及缺失项。许可证文本允许商业使用与**当前通知/权利链是否齐全**分开记录。未执行来源不明脚本，未新增依赖或联网调用游戏服务。

`public/play/hexgl/GAMEVADO-NOTICES.md` 旧摘要仅提 alteredq，未完整列 Film 原作者；以上精确归属是本次审查纠正，未来发布前需更新发行通知。遵守本次仅改文档约束，未改该运行目录文件。原文件声明未删除。

## E11：接入补丁与 GameVado 权属

[根 LICENSE](../../LICENSE) 声明 GameVado 2026 原创代码保留全部权利；不能将新增代码描述成自动 MIT。原 `index.html` 的改动是上游 MIT 文件上的衍生补丁，保留上游许可，GameVado 新贡献权属按根声明记录，需负责人确认贡献者授权。`gamevado-compat.js`、proxy、详情页、审核注册表、测试及完整性脚本等独立新增代码同样按根声明；没有新的第三方授权可解除 NC 限制。CSV 单列 9 个直接接入文件，完整原移植改动见 [维护记录](../HEXGL_GAMEVADO_ROADMAP.md)。本次新审查文档也按仓库根条款管理。

入口最小补丁：review title/noindex、固定 base、本地 favicon、移除作者 GA、加载音频恢复兼容脚本、退出链接；没有改写物理、模型、贴图或玩法。原 198 文件仅 index 改变，其余 197 字节不变。

## 发布路径：选择 C

A 不成立：核心 NC 与 UNKNOWN 仍存在。B 仅替换字体/声音/纹理不足以解决核心限制；上述相机、HUD、主循环、控制/碰撞、对局和赛道装配共同覆盖经典玩法。未经授权重新实现大部分核心将改变“完整原版移植”的交付性质，不在本次范围，也不能冒充原版。

优先方案：由负责人联系 Thibaut/BKcore，取得明确覆盖固定 SHA 中上述 9 文件、商业广告网站、修改/网络提供/再分发的书面许可或权威重新许可，确认其他贡献者权利。并行取得 Charnel、Nobiax、字体和录音的具体来源/许可链；补齐依赖全文及归属。替换素材只能在独立审批、记录新来源/哈希/视觉和玩法差异后进行，不自动解除核心阻断。若无法取得许可，保留本地受控审查，另选可商用候选。没有发送外部联系消息。

## 验证记录与人工待办

既有基线实测（2026-10-22，移植提交）：Windows / Node 24.19.0 / pnpm 11.25.0 / Next 16.3.3 / Playwright 1.62.1；`pnpm build` 通过（95 pages），专用 Playwright 3/3，34.3 秒；真实场景/模型/贴图/键盘/碰撞/计时/音频通过。结束流程使用检查点辅助，不是人手驾驶完整三圈。来源：[既有记录及命令](../HEXGL_GAMEVADO_ROADMAP.md)、既有 `tests/hexgl.spec.ts`；本次未重跑生产构建或浏览器测试，不能写成本次新通过。

本次仅文档：实际执行 `node scripts/verify-hexgl-upstream.mjs`、逐文件台账/候选证据/状态/本地链接校验及 `git diff --check`，结果记录于 [AUDIT_VALIDATION.md](AUDIT_VALIDATION.md)。默认 gate `src/proxy.ts` 要求 `HEXGL_REVIEW_ENABLED=1`，否则详情页/入口/资源为 404；审核注册表不进入公开目录。flag 不是身份认证，只能本地或独立访问控制下使用。此次没有修改这些文件或开启入口。

人工待办：书面商业授权、第三方权利链及完整通知包、贡献者权属、商标/feisar 名称外观、完整人手三圈/损毁流程、多设备测试与旧 WebGL warning 评估。所有权利解决后再做技术回归、许可证复核和显式发布审批；当前不授权商业发布。
