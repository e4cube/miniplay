const base='/assets/covers/';
export const gameCovers:Record<string,string>={
'battle-tanks':base+'battle-tanks-v2.webp','neon-rain':base+'neon-rain-v2.webp','meow-cafe':base+'meow-cafe-v2.webp',
'gem-match':base+'gems.svg','fruit-match':base+'fruit.svg','pet-match':base+'pets.svg','dessert-match':base+'dessert.svg','ocean-match':base+'ocean.svg','space-match':base+'space.svg','anime-match':base+'anime.svg',
'2048-merge':base+'numbers.svg','number-merge':base+'numbers.svg','sudoku':base+'sudoku.svg','snake':base+'snake.svg','galaxy-strike':base+'space.svg','tank-duel':'/assets/art/tanks/tank-arena-map.png','pixel-fighters':'/assets/art/fighters/fighting-stage-background.png','neon-runner':base+'runner.svg','fruit-slash':base+'fruit.svg','pong':base+'pong.svg','breakout':base+'breakout.svg','minesweeper':base+'mines.svg','emoji-memory':base+'memory.svg','solitaire':base+'cards.svg','tic-tac-toe':base+'tic.svg','connect-four':base+'connect.svg'};
export const coverFor=(slug:string)=>gameCovers[slug]||base+'gems.svg';
