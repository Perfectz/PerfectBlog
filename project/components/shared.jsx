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

function renderChartDemo(type) {
  const safeType = String(type || 'bar').toLowerCase().replace(/[^a-z0-9-]/g, '');
  const titles = {
    kpi: 'KPI scorecard',
    bullet: 'Actual vs target bullet chart',
    line: 'Daily revenue line chart',
    area: 'Cumulative conversions area chart',
    combo: 'Clicks and CTR combo chart',
    multiples: 'Channel revenue small multiples',
    bar: 'Conversions by channel bar chart',
    horizontal: 'Creative conversion ranking',
    pareto: 'Creative conversion Pareto chart',
    radar: 'Channel strength radar chart',
    donut: 'Revenue mix donut chart',
    stacked: 'Conversions by channel stacked bar',
    treemap: 'Budget allocation treemap',
    waterfall: 'Revenue bridge waterfall',
    funnel: 'Launch conversion funnel',
    sankey: 'Spend to revenue Sankey flow',
    histogram: 'Order value histogram',
    boxplot: 'Order value box plot',
    scatter: 'Spend vs revenue scatter plot',
    heatmap: 'Channel performance heatmap'
  };
  const title = titles[safeType] || 'Chart example';
  const imageSrc = `assets/charts/${safeType}.svg`;
  return [
    `<figure class="chart-demo chart-demo-${safeType}" role="img" aria-label="${escapeHtml(title)}">`,
    `<figcaption><span>${escapeHtml(title)}</span><em>Python / matplotlib output - generated from the article prompt</em></figcaption>`,
    `<div class="chart-demo-canvas chart-code-output"><img class="chart-output-img" src="${imageSrc}" alt="${escapeHtml(title)} generated with Python and matplotlib"></div>`,
    '</figure>'
  ].join('');

  const svg = (body, viewBox = '0 0 720 360') => `<svg class="chart-svg" viewBox="${viewBox}" role="img" aria-hidden="true">${body}</svg>`;
  const text = (x, y, value, className = '') => `<text x="${x}" y="${y}" class="${className}">${escapeHtml(value)}</text>`;
  const line = (x1, y1, x2, y2, className = 'axis') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${className}" />`;
  const rect = (x, y, w, h, className = 'bar') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" class="${className}" />`;
  const polyline = (points, className = 'line') => `<polyline points="${points.map(point => point.join(',')).join(' ')}" class="${className}" />`;
  const path = (d, className = 'line') => `<path d="${d}" class="${className}" />`;
  const chart = (body, subtitle = 'VS Code output - generated from the article prompt') => [
    `<figure class="chart-demo chart-demo-${safeType}" role="img" aria-label="${escapeHtml(title)}">`,
    `<figcaption><span>${escapeHtml(title)}</span><em>${escapeHtml(subtitle)}</em></figcaption>`,
    `<div class="chart-demo-canvas chart-code-output">${body}</div>`,
    '</figure>'
  ].join('');

  const barChart = (labels, values, horizontal = false) => {
    if (horizontal) {
      const max = Math.max(...values);
      return svg([
        text(56, 38, 'Conversion rate by creative', 'chart-heading'),
        line(190, 304, 650, 304),
        ...labels.map((label, index) => {
          const y = 76 + index * 38;
          const width = Math.round((values[index] / max) * 390);
          return [
            text(38, y + 18, label, 'axis-label left'),
            rect(190, y, width, 22, index < 3 ? 'bar accent' : 'bar muted'),
            text(200 + width, y + 17, `${values[index].toFixed(1)}%`, 'value-label')
          ].join('');
        })
      ].join(''));
    }
    const max = Math.max(...values);
    return svg([
      text(56, 38, 'Conversions by channel', 'chart-heading'),
      line(72, 304, 662, 304),
      line(72, 62, 72, 304),
      ...labels.map((label, index) => {
        const h = Math.round((values[index] / max) * 210);
        const x = 104 + index * 104;
        return [
          rect(x, 304 - h, 58, h, index === 0 ? 'bar accent' : 'bar'),
          text(x + 29, 328, label, 'axis-label center'),
          text(x + 29, 294 - h, values[index], 'value-label center')
        ].join('');
      })
    ].join(''));
  };

  const linePoints = [[80, 260], [140, 228], [200, 238], [260, 178], [320, 154], [380, 168], [440, 124], [500, 104], [560, 126], [640, 86]];

  const renderers = {
    kpi: () => chart([
      '<div class="kpi-grid">',
      '<div><span>Revenue</span><strong>$428K</strong><em>86% of $500K goal</em></div>',
      '<div><span>Spend</span><strong>$92K</strong><em>92% of budget</em></div>',
      '<div><span>ROAS</span><strong>4.7x</strong><em>Target 5.0x</em></div>',
      '<div><span>CAC</span><strong>$41</strong><em>$4 under target</em></div>',
      '</div>'
    ].join(''), 'VS Code output - HTML/CSS KPI component'),
    bullet: () => chart(svg([
      text(56, 38, 'Actual vs target pacing', 'chart-heading'),
      ...[
        ['Revenue', 428, 500, 610],
        ['Spend', 92, 100, 620],
        ['ROAS', 4.7, 5, 596],
        ['CAC', 41, 45, 572]
      ].map((item, index) => {
        const y = 76 + index * 58;
        const actual = Math.min(420, Math.round((item[1] / item[2]) * 420));
        return [
          text(56, y + 21, item[0], 'axis-label'),
          rect(180, y, 180, 24, 'band muted'),
          rect(360, y, 150, 24, 'band'),
          rect(510, y, 90, 24, 'band strong'),
          rect(180, y + 6, actual, 12, 'bar accent'),
          line(item[3], y - 5, item[3], y + 35, 'target-line'),
          text(622, y + 20, `${item[1]} / ${item[2]}`, 'value-label')
        ].join('');
      })
    ].join(''))),
    line: () => chart(svg([
      text(56, 38, 'Daily revenue vs required pace', 'chart-heading'),
      line(70, 304, 662, 304),
      line(70, 60, 70, 304),
      line(70, 158, 662, 158, 'target-line dashed'),
      text(520, 148, '$16.7K/day pace', 'value-label'),
      polyline(linePoints, 'line'),
      ...linePoints.map(point => `<circle cx="${point[0]}" cy="${point[1]}" r="5" class="dot" />`)
    ].join(''))),
    area: () => chart(svg([
      text(56, 38, 'Cumulative conversions by channel', 'chart-heading'),
      line(70, 304, 662, 304),
      path('M80 284 C160 266 220 220 300 202 C380 178 450 126 640 82 L640 304 L80 304 Z', 'area cyan'),
      path('M80 304 C160 292 226 260 300 244 C390 216 450 176 640 142 L640 304 Z', 'area pink'),
      path('M80 304 C160 300 226 282 300 274 C390 248 450 224 640 190 L640 304 Z', 'area gold'),
      text(516, 86, 'Paid Search', 'value-label'),
      text(520, 146, 'Email', 'value-label'),
      text(520, 194, 'Organic', 'value-label')
    ].join(''))),
    combo: () => chart(svg([
      text(56, 38, 'Clicks and CTR by day', 'chart-heading'),
      line(72, 304, 662, 304),
      ...[68, 88, 74, 112, 96, 138, 156, 126].map((value, index) => rect(104 + index * 68, 304 - value, 34, value, 'bar muted')),
      polyline([[116, 248], [184, 232], [252, 238], [320, 202], [388, 190], [456, 176], [524, 154], [592, 168]], 'line hot'),
      text(560, 152, 'CTR %', 'value-label hot'),
      text(116, 330, 'Clicks', 'axis-label center')
    ].join(''))),
    multiples: () => chart(svg([
      text(56, 38, 'Daily revenue by channel', 'chart-heading'),
      ...['Search', 'Social', 'Email', 'Organic', 'Display'].map((label, index) => {
        const x = 52 + index * 132;
        const y = 86;
        return [
          `<rect x="${x}" y="${y}" width="108" height="178" rx="10" class="panel" />`,
          polyline([[x + 12, y + 138], [x + 34, y + 122], [x + 58, y + 132 - index * 5], [x + 82, y + 86 - index * 7], [x + 96, y + 98]], 'line mini'),
          text(x + 54, y + 206, label, 'axis-label center')
        ].join('');
      })
    ].join(''))),
    bar: () => chart(barChart(['Search', 'Social', 'Email', 'Organic', 'Display'], [690, 540, 420, 310, 180])),
    horizontal: () => chart(barChart(['Neon A', 'Retro CTA', 'Synth B', 'Founder', 'Loop 07', 'Static'], [9.8, 8.7, 7.9, 6.4, 5.8, 4.6], true)),
    pareto: () => chart(svg([
      text(56, 38, 'Top creative conversion concentration', 'chart-heading'),
      line(72, 304, 662, 304),
      ...[170, 132, 96, 76, 58, 44].map((value, index) => rect(98 + index * 76, 304 - value, 42, value, index < 2 ? 'bar accent' : 'bar muted')),
      polyline([[119, 208], [195, 162], [271, 132], [347, 110], [423, 94], [499, 82]], 'line hot'),
      line(72, 102, 662, 102, 'target-line dashed'),
      text(536, 96, '80%', 'value-label hot')
    ].join(''))),
    radar: () => chart(svg([
      text(56, 38, 'Normalized channel profile', 'chart-heading'),
      '<polygon points="360,78 512,168 474,292 246,292 208,168" class="radar-grid" />',
      '<polygon points="360,116 470,176 436,258 274,260 246,178" class="radar-shape cyan" />',
      '<polygon points="360,150 440,190 410,280 288,244 236,190" class="radar-shape hot" />',
      text(344, 68, 'Reach', 'axis-label center'),
      text(524, 170, 'CTR', 'axis-label'),
      text(468, 318, 'CVR', 'axis-label center'),
      text(220, 318, 'ROAS', 'axis-label center'),
      text(152, 170, 'CAC', 'axis-label')
    ].join(''))),
    donut: () => chart(svg([
      text(56, 38, 'Revenue mix by channel', 'chart-heading'),
      '<circle cx="270" cy="188" r="104" class="donut-bg" />',
      '<circle cx="270" cy="188" r="104" class="donut-slice one" />',
      '<circle cx="270" cy="188" r="104" class="donut-slice two" />',
      '<circle cx="270" cy="188" r="64" class="donut-hole" />',
      text(246, 194, '42%', 'kpi-label'),
      text(438, 138, 'Paid Search 42%', 'value-label'),
      text(438, 172, 'Paid Social 27%', 'value-label'),
      text(438, 206, 'Email 18%', 'value-label'),
      text(438, 240, 'Other 13%', 'value-label')
    ].join(''))),
    stacked: () => chart(svg([
      text(56, 38, 'Weekly conversions by channel', 'chart-heading'),
      line(72, 304, 662, 304),
      ...[0, 1, 2, 3].map((week) => {
        const x = 136 + week * 116;
        const a = 76 + week * 14;
        const b = 52 + week * 8;
        const c = 34 + week * 6;
        return [
          rect(x, 304 - a, 58, a, 'bar accent'),
          rect(x, 304 - a - b, 58, b, 'bar cyan'),
          rect(x, 304 - a - b - c, 58, c, 'bar gold'),
          text(x + 29, 328, `W${week + 1}`, 'axis-label center')
        ].join('');
      })
    ].join(''))),
    treemap: () => chart(svg([
      text(56, 38, 'Budget allocation by channel', 'chart-heading'),
      '<rect x="70" y="72" width="300" height="210" rx="8" class="tile hot" />',
      '<rect x="382" y="72" width="190" height="124" rx="8" class="tile cyan" />',
      '<rect x="382" y="206" width="120" height="76" rx="8" class="tile gold" />',
      '<rect x="512" y="206" width="90" height="76" rx="8" class="tile muted" />',
      text(92, 112, 'Paid Search $42K', 'tile-label'),
      text(404, 112, 'Paid Social $27K', 'tile-label'),
      text(402, 248, 'Email $18K', 'tile-label'),
      text(526, 248, 'Other', 'tile-label')
    ].join(''))),
    waterfall: () => chart(svg([
      text(56, 38, 'Revenue bridge to net contribution', 'chart-heading'),
      line(72, 304, 662, 304),
      ...[
        ['Gross', 74, 218, 86, 'bar accent'],
        ['Refunds', 178, 248, 30, 'bar danger'],
        ['Discounts', 282, 268, 20, 'bar danger'],
        ['Shipping', 386, 232, 36, 'bar cyan'],
        ['Net', 490, 196, 108, 'bar gold']
      ].map(item => [rect(item[1], item[2], 62, item[3], item[4]), text(item[1] + 31, 328, item[0], 'axis-label center')].join(''))
    ].join(''))),
    funnel: () => chart(svg([
      text(56, 38, 'Launch conversion funnel', 'chart-heading'),
      ...[
        ['Impressions', 94, 560, '1.2M'],
        ['Clicks', 148, 452, '84K'],
        ['Trials', 202, 328, '9.6K'],
        ['Orders', 256, 208, '2.4K']
      ].map((item, index) => [
        `<path d="M${360 - item[2] / 2} ${item[1]} H${360 + item[2] / 2} L${360 + item[2] / 2 - 34} ${item[1] + 38} H${360 - item[2] / 2 + 34} Z" class="funnel-step s${index}" />`,
        text(360, item[1] + 25, `${item[0]} - ${item[3]}`, 'funnel-label')
      ].join(''))
    ].join(''))),
    sankey: () => chart(svg([
      text(56, 38, 'Spend to channel to revenue', 'chart-heading'),
      path('M116 126 C270 118 312 102 456 90', 'flow thick cyan'),
      path('M116 178 C270 178 312 170 456 170', 'flow medium hot'),
      path('M116 232 C270 238 312 254 456 262', 'flow thin gold'),
      rect(58, 96, 96, 168, 'node'),
      rect(456, 66, 122, 48, 'node accent'),
      rect(456, 146, 122, 48, 'node'),
      rect(456, 238, 122, 48, 'node'),
      text(82, 184, 'Spend', 'node-label'),
      text(482, 96, 'Search', 'node-label'),
      text(482, 176, 'Social', 'node-label'),
      text(486, 268, 'Email', 'node-label')
    ].join(''))),
    histogram: () => chart(svg([
      text(56, 38, 'Order value distribution', 'chart-heading'),
      line(72, 304, 662, 304),
      ...[28, 54, 102, 168, 144, 96, 54, 30].map((value, index) => rect(104 + index * 62, 304 - value, 44, value, index === 3 ? 'bar accent' : 'bar muted')),
      text(316, 334, 'Order value buckets', 'axis-label center')
    ].join(''))),
    boxplot: () => chart(svg([
      text(56, 38, 'Order value spread by channel', 'chart-heading'),
      line(72, 304, 662, 304),
      ...['Search', 'Social', 'Email', 'Organic'].map((label, index) => {
        const x = 138 + index * 124;
        return [
          line(x, 112 + index * 8, x, 260 - index * 10, 'target-line'),
          `<rect x="${x - 28}" y="${156 - index * 4}" width="56" height="${62 + index * 8}" rx="5" class="box" />`,
          line(x - 32, 190, x + 32, 190, 'median'),
          text(x, 328, label, 'axis-label center')
        ].join('');
      })
    ].join(''))),
    scatter: () => chart(svg([
      text(56, 38, 'Spend vs revenue by creative', 'chart-heading'),
      line(72, 304, 662, 304),
      line(72, 62, 72, 304),
      ...[[118, 260], [154, 240], [196, 224], [238, 198], [288, 184], [324, 160], [386, 148], [432, 126], [486, 110], [548, 94], [604, 82]].map((point, index) => `<circle cx="${point[0]}" cy="${point[1]}" r="${index > 8 ? 9 : 6}" class="dot ${index > 8 ? 'hot' : ''}" />`),
      text(322, 334, 'Spend', 'axis-label center'),
      text(30, 72, 'Revenue', 'axis-label')
    ].join(''))),
    heatmap: () => chart(svg([
      text(56, 38, 'ROAS by day and channel', 'chart-heading'),
      ...['Search', 'Social', 'Email', 'Organic', 'Display'].map((label, row) => [
        text(48, 92 + row * 38, label, 'axis-label'),
        ...Array.from({ length: 7 }, (_item, col) => `<rect x="${150 + col * 58}" y="${70 + row * 38}" width="46" height="28" rx="5" class="heat v${(row + col) % 5}" />`)
      ].join('')),
      ...['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, col) => text(173 + col * 58, 306, label, 'axis-label center'))
    ].join('')))
  };

  return (renderers[safeType] || renderers.bar)();
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
      if (language.toLowerCase() === 'mermaid') {
        html.push(`<figure class="md-diagram"><figcaption><span>VS Code Mermaid output</span><em>Rendered inline from the article prompt</em></figcaption><div class="mermaid">${escapeHtml(code.join('\n'))}</div></figure>`);
        continue;
      }
      if (language.toLowerCase().startsWith('chartdemo')) {
        const type = language.split(/\s+/)[1] || 'bar';
        html.push(renderChartDemo(type));
        continue;
      }
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
