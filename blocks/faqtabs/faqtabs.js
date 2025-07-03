// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';   // same helper you use in tabs.js :contentReference[oaicite:6]{index=6}

export default function decorate(block) {
  /* -------------------------------------------------------------
   *  Detect authoring vs. publish
   * ----------------------------------------------------------- */
  const isAuthor =
    window?.helix?.sidekick?.isEditor?.() ||
    document.documentElement.classList.contains('universal-editor');

  /* -------------------------------------------------------------
   *  Grab optional headline (first row) and build skeleton
   * ----------------------------------------------------------- */
  const headingRow = block.firstElementChild;
  const headerHTML = headingRow?.innerHTML || '';
  headingRow?.remove();

  const nav   = document.createElement('ul');  nav.className = 'faqtabs-nav';    nav.setAttribute('role','tablist');
  const panes = document.createElement('div'); panes.className = 'faqtabs-panels';
  block.prepend(nav);
  block.append(panes);

  /* -------------------------------------------------------------
   *  Convert every remaining row (= faqtab item)
   * ----------------------------------------------------------- */
  [...block.children].forEach((row, idx) => {
    if (row.classList.contains('faqtabs-nav') || row.classList.contains('faqtabs-panels')) return;

    const [titleDiv] = row.children;
    const tabTitle = titleDiv?.textContent.trim() || `Tab ${idx+1}`;
    const id = toClassName(tabTitle);

    /* ---- left-hand tab button -------------------------------- */
    const btn = document.createElement('button');
    btn.className = 'faqtabs-tab';
    btn.id = `tab-${id}`;
    btn.textContent = tabTitle;
    btn.setAttribute('type', 'button');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', !idx);
    btn.setAttribute('aria-controls', `panel-${id}`);
    nav.append(btn);

    /* ---- right-hand panel ------------------------------------ */
    const panel = document.createElement('div');
    panel.className = 'faqtabs-panel';
    panel.id = `panel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.hidden = !!idx;

    /* Collect Q-A rows from the UE table (preferred) … */
    const table = row.querySelector('table');
    const qaRows = [];
    if (table) {
      [...table.tBodies[0].rows].forEach((tr) => {
        const q = tr.cells[0]?.innerHTML.trim();
        const a = tr.cells[1]?.innerHTML.trim();
        if (q && a) qaRows.push({ q, a });
      });
    } else {
      /* …or gracefully fall back to consecutive <div>s */
      const cells = [...row.children].slice(1);   // skip titleDiv
      for (let i = 0; i < cells.length; i += 2) {
        qaRows.push({ q: cells[i]?.innerHTML.trim(), a: cells[i+1]?.innerHTML.trim() });
      }
    }

    qaRows.forEach(({ q, a }) => {
      const details = document.createElement('details');
      const summary = document.createElement('summary'); summary.innerHTML = q;
      const body    = document.createElement('p');       body.innerHTML    = a;
      details.append(summary, body);
      panel.append(details);
    });

    panes.append(panel);
    row.remove(); // scrub original author markup
  });

  /* -------------------------------------------------------------
   *  Interaction – switch panels
   * ----------------------------------------------------------- */
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const target = btn.getAttribute('aria-controls');

    nav.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', b === btn));
    panes.querySelectorAll('.faqtabs-panel').forEach((p) => { p.hidden = p.id !== target; });
  });

  /* -------------------------------------------------------------
   *  Put header back on top (optional)
   * ----------------------------------------------------------- */
  if (headerHTML) {
    const hdr = document.createElement('div');
    hdr.className = 'faqtabs-head';
    hdr.innerHTML = headerHTML;
    block.prepend(hdr);
  }

  /* Author mode stops here – raw table stays visible for editing */
  if (isAuthor) return;
}