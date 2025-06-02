// /blocks/tab/tab.js
export default function decorate(section) {
  // Only run on the first tab section in a run
  if (section.previousElementSibling?.dataset?.sectionTemplate === 'tab') return;

  const tabs = [];
  let ptr = section;
  while (ptr && ptr.dataset.sectionTemplate === 'tab') {
    tabs.push(ptr);
    ptr = ptr.nextElementSibling;
  }
  if (tabs.length < 2) return; // need at least two to build a tab set

  /* ---- build the wrapper ------------------------------------------------ */
  const wrapper = document.createElement('div');
  wrapper.className = 'tabs block';
  wrapper.dataset.blockName = 'tabs';

  // tab list
  const list = document.createElement('div');
  list.className = 'tabs-list';
  list.setAttribute('role', 'tablist');
  wrapper.append(list);

  tabs.forEach((tabSection, i) => {
    const title = tabSection.dataset.tabTitle || `Tab ${i + 1}`;

    /* button */
    const btn = document.createElement('button');
    btn.className = 'tabs-tab';
    btn.id = `tab-${i}`;
    btn.type = 'button';
    btn.role = 'tab';
    btn.setAttribute('aria-controls', `tabpanel-${i}`);
    btn.setAttribute('aria-selected', i === 0);
    btn.textContent = title;
    list.append(btn);

    /* panel */
    tabSection.className = 'tabs-panel';
    tabSection.id = `tabpanel-${i}`;
    tabSection.setAttribute('role', 'tabpanel');
    tabSection.setAttribute('aria-hidden', i !== 0);
    wrapper.append(tabSection);
  });

  // insert the complete tabs block where the first section was
  const parent = section.parentElement;
  parent.insertBefore(wrapper, tabs[0]);
}
