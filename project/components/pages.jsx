/* global React, SITE, CATEGORIES, getCategory, formatDate, LogoMark */

function Shell({ children, posts, activeCategory, setActiveCategory, query, setQuery, activePost }) {
  return (
    <div className="os-app">
      <div className="grid-bg" />
      <div className="scanline" />
      <div className="noise" />
      <ExternalHud />

      <main className="os-viewport">
        <div className="desktop-frame crt-corners crt-curve os-frame">
          <div className="os-stage">
            <OsRail
              posts={posts}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              query={query}
              setQuery={setQuery}
              activePost={activePost}
            />
            <section className="os-content">
              {children}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function ExternalHud() {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = value => String(value).padStart(2, '0');
  return (
    <div className="hud">
      <div className="row gap-4" style={{ alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>
        <span style={{ color: 'var(--hot)', textShadow: '0 0 6px var(--hot)', whiteSpace: 'nowrap' }}>◆ PATRICK.OS</span>
        <span className="dim" style={{ whiteSpace: 'nowrap' }}>v1995.04</span>
        <span className="dim">//</span>
        <span className="os-rec-dot" />
        <span style={{ whiteSpace: 'nowrap' }}>REC · SIGNAL OK</span>
      </div>
      <div style={{ whiteSpace: 'nowrap' }}>
        TAPE {pad(now.getUTCHours())}:{pad(now.getUTCMinutes())}:{pad(now.getUTCSeconds())} · 18.78°N
      </div>
    </div>
  );
}

function OsRail({ posts, activeCategory, setActiveCategory, query, setQuery, activePost }) {
  const continuing = posts.find(post => post.category === 'training') || posts[0];
  return (
    <aside className="left-rail os-rail">
      <button className="os-rail-brand" onClick={() => setActiveCategory('all')}>
        <LogoMark size={34} />
        <span>
          <strong>PATRICK.OS</strong>
          <small>AI ARCHITECT</small>
        </span>
      </button>

      <div className="os-rail-section nav-section">▸ Navigate</div>
      <RailButton kind="nav" code="◆" label="Home" active={activeCategory === 'all' && !activePost} onClick={() => setActiveCategory('all')} />
      <RailButton kind="nav" code="▦" label="Archive" active={activeCategory !== 'all' && !activePost} onClick={() => setActiveCategory('all')} />
      <RailLink kind="nav" code="◇" label="About" href="#about" />
      <RailLink kind="nav" code="✦" label="Contact" href={`mailto:${SITE.email}`} />

      <div className="os-rail-section channel-section">▸ Channels</div>
      <div className="os-channel-strip">
        {CATEGORIES.filter(category => category.id !== 'all').map(category => {
          const count = posts.filter(post => post.category === category.id).length;
          return (
            <RailButton
              key={category.id}
              kind="channel"
              code={category.id === 'videos' ? '▶' : category.id === 'usecases' ? '◎' : category.id === 'training' ? '▤' : '◆'}
              label={category.label}
              count={String(count).padStart(2, '0')}
              color={category.color}
              active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          );
        })}
      </div>

      <label className="os-search">
        <span>▸ Search</span>
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search posts..." />
      </label>

      {continuing && (
        <>
          <div className="os-rail-section continue-section">▸ Continue</div>
          <button className="os-course-card" onClick={() => window.dispatchEvent(new CustomEvent('open-post', { detail: continuing.slug }))}>
            <div className="win95-bar">
              <span>{getCategory(continuing.category).short}</span>
              <div className="btn-row"><span className="win95-btn">_</span><span className="win95-btn">×</span></div>
            </div>
            <div className="os-course-body">
              <strong>{continuing.title}</strong>
              <div className="pbar dither"><i style={{ width: '35%' }} /></div>
              <span>35% · {continuing.readTime}</span>
            </div>
          </button>
        </>
      )}

      <div className="os-rail-status">
        <span style={{ color: 'var(--hot)' }}>●</span> BROADCAST LIVE<br />
        CHIANG MAI · 18.78°N<br />
        SIGNAL <span style={{ color: 'var(--cyan)' }}>STABLE</span>
      </div>
    </aside>
  );
}

function RailButton({ kind = '', code, label, count, color, active, onClick }) {
  return (
    <button className={'rail-item ' + (kind ? `${kind}-item ` : '') + (active ? 'active' : '')} onClick={onClick}>
      <span className="code" style={color ? { color, textShadow: `0 0 8px ${color}` } : undefined}>{code}</span>
      <span>{label}</span>
      <span className="mono dim" style={{ fontSize: 12 }}>{count || ''}</span>
    </button>
  );
}

function RailLink({ kind = '', code, label, href }) {
  return (
    <a className={'rail-item ' + (kind ? `${kind}-item` : '')} href={href}>
      <span className="code">{code}</span>
      <span>{label}</span>
      <span />
    </a>
  );
}

function BlogIndex({ posts, filteredPosts, activeCategory, setActiveCategory, query, onOpenPost }) {
  const featured = posts.find(post => post.featured) || posts[0];
  const category = getCategory(activeCategory);
  const visiblePosts = filteredPosts.slice(0, 8);

  return (
    <div className="os-index">
      <Hero onPrimary={() => featured && onOpenPost(featured)} />
      <ChannelGrid posts={posts} setActiveCategory={setActiveCategory} />
      {featured && <FeaturedFile post={featured} onOpenPost={onOpenPost} />}
      <section className="os-section">
        <div className="os-section-head">
          <div>
            <span style={{ color: category.color }}>▸ {query ? 'Search Signal' : category.id === 'all' ? 'Latest Drops' : category.label}</span>
            <h2>{query ? `Results for "${query}"` : category.id === 'all' ? 'Fresh From The Tape Deck' : category.label}</h2>
          </div>
          <em>{filteredPosts.length} {filteredPosts.length === 1 ? 'item' : 'items'}</em>
        </div>
        {visiblePosts.length ? (
          <div className="os-post-grid">
            {visiblePosts.map(post => <PostTile key={post.slug} post={post} onOpenPost={onOpenPost} />)}
          </div>
        ) : (
          <EmptyState title="No matching posts" message="Clear search or choose a different channel." />
        )}
      </section>
      <Newsletter />
    </div>
  );
}

function Hero({ onPrimary }) {
  return (
    <section className="synth-hero os-hero">
      <div className="hero-sun" />
      <MountainStrip />
      <PalmStrip />
      <div className="os-hero-top">
        <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
          <span className="neon-pill hot">▶ NOW BROADCASTING</span>
          <span className="neon-pill">CH.01 - CH.04</span>
        </div>
        <span>◇ CHIANG MAI · 04.19.2026</span>
      </div>
      <div className="os-hero-title">
        <h1 className="chrome-text">Patrick<br />Zgambo</h1>
        <h2 className="glow-cyan">AI · Chillwave · Chiang Mai</h2>
      </div>
      <div className="os-hero-bottom">
        <p>I make <strong>AI music videos</strong>, break down <strong>use cases</strong>, teach people how to <strong>build & ship</strong>, and consult with teams at the edge of AI.</p>
        <div className="row gap-3" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-vhs" onClick={onPrimary}>▶ Play The Reel</button>
          <a className="btn-ghost" href="mailto:hello@patrickzgambo.com">◆ Book A Consult</a>
        </div>
      </div>
    </section>
  );
}

function ChannelGrid({ posts, setActiveCategory }) {
  return (
    <section className="os-section">
      <div className="os-section-head">
        <div>
          <span>◇ 4 Channels</span>
          <h2>What I do.</h2>
        </div>
        <em>Pick a bank →</em>
      </div>
      <div className="os-channel-grid">
        {CATEGORIES.filter(category => category.id !== 'all').map(category => {
          const count = posts.filter(post => post.category === category.id).length;
          const icon = category.id === 'videos' ? '▶' : category.id === 'usecases' ? '◎' : category.id === 'training' ? '▤' : '◆';
          return (
            <button
              key={category.id}
              className="vhs-card os-channel-card"
              style={{ '--channel-color': category.color }}
              onClick={() => setActiveCategory(category.id)}
            >
              <div className="os-card-bar">
                <span>CH.{category.id.slice(0, 3).toUpperCase()}</span>
                <em>◇ {count} ITEMS</em>
              </div>
              <div className="os-channel-body">
                <b>{icon}</b>
                <h3>{category.label}</h3>
                <p>{category.description}</p>
                <span>▸ Enter Channel</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedFile({ post, onOpenPost }) {
  return (
    <section className="os-section">
      <div className="os-section-head">
        <div>
          <span style={{ color: 'var(--cyan)' }}>▸ Featured File</span>
          <h2>Now Playing</h2>
        </div>
      </div>
      <button className="os-featured" onClick={() => onOpenPost(post)}>
        <Thumb post={post} />
        <div>
          <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
            <span className="neon-pill mag">◆ Featured</span>
            <span className="neon-pill">{getCategory(post.category).label}</span>
            <span className="mono dim">{formatDate(post.date)}</span>
          </div>
          <h3>{post.title}</h3>
          <p>{post.summary}</p>
          <div className="row gap-3">
            <span className="btn-vhs">▶ Read</span>
            <span className="btn-ghost">◆ Save</span>
          </div>
        </div>
      </button>
    </section>
  );
}

function PostTile({ post, onOpenPost }) {
  const category = getCategory(post.category);
  return (
    <button className="vhs-card os-post-tile" onClick={() => onOpenPost(post)}>
      <Thumb post={post} compact />
      <div className="os-post-body">
        <div className="row gap-2" style={{ alignItems: 'baseline', flexWrap: 'wrap' }}>
          <span className="mono" style={{ color: category.color, textShadow: `0 0 6px ${category.color}` }}>{category.label.toUpperCase()}</span>
          <span className="mono dim">{formatDate(post.date)}</span>
          <span className="mono dim">{post.readTime}</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.summary}</p>
        <TagRow tags={post.tags} />
      </div>
    </button>
  );
}

function Thumb({ post, compact }) {
  return (
    <div className={'thumb os-thumb' + (compact ? ' compact' : '')}>
      {post.cover && <img src={post.cover} alt="" />}
      <span className="label">{getCategory(post.category).short}</span>
      <span className="timecode">{post.readTime}</span>
      <span className="play-overlay">{post.category === 'videos' ? '▶' : '◆'}</span>
    </div>
  );
}

function TagRow({ tags }) {
  if (!tags || !tags.length) return null;
  return (
    <div className="os-tags">
      {tags.slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}
    </div>
  );
}

function PostReader({ post, posts, onBack }) {
  const category = getCategory(post.category);
  const related = posts
    .filter(candidate => candidate.slug !== post.slug)
    .filter(candidate => candidate.category === post.category || candidate.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3);

  return (
    <article className="os-reader">
      <button className="btn-ghost" onClick={onBack}>← Back To Index</button>
      <header>
        <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
          <span className="neon-pill" style={{ borderColor: category.color, color: category.color }}>{category.label}</span>
          <span className="neon-pill mag">{post.readTime}</span>
          <span className="mono dim">{formatDate(post.date)} · {post.author}</span>
        </div>
        <h1>{post.title}</h1>
        <p>{post.summary}</p>
        <TagRow tags={post.tags} />
      </header>
      <Thumb post={post} />
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      {related.length > 0 && (
        <section className="os-related">
          <div className="os-section-head">
            <div>
              <span>◇ Also On The Tape</span>
              <h2>Related Posts</h2>
            </div>
          </div>
          <div className="os-post-grid">
            {related.map(item => <PostTile key={item.slug} post={item} onOpenPost={(next) => window.dispatchEvent(new CustomEvent('open-post', { detail: next.slug }))} />)}
          </div>
        </section>
      )}
    </article>
  );
}

function Newsletter() {
  return (
    <section id="newsletter" className="os-newsletter win95">
      <div className="win95-bar">
        <span>◆ The Sunday Transmission - SIGNAL_SUB.EXE</span>
        <div className="btn-row"><span className="win95-btn">_</span><span className="win95-btn">×</span></div>
      </div>
      <div className="os-newsletter-body">
        <div>
          <h3>One tape. One signal. Every Sunday.</h3>
          <p>One AI experiment, one breakdown, one thing I shipped.</p>
        </div>
        <form onSubmit={event => event.preventDefault()}>
          <input type="email" placeholder="you@transmission.net" aria-label="Email address" />
          <button className="btn-vhs">▶ Sub</button>
        </form>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="os-state">
      <div className="grid-bg" />
      <div className="win95">
        <div className="win95-bar">◆ Loading PATRICK.OS</div>
        <div className="os-state-body">Reading Markdown posts from <code>posts/index.json</code>...</div>
      </div>
    </div>
  );
}

function ErrorState({ error }) {
  return (
    <div className="os-state">
      <div className="grid-bg" />
      <div className="win95">
        <div className="win95-bar">◆ Signal Error</div>
        <div className="os-state-body">
          <h1>Could not load the blog content.</h1>
          <p>{error}</p>
          <p>Run this folder through a local static server while testing.</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, message }) {
  return (
    <div className="win95 os-empty">
      <div className="win95-bar">◇ No Signal</div>
      <div className="os-state-body">
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}

function PalmStrip() {
  return (
    <svg viewBox="0 0 1200 220" preserveAspectRatio="none" className="os-palms" aria-hidden="true">
      <g fill="#0e0524">
        <path d="M120 220 L118 120 C118 115 122 110 125 112 L130 120 L132 115 L135 125 L140 118 L138 128 L145 122 L142 132 L150 128 L146 138 L155 136 L150 146 L158 148 L150 155 L135 160 L132 220 Z" />
        <path d="M120 120 C 110 100, 92 90, 78 92 L 90 96 L 76 102 L 92 104 L 82 112 L 98 110 L 92 118 L 108 114 Z" />
        <path d="M122 118 C 132 92, 148 80, 165 78 L 152 88 L 168 92 L 150 98 L 162 106 L 146 106 L 156 116 L 140 112 Z" />
      </g>
      <g fill="#0e0524" transform="translate(950 20)">
        <path d="M120 200 L118 105 C118 100 122 95 125 97 L130 105 L135 115 L142 108 L146 118 L152 114 L148 124 L156 122 L150 132 L135 138 L132 200 Z" />
        <path d="M120 105 C 108 85, 90 75, 76 78 L 90 82 L 76 88 L 92 92 L 82 100 L 98 98 Z" />
        <path d="M122 103 C 132 78, 150 66, 168 64 L 152 74 L 170 78 L 150 86 L 164 92 Z" />
      </g>
    </svg>
  );
}

function MountainStrip() {
  return (
    <svg viewBox="0 0 1200 220" preserveAspectRatio="none" className="os-mountains" aria-hidden="true">
      <polygon points="0,220 0,120 80,60 160,130 260,40 340,150 440,80 540,140 640,60 740,150 840,70 940,140 1040,60 1120,130 1200,100 1200,220" fill="#1b0845" />
    </svg>
  );
}

Object.assign(window, {
  Shell,
  BlogIndex,
  PostReader,
  LoadingState,
  ErrorState
});
