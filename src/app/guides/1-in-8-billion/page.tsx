import {lifeGuide} from '@/data/life-guide';
import type { Metadata } from 'next';
import Link from 'next/link';
import GameCard from '@/components/GameCard';
import { games } from '@/data/games';
import { absoluteUrl, site } from '@/config/site';
import styles from './page.module.css';

const {path,title,description,headline,published,updated,reviewed,officialUrl}=lifeGuide;
const shareImage={url:absoluteUrl(lifeGuide.imagePath),width:1200,height:630,alt:lifeGuide.imageAlt};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path, languages: { en: path, 'x-default': path } },
  openGraph: { type: 'article', title, description, url: path, siteName: site.name, locale: 'en_US', publishedTime: published, modifiedTime: updated, images: [shareImage] },
  twitter: { card: 'summary_large_image', title, description, images: [shareImage] },
  robots: {index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1},
};

const sections = [
  ['quick-answer', 'Quick start'], ['what-is', 'What is it?'], ['starting-settings', 'Starting settings'], ['how-to-play', 'How to play'],
  ['beginner-tips', 'Beginner tips'], ['faq', 'FAQ'], ['related-games', 'More games'],
];
const faqs = [
  ['What is 1 in 8 Billion?', 'A browser life simulation with randomly assigned beginnings, life events and decisions, informed by country-level statistics.'],
  ['Is 1 in 8 Billion free to play?', 'The official site describes it as a free life simulation. Check the official site for any optional paid features and current terms.'],
  ['How do you start a new life?', 'On the official start screen, review the settings, select “Be born”, then select “Begin this life” after birth registration.'],
  ['Can you choose your country?', 'The standard start draws your country randomly. You can select whether the draw is weighted by births or population. The optional “Where you were actually born” setting is for comparison; it does not select your simulated birthplace.'],
  ['How long does a simulation take?', 'The start screen offers about 30 minutes, 1 hour or 1.5 hours, calibrated to the drawn country’s life expectancy. Actual duration varies with lifespan, pauses and speed.'],
  ['Does the game save previous lives?', 'The official site says lives stay in this browser and provides records for your 10 most recent lives. Do not assume automatic cloud sync; use “Move my lives” when transferring records.'],
];

export default function GuidePage() {
  const related = ['life-atlas', 'epoch-trails'].flatMap(slug => games.filter(game => game.slug === slug));
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: '1 in 8 Billion Guide', item: absoluteUrl(path) },
      ],
    },
    {
      '@context': 'https://schema.org', '@type': 'Article',
      '@id': absoluteUrl(path) + '#article', headline, description,
      mainEntityOfPage: absoluteUrl(path), url: absoluteUrl(path), inLanguage: 'en',
      datePublished: published, dateModified: updated,
      image: {'@type':'ImageObject',url:shareImage.url,width:1200,height:630,caption:lifeGuide.imageAlt},
      articleSection: 'Game Guides',isAccessibleForFree:true,
      about:{'@type':'Thing',name:'1 in 8 Billion',url:officialUrl},
      author: { '@type': 'Organization', name: site.name, url: absoluteUrl('/about') },
      publisher: { '@type': 'Organization', name: site.name, url: absoluteUrl('/') },
      citation: 'https://1in8b.life/en/',
    },
  ];

  return <div className={`container ${styles.guide}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">1 in 8 Billion Guide</span></nav>
    <article id="article">
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className="eyebrow">UNOFFICIAL FAN GUIDE</span>
          <h1>1 in 8 Billion:<br /><em>Complete Beginner&apos;s Guide</em></h1>
          <p>A different beginning. An unfamiliar world. Explore a life shaped by chance, circumstances and the choices you make along the way.</p>
          <a className="btn" href={officialUrl} target="_blank" rel="noopener noreferrer">Play on Official Website <span aria-hidden="true">↗</span><span className={styles.srOnly}> (opens in a new tab)</span></a>
          <p className={styles.byline}>By GameVado · Reviewed <time dateTime={reviewed}>October 24, 2026</time></p>
        </div>
        <div className={styles.art} aria-hidden="true"><div className={styles.orbit} /><div className={styles.orbitInner} /><div className={styles.dotField} /><div className={styles.oneDot} /><span className={styles.artLabel}>ONE LIFE.<br />A WORLD OF POSSIBILITIES.</span></div>
      </header>
      <p className={styles.disclaimer}>This is an independent fan-made guide. GameVado is not affiliated with the creators of 1 in 8 Billion.</p>
      <nav aria-label="On this page" className={styles.toc}>{sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}<span aria-hidden="true"> ↘</span></a>)}</nav>
      <div className={styles.body}>
        <section id="quick-answer" aria-labelledby="quick-title"><h2 id="quick-title">How do you start 1 in 8 Billion?</h2><p>Open the official website, review the starting settings, select <strong>Be born</strong>, then choose <strong>Begin this life</strong>. Your simulated birthplace is drawn randomly. This guide explains the controls and choices; the game itself runs on <a href={officialUrl} target="_blank" rel="noopener noreferrer">1in8b.life</a>.</p></section>
        <section id="what-is" aria-labelledby="what-title">
          <span className="eyebrow">01 / THE IDEA</span><h2 id="what-title">What Is 1 in 8 Billion?</h2>
          <p>1 in 8 Billion is a life simulation played in your browser. Its standard start assigns a birthplace rather than letting you design an ideal character. You follow that person through life, responding to events and decisions.</p>
          <p>The official site uses public statistics to inform the simulation. Treat this as a way to explore how circumstances and chance interact: an individual playthrough is neither a prediction of your future nor evidence about everyone from a country.</p>
        </section>
        <section id="starting-settings" aria-labelledby="settings-title"><span className="eyebrow">BEFORE YOU BEGIN</span><h2 id="settings-title">Starting settings explained</h2><dl className={styles.settings}><div><dt>World period</dt><dd>The past, Today, The future and Any world change the setting of the simulation. For a first run, Today is the simplest starting point.</dd></div><div><dt>Country draw</dt><dd>Babies born now weights countries by annual births; The 8 billion alive now uses population. Neither is a manual simulated-country selector.</dd></div><div><dt>Life length</dt><dd>Choose about 30 minutes, 1 hour or 1.5 hours. Pauses, speed and the simulated lifespan affect the actual time.</dd></div><div><dt>Your real birthplace</dt><dd>This optional comparison setting does not choose your simulated birthplace. Leave it blank if you do not want the comparison.</dd></div></dl></section>
        <section id="how-to-play" aria-labelledby="play-title">
          <span className="eyebrow">02 / YOUR FIRST LIFE</span><h2 id="play-title">How to Play</h2>
          <ol className={styles.steps}>
            <li><h3>Open the official website</h3><p>Go to <a href={officialUrl} target="_blank" rel="noopener noreferrer">1in8b.life<span className={styles.srOnly}> (opens in a new tab)</span></a>. The guide you are reading does not run or host the simulation.</p></li>
            <li><h3>Review the starting settings</h3><p>Choose the world period, country draw method and life length. For a first run, keep the defaults so you have fewer variables to track.</p></li>
            <li><h3>Be born and begin</h3><p>Select <strong>Be born</strong>, review the birth registration, then select <strong>Begin this life</strong>. Take a moment to read your starting circumstances.</p></li>
            <li><h3>Follow events and decisions</h3><p>Read the life record and choose a yearly focus. When a decision appears, consider what matters to this person before choosing.</p></li>
            <li><h3>Set a comfortable pace</h3><p>Use Pause or the speed controls. Auto mode lets you watch; on phones it is in the ⋯ menu. Watch the Health, Happiness, Knowledge and Relationships status values.</p></li>
          </ol>
        </section>
        <section id="beginner-tips" aria-labelledby="tips-title">
          <span className="eyebrow">03 / PLAY WITH CURIOSITY</span><h2 id="tips-title">Beginner Tips</h2>
          <div className={styles.tips}>
            <div><h3>Make the first run a learning run</h3><p>Read each prompt before increasing speed. Trying to optimize every outcome immediately makes it harder to notice what the simulation is teaching you about its controls.</p></div>
            <div><h3>Understand the random draw</h3><p>Birth-weighted and population-weighted draws ask different questions: where a baby is born versus where a living person is. Neither means countries have equal odds. A few repeated results do not prove the draw is broken.</p></div>
            <div><h3>Observe before attributing cause</h3><p>Pause after an important event and compare the life record with the status values. A change that follows a choice does not, by itself, prove that choice was its only cause.</p></div>
            <div><h3>Change one setting at a time</h3><p>For a later run, try changing the draw method or world period while keeping other settings similar. This makes differences easier to discuss, although two random lives are not a controlled experiment.</p></div>
            <div><h3>Use automation intentionally</h3><p>Try Auto mode when you want to observe the unfolding story. Return to a slower pace when you want time to read decisions and reflect on their tradeoffs.</p></div>
            <div><h3>Keep the statistics in perspective</h3><p>Do not use a simulated lifespan, income or event as a real-world forecast. To make a factual claim, check the underlying source, year, definitions and uncertainty rather than extrapolating from your playthrough.</p></div>
          </div>
        </section>
        <section id="faq" aria-labelledby="faq-title">
          <span className="eyebrow">04 / QUICK ANSWERS</span><h2 id="faq-title">Frequently Asked Questions</h2>
          <div className={styles.faq}>{faqs.map(([question, answer]) => <div key={question}><h3>{question}</h3><p>{answer}</p></div>)}</div>
        </section>
        <aside className={styles.source} aria-label="Sources and review"><h2>Source &amp; review notes</h2><p>Controls and feature descriptions were checked against the <a href="https://1in8b.life/en/" target="_blank" rel="noopener noreferrer">official English game page<span className={styles.srOnly}> (opens in a new tab)</span></a> on October 23, 2026. The game is in beta, so menus and behavior may change. Tips are GameVado&apos;s independent editorial advice.</p></aside>
      </div>
      <section id="related-games" className={styles.related} aria-labelledby="related-title">
        <div className="section-heading"><div><span className="eyebrow">KEEP EXPLORING</span><h2 id="related-title">More Life Simulation Games on GameVado</h2></div><Link className="subtle-link" href="/games">Browse all games ↗</Link></div>
        <p className="muted">Keep exploring with two original GameVado games: shape an everyday life in Life Atlas, or choose a time in Earth’s history in Epoch Trails. Both are free to play and support English and Chinese.</p>
        <div className={styles.gameGrid}>{related.map(game => <GameCard key={game.id} game={game} />)}</div>
        <Link className="subtle-link" href="/">← Back to GameVado home</Link>
      </section>
    </article>
  </div>;
}
