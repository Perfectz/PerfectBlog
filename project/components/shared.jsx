/* global React */

const SITE = {
  name: 'Patrick Zgambo',
  handle: 'PATRICK.OS',
  tagline: 'AI experiments, music-video workflows, training notes, and consulting field reports from Chiang Mai.',
  location: 'Chiang Mai, Thailand',
  email: 'hello@patrickzgambo.com'
};

const CATEGORIES = [
  {
    id: 'all',
    label: 'All Posts',
    short: 'All',
    color: 'var(--cyan)',
    description: 'Everything published on the blog.'
  },
  {
    id: 'videos',
    label: 'Music Videos',
    short: 'Videos',
    color: 'var(--hot)',
    description: 'AI-generated music videos, visual experiments, and production notes.'
  },
  {
    id: 'usecases',
    label: 'Use Cases',
    short: 'Use Cases',
    color: 'var(--cyan)',
    description: 'Real AI applications broken down end to end.'
  },
  {
    id: 'training',
    label: 'Training',
    short: 'Training',
    color: 'var(--gold)',
    description: 'Courses, workshops, and practical learning material.'
  },
  {
    id: 'consulting',
    label: 'Consulting',
    short: 'Consulting',
    color: 'var(--lime)',
    description: 'Strategy, implementation, and founder-facing field notes.'
  }
];

function getCategory(id) {
  return CATEGORIES.find(category => category.id === id) || CATEGORIES[0];
}

function formatDate(value) {
  if (!value || value === 'OPEN' || value === 'WAITLIST') return value || '';
  const date = new Date(value + 'T00:00:00');
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) {
    return { metadata: {}, body: raw };
  }

  const metadata = {};
  match[1].split(/\r?\n/).forEach(line => {
    const separator = line.indexOf(':');
    if (separator === -1) return;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (!key) return;
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key === 'tags') {
      metadata[key] = value ? value.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    } else if (key === 'featured') {
      metadata[key] = value.toLowerCase() === 'true';
    } else {
      metadata[key] = value;
    }
  });

  return {
    metadata,
    body: raw.slice(match[0].length)
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeUrl(value) {
  const url = String(value || '').trim();
  if (/^\s*javascript:/i.test(url)) return '#';
  return escapeHtml(url);
}

function renderInline(markdown) {
  let html = escapeHtml(markdown);
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
    return `<img src="${safeUrl(src)}" alt="${escapeHtml(alt)}">`;
  });
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
    return `<a href="${safeUrl(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  return html;
}

function isBlockStart(line) {
  return /^#{1,4}\s+/.test(line)
    || /^>\s?/.test(line)
    || /^([-*+])\s+/.test(line)
    || /^\d+\.\s+/.test(line)
    || /^---+$/.test(line)
    || /^```/.test(line);
}

function renderMarkdown(markdown) {
  const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (/^```/.test(line)) {
      const language = line.replace(/^```/, '').trim();
      const code = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      html.push(`<pre class="md-code"><code data-language="${escapeHtml(language)}">${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      html.push(`<h${level} id="${slug}">${renderInline(text)}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      html.push('<hr>');
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      html.push(`<blockquote>${quote.map(renderInline).join('<br>')}</blockquote>`);
      continue;
    }

    if (/^([-*+])\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^([-*+])\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^([-*+])\s+/, ''));
        i += 1;
      }
      html.push(`<ul>${items.map(item => `<li>${renderInline(item)}</li>`).join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i += 1;
      }
      html.push(`<ol>${items.map(item => `<li>${renderInline(item)}</li>`).join('')}</ol>`);
      continue;
    }

    const paragraph = [line.trim()];
    i += 1;
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    html.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
  }

  return html.join('\n');
}

function plainText(markdown) {
  return String(markdown || '')
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[#>*_`-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseMarkdownDocument(raw, file) {
  const parsed = parseFrontmatter(raw);
  const metadata = parsed.metadata;
  const title = metadata.title || file.replace(/^.*\/|\.md$/g, '').replace(/-/g, ' ');
  const slug = metadata.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const tags = Array.isArray(metadata.tags) ? metadata.tags : [];

  return {
    file,
    slug,
    title,
    date: metadata.date || '',
    category: metadata.category || 'usecases',
    tags,
    summary: metadata.summary || '',
    readTime: metadata.readTime || '',
    featured: Boolean(metadata.featured),
    author: metadata.author || SITE.name,
    cover: metadata.cover || '',
    body: parsed.body,
    html: renderMarkdown(parsed.body),
    searchText: [
      title,
      metadata.summary || '',
      metadata.category || '',
      tags.join(' '),
      plainText(parsed.body)
    ].join(' ').toLowerCase()
  };
}

function sortPosts(posts) {
  return [...posts].sort((a, b) => {
    const aTime = Date.parse(a.date || '') || 0;
    const bTime = Date.parse(b.date || '') || 0;
    return bTime - aTime;
  });
}

function LogoMark({ size = 22 }) {
  return (
    <span style={{
      display: 'inline-block',
      width: size,
      height: size,
      position: 'relative',
      flex: `0 0 ${size}px`,
      background: 'linear-gradient(135deg, var(--hot), var(--cyan))',
      transform: 'rotate(45deg)',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.18), 0 0 16px rgba(255,41,117,0.7)'
    }}>
      <span style={{
        position: 'absolute',
        inset: '26%',
        background: 'var(--bg-0)'
      }} />
    </span>
  );
}

Object.assign(window, {
  SITE,
  CATEGORIES,
  getCategory,
  formatDate,
  LogoMark,
  parseMarkdownDocument,
  sortPosts
});
