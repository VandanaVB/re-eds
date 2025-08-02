// Decorates .faqtab-container sections
export default function decorate(section) {
  /* ------------------------------------------------------------------
   *  Collect tab wrappers (one per category)
   * ---------------------------------------------------------------- */
  const wrappers = [...section.querySelectorAll(':scope > .faqtab-wrapper')];
  if (!wrappers.length) return;

  /* ------------------------------------------------------------------
   *  Build the left nav
   * ---------------------------------------------------------------- */
  const nav = document.createElement('ul');
  nav.className = 'faqtab-nav';
  nav.setAttribute('role', 'tablist');

  wrappers.forEach((wrap, idx) => {
    const titleEl = wrap.querySelector('[data-aue-prop="tabTitle"]');
    const title   = titleEl ? titleEl.textContent.trim() : `Tab ${idx + 1}`;
    const id      = `faqtab-${idx}`;

    /* label row */
    const li = document.createElement('li');
    li.className = 'faqtab-nav-item';
    li.id = `tab-${id}`;
    li.textContent = title;
    li.setAttribute('role', 'tab');
    li.setAttribute('aria-controls', `panel-${id}`);
    li.setAttribute('aria-selected', !idx);
    nav.append(li);

    /* content wrapper */
    wrap.classList.add('faqtab-panel');
    wrap.id = `panel-${id}`;
    wrap.setAttribute('role', 'tabpanel');
    wrap.hidden = !!idx;

    /* --------------------------------------------------------------
     *  Turn every questionAnswer component into <details>
     * ------------------------------------------------------------ */
    [...wrap.querySelectorAll('[data-aue-model="questionanswer"]')]
      .forEach((qa) => {
        /* fetch props */
        const q = qa.querySelector('[data-aue-prop="question"]');
        const a = qa.querySelector('[data-aue-prop="answer"]');
        if (!q || !a) return;

        /* author markup stays so UE can edit; we just append UX layer */
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.innerHTML = q.innerHTML;
        const body = document.createElement('div');
        body.className = 'faqtab-answer';
        body.innerHTML = a.innerHTML;
        details.append(summary, body);

        qa.append(details);
      });
  });

  /* place nav before first wrapper */
  section.insertBefore(nav, wrappers[0]);

  /* ------------------------------------------------------------------
   *  Interaction – click nav item
   * ---------------------------------------------------------------- */
  nav.addEventListener('click', (e) => {
    const li = e.target.closest('.faqtab-nav-item');
    if (!li) return;

    const target = li.getAttribute('aria-controls');
    nav.querySelectorAll('.faqtab-nav-item')
       .forEach((n) => n.setAttribute('aria-selected', n === li));
    wrappers.forEach((w) => { w.hidden = w.id !== target; });
  });
}
