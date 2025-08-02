/*  Decorator fires once per .faqtab.block.
 *  ■ Builds an accordion for its own Q-A rows
 *  ■ Registers itself so the first block can build / refresh the nav
 *  ■ Keeps UE bindings intact (no author markup removed)
 */
export default function decorate(block) {
  const section = block.closest('.faqtab-container');
  if (!section) return;

  /* ------------------------------------------------------------------
   * 1. Build accordion inside *this* block (idempotent)
   * ---------------------------------------------------------------- */
  const inEditor = !!document.documentElement.dataset.editor;

  [...block.querySelectorAll('[data-aue-model="questionanswer"]')].forEach(
    (qa, rowIdx) => {
      if (qa.querySelector('details')) return;          // already done

      const q = qa.querySelector('[data-aue-prop="question"]');
      const a = qa.querySelector('[data-aue-prop="answer"]');
      if (!q || !a) return;

      const details  = document.createElement('details');
      const summary  = document.createElement('summary');
      const body     = document.createElement('div');

      summary.innerHTML = q.innerHTML;
      body.className    = 'faqtab-answer';
      body.innerHTML    = a.innerHTML;

      details.append(summary, body);
      if (!rowIdx) details.open = true;                 // first row open
      qa.textContent = '';
      qa.append(details);
    }
  );

  /* ------------------------------------------------------------------
   * 2. Register this panel
   * ---------------------------------------------------------------- */
  if (!section.faqtabs) section.faqtabs = [];
  section.faqtabs.push(block);

  /* always refresh nav (handles lazy-loaded blocks) */
  buildOrRefreshNav();

  /* ------------------------------------------------------------------
   * Helper: create / refresh nav + left column wrapper
   * ---------------------------------------------------------------- */
  function buildOrRefreshNav() {
    /* left wrapper: “Categories / Pick a Category” — one-time */
    if (!section.querySelector('.faqtab-left')) {
      const left      = document.createElement('div');
      left.className  = 'faqtab-left';

      /*  grab the *entire* text component that holds Categories + prompt  */
      const catsBlock = section.querySelector('.default-content-wrapper > [data-aue-prop="text"]');
      if (catsBlock) left.append(catsBlock);
      section.append(left);                            // grid handles placement
    }

    /* nav list */
    let nav = section.querySelector('.faqtab-nav');
    if (!nav) {
      nav = document.createElement('ul');
      nav.className = 'faqtab-nav';
      nav.setAttribute('role', 'tablist');
      section.querySelector('.faqtab-left').after(nav);
    }

    /* rebuild items */
    nav.innerHTML = '';
    section.faqtabs.forEach((panel, idx) => {
      const titleEl = panel.querySelector('[data-aue-prop="tabTitle"]');
      const title   = titleEl ? titleEl.textContent.trim() : `Tab ${idx + 1}`;

      panel.id = panel.id || `faqtab-${idx}`;
      panel.setAttribute('role', 'tabpanel');
      panel.hidden = !!idx;                            // show first only

      const li = document.createElement('li');
      li.className = 'faqtab-nav-item';
      li.textContent = title;
      li.setAttribute('role', 'tab');
      li.setAttribute('aria-controls', panel.id);
      li.setAttribute('aria-selected', !idx);

      li.addEventListener('click', () => {
        nav.querySelectorAll('.faqtab-nav-item')
          .forEach(n => n.setAttribute('aria-selected', n === li));
        section.faqtabs.forEach(p => { p.hidden = p !== panel; });

        /* auto-expand first Q-A of the newly shown panel */
        const first = panel.querySelector('details');
        if (first) first.open = true;
      });

      nav.append(li);
    });
  }
}
