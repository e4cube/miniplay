import Link from 'next/link';
import type {Game} from '@/data/games';
import {getGameCategories, categoryRegistry} from '@/data/games';
import {categoryNames} from '@/i18n/games';
import {localizedPath, type Locale} from '@/i18n/config';
import {dictionaries} from '@/i18n/dictionary';
import GameLoader, {type GameSlug} from '@/games/GameLoader';
import GameCard from './GameCard';
import AdPlaceholder from './AdPlaceholder';

// Keep meaningful page content in the initial HTML; only the game needs a browser.
export default function GamePage({game, allGames, locale = 'en'}: {
  game: Game; allGames: Game[]; locale?: Locale;
}) {
  const t = dictionaries[locale];
  const related = allGames.filter(candidate => candidate.id !== game.id)
    .map(candidate => ({candidate, score: (candidate.category === game.category ? 10 : 0)
      + candidate.tags.filter(tag => game.tags.includes(tag)).length}))
    .sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title))
    .slice(0, 3).map(item => item.candidate);
  const categories = categoryRegistry.filter(category => getGameCategories(game).includes(category.name));
  return <div className="container" style={{paddingTop: 24}}>
    <nav className="muted" style={{fontSize: 14}} aria-label={locale === 'zh-CN' ? '面包屑导航' : 'Breadcrumb'}>
      <Link href={localizedPath('/', locale)}>{t.common.home}</Link> / <Link href={localizedPath('/games', locale)}>{t.nav.games}</Link> / {game.title}
    </nav>
    <h1 style={{marginBottom: 4}}>{game.title}</h1>
    <p className="muted">{game.shortDescription}</p>
    <GameLoader slug={game.slug as GameSlug}/>
    <AdPlaceholder slot="game-bottom"/>
    <section className="prose">
      <h2>{t.common.howTo}</h2><ol>{game.howTo.map(step => <li key={step}>{step}</li>)}</ol>
      <h2>{t.common.controls}</h2><p>{game.controls}</p>
      <h2>{t.common.tips}</h2><ul>{game.tips.map(tip => <li key={tip}>{tip}</li>)}</ul>
      <h2>{t.common.aboutGame}</h2><p>{game.description}</p>
      {game.longContent?.map(section => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
      <p>{t.nav.categories}: {categories.map((category, index) => <span key={category.slug}>{index > 0 ? ' · ' : ''}<Link href={localizedPath(`/category/${category.slug}`, locale)}>{locale === 'zh-CN' ? categoryNames[category.name] : category.name}</Link></span>)}</p>
    </section>
    <AdPlaceholder slot="inline"/>
    <section><h2>{t.common.related}</h2><div className="grid-cards">{related.map(candidate => <GameCard locale={locale} key={candidate.id} game={candidate}/>)}</div></section>
    {game.faq.length > 0 && <section className="prose" style={{marginTop: 36}}><h2>{t.common.faq}</h2>{game.faq.map(item => <div key={item.q}><h3>{item.q}</h3><p>{item.a}</p></div>)}</section>}
  </div>;
}
