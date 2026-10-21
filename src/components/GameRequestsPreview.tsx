import type { PublicGameRequest } from '@/lib/ugc/requests';
import styles from './GameRequestsPreview.module.css';

type Copy = {
  eyebrow: string; title: string; intro: string; closed: string; unavailable: string;
  empty: string; votes: string; voteClosed: string; approved: string; planned: string; added: string;
};

const copy: Record<'en' | 'zh-CN', Copy> = {
  en: {
    eyebrow: 'Community preview', title: 'Game Requests',
    intro: 'See which games players would like to play next.',
    closed: 'Submitting requests and voting are not open yet. You can browse approved requests below.',
    unavailable: 'The request list is temporarily unavailable. Please try again later.',
    empty: 'No approved requests yet. Check back soon.', votes: 'votes',
    voteClosed: 'Voting opens soon', approved: 'Suggested', planned: 'Planned', added: 'Added',
  },
  'zh-CN': {
    eyebrow: '社区预览', title: '游戏愿望清单',
    intro: '看看玩家希望接下来玩到哪些游戏。',
    closed: '目前尚未开放提交和投票。你可以先浏览下方已审核通过的愿望。',
    unavailable: '愿望列表暂时无法加载，请稍后再试。',
    empty: '暂无已审核通过的愿望，欢迎稍后再来。', votes: '票',
    voteClosed: '即将开放投票', approved: '已收录', planned: '已计划', added: '已上线',
  },
};

export default function GameRequestsPreview({ locale, items }: {
  locale: 'en' | 'zh-CN'; items: PublicGameRequest[] | null;
}) {
  const t = copy[locale];
  return <main className={`container ${styles.page}`}>
    <header className={styles.hero}>
      <span className={styles.eyebrow}>{t.eyebrow}</span>
      <h1>{t.title}</h1>
      <p className={styles.intro}>{t.intro}</p>
      <p className={styles.notice} role="status">{t.closed}</p>
    </header>
    {items === null ? <p className={styles.empty} role="alert">{t.unavailable}</p>
      : items.length === 0 ? <p className={styles.empty}>{t.empty}</p>
        : <ol className={styles.list}>
          {items.map(item => <li className={styles.card} key={item.id}>
            <div className={styles.content}>
              <span className={styles.status}>{t[item.status]}</span>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
              {item.category && <span className={styles.category}>{item.category}</span>}
            </div>
            <div className={styles.voteArea}>
              <button type="button" className={styles.voteButton} disabled aria-label={`${t.voteClosed}: ${item.vote_count} ${t.votes}`}>
                <span aria-hidden="true">▲</span> {item.vote_count}
              </button>
              <small>{t.voteClosed}</small>
            </div>
          </li>)}
        </ol>}
  </main>;
}
