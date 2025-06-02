/* templates/tab/tab.js
   Turns consecutive Tab-sections into a real Tabs block          */
export default function decorate(section) {
  /* abort if this section is already inside a tabs block */
  if (section.closest('.tabs.block')) return;

  /* only run on the first section in a possible group      */
  if (section.previousElementSibling?.dataset?.aueModel === 'tab') return;

  /* collect consecutive sections that are Tab (model=tab & tab-title) */
  const run = [];
  let ptr = section;
  while (ptr
      && ptr.dataset.aueModel === 'tab'
      && ptr.dataset.tabTitle) {
    run.push(ptr);
    ptr = ptr.nextElementSibling;
  }
  if (run.length < 2) return;           // need at least two to build tabs

  /* build wrapper ------------------------------------------------------- */
  const wrapper = document.createElement('div');
  wrapper.className = 'tabs block';
  wrapper.dataset.blockName = 'tabs';

  /* tab list */
  const list = document.createElement('div');
  list.className = 'tabs-list';
  list.setAttribute('role', 'tablist');
  wrapper.append(list);

  run.forEach((sec, i) => {
    const title = sec.dataset.tabTitle || `Tab ${i + 1}`;

    /* button */
    const btn = document.createElement('button');
    btn.className = 'tabs-tab';
    btn.id = `tab-${i}`;
    btn.type = 'button';
    btn.role = 'tab';
    btn.textContent = title;
    btn.setAttribute('aria-controls', `tabpanel-${i}`);
    btn.setAttribute('aria-selected', i === 0);
    list.append(btn);

    /* panel */
    sec.className = 'tabs-panel';
    sec.id = `tabpanel-${i}`;
    sec.setAttribute('role', 'tabpanel');
    sec.setAttribute('aria-hidden', i !== 0);
    wrapper.append(sec);
  });

  /* replace first section with the new wrapper ------------------------- */
  section.parentElement.insertBefore(wrapper, run[0]);
}
