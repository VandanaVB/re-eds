/*  Decorator fires once per .faqtab.block.
 *  ■ Builds an accordion for its own Q-A rows
 *  ■ Registers itself so the first block can build / refresh the nav
 *  ■ Keeps UE bindings intact (no author markup removed)
 */
export default function decorate(block) {
  const section = block.closest('.faqtab-container');
  if (!section) return;

  const rows = Array.from(block.children);
  if (rows.length < 2) return;

  // extract panel title
  const titleRow = rows[0];
  const titleP = titleRow.querySelector('p');
  const panelTitle = titleP?.textContent.trim() || '';
  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'faqtab-inner';
  rows.slice(1).forEach((row, idx) => {
    const paras = row.querySelectorAll('p');
    if (paras.length < 2) return;
    const qText = paras[0].innerHTML;
    const aText = paras[1].innerHTML;

    const details = document.createElement('details');
    if (idx === 0) details.open = true;

    const summary = document.createElement('summary');
    summary.innerHTML = qText;

    const body = document.createElement('div');
    body.className = 'faqtab-answer';
    body.innerHTML = aText;

    details.append(summary, body);
    wrapper.append(details);
  });

  const titleEl = document.createElement('p');
  titleEl.setAttribute('data-aue-prop', 'tabTitle');
  titleEl.textContent = panelTitle;
  block.append(titleEl, wrapper);

  if (!section.faqtabs) section.faqtabs = [];
  if (!section.faqtabs.includes(block)) {
    section.faqtabs.push(block);
  }

  buildOrRefreshNav();

  function buildOrRefreshNav() {
    let left = section.querySelector('.faqtab-left');
    if (!left) {
      left = document.createElement('div');
      left.className = 'faqtab-left';
      const cats = section.querySelector('.default-content-wrapper > *:first-child');
      if (cats) left.append(cats.cloneNode(true));
      section.insertBefore(left, section.querySelector('.faqtab-wrapper'));
    }

    let nav = left.querySelector('.faqtab-nav');
    if (!nav) {
      nav = document.createElement('ul');
      nav.className = 'faqtab-nav';
      nav.setAttribute('role', 'tablist');
      left.append(nav);
    }
    nav.innerHTML = '';

    section.faqtabs.forEach((panel, i) => {
      const tabTitle = panel.querySelector('[data-aue-prop="tabTitle"]')?.textContent.trim() || `Tab ${i+1}`;
      panel.id = panel.id || `faqtab-${i}`;
      panel.hidden = i !== 0;
      panel.setAttribute('role', 'tabpanel');

      const li = document.createElement('li');
      li.className = 'faqtab-nav-item';
      li.textContent = tabTitle;
      li.setAttribute('role', 'tab');
      li.setAttribute('aria-controls', panel.id);
      li.setAttribute('aria-selected', i === 0);
      li.addEventListener('click', () => {
        nav.querySelectorAll('.faqtab-nav-item')
           .forEach((n,j) => n.setAttribute('aria-selected', j === i));
        section.faqtabs.forEach((p,j) => {
          p.hidden = j !== i;
          const firstDetails = p.querySelector('details');
          if (firstDetails) firstDetails.open = (j===i);
        });
      });
      nav.append(li);
    });
  }
}
