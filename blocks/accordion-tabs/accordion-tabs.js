export default function decorate(block) {
  /* ─── separate author rows ─── */
  const rows = [...block.children];            // 0 = block heading row, rest = accordion-tab rows
  const heading = rows.shift();                // remove first row for title/intro

  /* Build NAV */
  const nav = document.createElement('nav');
  nav.className = 'accordion-nav';
  nav.innerHTML = `
    <h3>${heading?.querySelector('[data-aue-prop="title"]')?.innerHTML || 'Categories'}</h3>
    <ul></ul>`;
  const ulNav = nav.querySelector('ul');

  /* Content wrapper */
  const content = document.createElement('div');
  content.className = 'accordion-content';

  /* Insert heading intro */
  if (heading) {
    const intro = heading.querySelector('[data-aue-prop="intro"]')?.innerHTML || '';
    if (intro) {
      const introDiv = document.createElement('div');
      introDiv.className = 'accordion-intro';
      introDiv.innerHTML = intro;
      content.append(introDiv);
    }
  }

  /* Build each tab */
  rows.forEach((row, idx) => {
    const tabTitle = row.querySelector('[data-aue-prop="tabTitle"]')?.textContent.trim() || `Tab ${idx+1}`;

    /* ---------- side-nav button ---------- */
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = tabTitle;
    if (idx === 0) btn.classList.add('active');
    ulNav.append(btn);

    /* ---------- tab panel ---------- */
    const panel = document.createElement('section');
    panel.className = 'accordion-panel';
    panel.hidden = idx !== 0;

    /* panel heading */
    const h2 = document.createElement('h2');
    h2.textContent = tabTitle;
    panel.append(h2);

    /* accordion container */
    const accordWrapper = document.createElement('div');
    accordWrapper.className = 'accordion-accordion';
    panel.append(accordWrapper);

    /* each accordionitem inside the row becomes accordion item */
    [...row.children].forEach((item) => {
      const ques = item.querySelector('[data-aue-prop="question"]')?.innerHTML || '';
      const ans  = item.querySelector('[data-aue-prop="answer"]')?.innerHTML   || '';

      if (ques) {
        const accItem = document.createElement('div');
        accItem.className = 'accordion-accordion-item';
        accItem.innerHTML = `
          <div class="accordion-question">${ques}</div>
          <div class="accordion-answer"><p>${ans}</p></div>`;
        accordWrapper.append(accItem);
      }
    });

    content.append(panel);
  });

  /* ---------- inject into block ---------- */
  block.innerHTML = '';
  block.classList.add('accordion-tabs');
  block.append(nav, content);

  /* ---------- wiring: nav click + accordion ---------- */
  nav.addEventListener('click', (e) => {
    if (!e.target.closest('button')) return;
    const buttons = nav.querySelectorAll('button');
    buttons.forEach((b, i) => {
      const active = b === e.target;
      b.classList.toggle('active', active);
      content.querySelectorAll('.accordion-panel')[i].hidden = !active;
    });
  });

  content.addEventListener('click', (e) => {
    const q = e.target.closest('.accordion-question');
    if (!q) return;
    q.classList.toggle('open');
    q.nextElementSibling.classList.toggle('open');
  });
}