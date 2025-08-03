export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  block.querySelectorAll('.icon-text').forEach((icontext) => {
    // read the authored props
    const iconName = icontext.querySelector('[data-aue-prop="iconType"]')?.textContent.trim();
    const label    = icontext.querySelector('[data-aue-prop="iconLabel"]')?.textContent.trim();
    if (!iconName || !label) return;

    // clear out the AEM skeleton
    icontext.textContent = '';

    // build the RE tile
    const wrapper = document.createElement('div');
    wrapper.className = 'icon-wit-btn';
    wrapper.innerHTML = `
      <div class="inner-box">
        <a href="#" class="icon-wit-link">
          <span class="${iconName}"></span>
          <p><button type="button" class="custom-btn arrow-r">${label}</button></p>
        </a>
      </div>`;

    icontext.append(wrapper);
  });
}
