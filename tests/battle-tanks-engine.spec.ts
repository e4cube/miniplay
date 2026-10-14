import { expect, test } from "@playwright/test";
import { canMove, createState, fire, moveTank, spawnEnemy, tick } from "../src/games/battle-tanks/engine/core";
import { officialMaps } from "../src/games/battle-tanks/maps/official";
import { validateMap } from "../src/games/battle-tanks/maps/schema";

test("all twelve official maps share a valid schema", () => { expect(officialMaps).toHaveLength(12); for (const map of officialMaps) expect(validateMap(map)).toEqual({ ok: true, map }); });
test("movement respects steel, brick and water collision", () => { const state=createState(officialMaps[0]); const tank=state.tanks[0]; tank.x=4.5;tank.y=4.6;expect(canMove(state,tank,4.5,4.5)).toBeFalsy();tank.x=2.5;tank.y=1.5;expect(canMove(state,tank,2.5,1.5)).toBeFalsy();state.tiles[1][2]="WATER";expect(canMove(state,tank,2.5,1.5)).toBeFalsy(); });
test("bullets destroy brick but not steel", () => { const state=createState(officialMaps[0]);state.tanks[0].x=2.5;state.tanks[0].y=4;state.tanks[0].direction="up";expect(fire(state,"p1")).toBeTruthy();tick(state,.08);expect(state.tiles[2][2]).toBe("EMPTY");state.tanks[0].x=4.5;state.tanks[0].y=5.5;state.tanks[0].cooldown=0;fire(state,"p1");tick(state,.08);expect(state.tiles[4][4]).toBe("STEEL"); });
test("enemy waves spawn and tanks take damage", () => { const state=createState(officialMaps[0]);expect(spawnEnemy(state,"scout")).toBeTruthy();const enemy=state.tanks.find(t=>t.enemy)!;state.tanks[0].x=enemy.x;state.tanks[0].y=enemy.y+1;state.tanks[0].direction="up";fire(state,"p1");tick(state,.08);expect(state.tanks.some(t=>t.id===enemy.id)).toBeFalsy();expect(state.remaining).toBe(3); });
test("pause blocks movement and reset creates independent co-op lives", () => { const state=createState(officialMaps[10],2);expect(state.tanks.filter(t=>t.player)).toHaveLength(2);state.status="paused";const x=state.tanks[0].x;expect(moveTank(state,"p1","left",1)).toBeFalsy();expect(state.tanks[0].x).toBe(x); });
test("custom map validation rejects malformed imports", () => { expect(validateMap({id:"bad"}).ok).toBeFalsy(); });
