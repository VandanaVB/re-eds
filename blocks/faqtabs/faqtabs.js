// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';   // same helper as tabs.js

export default function decorate(block) {
  /* ---------- gather rows ---------- */
  const rows = [...block.children];
  const heading = rows.shift();                  // optional headline row

  /* ---------- build tablist ---------- */
  const tablist = document.createElement('div');
  tablist.className = 'faqtabs-nav';
  tablist.setAttribute('role', 'tablist');

  if (heading) {                                 // keep headline if author added one
    const head = document.createElement('div');
    head.className = 'faqtabs-head';
    head.innerHTML = heading.innerHTML;
    block.prepend(head);
    heading.remove();
  }

  /* ---------- decorate every item row ---------- */
  rows.forEach((row, idx) => {
    /* ...row looks like:
       <div>
         <p data-aue-prop="tabTitle">Safety</p>
         <table data-aue-prop="faqRows">...</table>
       </div>
    */
    const titleEl = row.querySelector('[data-aue-prop="tabTitle"]') || row.firstElementChild;
    const tabTitle = titleEl?.textContent.trim() || `Tab ${idx + 1}`;
    const id = toClassName(tabTitle);

    /* ---- make the row a panel ---- */
    row.classList.add('faqtabs-panel');
    row.id = `panel-${id}`;
    row.setAttribute('role', 'tabpanel');
    row.setAttribute('aria-hidden', !!idx);

    /* ---- convert the table into an accordion (but KEEP it) ---- */
    const table = row.querySelector('table');
    if (table && table.tBodies[0]) {
      [...table.tBodies[0].rows].forEach((tr) => {
        const [qCell, aCell] = tr.cells;
        if (!qCell || !aCell) return;

        qCell.classList.add('faq-q');
        aCell.classList.add('faq-a');

        /* Toggle answer visibility */
        qCell.addEventListener('click', () => {
          tr.classList.toggle('is-collapsed');
        });
      });
    }

    /* ---- nav button ---- */
    const btn = document.createElement('button');
    btn.className = 'faqtabs-tab';
    btn.id = `tab-${id}`;
    btn.type = 'button';
    btn.textContent = tabTitle;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', !idx);
    btn.setAttribute('aria-controls', row.id);
    btn.addEventListener('click', () => {
      /* show / hide panels */
      tablist.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', false));
      rows.forEach((p) => p.setAttribute('aria-hidden', true));
      btn.setAttribute('aria-selected', true);
      row.setAttribute('aria-hidden', false);
    });

    tablist.append(btn);
  });

  /* ---------- inject tablist ---------- */
  block.prepend(tablist);
}
