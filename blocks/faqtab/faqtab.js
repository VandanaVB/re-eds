export default function decorate(block) {
  const section = block.closest('.faqtab-container');
  if (!section) return;

if (!section.querySelector('.faqtab-left')) {
  const orig = section.querySelector('.default-content-wrapper');
  if (orig) {
    const faqH2 = orig.querySelector('h2');
    const rest = Array.from(orig.children).slice(1);

    const faqWrapper = document.createElement('div');
    faqWrapper.className = 'default-content-wrapper';
    if (faqH2) faqWrapper.append(faqH2.cloneNode(true));

    const leftWrapper = document.createElement('div');
    leftWrapper.className = 'faqtab-left';
    const catDiv = document.createElement('div');
    rest.forEach((el) => catDiv.append(el.cloneNode(true)));
    leftWrapper.append(catDiv);

    orig.replaceWith(faqWrapper, leftWrapper);
  }
}

  const rows = Array.from(block.children);
  if (rows.length < 2) return;

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
