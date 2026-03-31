export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    // First column: image (full-bleed background)
    const img = cols[0]?.querySelector('img');
    if (img) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'cards-events-card-image';
      const picture = cols[0].querySelector('picture');
      imageWrap.append(picture || img);
      li.append(imageWrap);
    }

    // Second column: text content overlay
    const textCol = cols[1];
    if (textCol) {
      const overlay = document.createElement('div');
      overlay.className = 'cards-events-card-overlay';

      // Title
      const heading = textCol.querySelector('h2, h3, h4');
      if (heading) {
        const title = document.createElement('h3');
        title.className = 'cards-events-card-title';
        title.textContent = heading.textContent;
        overlay.append(title);
      }

      // Divider
      const divider = document.createElement('div');
      divider.className = 'cards-events-card-divider';
      overlay.append(divider);

      // Text paragraphs (location, date)
      const paragraphs = [...textCol.querySelectorAll('p')];
      const textParas = paragraphs.filter(
        (p) => !p.querySelector('a') && !p.querySelector('img') && p.textContent.trim(),
      );
      textParas.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = i === 0 ? 'cards-events-card-location' : 'cards-events-card-date';
        div.textContent = p.textContent.trim();
        overlay.append(div);
      });

      // CTA link
      const link = textCol.querySelector('a');
      if (link) {
        const cta = document.createElement('a');
        cta.className = 'cards-events-card-cta';
        cta.href = link.href;
        cta.textContent = link.textContent.trim();
        overlay.append(cta);
      }

      li.append(overlay);
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
