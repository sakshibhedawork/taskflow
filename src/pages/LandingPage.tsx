import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function useCountUp(target: number, delay = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      let cur = 0
      const step = target / 50
      const id = setInterval(() => {
        cur += step
        if (cur >= target) { setVal(target); clearInterval(id) }
        else setVal(Math.floor(cur))
      }, 22)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(t)
  }, [target, delay])
  return val
}

const AVATARS = [
  { bg: '#1c1917', label: 'AC' },
  { bg: '#d97706', label: 'SK' },
  { bg: '#0891b2', label: 'MT' },
  { bg: '#059669', label: 'PN' },
]

const STRIP_ITEMS = [
  { num: '01', label: 'Kanban board' },
  { num: '02', label: 'Drag & drop' },
  { num: '03', label: 'Activity log' },
  { num: '04', label: 'Search & filter' },
  { num: '05', label: 'Persisted state' },
]

const FEATURES = [
  {
    num: '01',
    title: 'Visual Kanban board',
    desc: 'Four stages — Backlog, In Progress, In Review, Done. Move tasks between columns with drag-and-drop or the status picker. Your entire pipeline is always visible at a glance.',
    tag: 'Drag & drop included',
  },
  {
    num: '02',
    title: 'Smart search & filter',
    desc: 'Find any task instantly by title. Narrow down by assignee or priority level — or combine both. All filters persist across page refreshes so your view is always where you left it.',
    tag: 'Saved across sessions',
  },
  {
    num: '03',
    title: 'Automatic activity log',
    desc: 'Every status change, reassignment, and priority update is logged automatically with a timestamp. No manual notes. Full history per task — even for moves made by drag-and-drop.',
    tag: 'Zero config, always on',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const tasks   = useCountUp(2400, 300)
  const teams   = useCountUp(180,  500)
  const shipped = useCountUp(94,   700)

  return (
    <div className="landing">

      {/* ── Nav ── */}
      <nav className="l-nav">
        <div className="l-nav__logo">
          <div className="l-nav__logo-mark">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="1"   y="1"   width="5.5" height="5.5" rx="1.2" fill="white" />
              <rect x="8.5" y="1"   width="5.5" height="5.5" rx="1.2" fill="white" opacity="0.65" />
              <rect x="1"   y="8.5" width="5.5" height="5.5" rx="1.2" fill="white" opacity="0.65" />
              <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" fill="white" opacity="0.3" />
            </svg>
          </div>
          TaskFlow
        </div>

        <div className="l-nav__links">
          <span className="l-nav__link">Features</span>
          <span className="l-nav__link">Workflow</span>
          <span className="l-nav__link">About</span>
        </div>

        <button className="l-nav__cta" onClick={() => navigate('/board')}>
          Open Board
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 6h6M7 3.5l2.5 2.5L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="l-hero">
        <div className="l-hero__inner">

          {/* Left — copy */}
          <div className="l-hero__copy">
            <div className="l-hero__eyebrow">
              <span className="l-eyebrow-dot" />
              Kanban · Drag &amp; Drop · Activity Log
            </div>

            <h1 className="l-hero__h1">
              <span className="l-hero__h1-line">Move the</span>
              <span className="l-hero__h1-line">backlog.</span>
              <span className="l-hero__h1-line">
                Ship the{' '}
                <span className="l-hero__h1-accent">sprint.</span>
              </span>
            </h1>

            <p className="l-hero__sub">
              A focused kanban board that keeps your backlog moving, your team aligned, and your deadlines visible — without the noise.
            </p>

            <div className="l-hero__actions">
              <button className="l-btn-primary" onClick={() => navigate('/board')}>
                Open Board
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="l-btn-secondary">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M4.5 6.5l1.5 1.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                No setup required
              </button>
            </div>

            <div className="l-hero__trust">
              <div className="l-hero__avatars">
                {AVATARS.map((a) => (
                  <div key={a.label} className="l-hero__avatar" style={{ background: a.bg }}>
                    {a.label}
                  </div>
                ))}
              </div>
              <span className="l-hero__trust-text">Trusted by 180+ engineering teams</span>
            </div>
          </div>

          {/* Right — device mockup */}
          <div className="l-hero__visual">
            <div className="l-device-window">

              {/* Browser chrome */}
              <div className="l-device-chrome">
                <div className="l-chrome-dot l-chrome-dot--r" />
                <div className="l-chrome-dot l-chrome-dot--y" />
                <div className="l-chrome-dot l-chrome-dot--g" />
                <div className="l-device-url">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <rect x="0.5" y="0.5" width="3.5" height="3.5" rx="0.6" fill="#a8a29e" />
                    <rect x="5" y="0.5" width="3.5" height="3.5" rx="0.6" fill="#a8a29e" opacity="0.5" />
                    <rect x="0.5" y="5" width="3.5" height="3.5" rx="0.6" fill="#a8a29e" opacity="0.5" />
                    <rect x="5" y="5" width="3.5" height="3.5" rx="0.6" fill="#a8a29e" opacity="0.28" />
                  </svg>
                  taskflow.app/board
                </div>
              </div>

              {/* App header */}
              <div className="l-device-appbar">
                <div className="l-device-appbar__logo">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="1" y="1" width="4.2" height="4.2" rx="1" fill="white" />
                    <rect x="6.8" y="1" width="4.2" height="4.2" rx="1" fill="white" opacity="0.6" />
                    <rect x="1" y="6.8" width="4.2" height="4.2" rx="1" fill="white" opacity="0.6" />
                    <rect x="6.8" y="6.8" width="4.2" height="4.2" rx="1" fill="white" opacity="0.3" />
                  </svg>
                </div>
                <span className="l-device-appbar__title">TaskFlow</span>
                <div className="l-device-divider" />
                <div className="l-device-appbar__search">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <circle cx="4" cy="4" r="3" stroke="#c7c3be" strokeWidth="1.2" />
                    <path d="M6.2 6.2l1.5 1.5" stroke="#c7c3be" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  Search tasks…
                </div>
                <div className="l-device-appbar__filter l-device-appbar__filter--on">Alex Chen</div>
                <div className="l-device-appbar__filter">Priority: High</div>
                <div className="l-device-appbar__btn">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M4.5 1v7M1 4.5h7" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  New Task
                </div>
              </div>

              {/* Board + Detail Panel */}
              <div className="l-device-body">

                {/* 4 kanban columns */}
                <div className="l-device-board">

                  {/* Backlog */}
                  <div className="l-prev-col">
                    <div className="l-prev-col__head">
                      <div className="l-prev-col__label">
                        <span className="l-prev-col__dot" style={{ background: '#94a3b8' }} />Backlog
                      </div>
                      <span className="l-prev-count">2</span>
                    </div>
                    <div className="l-prev-card l-prev-card--lo">
                      <div className="l-prev-card__t">Write unit tests</div>
                      <div className="l-prev-card__d">Auth module, 80% coverage</div>
                      <div className="l-prev-card__f">
                        <div className="l-prev-av" style={{ background: '#059669' }}>JW</div>
                        <span className="l-prev-card__spacer" />
                        <span className="l-prev-badge" style={{ background: '#f0fdf4', color: '#16a34a' }}>Low</span>
                      </div>
                    </div>
                    <div className="l-prev-card l-prev-card--me">
                      <div className="l-prev-card__t">Onboarding redesign</div>
                      <div className="l-prev-card__d">Improve drop-off rate</div>
                      <div className="l-prev-card__f">
                        <div className="l-prev-av" style={{ background: '#d97706' }}>PN</div>
                        <span className="l-prev-card__spacer" />
                        <span className="l-prev-card__due">May 5</span>
                      </div>
                    </div>
                    <div className="l-prev-col__add">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M4 1v6M1 4h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                      Add task
                    </div>
                  </div>

                  {/* In Progress */}
                  <div className="l-prev-col">
                    <div className="l-prev-col__head">
                      <div className="l-prev-col__label">
                        <span className="l-prev-col__dot" style={{ background: '#3b82f6' }} />In Progress
                      </div>
                      <span className="l-prev-count">2</span>
                    </div>
                    <div className="l-prev-progress">
                      <div className="l-prev-progress__bar" style={{ width: '60%' }} />
                    </div>
                    <div className="l-prev-card l-prev-card--hi l-prev-card--active">
                      <div className="l-prev-card__t">DB query optimization</div>
                      <div className="l-prev-card__d">Fix N+1 queries in dashboard</div>
                      <div className="l-prev-card__f">
                        <div className="l-prev-av" style={{ background: '#1c1917' }}>AC</div>
                        <span className="l-prev-card__spacer" />
                        <span className="l-prev-badge" style={{ background: '#fff7ed', color: '#ea580c' }}>High</span>
                        <span className="l-prev-card__due">Apr 25</span>
                      </div>
                    </div>
                    <div className="l-prev-card l-prev-card--me">
                      <div className="l-prev-card__t">Email notifications</div>
                      <div className="l-prev-card__d">SendGrid transactional</div>
                      <div className="l-prev-card__f">
                        <div className="l-prev-av" style={{ background: '#d97706' }}>PN</div>
                        <span className="l-prev-card__spacer" />
                        <span className="l-prev-card__due">Apr 28</span>
                      </div>
                    </div>
                  </div>

                  {/* In Review */}
                  <div className="l-prev-col">
                    <div className="l-prev-col__head">
                      <div className="l-prev-col__label">
                        <span className="l-prev-col__dot" style={{ background: '#d97706' }} />In Review
                      </div>
                      <span className="l-prev-count">2</span>
                    </div>
                    <div className="l-prev-card l-prev-card--ur">
                      <div className="l-prev-card__t">API rate limiting</div>
                      <div className="l-prev-card__d">Redis middleware all endpoints</div>
                      <div className="l-prev-card__f">
                        <div className="l-prev-av" style={{ background: '#0891b2' }}>MT</div>
                        <span className="l-prev-card__spacer" />
                        <span className="l-prev-badge" style={{ background: '#fef2f2', color: '#dc2626' }}>Urgent</span>
                        <span className="l-prev-card__due l-prev-card__due--over">2d over</span>
                      </div>
                    </div>
                    <div className="l-prev-card l-prev-card--hi">
                      <div className="l-prev-card__t">Mobile nav fix</div>
                      <div className="l-prev-card__d">Hamburger + slide transition</div>
                      <div className="l-prev-card__f">
                        <div className="l-prev-av" style={{ background: '#db2777' }}>SK</div>
                        <span className="l-prev-card__spacer" />
                        <span className="l-prev-badge" style={{ background: '#fff7ed', color: '#ea580c' }}>High</span>
                      </div>
                    </div>
                  </div>

                  {/* Done */}
                  <div className="l-prev-col">
                    <div className="l-prev-col__head">
                      <div className="l-prev-col__label">
                        <span className="l-prev-col__dot" style={{ background: '#16a34a' }} />Done
                      </div>
                      <span className="l-prev-count">2</span>
                    </div>
                    <div className="l-prev-card l-prev-card--done">
                      <div className="l-prev-card__t">Auth flow setup</div>
                      <div className="l-prev-card__d">OAuth2, token refresh</div>
                      <div className="l-prev-card__f">
                        <div className="l-prev-av" style={{ background: '#1c1917' }}>AC</div>
                        <span className="l-prev-card__spacer" />
                        <div className="l-prev-done-check">
                          <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                            <path d="M1.5 3.5l1.5 1.5L5.5 2" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="l-prev-card l-prev-card--done">
                      <div className="l-prev-card__t">Design system audit</div>
                      <div className="l-prev-card__d">Component inventory done</div>
                      <div className="l-prev-card__f">
                        <div className="l-prev-av" style={{ background: '#db2777' }}>SK</div>
                        <span className="l-prev-card__spacer" />
                        <div className="l-prev-done-check">
                          <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                            <path d="M1.5 3.5l1.5 1.5L5.5 2" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Task detail panel */}
                <div className="l-device-panel">
                  <div className="l-device-panel__label">Task detail</div>
                  <div className="l-device-panel__title">API rate limiting implementation</div>

                  <div className="l-device-panel__badges">
                    <span className="l-device-panel__badge" style={{ background: '#fffbeb', color: '#d97706' }}>In Review</span>
                    <span className="l-device-panel__badge" style={{ background: '#fef2f2', color: '#dc2626' }}>Urgent</span>
                  </div>

                  <div className="l-device-panel__meta-row">
                    <div className="l-prev-av" style={{ background: '#0891b2', width: 16, height: 16, fontSize: 7 }}>MT</div>
                    <span>Marcus Torres</span>
                  </div>

                  <div className="l-device-panel__meta-row">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <rect x="1" y="2" width="8" height="7" rx="1" stroke="#a8a29e" strokeWidth="1" />
                      <path d="M3 1v2M7 1v2M1 5h8" stroke="#a8a29e" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    <span style={{ color: '#dc2626' }}>Apr 20 · 2 days overdue</span>
                  </div>

                  <div className="l-device-panel__sep" />

                  <div className="l-device-panel__desc">
                    Add rate limiting middleware to all public endpoints. Use Redis for distributed request tracking.
                  </div>

                  <div className="l-device-panel__sep" />

                  <div className="l-device-panel__activity-title">Activity</div>
                  <div className="l-device-activity">
                    {[
                      { text: 'Status → In Review', time: '12h ago' },
                      { text: 'Priority → Urgent',  time: '2d ago' },
                      { text: 'Assigned to Marcus', time: '3d ago' },
                      { text: 'Task created',        time: '4d ago' },
                    ].map((e, i) => (
                      <div key={i} className="l-device-activity__item">
                        <div className="l-device-activity__dot" />
                        <div>
                          <div className="l-device-activity__text">{e.text}</div>
                          <div className="l-device-activity__time">{e.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Feature strip ── */}
      <div className="l-strip">
        {STRIP_ITEMS.map((item) => (
          <div key={item.num} className="l-strip__item">
            <span className="l-strip__num">{item.num}</span>
            {item.label}
          </div>
        ))}
      </div>

      {/* ── Stats ── */}
      <div className="l-stats">
        <div className="l-stat">
          <div className="l-stat__num">{tasks.toLocaleString()}<span>+</span></div>
          <div className="l-stat__label">Tasks managed monthly</div>
        </div>
        <div className="l-stat">
          <div className="l-stat__num">{teams}<span>+</span></div>
          <div className="l-stat__label">Teams onboarded</div>
        </div>
        <div className="l-stat">
          <div className="l-stat__num">{shipped}<span>%</span></div>
          <div className="l-stat__label">Sprint completion rate</div>
        </div>
      </div>

      {/* ── Features ── */}
      <section className="l-features">
        <div className="l-features__header">
          <div>
            <div className="l-features__eyebrow">Why TaskFlow</div>
            <h2 className="l-features__heading">
              Everything a team needs.<br />Nothing it doesn't.
            </h2>
          </div>
          <p className="l-features__right-desc">
            Built for engineers who want to ship, not configure. A workflow tool that stays out of your way and tracks everything automatically.
          </p>
        </div>

        <div className="l-features__list">
          {FEATURES.map((f) => (
            <div key={f.num} className="l-feature-item">
              <span className="l-feature-item__num">{f.num}</span>
              <div>
                <div className="l-feature-item__title">{f.title}</div>
                <div className="l-feature-item__desc">{f.desc}</div>
              </div>
              <span className="l-feature-item__tag">{f.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="l-cta">
        <h2 className="l-cta__heading">
          Ready to clear<br />the <em>backlog?</em>
        </h2>
        <p className="l-cta__sub">
          No accounts, no onboarding, no waiting. Open the board and start moving work forward.
        </p>
        <button className="l-cta__btn" onClick={() => navigate('/board')}>
          Open Board — it&apos;s free
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M3.5 7.5h8M8 4l3.5 3.5L8 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="l-footer">
        <div className="l-footer__logo">
          <div className="l-nav__logo-mark" style={{ width: 22, height: 22, borderRadius: 5 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="4" height="4" rx="1" fill="white" />
              <rect x="7" y="1" width="4" height="4" rx="1" fill="white" opacity="0.6" />
              <rect x="1" y="7" width="4" height="4" rx="1" fill="white" opacity="0.6" />
              <rect x="7" y="7" width="4" height="4" rx="1" fill="white" opacity="0.3" />
            </svg>
          </div>
          TaskFlow
        </div>
        <span className="l-footer__text">Senior Frontend Engineer Assignment · 2025</span>
      </footer>

    </div>
  )
}
