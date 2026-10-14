import type { Metadata } from "next"; import MapEditor from "@/games/battle-tanks/editor/MapEditor"; import { absoluteUrl } from "@/config/site";
export const metadata:Metadata={title:"Battle Tanks Map Editor",description:"Create, import, export and test custom Battle Tanks maps.",alternates:{canonical:absoluteUrl("/games/battle-tanks/editor")}};
export default function Page(){return <MapEditor/>}
