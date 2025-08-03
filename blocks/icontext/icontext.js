export default function decorate(block) {
  // pull out the two fields
  const iconName = block.querySelector('[data-aue-prop="iconType"]')?.textContent.trim();
  const label    = block.querySelector('[data-aue-prop="iconLabel"]')?.textContent.trim();
  const iconLink    = block.querySelector('[data-aue-prop="iconLink"]')?.textContent.trim();
  if (!iconName || !label) return;

  // clear the block
  block.textContent = '';

  // build the tile
  const wrapper = document.createElement('div');
  wrapper.className = 'icon-wit-btn';
  wrapper.innerHTML = `
    <div class="inner-box">
      <a href="${iconLink}" class="icon-wit-link">
        <span class="${iconName}"></span>
        <h4><button type="button" class="custom-btn arrow-r">${label}</button></h4>
      </a>
    </div>`;

  block.append(wrapper);
}