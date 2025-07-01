export default function decorate(block) {
  const inEditor =
    window?.helix?.sidekick?.isEditor?.() ||
    document.documentElement.classList.contains('universal-editor');

  const table = block.querySelector('table');
  if (!table) return;               // author deleted the table – be safe

  if (inEditor) {
    // Authoring mode → leave the table visible, add minimal styling
    block.classList.add('faqtabs--author');
    return;
  }

  /* ---------- PUBLISH-MODE TRANSFORM ---------- */
  const rows = [...table.tBodies[0].rows];
  const data = {};

  rows.forEach((tr) => {
    const [tabCell, qCell, aCell] = tr.cells;
    if (!tabCell || !qCell || !aCell) return;

    const tab = tabCell.textContent.trim();
    if (!data[tab]) data[tab] = [];
    data[tab].push({
      question: qCell.innerHTML.trim(),
      answer:   aCell.innerHTML.trim(),
    });
  });

  // build left nav
  const nav = document.createElement('ul');
  nav.className = 'faqtabs__nav';

  // build right panels
  const panelWrap = document.createElement('div');
  panelWrap.className = 'faqtabs__panels';

  Object.entries(data).forEach(([tab, qa], idx) => {
    /* nav item */
    const li = document.createElement('li');
    li.textContent = tab;
    li.dataset.tab = tab;
    if (idx === 0) li.classList.add('is-active');
    nav.append(li);

    /* panel */
    const panel = document.createElement('div');
    panel.className = 'faqtabs__panel';
    panel.dataset.tab = tab;
    if (idx !== 0) panel.hidden = true;

    qa.forEach(({ question, answer }) => {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.innerHTML = question;
      const p = document.createElement('p');
      p.innerHTML = answer;
      details.append(summary, p);
      panel.append(details);
    });

    panelWrap.append(panel);
  });

  // event delegation for tab clicks
  nav.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const { tab } = li.dataset;

    [...nav.children].forEach((n) => n.classList.toggle('is-active', n === li));
    [...panelWrap.children].forEach((p) => {
      p.hidden = p.dataset.tab !== tab;
    });
  });

  // swap elements into the block & hide original table
  table.replaceWith(nav, panelWrap);
}