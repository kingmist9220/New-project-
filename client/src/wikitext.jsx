// A small parser for a subset of MediaWiki-style markup. It renders straight
// to React elements (never raw HTML), so article text can't inject scripts.
import { Link } from 'react-router-dom';
import { slugify } from './api.js';

const INLINE = /(\[\[([^\]|]+)(?:\|([^\]]+))?\]\])|(\[(https?:\/\/[^\s\]]+)(?:\s+([^\]]+))?\])|('''(.+?)''')|(''(.+?)'')/g;

export function headingId(text) {
  return slugify(text) || 'section';
}

// Splits text into blocks: headings, bullet/numbered lists and paragraphs.
export function parseBlocks(source) {
  const blocks = [];
  let para = [];
  let list = null;

  const flushPara = () => {
    if (para.length) blocks.push({ type: 'p', text: para.join(' ') });
    para = [];
  };
  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  for (const raw of source.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trimEnd();
    const heading = line.match(/^(={2,4})\s*(.+?)\s*\1$/);
    const item = line.match(/^([*#])\s*(.*)$/);

    if (heading) {
      flushPara();
      flushList();
      blocks.push({ type: 'h', level: heading[1].length, text: heading[2] });
    } else if (item) {
      flushPara();
      const type = item[1] === '*' ? 'ul' : 'ol';
      if (list?.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push(item[2]);
    } else if (!line.trim()) {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();
  return blocks;
}

export function tableOfContents(blocks) {
  return blocks.filter((b) => b.type === 'h').map((b) => ({ level: b.level, text: b.text, id: headingId(b.text) }));
}

// All internal link targets, so the page can ask the server which ones exist.
export function linkedSlugs(source) {
  const slugs = new Set();
  for (const m of source.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) {
    if (!m[1].startsWith('Special:')) slugs.add(slugify(m[1]));
  }
  return [...slugs];
}

const SPECIAL_ROUTES = {
  'Special:AllPages': '/special/all',
  'Special:RecentChanges': '/special/recent',
  'Special:Random': '/special/random',
};

function renderInline(text, existing, keyPrefix) {
  const out = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyPrefix}-${i++}`;
    if (m[1]) {
      const target = m[2].trim();
      const label = m[3] ?? target;
      if (SPECIAL_ROUTES[target]) {
        out.push(<Link key={key} to={SPECIAL_ROUTES[target]}>{label}</Link>);
      } else {
        const slug = slugify(target);
        const missing = existing && existing[slug] === false;
        out.push(
          <Link
            key={key}
            to={missing ? `/wiki/${encodeURIComponent(slug)}/edit` : `/wiki/${encodeURIComponent(slug)}`}
            className={missing ? 'new' : undefined}
            title={missing ? `${target} (page does not exist)` : target}
          >
            {label}
          </Link>,
        );
      }
    } else if (m[4]) {
      out.push(
        <a key={key} className="external" href={m[5]} target="_blank" rel="noopener noreferrer">
          {m[6] ?? m[5]}
        </a>,
      );
    } else if (m[7]) {
      out.push(<b key={key}>{renderInline(m[8], existing, key)}</b>);
    } else if (m[9]) {
      out.push(<i key={key}>{renderInline(m[10], existing, key)}</i>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function WikiContent({ blocks, existing }) {
  return blocks.map((b, i) => {
    if (b.type === 'h') {
      const Tag = `h${b.level}`;
      return <Tag key={i} id={headingId(b.text)}>{renderInline(b.text, existing, i)}</Tag>;
    }
    if (b.type === 'ul' || b.type === 'ol') {
      const Tag = b.type;
      return (
        <Tag key={i}>
          {b.items.map((item, j) => <li key={j}>{renderInline(item, existing, `${i}-${j}`)}</li>)}
        </Tag>
      );
    }
    return <p key={i}>{renderInline(b.text, existing, i)}</p>;
  });
}
