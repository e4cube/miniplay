<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## 游戏上架与排序 / New release placement

- 新上架游戏必须放到站内靠前位置，中英文站保持一致。
- 在 src/data/games.ts 的 games 数组最前面插入新游戏；该顺序即默认上架顺序（最新在前）。不要添加将旧推荐游戏重新置顶的排序。
- 首页最新上架、前三款主打、发现区前八款，以及目录与分类筛选均继承这个顺序。允许保留独立策划的专题主视觉。
- 新增游戏时核对 /、/zh、/games、/zh/games 及所属分类的实际位置；搜索和用户筛选继续正常工作。
- 排序变更后运行 node scripts/test-release-order.cjs。
