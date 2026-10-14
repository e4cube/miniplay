import {classicMod,type BattleMod} from '../config/classic';
export const mods:Record<string,BattleMod>={classic:classicMod};
export type ModOverrides = {
 id?:string; tank?:Partial<BattleMod['tank']>;weapon?:Partial<BattleMod['weapon']>;rules?:Partial<BattleMod['rules']>;
 enemies?:{[K in keyof BattleMod['enemies']]?:Partial<BattleMod['enemies'][K]>};
 tiles?:{[K in keyof BattleMod['tiles']]?:Partial<BattleMod['tiles'][K]>};
};
/** Small, explicit config merge; mods never require changes to simulation or React. */
export function createMod(overrides:ModOverrides):BattleMod {
 const enemies={...classicMod.enemies},tiles={...classicMod.tiles};
 for(const key of Object.keys(enemies) as (keyof typeof enemies)[])enemies[key]={...enemies[key],...overrides.enemies?.[key]};
 for(const key of Object.keys(tiles) as (keyof typeof tiles)[])tiles[key]={...tiles[key],...overrides.tiles?.[key]};
 return {...classicMod,id:overrides.id??classicMod.id,tank:{...classicMod.tank,...overrides.tank},weapon:{...classicMod.weapon,...overrides.weapon},rules:{...classicMod.rules,...overrides.rules},enemies,tiles};
}
