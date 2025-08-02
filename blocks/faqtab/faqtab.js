/*  This decorator fires once for **every** .faqtab.block.
 *  The first one encountered becomes the “coordinator” that
 *  creates the nav; subsequent blocks only attach themselves.
 */
export default function decorate(block) {
  const section = block.closest('.faqtab-container');
  if (!section) return;                       // safety

  /* ------------------------------------------------------------
   *  Build an accordion inside *this* block
   * ---------------------------------------------------------- */
  [...block.querySelectorAll('[data-aue-model="questionanswer"]')]
    .forEach((qa) => {
      const q = qa.querySelector('[data-aue-prop="question"]');
      const a = qa.querySelector('[data-aue-prop="answer"]');
      if (!q || !a) return;

      /* Author nodes stay; append UX layer */
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.innerHTML = q.innerHTML;
      const body = document.createElement('div');
      body.className = 'faqtab-answer';
      body.innerHTML = a.innerHTML;
      details.append(summary, body);
      qa.append(details);
    });

  /* ------------------------------------------------------------
   *  Register block in a section-level registry
   * ---------------------------------------------------------- */
  if (!section.faqtabs) section.faqtabs = [];
  section.faqtabs.push(block);

  /*  If this is NOT the first block, the nav is already built.
   *  Accordion above is enough.
   */
  //if (section.faqtabs.length > 1) return;
   buildOrRefreshNav();
  /* ------------------------------------------------------------
   *  Helper: create nav once, then replace its innerHTML
   * ---------------------------------------------------------- */
     function buildOrRefreshNav() {
      let nav = section.querySelector('.faqtab-nav');
      if (!nav) {
        nav = document.createElement('ul');
        nav.className = 'faqtab-nav';
        nav.setAttribute('role', 'tablist');
        section.prepend(nav);
      }
      nav.innerHTML = '';
      section.faqtabs.forEach((panel, idx) => {
        const titleEl = panel.querySelector('[data-aue-prop="tabTitle"]');
        const title = titleEl ? titleEl.textContent.trim() : `Tab ${idx + 1}`;
        const li = document.createElement('li');
        li.className = 'faqtab-nav-item';
        li.textContent = title;
        li.setAttribute('role', 'tab');
        li.setAttribute('aria-controls', panel.id || `faqtab-${idx}`);
        li.setAttribute('aria-selected', !idx);

        /* ensure each panel has an ID and default visibility */
        panel.id = panel.id || `faqtab-${idx}`;
        panel.setAttribute('role', 'tabpanel');
        panel.hidden = !!idx;

        li.addEventListener('click', () => {
          nav.querySelectorAll('.faqtab-nav-item')
             .forEach((n) => n.setAttribute('aria-selected', n === li));
          section.faqtabs.forEach((p) => { p.hidden = p !== panel; });
        });

        nav.append(li);
    });
  }

}