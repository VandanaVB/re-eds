// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {

  const headingRow = block.firstElementChild;
  const titleHTML  = headingRow.innerHTML;
  headingRow.remove();

  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

 // make it sticky
  tablist.style.position = 'sticky';
  tablist.style.top = '0';
  tablist.style.zIndex = '1000';

   const logoWrapper = document.createElement('div');
    logoWrapper.className = 'tab-logo';
    logoWrapper.innerHTML = `
      <a href="/in/en/home" title="Royal Enfield">
        <img src="/content/dam/royal-enfield/india/logos/logo.svg"
             alt="Royal Enfield" />
      </a>`;
  tablist.append(logoWrapper);
  //Inject Title
  const titleSpan = document.createElement('span');
  titleSpan.className = 'tabs-title';
  titleSpan.innerHTML = titleHTML;
  tablist.append(titleSpan);

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent.trim());

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    buildHero(tabpanel);
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);

      const offset = button.offsetLeft - tablist.clientWidth / 2 + button.clientWidth / 2;
      tablist.scrollTo({ left: offset, behavior: 'smooth' });
    });
    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);

  // ───  add drop-shadow when “stuck” ─────────────────────────────
  const observer = new IntersectionObserver(
    ([e]) => {
      tablist.classList.toggle('is-fixed', !e.isIntersecting);
    },
    { rootMargin: '-1px 0px 0px 0px', threshold: [1] }
  );
  observer.observe(block);

  function buildHero(panel) {
    const kids = [...panel.children];
    const [tabTitleDiv,txtDiv, picDiv, pLab, pLink, sLab, sLink, alignDiv] = kids;
    const align = (alignDiv?.textContent || 'center').trim();
    const hero = document.createElement('div');
    hero.className = 'hero-slide';
    hero.innerHTML = `
      <picture class="hero-bg">${picDiv?.innerHTML || ''}</picture>
      <div class="hero-overlay align-${align}">
        <div class="hero-copy">${txtDiv?.innerHTML || ''}</div>
        <div class="cta-row">
          ${cta(pLab, pLink)}
          ${cta(sLab, sLink)}
        </div>
      </div>`;
    panel.innerHTML = '';
    panel.append(hero);
  }
  function cta(labelDiv, linkDiv) {
    const label = labelDiv?.textContent.trim();
    const href  = linkDiv?.querySelector('a')?.getAttribute('href');
    return label && href
      ? `<a class="cta" href="${href}">${label} <span>›</span></a>`
      : '';
  }
 }