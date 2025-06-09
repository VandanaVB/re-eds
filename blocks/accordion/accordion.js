export default function decorate(block) {
  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    const [titleDiv, contentDiv] = [...row.children];
    const button = document.createElement('button');
    button.className = 'accordion-title';
    button.innerHTML = titleDiv ? titleDiv.innerHTML : '';
    button.setAttribute('aria-expanded', 'false');

    const panel = document.createElement('div');
    panel.className = 'accordion-panel';
    panel.innerHTML = contentDiv ? contentDiv.innerHTML : '';
    panel.hidden = true;

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      panel.hidden = expanded;
    });

    item.append(button, panel);
    row.replaceWith(item);
  });
  block.classList.add('accordion');
}
