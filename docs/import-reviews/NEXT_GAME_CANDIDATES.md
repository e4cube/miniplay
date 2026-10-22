# 下一批候选：取证进度，不是发布批准

核查日期 2026-10-22。官方仓库元数据、递归目录及下述原文已实际读取；精确 SHA/分支/证据内容哈希见 [CANDIDATE_EVIDENCE.json](CANDIDATE_EVIDENCE.json)。**未安装、构建或浏览器实测任何候选**，网页运行方式是源码/README 判断。最近 push 只作维护线索，不等同有效功能维护；当前均未进入 READY_FOR_PORT 或 LICENSE_VERIFIED。

目录重复比较基于 GameVado 当前 `src/data/{games,phase2-games,match3-games,meow-cafe,review-games}.ts`：有基础益智/卡牌、数值合成、七款 match-3、Neon Runner 等，无下列同名公开项；主题相似不等于玩法相同。未做全网内容去重。

| 候选 / 官方源码 | 分支 / 固定 SHA | 元数据最近 push（UTC）/维护线索 | 状态 | 初步移植+测试人日（不含授权等待） |
| --- | --- | --- | --- | --- |
| [A Dark Room](https://github.com/doublespeakgames/adarkroom) | main / `1fada4620b6c66bd07bf15a3f1eb8223df8bc1d7` | 2025-05-23；未归档，非持续维护承诺 | AUDITING | 2–4，文本/长流程/存档回归另增 |
| [Hextris](https://github.com/Hextris/hextris) | gh-pages / `3f4847dc8fd7dab3d1c87e6324b9159d92fbd396` | 2023-05-13；README 明说不再积极维护 | AUDITING | 1–3，GPL发行包另计 |
| [IsoCity](https://github.com/victorqribeiro/isocity) | master / `c5772412d3e423318f2cf479ebdd50a2b9029d84` | 2024-10-14；未归档 | AUDITING | 1–2，触屏/地图保存另验 |
| [Whatajong 新版](https://github.com/masylum/whatajong) | main / `45fe3da7a7d1e87a66ae41b72ee74cc4e0a920d5` | 2025-06-15；未归档 | AUDITING | 3–6，构建与素材取证较多 |
| [micropolisJS](https://github.com/graememcc/micropolisJS) | main / `f13a1624d111d235e804bd80f48ba7c9f66a8e0f` | 2025-07-13；未归档 | BLOCKED（当前名称商业方案） | 4–8，长模拟/存档与许可另计 |
| [Clumsy Bird](https://github.com/ellisonleao/clumsy-bird) | master / `fae3d487d5102af29fb3f78431cbd45e9b83aed3` | 2018-04-13；已归档 | BLOCKED（许可冲突） | 2–4，旧工具链/音频兼容风险 |

以上估时为源码规模与依赖判断、低至中信心，不是承诺或真实工时；获准后才以实际跑通结果修正。

## A Dark Room：MPL 文件范围及中文均未作 blanket 放行

已读固定版本 [LICENSE.md](https://github.com/doublespeakgames/adarkroom/blob/1fada4620b6c66bd07bf15a3f1eb8223df8bc1d7/LICENSE.md)、README、package.json、index.html、script/engine.js、简体 strings.js/strings.po、繁体 strings.po。LICENSE 为 MPL-2.0，package 同样声明 MPL-2.0、作者 Michael Townsend。根许可是仓库授权证据；尚未逐文件建立 Covered Software 与第三方 `lib/`、音乐/音频的完整映射，不能将全文所有资源自动认定 MPL。

MPL 允许商业使用，修改其覆盖文件要按 MPL 提供对应源码/保留通知；独立新文件可采用不同条款。压缩浏览器 JS 须提供方便获得其首选源码的方式。依据 [Mozilla 许可与 FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/)；实际义务按发行文件界定。

中文在官方仓库 `lang/zh_cn/strings.{js,po}` 与 `lang/zh_tw/strings.po`，不是第三方汉化站搬运。PO 头部可见 zh_cn 最后翻译者 dblark（2019），zh_tw YukiUsagi（2016）；这不是完整作者清单或单独权利授予。尚未确认翻译贡献适用许可/贡献记录、文本权利范围，**中文内容授权 UNKNOWN**；根 MPL/package 声明不足以替代这一步。下一步追溯翻译提交/贡献条款并审查第三方库与大量 audio 文件，必要时权利人确认。

原版是 HTML/CSS/JS+jQuery 文本生存/放置游戏，本地静态服务可作为移植方向，`node dev-server.js` 是开发服务器，不据此假设运行必需后端；index 含外部 jQuery 加载及本地 fallback，Dropbox/统计等历史功能需网络清单核查。长剧情/村庄/探险/保存测试成本高。与现有游戏无同类完整文本生存玩法，重复低。

## Hextris：GPL 不是禁止商业，但发行与字体尚未审完

已读 [LICENSE.md](https://github.com/Hextris/hextris/blob/3f4847dc8fd7dab3d1c87e6324b9159d92fbd396/LICENSE.md)、README、index 和目录。GPLv3 全文；README 明确 GPLv3-or-later，Copyright 2018 Logan Engstrom，创作者另列 Garrett Finucane、Noah Moroze、Michael Yang。需要按适用 GPL 提供源码/修改记录和条款，独立宿主与游戏边界再审，不得把 GPL 说成商业禁令。

HTML/JS/Canvas 旋转六边形消除，官方 [hextris.io](https://hextris.io/)；静态导入可行方向，index 存在统计/社交相关外链，必须梳理。`style/fonts/` 含 Exo2、Lovelo、QuattrocentoSans、Roboto，`style/fa/fonts/` 有 FontAwesome；没核实精确字体二进制授权和全部素材来源，**UNKNOWN**，不能因游戏 GPL 认为全部字体 GPL。与 match-3/合成类同为益智但操作机制不同，重复中低。下一步字体/第三方组件清单及 GPL 发行方案。

## IsoCity：先锁定同名项目，再核对素材包

本清单明确选 Victor Ribeiro 的 [isocity](https://github.com/victorqribeiro/isocity)，不是另一同名大型项目。已读 [LICENSE](https://github.com/victorqribeiro/isocity/blob/c5772412d3e423318f2cf479ebdd50a2b9029d84/LICENSE)、README、index、js/main.js，目录仅 11 项。MIT，Copyright 2019 Victor Ribeiro，保留版权/全文；代码许可初查支持商业使用，整包未通过。

README 说无模拟/预算/目标的等距城市搭建玩具；原生 JS 双 Canvas、本地 CSS 与单张 spritesheet，不把它宣传成 SimCity。源码明确指向 [Kenney 的 Isometric Landscape](https://opengameart.org/content/isometric-landscape)，该作者发布页声明 CC0、Kenney.nl 署名非强制。已比 README 的作者主页更进一步定位到具体包；**尚未下载包与 `textures/01_130x66_130x230.png` 做精确比对**，素材映射仍 UNKNOWN，不能写成全部已验证 CC0。网页运行方向为静态服务，无已发现的必需后端，尚未运行确认。重复低；下一步精确素材比对、触屏与导出/存储检查。

## Whatajong：使用新版前端仓库

正确仓库 [masylum/whatajong](https://github.com/masylum/whatajong)，明确排除 `whatajong_legacy`。已读 [LICENSE](https://github.com/masylum/whatajong/blob/45fe3da7a7d1e87a66ae41b72ee74cc4e0a920d5/LICENSE)、README、package、vite.config.ts 和完整目录。MIT Copyright 2025 Pao Ramon；package 作者为 Ramensoft SL，名称/贡献权属关系需留记录，不能替第三方素材做授权保证。

新版为 roguelike Mahjong Solitaire；SolidJS/TypeScript/Vite，`src/renderer` 是浏览器入口，build 脚本为 tsc+vite、输出 dist；同仓有 Electron 配置，不代表网页版需要 Electron 或旧版服务器。开发 `pnpm dev`（8788），正式静态构建尚未执行；部署 `/play/whatajong/` 需审 Vite base/资源路径。howler、posthog-js、wrangler 等依赖需逐项审；包名出现 wrangler 不等于已证明运行必需后端，PostHog 网络行为尚未完整追踪。

`src/renderer` 附 BraveGates.otf、music/sprite.mp3、多个音效/tiles/background 素材；这些文件未见独立许可清单，**UNKNOWN**，同时核对 @fontsource/nunito 的具体版本及 OFL 包。与七款普通 match-3 不同，麻将接龙/roguelike 属新玩法，主题重复中低。下一步完整资源/网络/依赖审查，隔离安装后跑构建与 Vitest，不能把源码阅读当通过。

## micropolisJS：GPL 代码和名称条款分开

已读 [LICENSE](https://github.com/graememcc/micropolisJS/blob/f13a1624d111d235e804bd80f48ba7c9f66a8e0f/LICENSE)、COPYING、README、package、index、FONT_LICENSE 及 [MicropolisPublicNameLicense.md](https://github.com/graememcc/micropolisJS/blob/f13a1624d111d235e804bd80f48ba7c9f66a8e0f/MicropolisPublicNameLicense.md)。代码 GPLv3-or-later，Graeme McCutcheon 2013，衍生 Micropolis；附 §7 条款要求保留版权及附加条款、修改标注、不得用 SimCity/EA 作未授权商标/宣传，不代表 EA 背书；涉及承担合同责任时还有赔偿条款，须完整审阅。

README 还要求遵守 2024-10-01 Micropolis GmbH 的名称许可：其中给 Micropolis 名称/相关标识的授权限非商业用途，要求标题/欢迎画面及 credits 署名和链接、保留/传递名称许可，对营销用途要求书面许可等；不得据 GPL 推定名称可以在当前商业网站使用。**按现名称广告商业发行方案 BLOCKED**；代码 GPL 本身允许商业，名称许可适用范围/兼容性、是否能合法独立改名发行，必须由负责人/法律审核确认，不能删声明规避。

`css/FONT_LICENSE.markdown` 为 OFL-1.1，2009 Meredith Mandel，Reserved Font Name Chunk；字体组件证据较明确，需与实际字体映射。其余衍生图像/声音的版权链仍待核验。TypeScript/webpack/Canvas 模拟，浏览器 index 与本地资源，静态输出方向；保存/长期模拟、worker/资源路径需实际检查。与现有目录重复低，与本候选 IsoCity 主题重叠但一个模拟一个搭建玩具。下一步先解决名称条款和 GPL 发行边界，再评估技术。

## Clumsy Bird：许可证实质冲突，不能当 MIT 候选放行

已读 [LICENSE.md](https://github.com/ellisonleao/clumsy-bird/blob/fae3d487d5102af29fb3f78431cbd45e9b83aed3/LICENSE.md)、[package.json](https://github.com/ellisonleao/clumsy-bird/blob/fae3d487d5102af29fb3f78431cbd45e9b83aed3/package.json)、README、index 及目录。LICENSE.md 是 GPLv3 全文；package 的 `licenses` 却写 MIT License 并链接仓库 `LICENSE`（该固定树中不存在，只有 LICENSE.md）。**真实不一致**，不得任选 MIT；标 BLOCKED，需维护者澄清或经过明确审批按适用 GPL 路径处理，仍需资源审查，不表示现在已经获准按 GPL 发布。

原版 melonJS/HTML5 Flappy 类，README 用 grunt connect 本地 8001；Node >=0.8、grunt 0.4.1 等旧开发依赖，归档仓库有工具链和漏洞风险，不执行其脚本。音频 theme/hit/lose/wing、游戏字体四格式、鸟/管道/背景图未完成独立授权链，UNKNOWN；相似 Flappy 玩法不赋予原作角色素材版权。现有 Neon Runner 同为单键反应但玩法不同，重复中低；下一步先解决许可证冲突和素材来源，技术构建后置。

## 下一步排序与审批

建议先完成 IsoCity 的精确素材包比对（体积小且已找到原始 CC0 页面），同时补 A Dark Room 的 MPL 文件映射/中文和音频证据；其后 Hextris 字体与 GPL 方案、Whatajong 新版资源与网络依赖。micropolisJS 名称和 Clumsy Bird 许可冲突需要人工确认。排序仅为取证效率判断；没有候选获准商业发布，也未引入其代码。统一流程与批准条件见 [审核标准](GAME_IMPORT_STANDARD.md)。
