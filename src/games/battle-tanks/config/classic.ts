import type { EnemyKind, TileType } from "../maps/schema";
export const TILE_SIZE = 32;
export type BattleMod = {id:string;tank:{speed:number;fireRate:number;bulletSpeed:number;bulletDamage:number;armor:number};weapon:{maxBullets:number};rules:{maxEnemies:number};enemies:Record<EnemyKind,{speed:number;armor:number;fireRate:number}>;tiles:Record<TileType,{solid:boolean;destructible?:boolean}>};
export const classicMod:BattleMod = {
  id: "classic",
  tank: { speed: 104, fireRate: 420, bulletSpeed: 230, bulletDamage: 1, armor: 3 },
  weapon: { maxBullets: 2 },
  rules: { maxEnemies: 6 },
  enemies: {
    scout: { speed: 92, armor: 1, fireRate: 1500 }, assault: { speed: 68, armor: 2, fireRate: 1250 },
    heavy: { speed: 44, armor: 4, fireRate: 1800 }, elite: { speed: 76, armor: 3, fireRate: 850 },
  } satisfies Record<EnemyKind, { speed: number; armor: number; fireRate: number }>,
  tiles: {
    EMPTY: { solid: false }, BRICK: { solid: true, destructible: true }, STEEL: { solid: true }, WATER: { solid: true },
    GRASS: { solid: false }, ICE: { solid: false }, BASE: { solid: true }, PLAYER_SPAWN: { solid: false }, ENEMY_SPAWN: { solid: false },
  } satisfies Record<TileType, { solid: boolean; destructible?: boolean }>,
};
